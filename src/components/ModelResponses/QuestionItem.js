import { useState } from 'react';
import ModelResponse from './ModelResponse';

export default function QuestionItem({
  question,
  allModelResponses,
  getModelPosition,
  getModelDisplayName,
}) {
  const [expanded, setExpanded] = useState(false);

  // Find response for a specific question and model
  const findResponse = (questionId, modelResponses) => {
    return modelResponses.find((response) => response.id === questionId);
  };

  return (
    <div className="bg-slate-850 border border-slate-700 overflow-hidden shadow-lg transition-all duration-200 hover:border-slate-600">
      {/* Question card header */}
      <button
        className="w-full p-5 flex justify-between items-center cursor-pointer focus:outline-none group"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex-1 text-left">
          <h2>{question.id}</h2>
          <h2 className="text-lg font-medium text-cyan-100 tracking-tight">
            {question.question}
          </h2>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-cyan-300 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable content panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[5000px]' : 'max-h-0'
        }`}
      >
        <div className="border-t border-slate-700">
          <div className="p-5">
            <div className="mb-4">
              <h3 className="text-sm uppercase tracking-wider text-slate-300 font-semibold">
                Model Responses
              </h3>
              <div className="h-px bg-gradient-to-r from-cyan-500/20 to-transparent mt-1"></div>
            </div>

            <div className="space-y-5">
              {Object.entries(allModelResponses).map(
                ([modelKey, modelResponses]) => {
                  const response = findResponse(question.id, modelResponses);
                  const modelName = getModelDisplayName(modelKey);
                  const modelPosition = getModelPosition(modelName);

                  if (!response) return null;

                  return (
                    <ModelResponse
                      key={modelKey}
                      response={response}
                      modelName={modelName}
                      modelPosition={modelPosition}
                      question={question}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
