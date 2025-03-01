import { useState } from 'react';
import ModelResponse from './ModelResponse';

export default function QuestionItem({
  question,
  allModelResponses,
  getModelPosition,
  getModelDisplayName,
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Find response for a specific question and model
  const findResponse = (questionId, modelResponses) => {
    return modelResponses.find((response) => response.id === questionId);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Question header (always visible) */}
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-750"
        onClick={toggleExpanded}
      >
        <div>
          <h2 className="text-lg font-semibold text-cyan-300">
            {question.question}
          </h2>
        </div>
        <div className="text-cyan-400">{expanded ? '▲' : '▼'}</div>
      </div>

      {/* Expanded content with model responses */}
      {expanded && (
        <div className="border-t border-slate-700 p-4">
          <div className="space-y-6">
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
      )}
    </div>
  );
}
