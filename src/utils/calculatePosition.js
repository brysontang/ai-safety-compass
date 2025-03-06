/**
 * Calculate the position on the AI Safety Compass based on user answers
 *
 * @param {Object} allAnswers - Object containing all section answers
 * @param {Array} questions - Array of all questions from the JSON data
 * @returns {Object} - Object containing x and y coordinates for the compass
 */
export function calculatePosition(allAnswers, questions) {
  let alignmentScore = 0;
  let openSourceScore = 0;

  // Flatten all questions into a single array
  const allQuestions = questions.flatMap((section) => section.questions);

  // Process each section's answers
  Object.entries(allAnswers).forEach(([sectionIndex, sectionAnswers]) => {
    const sectionQuestions = questions[parseInt(sectionIndex)].questions;

    // Process each question's answer
    Object.entries(sectionAnswers).forEach(([questionIndex, answerValue]) => {
      const question = sectionQuestions[parseInt(questionIndex)];

      // Apply the answer to each axis based on the question's axes configuration
      question.axes.forEach((axisConfig) => {
        const { axis, multiplier, direction } = axisConfig;

        // Calculate the weighted score
        const weightedScore = answerValue * multiplier;

        // Apply the score to the appropriate axis in the appropriate direction
        if (axis === 'alignment') {
          alignmentScore +=
            direction === 'proAlignment' ? weightedScore : -weightedScore;
        } else if (axis === 'openVsClosed') {
          openSourceScore +=
            direction === 'openSource' ? weightedScore : -weightedScore;
        }
      });
    });
  });

  // Normalize scores to a range between -1 and 1
  const totalAlignmentQuestions = allQuestions.filter((q) =>
    q.axes.some((a) => a.axis === 'alignment')
  ).length;

  const totalOpenSourceQuestions = allQuestions.filter((q) =>
    q.axes.some((a) => a.axis === 'openVsClosed')
  ).length;

  // Maximum possible score would be if all questions were answered with Strongly Agree (2)
  // and all had a multiplier of 1.0
  const maxAlignmentScore = totalAlignmentQuestions * 2;
  const maxOpenSourceScore = totalOpenSourceQuestions * 2;

  // Normalize to -1 to 1 range
  const normalizedAlignmentScore = alignmentScore / maxAlignmentScore;
  const normalizedOpenSourceScore = openSourceScore / maxOpenSourceScore;

  return {
    x: normalizedAlignmentScore, // X-axis: No Alignment (-1) to Pro Alignment (1)
    y: normalizedOpenSourceScore, // Y-axis: Closed Source (-1) to Open Source (1)
  };
}

/**
 * Get a description of the user's position on the compass
 *
 * @param {number} x - X coordinate (alignment axis)
 * @param {number} y - Y coordinate (open source axis)
 * @returns {Object} - Object containing position name and description
 */
export function getPositionDescription(x, y) {
  // Determine which quadrant the user falls into
  if (x >= 0 && y < 0) {
    return {
      name: 'Cautious Authority',
      description:
        'You strongly favor meticulous safety measures and deliberate alignment research, trusting only select, regulated organizations to responsibly manage AI. To you, cautious control ensures that powerful technologies are introduced safely and deliberately.',
    };
  } else if (x >= 0 && y >= 0) {
    return {
      name: 'Community Watch',
      description:
        'You believe transparency and collective scrutiny are crucial for safely developing AI. In your view, openness combined with public oversight helps ensure alignment and reduces risks, fostering trust through collaborative safety checks.',
    };
  } else if (x < 0 && y < 0) {
    return {
      name: 'Shadow Catalyst',
      description:
        'You value rapid advancement and competitive advantage, preferring to accelerate AI capabilities without the friction of rigorous safety oversight or public involvement. For you, closed doors enable efficiency, speed, and strategic innovation without the constraints of alignment concerns.',
    };
  } else {
    return {
      name: 'Open Frontier',
      description:
        'You advocate for completely unrestricted, open development of AI. To you, explicit alignment measures are unnecessary—risks are minimal or naturally manageable through global cooperation. The priority is on innovation, accessibility, and the natural resilience that emerges from open collaboration.',
    };
  }
}
