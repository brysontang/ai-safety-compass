'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QuestionSection from '../components/Quiz/QuestionSection';
import Results from '../components/Quiz/Results';
import LandingCompass from '../components/Quiz/LandingCompass';
import { calculatePosition } from '../utils/calculatePosition';
import questionsData from '../data/questions.json';
import Link from 'next/link';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [allAnswers, setAllAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [compassPosition, setCompassPosition] = useState({ x: 0, y: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Shuffle questions in each section when component mounts
  useEffect(() => {
    const shuffled = questionsData.map((section) => {
      // Create a copy of the questions array
      const shuffledQuestions = [...section.questions];

      // Fisher-Yates shuffle algorithm
      for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [
          shuffledQuestions[j],
          shuffledQuestions[i],
        ];
      }

      // Return a new section object with shuffled questions
      return {
        ...section,
        questions: shuffledQuestions,
      };
    });

    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    console.log(
      'Before scroll - scrollY:',
      window.scrollY,
      'document height:',
      document.documentElement.scrollHeight
    );

    setTimeout(() => {
      console.log(
        'After scroll - scrollY:',
        window.scrollY,
        'document height:',
        document.documentElement.scrollHeight
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50); // Give smooth scroll time to complete
  }, [currentSection, showResults, isStarted]);

  const handleSectionComplete = (sectionAnswers) => {
    const newAllAnswers = {
      ...allAnswers,
      [currentSection]: sectionAnswers,
    };

    setAllAnswers(newAllAnswers);

    // Move to the next section or show results if all sections are complete
    if (currentSection < shuffledQuestions.length - 1) {
      setCurrentSection(currentSection + 1);
      // Scroll to top after changing section
    } else {
      // Calculate final position
      const position = calculatePosition(newAllAnswers, shuffledQuestions);
      setCompassPosition(position);
      setShowResults(true);
      // Scroll to top when showing results
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full p-8 bg-slate-800 rounded-lg shadow-lg border border-cyan-500/30">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-cyan-400 font-mono">
              AI SAFETY COMPASS
            </h1>
            <p className="text-slate-300">
              Discover where you stand on key AI safety and governance issues
            </p>
          </div>

          <div className="mb-8 bg-slate-900 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">
              About This Test
            </h2>
            <p className="text-slate-300 mb-4">
              The AI Safety Compass maps your views on two key dimensions of AI
              governance:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-cyan-400 mb-2">
                  Alignment Axis
                </h3>
                <p className="text-sm text-slate-300">
                  From &ldquo;No Alignment&rdquo; (skeptical of AI risks) to
                  &ldquo;Pro Alignment&rdquo; (prioritizing AI safety research)
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-cyan-400 mb-2">
                  Access Axis
                </h3>
                <p className="text-sm text-slate-300">
                  From &ldquo;Closed Source&rdquo; (restricted access to AI) to
                  &ldquo;Open Source&rdquo; (democratized access to AI)
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm">
              Answer honestly to get the most accurate results. There are{' '}
              {questionsData.reduce(
                (total, section) => total + section.questions.length,
                0
              )}{' '}
              questions across {questionsData.length} sections.
            </p>
          </div>

          {/* Add the AI Models Compass */}
          <div className="mb-8">
            <LandingCompass />
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsStarted(true)}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-cyan-500/20 text-lg"
            >
              Start the Test
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
  }

  // Wait until questions are shuffled before rendering
  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-cyan-400">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4">
      {!showResults ? (
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cyan-400 font-mono">
              AI SAFETY COMPASS
            </h1>
            <p className="text-slate-400 mt-2">
              Section {currentSection + 1} of {shuffledQuestions.length}
            </p>
          </div>

          <QuestionSection
            section={shuffledQuestions[currentSection]}
            onSectionComplete={handleSectionComplete}
          />
        </div>
      ) : (
        <Results xValue={compassPosition.x} yValue={compassPosition.y} />
      )}
    </div>
  );
}
