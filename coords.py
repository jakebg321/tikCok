import re
import json
from typing import Dict, List, Tuple

def parse_svg_path(path_data: str) -> List[Tuple[float, float]]:
    """
    Parse SVG path data and extract coordinates.
    Returns a list of (x, y) coordinate tuples.
    """
    # Regular expression to find coordinates in path data
    coord_pattern = r'[ML]\s*(-?\d+\.?\d*)[,\s](-?\d+\.?\d*)'
    coordinates = re.findall(coord_pattern, path_data)
    return [(float(x), float(y)) for x, y in coordinates]

def get_country_centroid(coordinates: List[Tuple[float, float]]) -> Tuple[float, float]:
    """
    Calculate the centroid (average point) of a country's coordinates.
    """
    if not coordinates:
        return (0, 0)
    x_sum = sum(x for x, _ in coordinates)
    y_sum = sum(y for _, y in coordinates)
    count = len(coordinates)
    return (x_sum / count, y_sum / count)

def extract_country_coordinates(svg_content: str) -> Dict[str, Dict]:
    """
    Extract country coordinates from SVG content.
    Returns a dictionary with country information including coordinates and centroid.
    """
    country_data = {}
    
    # Regular expression to find path elements with country information
    path_pattern = r'<path[^>]*d="([^"]*)"[^>]*id="([^"]*)"[^>]*name="([^"]*)"'
    
    # Find all country paths
    countries = re.finditer(path_pattern, svg_content)
    
    for country in countries:
        path_data, country_id, country_name = country.groups()
        
        # Extract coordinates from path data
        coordinates = parse_svg_path(path_data)
        
        # Calculate centroid
        centroid = get_country_centroid(coordinates)
        
        country_data[country_id] = {
            'name': country_name,
            'coordinates': coordinates,
            'centroid': centroid
        }
    
    return country_data

def main(svg_content: str):
    """
    Main function to process SVG content and output country coordinate data.
    """
    # Extract coordinates
    country_data = extract_country_coordinates(svg_content)
    
    # Output results
    print("Country Coordinate Data:")
    print("=======================")
    
    for country_id, data in country_data.items():
        print(f"\nCountry: {data['name']} ({country_id})")
        print(f"Centroid: ({data['centroid'][0]:.2f}, {data['centroid'][1]:.2f})")
        print(f"Number of coordinate points: {len(data['coordinates'])}")
        if data['coordinates']:
            print(f"First coordinate point: {data['coordinates'][0]}")

    # Optional: Save to JSON file
    with open('country_coordinates.json', 'w') as f:
        json.dump(country_data, f, indent=2)
        print("\nData saved to 'country_coordinates.json'")

# Example usage:
if __name__ == "__main__":
    # Read SVG content from file
    with open(r'C:\Users\jakeb\VSCODE\FreshTok\CleanSite\public\world.svg', 'r') as f:
        svg_content = f.read()
    
    main(svg_content)