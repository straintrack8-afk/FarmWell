import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../contexts/BiosecurityContext';
import { Shield, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';

function BiosecurityHomePage() {
  const navigate = useNavigate();
  const { assessmentHistory, loadDraftAssessment } = useBiosecurity();

  const lastAssessment = assessmentHistory.length > 0 
    ? assessmentHistory[assessmentHistory.length - 1] 
    : null;

  const handleStartNew = () => {
    navigate('/swine/biosecurity/assessment');
  };

  const handleContinueDraft = () => {
    const hasDraft = loadDraftAssessment();
    if (hasDraft) {
      navigate('/swine/biosecurity/assessment');
    }
  };

  const handleViewReport = (assessmentId) => {
    navigate(`/swine/biosecurity/results/${assessmentId}`);
  };

  const checkForDraft = () => {
    try {
      const draft = localStorage.getItem('biosecurity_draft');
      return draft !== null;
    } catch {
      return false;
    }
  };

  const hasDraft = checkForDraft();

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: '1.5rem'
        }}>
          <Shield size={40} color="white" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          Farm Biosecurity Check
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Comprehensive biosecurity assessment based on BIOCHECK PIG V4.0 from Ghent University
        </p>
      </div>

      {hasDraft && (
        <div className="card" style={{ 
          marginBottom: '2rem', 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Clock size={24} color="#d97706" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.25rem' }}>
                Draft Assessment Found
              </div>
              <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
                You have an unfinished assessment. Continue where you left off.
              </div>
            </div>
            <button
              onClick={handleContinueDraft}
              className="btn btn-primary"
              style={{ background: '#d97706', borderColor: '#d97706' }}
            >
              Continue Draft
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              Start New Assessment
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Complete a comprehensive 50-question biosecurity evaluation. Takes approximately 20-25 minutes.
            </p>
            
            {lastAssessment && (
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Last Assessment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '1.25rem' }}>
                      {lastAssessment.results?.overall_score || 0}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    background: lastAssessment.results?.risk_level.level === 'low' ? '#d1fae5' :
                               lastAssessment.results?.risk_level.level === 'medium' ? '#fef3c7' :
                               lastAssessment.results?.risk_level.level === 'high' ? '#fed7aa' : '#fecaca',
                    color: lastAssessment.results?.risk_level.level === 'low' ? '#065f46' :
                           lastAssessment.results?.risk_level.level === 'medium' ? '#92400e' :
                           lastAssessment.results?.risk_level.level === 'high' ? '#9a3412' : '#991b1b'
                  }}>
                    {lastAssessment.results?.risk_level.level.toUpperCase()} RISK
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {new Date(lastAssessment.completed_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleStartNew}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <Shield size={20} style={{ marginRight: '0.5rem' }} />
              Start New Assessment
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          What You'll Assess
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🏭', title: 'Farm Infrastructure', desc: 'Location, fencing, and physical barriers' },
            { icon: '🐷', title: 'Animal Management', desc: 'Purchase, quarantine, and transport' },
            { icon: '👥', title: 'People & Visitors', desc: 'Worker protocols and hygiene locks' },
            { icon: '🌾', title: 'Feed & Water', desc: 'Storage, quality, and contamination prevention' },
            { icon: '🐀', title: 'Pest Control', desc: 'Rodents, birds, and wild animals' },
            { icon: '🧼', title: 'Cleaning Protocols', desc: 'Disinfection and sanitation practices' }
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {assessmentHistory.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Assessment History
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assessmentHistory.slice().reverse().slice(0, 5).map((assessment) => (
              <div 
                key={assessment.id} 
                className="card"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => handleViewReport(assessment.id)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    background: assessment.results?.risk_level.level === 'low' ? '#d1fae5' :
                               assessment.results?.risk_level.level === 'medium' ? '#fef3c7' :
                               assessment.results?.risk_level.level === 'high' ? '#fed7aa' : '#fecaca',
                    color: assessment.results?.risk_level.level === 'low' ? '#065f46' :
                           assessment.results?.risk_level.level === 'medium' ? '#92400e' :
                           assessment.results?.risk_level.level === 'high' ? '#9a3412' : '#991b1b'
                  }}>
                    {assessment.results?.overall_score || 0}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      Assessment - {new Date(assessment.completed_at).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Grade: {assessment.results?.grade} • {assessment.results?.risk_level.level.toUpperCase()} Risk
                    </div>
                  </div>
                  
                  <FileText size={20} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem', background: '#eff6ff', border: '1px solid #3b82f6' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ color: '#1e40af', fontSize: '1.5rem' }}>ℹ️</div>
          <div>
            <div style={{ fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>
              About BIOCHECK PIG
            </div>
            <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
              This assessment is based on the scientifically validated BIOCHECK PIG V4.0 system developed 
              by Ghent University. It evaluates biosecurity across multiple critical areas to help protect 
              your farm from disease outbreaks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiosecurityHomePage;
