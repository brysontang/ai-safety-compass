'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import questionsData from '../../data/questions.json';
import { aiModels } from '../../data/aiModels';
import QuestionSection from '../../components/ModelResponses/QuestionSection';

// Import all model response files
// import claudeSonnet from '../../data/responses/claude_sonnet_3_7.json';
// import gpt45 from '../../data/responses/gpt_4_5.json';
import grok3 from '../../data/responses/grok_3.json';
// import deepseekR1 from '../../data/responses/deepseek_r1.json';
// import geminiFlash2 from '../../data/responses/gemini_flash_2.json';
// import o1Pro from '../../data/responses/o1_pro.json';
// import llama3405b from '../../data/responses/llama_3_405b.json';

export default function ModelResponses() {
  const [flatQuestions, setFlatQuestions] = useState([]);
  const [allModelResponses, setAllModelResponses] = useState({
    // gpt_4_5: gpt45,
    // o1_pro: o1Pro,
    // claude_sonnet_3_7: claudeSonnet,
    grok_3: grok3,
    // deepseek_r1: deepseekR1,
    // gemini_flash_2: geminiFlash2,
    // llama_3_405b: llama3405b,
  });
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Flatten questions data for easier access
  useEffect(() => {
    const flattened = questionsData.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        sectionTitle: section.sectionTitle,
      }))
    );
    setFlatQuestions(flattened);
  }, []);

  // Group questions by section
  const groupedQuestions = questionsData.map((section) => ({
    sectionTitle: section.sectionTitle,
    questions: section.questions,
  }));

  // Get model position from aiModels data
  const getModelPosition = (modelName) => {
    const model = aiModels.find((m) => m.name === modelName);
    return model ? { x: model.x, y: model.y } : { x: 0, y: 0 };
  };

  // Get model display name
  const getModelDisplayName = (modelKey) => {
    const modelResponses = allModelResponses[modelKey] || [];
    return modelResponses[0]?.name || modelKey.replace(/_/g, ' ').toUpperCase();
  };

  // If not client yet, return a simple loading state to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cyan-400 font-mono">
              AI MODEL RESPONSES
            </h1>
            <p className="text-slate-400 mt-2">Loading model responses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 font-mono">
            AI MODEL RESPONSES
          </h1>
          <p className="text-slate-400 mt-2">
            Compare how different AI models respond to the same questions
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-cyan-500 hover:text-cyan-400"
          >
            ← Back to Compass
          </Link>
        </div>

        {/* Questions by section */}
        <div className="space-y-8">
          {groupedQuestions.map((section) => (
            <QuestionSection
              key={section.sectionTitle}
              section={section}
              allModelResponses={allModelResponses}
              getModelPosition={getModelPosition}
              getModelDisplayName={getModelDisplayName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
