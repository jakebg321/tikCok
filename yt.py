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
        html_elements = {}

        try:
            # Extract engagement buttons section
            engagement_panel = soup.find('div', {'id': 'top-level-buttons-computed'})
            if engagement_panel:
                html_elements['engagement_panel'] = str(engagement_panel)

            # Extract video description
            description = soup.find('div', {'id': 'description-inline-expander'})
            if description:
                html_elements['description'] = str(description)

            # Extract comments section
            comments_section = soup.find('ytd-comments', {'id': 'comments'})
            if comments_section:
                html_elements['comments_section'] = str(comments_section)

            # Extract video metadata
            meta_section = soup.find('div', {'id': 'above-the-fold'})
            if meta_section:
                html_elements['meta_section'] = str(meta_section)

            # Extract view count
            view_count = soup.select_one('ytd-video-view-count-renderer')
            if view_count:
                html_elements['view_count'] = str(view_count)

            # Extract like button
            like_button = soup.find('ytd-menu-renderer', {'class': 'ytd-video-primary-info-renderer'})
            if like_button:
                html_elements['like_button'] = str(like_button)

            # Extract raw page data
            html_elements['raw_page'] = str(soup)

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
                    'id': video_id,
                    'desc': info.get('title'),
                    'create_time': info.get('upload_date'),
                    'statistics': {
                        'likes': info.get('like_count', 0),
                        'comments': info.get('comment_count', 0),
                        'shares': 0,  # YouTube doesn't provide share count
                        'views': info.get('view_count', 0)
                    },
                    'author': {
                        'username': info.get('channel_id'),
                        'nickname': info.get('channel')
                    },
                    'video_url': url,
                    'html_elements': html_elements,
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
        except Exception as e:
            print(f"Error logging data: {str(e)}")

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