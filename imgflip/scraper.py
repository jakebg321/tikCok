import requests
from bs4 import BeautifulSoup
import time
import json
from datetime import datetime
import os
import logging
from logging.handlers import RotatingFileHandler
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import threading
from concurrent.futures import ThreadPoolExecutor
import random
class ImgFlipScraper:
    def __init__(self, max_threads=16):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.base_url = 'https://imgflip.com/memetemplates'
        self.max_threads = max_threads
        self.results = []
        self.result_lock = threading.Lock()
        self.setup_logging()
        self.setup_driver()
        
    def setup_logging(self):
        """Setup logging configuration."""
        log_dir = os.path.join(os.path.dirname(__file__), 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = os.path.join(log_dir, f'scraper_{timestamp}.log')
        
        self.logger = logging.getLogger('ImgFlipScraper')
        self.logger.setLevel(logging.DEBUG)
        
        file_handler = RotatingFileHandler(
            log_file, 
            maxBytes=5*1024*1024,  # 5MB
            backupCount=5
        )
        file_handler.setLevel(logging.DEBUG)
        
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        file_formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s'
        )
        console_formatter = logging.Formatter(
            '%(message)s'
        )
        
        file_handler.setFormatter(file_formatter)
        console_handler.setFormatter(console_formatter)
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
        
        self.logger.info(f"Logging setup complete. Log file: {log_file}")
        
    def setup_driver(self):
        """Setup Selenium WebDriver with SSL and stability fixes."""
        options = webdriver.ChromeOptions()
        
        options.add_argument('--headless=new')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--ignore-ssl-errors')
        options.add_argument('--ignore-certificate-errors-spki-list')
        options.add_argument('--allow-insecure-localhost')
        
        options.add_argument('--disable-webgl')
        options.add_argument('--disable-3d-apis')
        
        options.add_argument('--disable-extensions')
        options.add_argument('--disable-notifications')
        options.add_argument('--disable-infobars')
        options.add_argument('--disable-popup-blocking')
        
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disk-cache-size=0')
        options.add_argument('--disable-application-cache')
        
        options.page_load_strategy = 'none'
        
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        options.add_experimental_option('excludeSwitches', ['enable-automation'])
        
        self.driver = webdriver.Chrome(options=options)
        self.driver.set_page_load_timeout(60) 
        self.driver.set_script_timeout(60)
        self.wait = WebDriverWait(self.driver, 20)
        
        self.driver.set_window_size(1280, 720)
        
        self.logger.info("Chrome WebDriver setup complete with SSL and stability fixes")
    def get_memes(self, pages=1):
        all_memes = []
        successful = 0
        failed = 0
        
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_dir = 'data'
            os.makedirs(output_dir, exist_ok=True)
            output_file = os.path.join(output_dir, f'meme_data_{timestamp}.json')
            
            template_urls = []
            for page in range(1, pages + 1):
                time.sleep(3)
                urls = self.get_template_urls_from_page(page)
                if urls:
                    template_urls.extend(urls)
                    self.logger.info(f"Found {len(urls)} templates on page {page}")
                    time.sleep(3)
                else:
                    self.logger.warning(f"No templates found on page {page}")
            
            self.logger.info(f"Total templates to process: {len(template_urls)}")
            
            for i, url in enumerate(template_urls, 1):
                self.logger.info(f"Processing template {i}/{len(template_urls)}: {url}")
                result = self.process_template(url)
                
                if result:
                    all_memes.append(result)
                    successful += 1
                    
                    meme_data = {
                        'metadata': {
                            'total_memes': len(all_memes),
                            'successful': successful,
                            'failed': failed,
                            'last_updated': datetime.now().isoformat(),
                            'pages_scraped': pages
                        },
                        'memes': all_memes
                    }
                    
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(meme_data, f, indent=2, ensure_ascii=False)
                    
                    self.logger.info(f"Updated data saved to {output_file}")
                else:
                    failed += 1
                
                time.sleep(random.uniform(3, 5))
                
                # Log progress
                if i % 5 == 0:
                    self.logger.info(f"\nProgress Update:")
                    self.logger.info(f"Processed: {i}/{len(template_urls)} templates")
                    self.logger.info(f"Success: {successful}, Failed: {failed}")
            
            return all_memes
            
        except Exception as e:
            self.logger.error(f"Error in get_memes: {e}")
            return all_memes
    def parse_number(self, text):
        """Helper method to parse number strings with K/M suffixes"""
        try:
            text = text.strip().upper()
            if 'K' in text:
                return int(float(text.replace('K', '')) * 1000)
            elif 'M' in text:
                return int(float(text.replace('M', '')) * 1000000)
            return int(''.join(filter(str.isdigit, text)))
        except:
            return 0
    def extract_chart_data(self, url, meme_title):
        """Extract usage data from the JavaScript captions array in the page source."""
        try:
            script = """
            try {
                // Return the captions array if it exists in the global scope
                if (typeof captions !== 'undefined') {
                    return captions;
                }
                return null;
            } catch (error) {
                return null;
            }
            """
            
            raw_data = self.driver.execute_script(script)
            
            if not raw_data:
                page_source = self.driver.page_source
                caption_match = re.search(r'captions=(\[\[.*?\]\]);', page_source, re.DOTALL)
                
                if caption_match:
                    captions_str = caption_match.group(1)
                    try:
             
                        captions_str = captions_str.replace("'", '"')
                        raw_data = json.loads(captions_str)
                    except json.JSONDecodeError:
                        self.logger.error(f"Failed to parse captions data for {meme_title}")
                        return None
                else:
                    self.logger.warning(f"No captions data found for {meme_title}")
                    return None
            
            if raw_data:
                usage_data = []
                for date_str, count in raw_data:
                    try:
                        date = datetime.strptime(date_str, "%Y-%m")
                        formatted_date = date.strftime('%Y-%m-%d')
                        
                        usage_data.append({
                            'date': formatted_date,
                            'captions': count
                        })
                    except Exception as e:
                        self.logger.debug(f"Skipping invalid data point: [{date_str}, {count}]. Error: {e}")
                        continue
                
                if usage_data:
                    usage_data.sort(key=lambda x: x['date'])
                    self.logger.info(f"Successfully extracted {len(usage_data)} data points for {meme_title}")
                    
                    if len(usage_data) > 0:
                        self.logger.info(f"First data point: {usage_data[0]['date']} - {usage_data[0]['captions']} captions")
                        self.logger.info(f"Last data point: {usage_data[-1]['date']} - {usage_data[-1]['captions']} captions")
                    
                    return usage_data
                
            return None
            
        except Exception as e:
            self.logger.error(f"Error extracting chart data for {meme_title}: {e}")
            self.logger.debug(f"Full error: {str(e)}", exc_info=True)
            return None
    def get_template_urls_from_page(self, page_number=1, max_retries=3, retry_delay=5):
        """Get all meme template URLs from a specific page using requests."""
        for attempt in range(max_retries):
            try:
                url = f"{self.base_url}?page={page_number}"
                self.logger.info(f"Fetching template listing page {page_number} (Attempt {attempt + 1}/{max_retries})")
                
                response = requests.get(url, headers=self.headers, timeout=30)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                template_urls = set()  
                
                title_elements = soup.select("h3.mt-title a")
                
                for element in title_elements:
                    href = element.get('href')
                    if href:
                        if href.startswith('/'):
                            href = f"https://imgflip.com{href}"
                        if '/meme/' in href:
                            template_urls.add(href)
                
                template_urls = list(template_urls)
                
                if template_urls:
                    self.logger.info(f"Found {len(template_urls)} templates on page {page_number}")
                    return template_urls
                else:
                    raise Exception("No template URLs found on page")
                
            except Exception as e:
                self.logger.error(f"Error on attempt {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    self.logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                else:
                    self.logger.error(f"Failed to fetch template page {page_number} after {max_retries} attempts")
                    return []
            
        return []

    def get_meme_details(self, url):
        """Get detailed information about a specific meme template using requests first."""
        try:
            self.logger.info(f"Fetching meme: {url}")
            
            try:
                response = requests.get(url, headers=self.headers, timeout=30)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')
                
                title = None
                title_elem = soup.select_one("h1.base-meme-title, h1.meme-title, .meme-caption h1, h1.mt-title")
                if title_elem:
                    title = title_elem.text.strip()
                    if title.endswith(' Meme'):
                        title = title[:-5]
                
                if not title:
                    title = url.split('/')[-1].replace('-', ' ')
                
                stats = {}
                stats_elements = soup.select(".meme-stats .stat, .base-stats .stat, .meme-view-stats .stat, .stats-count")
                for stat in stats_elements:
                    stat_text = stat.text.strip().lower()
                    if 'views' in stat_text:
                        stats['views'] = self.parse_number(stat_text)
                    elif 'captions' in stat_text or 'uses' in stat_text:
                        stats['captions'] = self.parse_number(stat_text)
                
                image_url = None
                img_elem = soup.select_one(".base-meme-image, .meme-image, img.base-img")
                if img_elem and img_elem.get('src'):
                    image_url = img_elem['src']
                    # Ensure the image URL is absolute
                    if image_url.startswith('//'):
                        image_url = f'https:{image_url}'
                    elif image_url.startswith('/'):
                        image_url = f'https://imgflip.com{image_url}'
                
                usage_data = None
                try:
                    self.driver.delete_all_cookies()
                    
                    self.driver.get(url)
                    time.sleep(3) 
                    
                    usage_data = self.extract_chart_data(url, title)
                except Exception as e:
                    self.logger.error(f"Failed to extract chart data: {e}")
                
                meme_data = {
                    'url': url,
                    'title': title,
                    'stats': stats,
                    'image_url': image_url,
                    'usage_history': usage_data,
                    'timestamp': datetime.now().isoformat()
                }
                
                try:
                    os.makedirs('data', exist_ok=True)
                    clean_title = re.sub(r'[^\w\s-]', '', title).strip().replace(' ', '_')
                    filename = f'data/meme_{clean_title}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
                    
                    with open(filename, 'w', encoding='utf-8') as f:
                        json.dump(meme_data, f, indent=2, ensure_ascii=False)
                        
                    self.logger.info(f"Saved data for {title} to {filename}")
                except Exception as e:
                    self.logger.error(f"Failed to save data: {e}")
                
                return meme_data
                
            except requests.exceptions.RequestException as e:
                self.logger.error(f"Failed to fetch page with requests: {e}")
                return None
                
        except Exception as e:
            self.logger.error(f"Error getting meme details for {url}: {e}")
            return None
    def process_template(self, template_url):
        """Process a single template with improved error handling."""
        max_retries = 3
        base_delay = 3 
        for attempt in range(max_retries):
            try:
                self.logger.info(f"Processing template: {template_url} (Attempt {attempt + 1}/{max_retries})")
                
                time.sleep(base_delay + random.uniform(1, 3))
                
                try:
                    if hasattr(self, 'driver'):
                        self.driver.quit()
                except:
                    pass
                    
                self.setup_driver()
                
                self.driver.delete_all_cookies()
                
                data = self.get_meme_details(template_url)
                if data:
                    self.logger.info(f"Successfully processed {data['title']}")
                    return data
                    
                if attempt < max_retries - 1:
                    delay = base_delay * (attempt + 1) + random.uniform(1, 3)
                    self.logger.info(f"Retrying in {delay:.1f} seconds...")
                    time.sleep(delay)
                
            except Exception as e:
                self.logger.error(f"Error processing template {template_url}: {e}")
                if attempt < max_retries - 1:
                    delay = base_delay * (attempt + 1) + random.uniform(1, 3)
                    self.logger.info(f"Retrying in {delay:.1f} seconds...")
                    time.sleep(delay)
                else:
                    self.logger.error(f"Failed to process {template_url} after {max_retries} attempts")
            finally:
                try:
                    if hasattr(self, 'driver'):
                        self.driver.quit()
                except:
                    pass
        
        return None

    def __del__(self):
        """Cleanup."""
        if hasattr(self, 'driver'):
            self.driver.quit()
def main():
    try:
        scraper = ImgFlipScraper()
        print("Starting meme template analysis...")
        
        # Limit scraping to first 15 pages to reduce processing time
        pages_to_scrape = 15  
        print(f"\nScraping {pages_to_scrape} pages of meme templates...")
        memes = scraper.get_memes(pages=pages_to_scrape)
        
        if memes:
            print(f"\nFound {len(memes)} memes across {pages_to_scrape} pages")
            print("\nAnalysis Results:")
            
            total_views = 0
            total_captions = 0
            most_viewed = None
            most_used = None
            
            for meme in memes:
                print(f"\nTitle: {meme['title']}")
                if 'stats' in meme:
                    if 'views' in meme['stats']:
                        views = meme['stats']['views']
                        print(f"Views: {format_number(views)}")
                        total_views += views
                        if most_viewed is None or views > most_viewed['stats']['views']:
                            most_viewed = meme
                            
                    if 'captions' in meme['stats']:
                        captions = meme['stats']['captions']
                        print(f"Captions: {format_number(captions)}")
                        total_captions += captions
                        if most_used is None or captions > most_used['stats']['captions']:
                            most_used = meme
            
            print("\nOverall Statistics:")
            print(f"Total Memes Analyzed: {len(memes)}")
            print(f"Total Views: {format_number(total_views)}")
            print(f"Total Captions: {format_number(total_captions)}")
            
            if most_viewed:
                print(f"\nMost Viewed Meme: {most_viewed['title']}")
                print(f"Views: {format_number(most_viewed['stats']['views'])}")
            
            if most_used:
                print(f"\nMost Used Meme: {most_used['title']}")
                print(f"Captions: {format_number(most_used['stats']['captions'])}")
                
            print("\nDetailed data saved to the data directory.")
        else:
            print("No memes were found or analyzed.")
        
    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        if hasattr(scraper, 'driver'):
            scraper.driver.quit()

def format_number(num):
    """Format large numbers with K/M suffixes"""
    if num >= 1_000_000:
        return f"{num/1_000_000:.1f}M"
    if num >= 1_000:
        return f"{num/1_000:.1f}K"
    return str(num)

if __name__ == "__main__":
    main()