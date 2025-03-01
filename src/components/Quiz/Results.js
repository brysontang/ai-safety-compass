'use client';

import Link from 'next/link';
import Compass from './Compass';
import { getPositionDescription } from '../../utils/calculatePosition';
import { aiModels } from '../../data/aiModels';

const Results = ({ xValue, yValue }) => {
  const position = getPositionDescription(xValue, yValue);

  // Create a copy of AI models and add the user's position
  const allModels = [
    ...aiModels,
    {
      name: 'You',
      x: xValue,
      y: yValue,
      color: '#22d3ee', // Cyan
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-6 bg-slate-800 rounded-lg shadow-lg border border-cyan-500/30">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400 font-mono">
          YOUR AI SAFETY COMPASS RESULTS
        </h2>

        <Compass
          xValue={xValue}
          yValue={yValue}
          aiModels={aiModels}
          defaultView={false}
        />

        <div className="mt-8 bg-slate-900 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-center mb-4">
            <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-500 rounded-full text-cyan-400 font-mono font-bold">
              {position.name}
            </div>
          </div>

          <p className="text-slate-300 text-center">{position.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">
                Alignment Score
              </h3>
              <div className="flex items-center">
                <div className="w-full bg-slate-700 h-2 rounded-full">
                  <div
                    className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${((xValue + 1) / 2) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-slate-300 font-mono">
                  {xValue.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">
                Open Source Score
              </h3>
              <div className="flex items-center">
                <div className="w-full bg-slate-700 h-2 rounded-full">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${((yValue + 1) / 2) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-slate-300 font-mono">
                  {yValue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-900 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold mb-4 text-cyan-400 font-mono">
            AI MODELS COMPARISON
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allModels.map((model, index) => (
              <div
                key={index}
                className="bg-slate-800 p-4 rounded-lg flex items-center"
              >
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: model.color }}
                ></div>
                <div className="flex-1">
                  <div className="font-medium text-slate-200">{model.name}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    X: {model.x.toFixed(2)} | Y: {model.y.toFixed(2)}
                  </div>
                </div>
                <div className="text-xs font-mono px-2 py-1 rounded bg-slate-700 text-slate-300">
                  {getPositionDescription(model.x, model.y).name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-cyan-500/20"
          >
            Take the Test Again
          </button>

          <Link
            href="/model-responses"
            className="block mt-4 text-cyan-500 hover:text-cyan-400"
          >
            View AI Model Responses →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
