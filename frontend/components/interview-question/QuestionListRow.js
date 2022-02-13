import { useState } from "react";

export default function QuestionListRow({ question }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div>
      <div>
        <span>{question.field}</span>
        <div>
          <span>Q. {question.question}</span>
          <button onClick={() => setShowAnswer(!showAnswer)}>
            <i class="fas fa-angle-down"></i>
          </button>
        </div>
      </div>

      {showAnswer ? (
        <div>
          <div></div>
          <span>A. {question.answer}</span>
        </div>
      ) : null}
    </div>
  );
}
