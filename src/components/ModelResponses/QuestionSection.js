import QuestionItem from './QuestionItem';

export default function QuestionSection({
  section,
  allModelResponses,
  getModelPosition,
  getModelDisplayName,
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        {section.sectionTitle}
      </h2>

      <div className="space-y-4">
        {section.questions.map((question) => (
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
