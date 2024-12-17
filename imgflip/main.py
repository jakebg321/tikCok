from scraper import ImgFlipScraper
from imgflip.visulaizer import ImgFlipAnalyzer
import json
import time

def format_number(num):
    if num >= 1_000_000:
        return f"{num/1_000_000:.1f}M"
    if num >= 1_000:
        return f"{num/1_000:.1f}K"
    return str(num)

def main():
    # Create instances
    scraper = ImgFlipScraper(max_threads=16)
    analyzer = ImgFlipAnalyzer()
    
    print("Starting meme template analysis...")
    start_time = time.time()
    
    # Get memes
    print("\nScraping memes...")
    memes = scraper.get_memes(pages=2)
    
    end_time = time.time()
    print(f"\nProcessing took {end_time - start_time:.2f} seconds")
    
    # Analyze results
    stats = analyzer.analyze_memes(memes)
    popular_memes = analyzer.get_popular_memes(memes, limit=5)
    
    # Print summary
    print("\nAnalysis Results:")
    print(f"Total Memes: {stats['total_memes']}")
    print(f"Unique Memes: {stats['unique_memes']}")
    
    if popular_memes:
        print("\nTop 5 Popular Memes:")
        for i, meme in enumerate(popular_memes, 1):
            print(f"{i}. {meme['title']}")
    
    # Save results
    results = {
        'memes': memes,
        'stats': stats,
        'processing_time': end_time - start_time
    }
    
    output_file = 'meme_templates.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {output_file}")

if __name__ == "__main__":
    main()