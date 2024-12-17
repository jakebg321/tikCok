import yt_dlp
import json
import os
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import re

class YouTubeDataCollector:
    def __init__(self):
        self.ydl_opts = {
            'quiet': True,
            'extract_flat': True,
            'force_generic_extractor': False
        }
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

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
            'view_count_element': '',
            'like_button_element': '',
            'description_container': '',
            'upload_info_element': ''
        }

        try:
            # Find and extract relevant HTML elements
            # Note: These selectors might need adjustment based on YouTube's current structure
            view_count = soup.find('meta', {'itemprop': 'interactionCount'})
            if view_count:
                html_elements['view_count_element'] = str(view_count.parent)

            # Get the container that typically holds the like button
            like_section = soup.find('yt-formatted-string', {'id': 'text', 'class': 'ytd-toggle-button-renderer'})
            if like_section:
                html_elements['like_button_element'] = str(like_section.parent)

            # Get the description container
            description = soup.find('div', {'id': 'description-content'})
            if description:
                html_elements['description_container'] = str(description)

            # Get upload info section
            upload_info = soup.find('div', {'id': 'info-strings'})
            if upload_info:
                html_elements['upload_info_element'] = str(upload_info)

        except Exception as e:
            print(f"Error parsing HTML elements: {str(e)}")

        return html_elements

    def search_videos(self, query):
        """Search for videos using either topic or channel."""
        try:
            with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
                url = f"ytsearch5:{query}"  # Limit to 5 results
                results = ydl.extract_info(url, download=False)
                return results.get('entries', [])
        except Exception as e:
            print(f"Error searching videos: {str(e)}")
            return []

    def get_video_details(self, video_id):
        """Get detailed information about a specific video."""
        try:
            with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
                url = f"https://www.youtube.com/watch?v={video_id}"
                info = ydl.extract_info(url, download=False)
                
                # Get the raw HTML and extract elements
                page_html = self.get_page_html(url)
                html_elements = self.extract_html_elements(page_html)
                
                return {
                    'title': info.get('title'),
                    'views': info.get('view_count'),
                    'likes': info.get('like_count'),
                    'duration': info.get('duration'),
                    'description_html': info.get('description_html', ''),
                    'upload_date': info.get('upload_date'),
                    'channel': info.get('channel'),
                    'url': url,
                    'html_elements': html_elements,  # Include the HTML elements
                    'timestamp': datetime.now().isoformat()
                }
        except Exception as e:
            print(f"Error getting video details: {str(e)}")
            return None

    def log_data(self, data, filename=None):
        """Log the collected data to a JSON file."""
        if filename is None:
            filename = f"youtube_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"Data successfully logged to {filename}")
            
            # Also create an HTML log file for easy viewing
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
            <title>YouTube Data Log</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                .video-entry {{ border: 1px solid #ccc; margin: 10px 0; padding: 15px; }}
                .html-section {{ background-color: #f5f5f5; padding: 10px; margin: 5px 0; }}
                pre {{ white-space: pre-wrap; }}
            </style>
        </head>
        <body>
            <h1>YouTube Data Log</h1>
            <p>Search Query: {data['search_query']}</p>
            <p>Timestamp: {data['timestamp']}</p>
            
            <h2>Videos:</h2>
            {''.join(f'''
            <div class="video-entry">
                <h3>{video['title']}</h3>
                <p>URL: <a href="{video['url']}">{video['url']}</a></p>
                <p>Views: {video['views']}</p>
                <p>Likes: {video['likes']}</p>
                <p>Duration: {video['duration']} seconds</p>
                <p>Upload Date: {video['upload_date']}</p>
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

def main():
    collector = YouTubeDataCollector()
    
    # Get search query from user
    query = input("Enter search query (topic or channel): ")
    
    # Search for videos
    print("Searching for videos...")
    videos = collector.search_videos(query)
    
    if not videos:
        print("No videos found.")
        return
    
    # Collect detailed data for each video
    detailed_data = []
    for video in videos:
        print(f"Collecting data for video: {video.get('title', 'Unknown')}")
        video_id = video.get('id')
        if video_id:
            details = collector.get_video_details(video_id)
            if details:
                detailed_data.append(details)
    
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
    main()