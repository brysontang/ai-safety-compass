// Import all model response files
import claudeSonnet from './responses/claude_sonnet_3_7.json';
import grok3 from './responses/grok_3.json';
import geminiFlash2 from './responses/gemini_2_flash.json';
import gemini2Pro from './responses/gemini_2_pro.json';
import gpt45 from './responses/gpt_4_5.json';
import llama33 from './responses/llama_3_3.json';
import o3MiniHigh from './responses/o3_mini_high.json';
import qwen25 from './responses/qwen_2_5.json';

export const allModelResponses = {
  'Claude Sonnet 3.7': claudeSonnet,
  'Grok 3': grok3,
  'GPT-4.5': gpt45,
  'o3 Mini High': o3MiniHigh,
  'Gemini 2.0 Flash': geminiFlash2,
  'Gemini 2.0 Pro Exp': gemini2Pro,
  'Llama 3.3 70B Instruct': llama33,
  'Qwen2.5 32B Instruct': qwen25,
};
