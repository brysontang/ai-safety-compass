from openai import OpenAI
import os
from datetime import datetime
import re
import json
from dotenv import load_dotenv
import time

load_dotenv()

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY"),
)

def read_prompt_file(file_path):
    """Read the content of the prompt file."""
    try:
        with open(file_path, 'r') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

def extract_json_from_response(response_text):
    """Extract JSON content from the response text."""
    # First, look explicitly for JSON code blocks
    json_match = re.search(r'```json\s*([\s\S]*?)\s*```', response_text, re.IGNORECASE)
    
    if not json_match:
        # Try generic code blocks without explicit language
        json_match = re.search(r'```\s*([\s\S]*?)\s*```', response_text)
    
    if json_match:
        json_str = json_match.group(1)
    else:
        # Finally, try to directly detect JSON array/object
        json_match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', response_text)
        if json_match:
            json_str = json_match.group(1)
            json_str = re.sub(r'^\s*```(?:json)?\s*|\s*```\s*$', '', json_str)
        else:
            print("Could not extract valid JSON from the response.")
            return None
    
    # Remove any comment lines
    json_str = re.sub(r'\s*//.*$', '', json_str, flags=re.MULTILINE)
    # Remove any triple backticks at the beginning and end of the JSON string
    json_str = re.sub(r'^\s*```(?:json)?\s*|\s*```\s*$', '', json_str)
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

def get_model_completion(model, prompt_content):
  completion = client.chat.completions.create(
    extra_body={},
    model=model,
    messages=[
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": prompt_content
          },
        ]
      }
    ]
  )

  # Extract JSON from the response
  response_json = extract_json_from_response(completion.choices[0].message.content)

  # Update the content to be saved if JSON was successfully extracted
  if response_json:
      json_content = json.dumps(response_json, indent=2)
      print(f"Successfully extracted JSON with {len(response_json)} questions")
  else:
      print(completion.choices[0].message.content)
      json_content = ''
  return json_content
  
def main(model, remaining, retry=False):
  for n in range(remaining):
    # Read the AI Safety Compass prompt
    prompt_path = "prompts/ai_safety_compass_prompt.txt"
    prompt_content = read_prompt_file(prompt_path)

    model_name = model.split("/")[-1]
    
    # Create directory for responses if it doesn't exist
    response_dir = f"responses/{model_name}"
    if not os.path.exists(response_dir):
        os.makedirs(response_dir)
        print(f"Created directory: {response_dir}")

    # Get the completion
    completion = get_model_completion(model, prompt_content)

    if completion:
      # Save the response to a file
      with open(f"responses/{model_name}/{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w") as file:
          file.write(completion)
    elif retry:
      # If retry is enabled and we failed to get a valid completion, try again
      print(f"Failed to get valid JSON response for {model_name}, retrying...")
      n -= 1  # Decrement n to retry this iteration
      time.sleep(2)  # Add a small delay before retrying

if __name__ == "__main__":
  import argparse
  
  # Set up command line arguments
  parser = argparse.ArgumentParser(description='Run AI Safety Compass evaluations')
  parser.add_argument('-r', '--retry', action='store_true', help='Enable retrying on failures')
  args = parser.parse_args()
  
  models = [
      'anthropic/claude-3.7-sonnet',
      'google/gemini-2.0-flash-001',
      'google/gemini-2.0-pro-exp-02-05:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'openai/o3-mini-high',
      'qwen/qwen2.5-32b-instruct',
      # 'openai/gpt-4.5-preview'
      'qwen/qwq-32b:free',
      # 'deepseek/deepseek-r1:free'
  ]
  
  for model in models:
    model_name = model.split("/")[-1]

    # Create directory for responses if it doesn't exist
    response_dir = f"responses/{model_name}"
    if not os.path.exists(response_dir):
        os.makedirs(response_dir)
        print(f"Created directory: {response_dir}")

    # Check if there are already 10 files in the model's response directory
    response_dir = f"responses/{model_name}"
    if os.path.exists(response_dir):
        existing_files = [f for f in os.listdir(response_dir) if f.endswith('.json')]
        num_existing = len(existing_files)
        if num_existing >= 10:
            print(f"Skipping {model_name}: Already has {num_existing} responses")
            continue
        else:
            # If less than 10 files exist, only run the remaining needed evaluations
            remaining = 10 - num_existing
            print(f"Found {num_existing} existing responses for {model_name}, running {remaining} more")
            main(model, remaining, args.retry)
            
            # If retry is enabled, keep checking until we have 10 files
            if args.retry:
                while True:
                    existing_files = [f for f in os.listdir(response_dir) if f.endswith('.json')]
                    num_existing = len(existing_files)
                    if num_existing >= 10:
                        print(f"Successfully completed 10 evaluations for {model_name}")
                        break
                    remaining = 10 - num_existing
                    print(f"Still need {remaining} more valid responses for {model_name}, continuing...")
                    main(model, remaining, args.retry)