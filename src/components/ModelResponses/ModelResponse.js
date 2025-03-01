import { getPositionDescription } from '../../utils/calculatePosition';

export default function ModelResponse({
  response,
  modelName,
  model,
  modelPosition,
  question,
}) {
  return (
    <div className="bg-slate-850 rounded-lg border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">
              {modelName}
            </h3>

            <div className="flex items-start mb-3">
              <div className="flex items-center">
                {[
                  {
                    value: -2,
                    label: 'Strongly Disagree',
                    color: 'bg-red-700',
                  },
                  {
                    value: -1,
                    label: 'Disagree',
                    color: 'bg-orange-700',
                  },
                  {
                    value: 0,
                    label: 'Neutral',
                    color: 'bg-gray-700',
                  },
                  {
                    value: 1,
                    label: 'Agree',
                    color: 'bg-emerald-700',
                  },
                  {
                    value: 2,
                    label: 'Strongly Agree',
                    color: 'bg-green-700',
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`px-2 py-1 mx-1 rounded-md flex items-center justify-center text-xs ${
                      response.score === option.value
                        ? `${option.color} text-white font-medium`
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center flex-col">
            <div className="relative w-16 h-16 border border-slate-600 rounded mb-2 group">
              {/* Simple compass visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Quadrant backgrounds with hover effects */}
                <div className="absolute w-1/2 h-1/2 left-0 top-0 bg-purple-600/0 group-hover:bg-purple-600/30 transition-colors duration-300"></div>
                <div className="absolute w-1/2 h-1/2 right-0 top-0 bg-teal-600/0 group-hover:bg-teal-600/30 transition-colors duration-300"></div>
                <div className="absolute w-1/2 h-1/2 left-0 bottom-0 bg-amber-500/0 group-hover:bg-amber-500/30 transition-colors duration-300"></div>
                <div className="absolute w-1/2 h-1/2 right-0 bottom-0 bg-rose-500/0 group-hover:bg-rose-500/30 transition-colors duration-300"></div>

                {/* Vertical line */}
                <div className="absolute h-full w-px bg-slate-600"></div>
                {/* Horizontal line */}
                <div className="absolute w-full h-px bg-slate-600"></div>
                {/* Answer position dot */}
                {modelPosition && (
                  <div
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#3b82f6',
                      left: `${((modelPosition.x + 1) / 2) * 100}%`,
                      top: `${((1 + modelPosition.y) / 2) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  ></div>
                )}
              </div>
            </div>

            <div className="text-slate-400 text-xs">Model Position</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start flex-col">
          <div className="w-20 text-slate-400">Thinking:</div>
          <div className="text-slate-300 ml-0">
            <p className="mt-0">{response.thinking}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
