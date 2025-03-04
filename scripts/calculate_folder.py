import os
import json
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.calculate_score import load_questions, calculate_position

def calculate_folder_average(model_name, verbose=False):
    """
    Calculate the average position for all responses from a specific model in the responses folder.
    
    Args:
        model_name (str): Name of the model folder (e.g., 'gemini-2.0-flash-lite-001')
    
    Returns:
        dict: Average x,y coordinates and count of processed responses
    """
    responses_dir = os.path.join('responses', model_name)
    if not os.path.exists(responses_dir):
        if verbose:
            print(f"Error: Directory {responses_dir} does not exist")
        return None
    
    # Load questions once for all calculations
    questions = load_questions()
    
    # Initialize counters for averaging
    total_x = 0
    total_y = 0
    count = 0
    
    # Process each response file in the directory
    for filename in os.listdir(responses_dir):
        if filename.endswith('.json'):
            file_path = os.path.join(responses_dir, filename)
            try:
                with open(file_path, 'r') as file:
                    all_answers = json.load(file)
                
                # Calculate position for this response
                position = calculate_position(all_answers, questions)
                
                # Add to totals
                total_x += position['x']
                total_y += position['y']
                count += 1
                
            except Exception as e:
                if verbose:
                    print(f"Error processing {filename}: {str(e)}")
                continue
    
    if count == 0:
        if verbose:
            print(f"No valid responses found in {responses_dir}")
        return None
    
    # Calculate averages
    avg_x = total_x / count
    avg_y = total_y / count
    
    return {
        'x': avg_x,
        'y': avg_y,
        'count': count
    }

def main():
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python calculate_folder.py <model_name>")
        print("Example: python calculate_folder.py gemini-2.0-flash-lite-001")
        sys.exit(1)
    
    model_name = sys.argv[1]
    result = calculate_folder_average(model_name)
    
    if result:
        print(f"Average position for {model_name}:")
        print(f"X: {result['x']:.2f}")
        print(f"Y: {result['y']:.2f}")
        print(f"Processed {result['count']} responses")

def print_compass(results):
    # Define graph dimensions and scale
    graph_width = 40
    graph_height = 20
    x_min, x_max = -1.0, 1.0
    y_min, y_max = -1.0, 1.0
    
    # Create empty graph
    graph = [[' ' for _ in range(graph_width)] for _ in range(graph_height)]
    
    # Draw axes
    mid_x = graph_width // 2
    mid_y = graph_height // 2
    
    # Draw horizontal axis
    for i in range(graph_width):
        graph[mid_y][i] = '-'
    
    # Draw vertical axis
    for i in range(graph_height):
        graph[i][mid_x] = '|'
    
    # Mark center
    graph[mid_y][mid_x] = '+'

    
    # Plot each model's position
    model_markers = {}
    for i, (model_name, result) in enumerate(results):
        # Scale coordinates to graph dimensions
        x_scaled = int((result['x'] - x_min) / (x_max - x_min) * (graph_width - 1))
        y_scaled = int((y_max - result['y']) / (y_max - y_min) * (graph_height - 1))
        
        # Ensure coordinates are within bounds
        x_scaled = max(0, min(graph_width - 1, x_scaled))
        y_scaled = max(0, min(graph_height - 1, y_scaled))
        
        # Use letters as markers (A, B, C, etc.)
        marker = chr(65 + (i % 26))
        graph[y_scaled][x_scaled] = marker
        model_markers[marker] = model_name
    
    # Print the graph
    print("+" + "-" * (graph_width + 2) + "+")
    for row in graph:
        print("| " + ''.join(row) + " |")
    print("+" + "-" * (graph_width + 2) + "+")
    
    # Print legend
    print("\nLegend:")
    for marker, model in model_markers.items():
        print(f"{marker}: {model}")

   

if __name__ == "__main__":
    import argparse
    
    # Set up command line arguments
    parser = argparse.ArgumentParser(description='Calculate average positions for AI Safety Compass responses')
    parser.add_argument('-v', '--verbose', action='store_true', help='Enable verbose output')
    args = parser.parse_args()
    
    # Get all model folders in the responses directory
    responses_dir = 'responses'
    if not os.path.exists(responses_dir):
        print(f"Error: Responses directory {responses_dir} does not exist")
        sys.exit(1)
    
    # Process each model folder
    results = []
    max_name_length = 0
    
    for model_name in os.listdir(responses_dir):
        model_dir = os.path.join(responses_dir, model_name)
        if os.path.isdir(model_dir):
            if args.verbose:
                print(f"\nProcessing model: {model_name}")
            
            result = calculate_folder_average(model_name, args.verbose)
            
            if result:
                # Track the longest model name for formatting
                max_name_length = max(max_name_length, len(model_name))
                results.append((model_name, result))
                
                if args.verbose:
                    print(f"Average position for {model_name}:")
                    print(f"X: {result['x']:.2f}")
                    print(f"Y: {result['y']:.2f}")
                    print(f"Processed {result['count']} responses")
                    print("-" * 40)
    
    # Print results in a nicely formatted table
    if not args.verbose and results:
        print("\nAI Safety Compass Results:")
        print("-" * (max_name_length + 25))
        print(f"{'Model Name':{max_name_length}}  |  {'X-Value':^8}  |  {'Y-Value':^8}")
        print("-" * (max_name_length + 25))
        
        for model_name, result in results:
            print(f"{model_name:{max_name_length}}  |  {result['x']:^8.2f}  |  {result['y']:^8.2f}")
        print("-" * (max_name_length + 25))

        # Draw an ASCII graph with the points
        print("\nASCII Graph of Model Positions:")
        print_compass(results)
        
