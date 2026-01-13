import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../contexts/BiosecurityContext';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Download, Home, BarChart3 } from 'lucide-react';

function BiosecurityResultsPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { getAssessmentById } = useBiosecurity();
  const [assessment, setAssessment] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (assessmentId) {
      const data = getAssessmentById(assessmentId);
      if (data) {
        setAssessment(data);
      } else {
        navigate('/swine/biosecurity');
      }
    }
  }, [assessmentId]);

  if (!assessment) {
    return <div className="container">Loading...</div>;
  }

  const { results, disease_risks, disease_risk_summary, recommendations } = assessment;
  const riskLevel = results.risk_level;

  const getRiskColor = (level) => {
    const colors = {
      low: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      medium: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
      high: { bg: '#fed7aa', text: '#9a3412', border: '#f97316' },
      critical: { bg: '#fecaca', text: '#991b1b', border: '#ef4444' }
    };
    return colors[level] || colors.medium;
  };

  const categoryNames = {
    farm_characteristics: 'Farm Characteristics',
    purchase_animals: 'Purchase of Animals & Semen',
    transport_deadstock: 'Transport & Deadstock',
    feed_water_equipment: 'Feed, Water & Equipment',
    visitors_workers: 'Visitors & Workers',
    vermin_bird_control: 'Vermin & Bird Control',
    location: 'Location',
    disease_management: 'Disease Management',
    farrowing_suckling: 'Farrowing & Suckling Period',
    nursery_unit: 'Nursery Unit',
    finishing_unit: 'Finishing Unit',
    measures_between_compartments: 'Measures Between Compartments',
    cleaning_disinfection: 'Cleaning & Disinfection'
  };

  const colors = getRiskColor(riskLevel.level);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '1200px', padding: '2rem 1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: colors.bg,
              border: `3px solid ${colors.border}`,
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: colors.text }}>
                {results.overall_score}
              </span>
            </div>
            
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Assessment Complete
            </h1>
            
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: '600',
              background: colors.bg,
              color: colors.text,
              marginBottom: '1rem'
            }}>
              {riskLevel.icon} Grade {results.grade} - {riskLevel.level.toUpperCase()} RISK
            </div>
            
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {riskLevel.message}
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: '2px solid var(--border-color)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'diseases', label: 'Disease Risks', icon: AlertTriangle },
            { id: 'recommendations', label: 'Recommendations', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                color: activeTab === tab.id ? '#667eea' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Summary Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div className="card">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Overall Score
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: colors.text }}>
                  {results.overall_score}/100
                </div>
              </div>
              
              <div className="card">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Grade
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                  {results.grade}
                </div>
              </div>
              
              <div className="card">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Disease Risks
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: disease_risk_summary.color }}>
                  {disease_risk_summary.total}
                </div>
              </div>
              
              <div className="card">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Completed
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                  {new Date(assessment.completed_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                📊 Category Breakdown
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(results.category_scores).map(([categoryId, score]) => {
                  const categoryColor = score >= 85 ? '#10b981' :
                                       score >= 70 ? '#f59e0b' :
                                       score >= 50 ? '#f97316' : '#ef4444';
                  
                  return (
                    <div key={categoryId}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>
                          {categoryNames[categoryId] || categoryId}
                        </span>
                        <span style={{ fontWeight: '700', color: categoryColor }}>
                          {score.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '12px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '9999px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${score}%`,
                            height: '100%',
                            background: categoryColor,
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Disease Risks Tab */}
        {activeTab === 'diseases' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem', background: `${disease_risk_summary.color}10`, border: `2px solid ${disease_risk_summary.color}` }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <AlertTriangle size={32} color={disease_risk_summary.color} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                    {disease_risk_summary.message}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {disease_risk_summary.critical} Critical • {disease_risk_summary.high} High • {disease_risk_summary.medium} Medium
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Risks */}
            {disease_risks.critical.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626', marginBottom: '1rem' }}>
                  🔴 CRITICAL RISKS
                </h3>
                {disease_risks.critical.map((risk, idx) => (
                  <div key={idx} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #dc2626' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {risk.disease}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {risk.description}
                    </p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Risk Factors Detected:
                      </div>
                      <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        {risk.factors.map((factor, i) => (
                          <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                            <span style={{ 
                              fontWeight: '600',
                              color: factor.weight === 'CRITICAL' ? '#dc2626' : 
                                     factor.weight === 'HIGH' ? '#f97316' : '#f59e0b'
                            }}>
                              [{factor.weight}]
                            </span> {factor.factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#991b1b' }}>
                        Prevention Measures:
                      </div>
                      <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        {risk.prevention.map((measure, i) => (
                          <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', color: '#7f1d1d' }}>
                            {measure}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* High Risks */}
            {disease_risks.high.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f97316', marginBottom: '1rem' }}>
                  🟠 HIGH RISKS
                </h3>
                {disease_risks.high.map((risk, idx) => (
                  <div key={idx} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #f97316' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {risk.disease}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {risk.description}
                    </p>
                    
                    <div style={{ background: '#fff7ed', padding: '1rem', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#9a3412' }}>
                        Key Prevention Measures:
                      </div>
                      <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        {risk.prevention.slice(0, 4).map((measure, i) => (
                          <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', color: '#7c2d12' }}>
                            {measure}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Medium Risks */}
            {disease_risks.medium.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f59e0b', marginBottom: '1rem' }}>
                  ⚠️ MEDIUM RISKS
                </h3>
                {disease_risks.medium.map((risk, idx) => (
                  <div key={idx} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #f59e0b' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {risk.disease}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {risk.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {disease_risks.critical.length === 0 && disease_risks.high.length === 0 && disease_risks.medium.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Excellent Biosecurity!
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  No significant disease risks detected. Continue maintaining your current biosecurity practices.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            {recommendations.length > 0 ? (
              <div>
                {recommendations.filter(r => r.priority === 'high').length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626', marginBottom: '1rem' }}>
                      🔴 High Priority Actions
                    </h3>
                    {recommendations.filter(r => r.priority === 'high').map((rec, idx) => (
                      <div key={idx} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #dc2626' }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          {rec.issue_title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          {rec.issue_description}
                        </p>
                        <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                          <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            Recommendation:
                          </div>
                          <p style={{ fontSize: '0.875rem', margin: 0 }}>
                            {rec.recommendation_text}
                          </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                          <div>
                            <span style={{ fontWeight: '600' }}>Expected Impact:</span><br />
                            {rec.expected_impact}
                          </div>
                          <div>
                            <span style={{ fontWeight: '600' }}>Cost:</span><br />
                            {rec.estimated_cost}
                          </div>
                          <div>
                            <span style={{ fontWeight: '600' }}>Timeline:</span><br />
                            {rec.implementation_timeline}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recommendations.filter(r => r.priority === 'medium').length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f59e0b', marginBottom: '1rem' }}>
                      ⚠️ Medium Priority Actions
                    </h3>
                    {recommendations.filter(r => r.priority === 'medium').map((rec, idx) => (
                      <div key={idx} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #f59e0b' }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          {rec.issue_title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          {rec.recommendation_text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Great Work!
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  No critical recommendations at this time. Keep up the excellent biosecurity practices!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/swine/biosecurity')}
            className="btn btn-primary"
            style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Home size={20} />
            Back to Home
          </button>
          
          <button
            onClick={() => window.print()}
            className="btn"
            style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Download size={20} />
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiosecurityResultsPage;
