import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import { Vocabulary, Quiz as QuizType } from '../types';
import { useAudio } from '../hooks/useAudio';

interface QuizProps {
  vocabularyList: Vocabulary[];
  onComplete: (score: number, totalQuestions: number) => void;
  quizType: 'multiple-choice' | 'fill-blank' | 'matching' | 'mixed';
}

const Quiz: React.FC<QuizProps> = ({ vocabularyList, onComplete, quizType }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuizType[]>([]);
  const { speak } = useAudio();

  useEffect(() => {
    generateQuestions();
  }, [vocabularyList, quizType]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [timeLeft, showResult, isAnswered]);

  const generateQuestions = () => {
    const shuffled = [...vocabularyList].sort(() => Math.random() - 0.5);
    const selectedVocab = shuffled.slice(0, Math.min(10, vocabularyList.length));
    
    const newQuestions: QuizType[] = selectedVocab.map((vocab, index) => {
      const currentQuizType = quizType === 'mixed' 
        ? ['multiple-choice', 'fill-blank'][Math.floor(Math.random() * 2)] as 'multiple-choice' | 'fill-blank'
        : quizType;

      switch (currentQuizType) {
        case 'multiple-choice':
          return generateMultipleChoice(vocab, vocabularyList);
        case 'fill-blank':
          return generateFillBlank(vocab);
        default:
          return generateMultipleChoice(vocab, vocabularyList);
      }
    });

    setQuestions(newQuestions);
  };

  const generateMultipleChoice = (vocab: Vocabulary, allVocab: Vocabulary[]): QuizType => {
    const otherVocab = allVocab.filter(v => v.id !== vocab.id);
    const wrongAnswers = otherVocab
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.meaning);
    
    const options = [vocab.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      id: `mc-${vocab.id}`,
      type: 'multiple-choice',
      question: `What does "${vocab.word}" mean?`,
      options,
      correctAnswer: vocab.meaning,
      vocabulary: vocab,
      difficulty: vocab.difficulty || 0.5
    };
  };

  const generateFillBlank = (vocab: Vocabulary): QuizType => {
    const sentence = vocab.example.replace(
      new RegExp(vocab.word, 'gi'), 
      '_____'
    );

    return {
      id: `fb-${vocab.id}`,
      type: 'fill-blank',
      question: `Fill in the blank: ${sentence}`,
      correctAnswer: vocab.word.toLowerCase(),
      vocabulary: vocab,
      difficulty: vocab.difficulty || 0.5
    };
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    setShowResult(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        onComplete(score, questions.length);
      }
    }, 2000);
  };

  const handleAnswer = () => {
    if (isAnswered) return;

    setIsAnswered(true);
    setShowResult(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = currentQ.type === 'multiple-choice' 
      ? selectedAnswer === currentQ.correctAnswer
      : userAnswer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      speak('Correct!');
    } else {
      speak('Incorrect');
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion();
      } else {
        onComplete(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer('');
    setUserAnswer('');
    setShowResult(false);
    setIsAnswered(false);
    setTimeLeft(30);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating quiz questions...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-lg font-semibold text-gray-700">
            Score: {score}/{questions.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentQ.question}
          </h2>
          
          {currentQ.vocabulary.imageUrl && (
            <img
              src={currentQ.vocabulary.imageUrl}
              alt={currentQ.vocabulary.word}
              className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 shadow-md"
            />
          )}
        </div>

        {/* Multiple Choice Options */}
        {currentQ.type === 'multiple-choice' && currentQ.options && (
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.correctAnswer;
              const isWrong = showResult && isSelected && !isCorrect;
              const shouldHighlight = showResult && isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !isAnswered && setSelectedAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium ${
                    shouldHighlight
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : isWrong
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {showResult && isWrong && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank */}
        {currentQ.type === 'fill-blank' && (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => !isAnswered && setUserAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-center text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
            />
            
            {showResult && (
              <div className="text-center">
                <p className="text-lg font-medium">
                  Correct answer: <span className="text-green-600">{currentQ.correctAnswer}</span>
                </p>
                {userAnswer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase() ? (
                  <div className="flex items-center justify-center text-green-600 mt-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Correct!
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-red-600 mt-2">
                    <XCircle className="h-5 w-5 mr-2" />
                    Incorrect
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!showResult && (
          <div className="text-center mt-6">
            <button
              onClick={handleAnswer}
              disabled={
                isAnswered || 
                (currentQ.type === 'multiple-choice' && !selectedAnswer) ||
                (currentQ.type === 'fill-blank' && !userAnswer.trim())
              }
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>

      {/* Answer Explanation */}
      {showResult && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About this word:</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Definition:</strong> {currentQ.vocabulary.definition}</p>
            <p><strong>Example:</strong> "{currentQ.vocabulary.example}"</p>
            <p><strong>Pronunciation:</strong> {currentQ.vocabulary.pronunciation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;