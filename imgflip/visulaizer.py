import json
import matplotlib.pyplot as plt
from datetime import datetime
import os

def plot_meme_data(json_file):
    """Create visualization from meme data JSON file."""
    # Read the JSON data
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    # Extract dates and caption counts
    dates = [datetime.strptime(entry['date'], '%Y-%m-%d') for entry in data['usage_history']]
    captions = [entry['captions'] for entry in data['usage_history']]
    
    # Create figure
    plt.figure(figsize=(12, 6))
    
    # Plot the data
    plt.plot(dates, captions, marker='o', linestyle='-', linewidth=2, markersize=6)
    
    # Customize the plot
    plt.title(f"Usage Over Time: {data['title']}", fontsize=14, pad=15)
    plt.xlabel('Date', fontsize=12)
    plt.ylabel('Number of Captions', fontsize=12)
    
    # Rotate x-axis labels for better readability
    plt.xticks(rotation=45)
    
    # Add grid
    plt.grid(True, linestyle='--', alpha=0.7)
    
    # Adjust layout
    plt.tight_layout()
    
    # Create plots directory if it doesn't exist
    os.makedirs('plots', exist_ok=True)
    
    # Save the plot
    plot_file = f"plots/meme_usage_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    plt.savefig(plot_file, dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Plot saved to {plot_file}")

def main():
    # Look for the most recent JSON file in the data directory
    data_dir = 'data'
    if os.path.exists(data_dir):
        json_files = [f for f in os.listdir(data_dir) if f.endswith('.json')]
        if json_files:
            # Get the most recent file
            latest_file = max([os.path.join(data_dir, f) for f in json_files], key=os.path.getctime)
            plot_meme_data(latest_file)
        else:
            print("No JSON files found in data directory")
    else:
        print("Data directory not found")

if __name__ == "__main__":
    main()