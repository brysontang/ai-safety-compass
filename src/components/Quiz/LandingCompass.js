'use client';

import { useEffect, useState } from 'react';
import Compass from './Compass';
import { aiModels } from '../../data/aiModels';

const LandingCompass = () => {
  // Use state to ensure component renders properly with client-side hydration
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">
          AI Models on the Compass
        </h2>
        <p className="text-slate-300 mb-6">
          Explore the AI Safety Compass with its four quadrants representing
          different approaches to AI development and safety. Take the test to
          find your position!
        </p>

        {isClient && (
          <Compass
            xValue={-0.13}
            yValue={0.42}
            aiModels={aiModels}
            showUserPosition={false}
            defaultView={false}
          />
        )}
      </div>
    </div>
  );
};

export default LandingCompass;
