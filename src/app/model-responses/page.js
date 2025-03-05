'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import questionsData from '../../data/questions.json';
import { aiModels } from '../../data/aiModels';
import { allModelResponses } from '../../data/modelResponses';
import QuestionSection from '../../components/ModelResponses/QuestionSection';
import Compass from '../../components/Quiz/Compass';

export default function ModelResponses() {
  const [flatQuestions, setFlatQuestions] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [showCompass, setShowCompass] = useState(true);

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
        <div className="max-w-6xl mx-auto">
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

        {/* Questions Section */}
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
