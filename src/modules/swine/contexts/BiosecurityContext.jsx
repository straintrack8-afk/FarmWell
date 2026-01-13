import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateScore, generateRecommendations } from '../utils/biosecurityScoring';
import { assessDiseaseRisks, getDiseaseRiskSummary } from '../utils/diseaseRisk';

const BiosecurityContext = createContext();

export function useBiosecurity() {
  const context = useContext(BiosecurityContext);
  if (!context) {
    throw new Error('useBiosecurity must be used within BiosecurityProvider');
  }
  return context;
}

export function BiosecurityProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  useEffect(() => {
    loadQuestions();
    loadAssessmentHistory();
  }, []);

  useEffect(() => {
    if (currentAssessment) {
      saveAssessmentToStorage();
    }
  }, [currentAssessment, answers]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/data/swine/swine_questions_complete.json');
      const data = await response.json();
      
      const allQuestions = [];
      data.categories.forEach(category => {
        category.questions.forEach(question => {
          allQuestions.push({
            ...question,
            category: category.id,
            categoryName: category.name,
            categoryWeight: category.weight
          });
        });
      });
      
      setQuestions(allQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const loadAssessmentHistory = () => {
    try {
      const history = localStorage.getItem('biosecurity_history');
      if (history) {
        setAssessmentHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading assessment history:', error);
    }
  };

  const saveAssessmentToStorage = () => {
    try {
      if (currentAssessment) {
        localStorage.setItem('biosecurity_draft', JSON.stringify({
          assessment: currentAssessment,
          answers: answers,
          currentQuestionIndex: currentQuestionIndex
        }));
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const loadDraftAssessment = () => {
    try {
      const draft = localStorage.getItem('biosecurity_draft');
      if (draft) {
        const data = JSON.parse(draft);
        setCurrentAssessment(data.assessment);
        setAnswers(data.answers);
        setCurrentQuestionIndex(data.currentQuestionIndex);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading draft:', error);
      return false;
    }
  };

  const startNewAssessment = () => {
    const assessment = {
      id: generateAssessmentId(),
      started_at: new Date().toISOString(),
      status: 'in_progress',
      farm_name: '',
      assessor_name: ''
    };
    
    setCurrentAssessment(assessment);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    localStorage.removeItem('biosecurity_draft');
  };

  const saveAnswer = (questionId, answerValue, notes = '', photos = []) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    let answerScore = 0;
    if (question.type === 'single_select') {
      const option = question.options.find(opt => opt.value === answerValue);
      answerScore = option ? option.score : 0;
    } else if (question.type === 'multi_select') {
      const selectedValues = Array.isArray(answerValue) ? answerValue : [answerValue];
      const scores = selectedValues.map(val => {
        const option = question.options.find(opt => opt.value === val);
        return option ? option.score : 0;
      });
      answerScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }

    const newAnswer = {
      question_id: questionId,
      category: question.category,
      question_text: question.text,
      answer_value: answerValue,
      answer_score: answerScore,
      notes: notes,
      photo_urls: photos,
      answered_at: new Date().toISOString()
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.question_id !== questionId);
      return [...filtered, newAnswer];
    });
  };

  const getAnswer = (questionId) => {
    return answers.find(a => a.question_id === questionId);
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex];
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const completeAssessment = () => {
    const results = calculateScore(answers, questions);
    const diseaseRisks = assessDiseaseRisks(answers);
    const diseaseRiskSummary = getDiseaseRiskSummary(diseaseRisks);
    const recommendations = generateRecommendations(answers, results.category_scores);

    const completedAssessment = {
      ...currentAssessment,
      status: 'completed',
      completed_at: new Date().toISOString(),
      answers: answers,
      results: results,
      disease_risks: diseaseRisks,
      disease_risk_summary: diseaseRiskSummary,
      recommendations: recommendations,
      total_questions: questions.length,
      answered_questions: answers.length
    };

    const history = [...assessmentHistory, completedAssessment];
    setAssessmentHistory(history);
    localStorage.setItem('biosecurity_history', JSON.stringify(history));
    localStorage.removeItem('biosecurity_draft');

    return completedAssessment;
  };

  const getAssessmentById = (id) => {
    return assessmentHistory.find(a => a.id === id);
  };

  const deleteAssessment = (id) => {
    const filtered = assessmentHistory.filter(a => a.id !== id);
    setAssessmentHistory(filtered);
    localStorage.setItem('biosecurity_history', JSON.stringify(filtered));
  };

  const getProgress = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = answers.length;
    return {
      total: totalQuestions,
      answered: answeredQuestions,
      percentage: totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0,
      current: currentQuestionIndex + 1
    };
  };

  const getCategoryProgress = () => {
    const categoryProgress = {};
    
    questions.forEach(q => {
      if (!categoryProgress[q.category]) {
        categoryProgress[q.category] = {
          name: q.categoryName,
          total: 0,
          answered: 0
        };
      }
      categoryProgress[q.category].total++;
    });

    answers.forEach(a => {
      if (categoryProgress[a.category]) {
        categoryProgress[a.category].answered++;
      }
    });

    return categoryProgress;
  };

  const value = {
    questions,
    currentAssessment,
    answers,
    currentQuestionIndex,
    loading,
    assessmentHistory,
    startNewAssessment,
    saveAnswer,
    getAnswer,
    getCurrentQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    completeAssessment,
    getAssessmentById,
    deleteAssessment,
    loadDraftAssessment,
    getProgress,
    getCategoryProgress
  };

  return (
    <BiosecurityContext.Provider value={value}>
      {children}
    </BiosecurityContext.Provider>
  );
}

function generateAssessmentId() {
  return `BSC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
