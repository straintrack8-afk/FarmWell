import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../contexts/BiosecurityContext';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Info } from 'lucide-react';

function BiosecurityAssessmentPage() {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    answers,
    startNewAssessment,
    saveAnswer,
    getAnswer,
    getCurrentQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    completeAssessment,
    getProgress,
    getCategoryProgress
  } = useBiosecurity();

  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [notes, setNotes] = useState('');
  const [showCategoryNav, setShowCategoryNav] = useState(false);

  useEffect(() => {
    if (questions.length > 0 && !answers.length) {
      startNewAssessment();
    }
  }, [questions]);

  useEffect(() => {
    const question = getCurrentQuestion();
    if (question) {
      const existingAnswer = getAnswer(question.id);
      if (existingAnswer) {
        setCurrentAnswer(existingAnswer.answer_value);
        setNotes(existingAnswer.notes || '');
      } else {
        setCurrentAnswer(null);
        setNotes('');
      }
    }
  }, [currentQuestionIndex, questions]);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const categoryProgress = getCategoryProgress();

  if (!currentQuestion) {
    return <div className="container">Loading...</div>;
  }

  const handleAnswerSelect = (value) => {
    if (currentQuestion.type === 'multi_select') {
      const current = Array.isArray(currentAnswer) ? currentAnswer : [];
      if (current.includes(value)) {
        setCurrentAnswer(current.filter(v => v !== value));
      } else {
        setCurrentAnswer([...current, value]);
      }
    } else {
      setCurrentAnswer(value);
    }
  };

  const handleNext = () => {
    if (currentAnswer !== null && currentAnswer !== '') {
      saveAnswer(currentQuestion.id, currentAnswer, notes);
      
      if (currentQuestionIndex < questions.length - 1) {
        goToNextQuestion();
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentAnswer !== null && currentAnswer !== '') {
      saveAnswer(currentQuestion.id, currentAnswer, notes);
    }
    goToPreviousQuestion();
  };

  const handleComplete = () => {
    const completed = completeAssessment();
    navigate(`/swine/biosecurity/results/${completed.id}`);
  };

  const isAnswerValid = () => {
    if (currentQuestion.type === 'multi_select') {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    if (currentQuestion.type === 'matrix') {
      if (typeof currentAnswer === 'object' && !Array.isArray(currentAnswer)) {
        const requiredRows = currentQuestion.rows.length;
        const answeredRows = Object.keys(currentAnswer).length;
        return answeredRows === requiredRows;
      }
      return false;
    }
    return currentAnswer !== null && currentAnswer !== '';
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      farm_characteristics: '#8b5cf6',
      purchase_animals: '#3b82f6',
      transport_deadstock: '#06b6d4',
      feed_water_equipment: '#10b981',
      visitors_workers: '#f59e0b',
      vermin_bird_control: '#ef4444',
      location: '#ec4899',
      disease_management: '#6366f1',
      farrowing_suckling: '#f97316',
      nursery_unit: '#84cc16',
      finishing_unit: '#22d3ee',
      measures_between_compartments: '#a855f7',
      cleaning_disinfection: '#14b8a6'
    };
    return colors[categoryId] || '#6b7280';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Progress Bar */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ maxWidth: '1200px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              Question {progress.current} of {progress.total}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {Math.round(progress.percentage)}% Complete
            </div>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: 'var(--bg-secondary)', 
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${progress.percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Category Badge */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            background: `${getCategoryColor(currentQuestion.category)}20`,
            color: getCategoryColor(currentQuestion.category)
          }}>
            {currentQuestion.categoryName}
          </div>
        </div>

        {/* Question Card */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', lineHeight: '1.4' }}>
            {currentQuestion.text}
          </h2>

          {currentQuestion.help && (
            <div style={{
              padding: '1rem',
              background: '#eff6ff',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <Info size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                {currentQuestion.help}
              </div>
            </div>
          )}

          {/* Answer Options */}
          <div style={{ marginBottom: '1.5rem' }}>
            {currentQuestion.type === 'single_select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      border: '2px solid',
                      borderColor: currentAnswer === option.value ? '#667eea' : 'var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: currentAnswer === option.value ? '#f5f3ff' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (currentAnswer !== option.value) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentAnswer !== option.value) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option.value}
                      checked={currentAnswer === option.value}
                      onChange={() => handleAnswerSelect(option.value)}
                      style={{ marginRight: '0.75rem', width: '20px', height: '20px' }}
                    />
                    <span style={{ flex: 1, fontWeight: currentAnswer === option.value ? '600' : '400' }}>
                      {option.label}
                    </span>
                    {currentAnswer === option.value && (
                      <Check size={20} color="#667eea" />
                    )}
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multi_select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentQuestion.options.map((option) => {
                  const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        border: '2px solid',
                        borderColor: isSelected ? '#667eea' : 'var(--border-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isSelected ? '#f5f3ff' : 'white'
                      }}
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(option.value)}
                        style={{ marginRight: '0.75rem', width: '20px', height: '20px' }}
                      />
                      <span style={{ flex: 1, fontWeight: isSelected ? '600' : '400' }}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check size={20} color="#667eea" />
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'number' && (
              <div>
                <input
                  type="number"
                  value={currentAnswer || ''}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={`Enter ${currentQuestion.unit || 'number'}`}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                {currentQuestion.unit && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Unit: {currentQuestion.unit}
                  </div>
                )}
              </div>
            )}

            {currentQuestion.type === 'matrix' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                        Question
                      </th>
                      {currentQuestion.columns.map((col) => (
                        <th key={col.value} style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestion.rows.map((row) => {
                      const matrixAnswer = typeof currentAnswer === 'object' && !Array.isArray(currentAnswer) ? currentAnswer : {};
                      return (
                        <tr key={row.id}>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                            {row.text}
                          </td>
                          {currentQuestion.columns.map((col) => (
                            <td key={col.value} style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                              <input
                                type="radio"
                                name={`matrix_${row.id}`}
                                value={col.value}
                                checked={matrixAnswer[row.id] === col.value}
                                onChange={() => {
                                  const newAnswer = { ...matrixAnswer, [row.id]: col.value };
                                  setCurrentAnswer(newAnswer);
                                }}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant observations or comments..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswerValid()}
            className="btn btn-primary"
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Category Progress */}
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Category Progress</h3>
            <button
              onClick={() => setShowCategoryNav(!showCategoryNav)}
              className="btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {showCategoryNav ? 'Hide' : 'Show'} Categories
            </button>
          </div>

          {showCategoryNav && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(categoryProgress).map(([categoryId, data]) => {
                const percentage = data.total > 0 ? (data.answered / data.total) * 100 : 0;
                return (
                  <div key={categoryId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{data.name}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {data.answered}/{data.total}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '9999px',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: getCategoryColor(categoryId),
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BiosecurityAssessmentPage;
