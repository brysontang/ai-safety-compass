# AI Safety Compass

The AI Safety Compass is a tool for evaluating and visualizing perspectives on AI safety, governance, and development. It maps responses to a series of questions onto a two-dimensional compass with axes representing alignment priorities and open vs. closed source preferences.

If you would like to try the AI Safety Compass, visit: https://ai-safety-compass.vercel.app

## Overview

The AI Safety Compass consists of:

1. A web application built with Next.js that allows users to take the test and view their results
2. Python scripts for generating prompts and calculating scores for AI models
3. A collection of responses from various AI models for comparison

## Features

- **Interactive Quiz**: Answer questions about AI safety, governance, and development
- **Visual Compass**: See your position on the AI Safety Compass
- **Model Comparisons**: Compare your results with those of leading AI models like Claude, GPT-4.5, Grok, and others
- **Detailed Analysis**: Understand where you stand on key AI safety dimensions

## Axes

The compass has two primary axes:

- **X-axis**: No Alignment (-1) to Pro Alignment (1)
  - Measures how much emphasis you place on AI alignment research and safety measures
- **Y-axis**: Closed Source (-1) to Open Source (1)
  - Measures your preference for open vs. closed development of AI systems

## Quadrants

Your position on the compass places you in one of four quadrants:

1. **Cautious Authority** (Pro Alignment, Closed Source)

   - You strongly favor meticulous safety measures and deliberate alignment research, trusting only select, regulated organizations to responsibly manage AI. To you, cautious control ensures that powerful technologies are introduced safely and deliberately.

2. **Community Watch** (Pro Alignment, Open Source)

   - You believe transparency and collective scrutiny are crucial for safely developing AI. In your view, openness combined with public oversight helps ensure alignment and reduces risks, fostering trust through collaborative safety checks.

3. **Shadow Catalyst** (No Alignment, Closed Source)

   - You value rapid advancement and competitive advantage, preferring to accelerate AI capabilities without the friction of rigorous safety oversight or public involvement. For you, closed doors enable efficiency, speed, and strategic innovation without the constraints of alignment concerns.

4. **Open Frontier** (No Alignment, Open Source)
   - You advocate for completely unrestricted, open development of AI. To you, explicit alignment measures are unnecessary—risks are minimal or naturally manageable through global cooperation. The priority is on innovation, accessibility, and the natural resilience that emerges from open collaboration.

## Technical Details

### Web Application

- Built with Next.js and React
- Uses Tailwind CSS for styling
- Interactive compass visualization using D3.js

### Python Scripts

- `generate_prompt.py`: Creates prompts for testing AI models
- `calculate_score.py`: Processes AI model responses and calculates their position on the compass

## Getting Started

### Prerequisites

- Node.js (version specified in .nvmrc)
- Python 3.x

### Installation

1. Clone the repository
2. Install JavaScript dependencies:
   ```
   npm install
   ```

### Running the Web Application

```
npm run dev
```

The application will be available at http://localhost:3000

### Testing AI Models

1. Generate a prompt:

   ```
   python generate_prompt.py
   ```

2. Use the generated prompt to test an AI model

3. Calculate the model's position:
   ```
   python calculate_score.py <llm_response_file> <shuffled_questions_file>
   ```

## License

MIT License
