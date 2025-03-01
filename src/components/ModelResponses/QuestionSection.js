import QuestionItem from './QuestionItem';

export default function QuestionSection({
  section,
  allModelResponses,
  getModelPosition,
  getModelDisplayName,
}) {
  // Sort questions by id
  const sortedQuestions = [...section.questions].sort((a, b) => {
    // Extract the numeric part after the hyphen (e.g., "0-1" -> "1")
    const idA = a.id.split('-')[1];
    const idB = b.id.split('-')[1];
    return parseInt(idA) - parseInt(idB);
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-cyan-200 mb-4">
        {section.sectionTitle}
      </h2>

      <div>
        {sortedQuestions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            allModelResponses={allModelResponses}
            getModelPosition={getModelPosition}
            getModelDisplayName={getModelDisplayName}
          />
        ))}
      </div>
    </div>
  );
}
