import React, { useState, useEffect } from 'react';
import quizData from './quizData.json';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

const App: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // สุ่มคำตอบเมื่อเริ่มคำถามใหม่
    setShuffledOptions([...quizData[currentQuestion].options].sort(() => Math.random() - 0.5));
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowReason(true);
    if (answer === quizData[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setShowReason(false);
      setSelectedAnswer('');
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowReason(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quiz Completed!</h1>
        <p className="text-lg text-gray-800 mb-4">
          You scored <strong>{score}</strong> out of <strong>{quizData.length}</strong>.
        </p>
        <button
          onClick={restartQuiz}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-colors duration-200"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const question: Question = quizData[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h1>
      <div className="space-y-3 w-full max-w-md">
        {shuffledOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`w-full text-left p-4 rounded-lg border border-gray-300 hover:bg-blue-100 focus:outline-none transition-colors duration-200 ${
              option === selectedAnswer ? 'bg-green-100' : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showReason && (
        <div className="mt-6 p-4 rounded-lg bg-white shadow-md w-full max-w-md">
          {selectedAnswer === question.answer ? (
            <p className="text-green-500 text-center"><strong> Correct! </strong> {question.explanation}</p>
          ) : (
            <p className="text-red-500 text-center">
              Incorrect. The correct answer is: <strong>{question.answer}</strong>.
            </p>
          )}
        </div>
      )}
      <div className="mt-4 w-full max-w-md flex justify-between">
        <button
          onClick={() => setCurrentQuestion((prev) => (prev - 1 + quizData.length) % quizData.length)}
          className="p-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none transition-colors duration-200"
        >
          Previous Question
        </button>
        {showReason && (
          <button
            onClick={nextQuestion}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-colors duration-200"
          >
            {currentQuestion + 1 === quizData.length ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
