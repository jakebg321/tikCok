from tiktokapipy.api import TikTokAPI
from tiktokapipy.models.video import Video
import json
from datetime import datetime
import asyncio
import requests
from bs4 import BeautifulSoup
import time

class TikTokDataCollector:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    async def search_videos(self, query, limit=5):
        """Search for TikTok videos using a keyword."""
        videos = []
        try:
            async with TikTokAPI() as api:
                search_results = api.search(query)
                async for video in search_results.videos:
                    if len(videos) >= limit:
                        break
                    videos.append(video)
                    await asyncio.sleep(1)  # Respect rate limits
        except Exception as e:
            print(f"Error searching videos: {str(e)}")
        return videos

    def get_page_html(self, url):
        """Get the raw HTML content of the video page."""
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching HTML: {str(e)}")
            return None

    def extract_html_elements(self, html):
        """Extract specific HTML elements containing video metrics."""
        if not html:
            return {}
        
        soup = BeautifulSoup(html, 'html.parser')
        html_elements = {
            'likes_section': '',
            'comments_section': '',
            'shares_section': '',
            'video_container': ''
        }

        try:
            # Extract relevant HTML sections
            # Note: Selectors might need adjustment based on TikTok's structure
            likes = soup.find('strong', {'data-e2e': 'like-count'})
            if likes:
                html_elements['likes_section'] = str(likes.parent)

            comments = soup.find('strong', {'data-e2e': 'comment-count'})
            if comments:
                html_elements['comments_section'] = str(comments.parent)

            shares = soup.find('strong', {'data-e2e': 'share-count'})
            if shares:
                html_elements['shares_section'] = str(shares.parent)

            video_container = soup.find('div', {'class': 'video-card-container'})
            if video_container:
                html_elements['video_container'] = str(video_container)

        except Exception as e:
            print(f"Error parsing HTML elements: {str(e)}")

        return html_elements

    async def get_video_details(self, video: Video):
        """Get detailed information about a specific video."""
        try:
            video_data = {
                'id': video.id,
                'desc': video.desc,
                'create_time': video.create_time.isoformat(),
                'statistics': {
                    'likes': video.stats.digg_count,
                    'comments': video.stats.comment_count,
                    'shares': video.stats.share_count,
                    'views': video.stats.play_count
                },
                'author': {
                    'username': video.author.unique_id,
                    'nickname': video.author.nickname
                },
                'video_url': video.video_url,
                'timestamp': datetime.now().isoformat()
            }

            # Get page HTML and extract elements
            page_html = self.get_page_html(video.video_url)
            html_elements = self.extract_html_elements(page_html)
            video_data['html_elements'] = html_elements

            return video_data

        except Exception as e:
            print(f"Error getting video details: {str(e)}")
            return None

    def log_data(self, data, filename=None):
        """Log the collected data to JSON and HTML files."""
        if filename is None:
            filename = f"tiktok_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            # Save JSON
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"Data successfully logged to {filename}")
            
            # Create HTML log
            html_filename = filename.replace('.json', '.html')
            self.create_html_log(data, html_filename)
            
        except Exception as e:
            print(f"Error logging data: {str(e)}")

    def create_html_log(self, data, filename):
        """Create an HTML file for visualizing the logged data."""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>TikTok Data Log</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                .video-entry {{ border: 1px solid #ccc; margin: 10px 0; padding: 15px; }}
                .html-section {{ background-color: #f5f5f5; padding: 10px; margin: 5px 0; }}
                pre {{ white-space: pre-wrap; }}
            </style>
        </head>
        <body>
            <h1>TikTok Data Log</h1>
            <p>Search Query: {data['search_query']}</p>
            <p>Timestamp: {data['timestamp']}</p>
            
            <h2>Videos:</h2>
            {''.join(f'''
            <div class="video-entry">
                <h3>{video['desc'][:100]}...</h3>
                <p>URL: <a href="{video['video_url']}">{video['video_url']}</a></p>
                <p>Author: {video['author']['nickname']} (@{video['author']['username']})</p>
                <p>Statistics:</p>
                <ul>
                    <li>Likes: {video['statistics']['likes']}</li>
                    <li>Comments: {video['statistics']['comments']}</li>
                    <li>Shares: {video['statistics']['shares']}</li>
                    <li>Views: {video['statistics']['views']}</li>
                </ul>
                <h4>HTML Elements:</h4>
                <div class="html-section">
                    <pre>{json.dumps(video['html_elements'], indent=2)}</pre>
                </div>
            </div>
            ''' for video in data['videos'])}
        </body>
        </html>
        """
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"HTML log created at {filename}")
        except Exception as e:
            print(f"Error creating HTML log: {str(e)}")

async def main():
    collector = TikTokDataCollector()
    
    # Get search query from user
    query = input("Enter search query: ")
    
    # Search for videos
    print("Searching for videos...")
    videos = await collector.search_videos(query)
    
    if not videos:
        print("No videos found.")
        return
    
    # Collect detailed data for each video
    detailed_data = []
    for video in videos:
        print(f"Collecting data for video: {video.desc[:50]}...")
        details = await collector.get_video_details(video)
        if details:
            detailed_data.append(details)
        await asyncio.sleep(1)  # Respect rate limits
    
    # Log the collected data
    if detailed_data:
        collector.log_data({
            'search_query': query,
            'timestamp': datetime.now().isoformat(),
            'videos': detailed_data
        })
    else:
        print("No data collected to log.")

if __name__ == "__main__":
    asyncio.run(main())