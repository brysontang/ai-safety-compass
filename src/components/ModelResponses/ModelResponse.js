import { getPositionDescription } from '../../utils/calculatePosition';

export default function ModelResponse({
  response,
  modelName,
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
            <div className="relative w-16 h-16 border border-slate-600 rounded mb-2">
              {/* Simple compass visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Vertical line */}
                <div className="absolute h-full w-px bg-slate-600"></div>
                {/* Horizontal line */}
                <div className="absolute w-full h-px bg-slate-600"></div>

                {/* Answer position dot */}
                {response.score !== undefined && (
                  <div
                    className="absolute w-2 h-2 rounded-full bg-yellow-500"
                    style={{
                      left: question.axes.some((a) => a.axis === 'alignment')
                        ? `${
                            (((response.score *
                              (question.axes.find((a) => a.axis === 'alignment')
                                ?.multiplier || 1)) /
                              2 +
                              1) /
                              2) *
                            100
                          }%`
                        : '50%',
                      top: question.axes.some((a) => a.axis === 'openVsClosed')
                        ? `${
                            (((response.score *
                              (question.axes.find(
                                (a) => a.axis === 'openVsClosed'
                              )?.multiplier || 1)) /
                              2 +
                              1) /
                              2) *
                            100
                          }%`
                        : '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  ></div>
                )}
              </div>
            </div>

            <div className="text-slate-400 text-xs">Question Vector</div>
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
