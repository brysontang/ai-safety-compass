'use client';

import { useState, useEffect } from 'react';

const QuestionSection = ({ section, onSectionComplete }) => {
  const [answers, setAnswers] = useState({});

  // Clear answers when section changes
  useEffect(() => {
    setAnswers({});
  }, [section]);

  const handleAnswer = (questionIndex, value) => {
    const newAnswers = {
      ...answers,
      [questionIndex]: value,
    };
    setAnswers(newAnswers);
  };

  const handleNextSection = () => {
    onSectionComplete(answers);
  };

  const options = [
    { value: -2, label: 'Strongly Disagree' },
    { value: -1, label: 'Disagree' },
    { value: 0, label: 'Neutral' },
    { value: 1, label: 'Agree' },
    { value: 2, label: 'Strongly Agree' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-slate-800 rounded-lg shadow-lg border border-cyan-500/30">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 font-mono">
        {section.sectionTitle}
      </h2>

      <div className="space-y-8">
        {section.questions.map((q, index) => (
          <div
            key={index}
            className="bg-slate-900 p-5 rounded-lg border border-slate-700"
          >
            <p className="text-slate-100 mb-4">{q.question}</p>

            <div className="grid grid-cols-5 gap-2 mt-4">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(index, option.value)}
                  className={`py-2 px-1 text-xs sm:text-sm rounded-md transition-all duration-200 
                    ${
                      answers[index] === option.value
                        ? 'bg-cyan-600 text-white border-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-slate-400 text-sm">
          {Object.keys(answers).length} of {section.questions.length} questions
          answered
        </div>

        <div className="h-2 bg-slate-700 rounded-full w-48">
          <div
            className="h-2 bg-cyan-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                (Object.keys(answers).length / section.questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Next button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNextSection}
          disabled={Object.keys(answers).length < section.questions.length}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            Object.keys(answers).length < section.questions.length
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20'
          }`}
        >
          Next Section
        </button>
      </div>
    </div>
  );
};

export default QuestionSection;
