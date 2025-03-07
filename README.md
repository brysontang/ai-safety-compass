# AI Safety Compass

The AI Safety Compass is a tool for evaluating and visualizing perspectives on AI safety, governance, and development. It helps users and AI models articulate and compare their stances on AI topics.

This benchmark includes responses collected from various Large Language Models (LLMs) to capture and compare their perspectives on AI safety.

Try the interactive quiz or review how different LLMs respond to important questions about AI.

## Project Overview

The AI Safety Compass comprises:

- A web app built with Next.js, offering an interactive quiz and visual results.
- Python scripts for generating prompts and analyzing AI model responses.
- A dataset of responses from various LLMs for benchmarking purposes.

## Features

- Interactive Quiz: Explore your stance on AI safety, governance, and development.
- Visual Compass Results: View your perspective plotted on a two-dimensional compass.
- LLM Benchmarks: Compare responses from multiple large language models to gauge diverse viewpoints.
- Detailed Analysis: Understand nuanced differences between AI models on critical safety dimensions.

## Benchmarking AI Models

We have run benchmarks across various Large Language Models (LLMs) to capture their distinct perspectives on AI safety, governance, and openness. This allows for meaningful comparisons between human and AI responses, helping users understand different approaches and biases inherent in popular models.

## Features

Interactive Quiz: Users answer structured questions on AI safety, governance, and development.

Model Comparisons: Compare your results with benchmarked responses from multiple LLMs.

Visualization: Clearly view where you (or different AI models) fall on the AI safety compass.

## Axes of the Compass

X-axis: Alignment

- Ranges from No Alignment (-1) to Pro Alignment (1)
- Indicates the priority placed on AI safety measures and alignment research.

Y-axis: Source Openness

- Ranges from Closed Source (-1) to Open Source (1)
- Reflects preference for controlled vs. openly available AI development.

## Compass Quadrants

1. Cautious Control (Pro Alignment, Closed Source)
2. Community Watch (Pro Alignment, Open Source)
3. Open Frontier (No Alignment, Open Source)
4. Closed Frontier (No Alignment, Closed Source)

## Getting Started

### Prerequisites

- Node.js (specified in .nvmrc)
- Python 3.x

### Installation

1. Clone the repository

2. Install JavaScript dependencies:

```bash
npm install
```

3. Running the Web Application

```bash
npm run dev
```

The app will run locally at http://localhost:3000.

### Scripts

1. Set your API key in the `.env` file:

```bash
OPENROUTER_API_KEY=your_openai_api_key
```

2. Generate prompts for models:

```bash
python scripts/run_eval.py
```

3. Analyze model responses:

```bash
python scripts/calculate_folder.py -v
```

### Paper

To generate the paper, run:

```bash
latexmk -pdf paper/main.tex
```

or install the VSCode extension:

- [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)

then enter the keystroke

- macOS: Cmd + Option + B
- Windows/Linux: Ctrl + Alt + B

## License

This project is licensed under the MIT License.
