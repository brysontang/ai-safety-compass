import os
import json
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.calculate_score import load_questions, calculate_position

def calculate_folder_average(model_name):
    """
    Calculate the average position for all responses from a specific model in the responses folder.
    
    Args:
        model_name (str): Name of the model folder (e.g., 'gemini-2.0-flash-lite-001')
    
    Returns:
        dict: Average x,y coordinates and count of processed responses
    """
    responses_dir = os.path.join('responses', model_name)
    if not os.path.exists(responses_dir):
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

                print(f"Processed {filename} with position {position['x']}, {position['y']}")
                count += 1
                
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
                continue
    
    if count == 0:
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

if __name__ == "__main__":
    main()
