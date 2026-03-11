import React from 'react';

export const ComparisonSection = ({ title, data1, data2 }) => {
  return (
    <div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries(data1).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>{key}:</span>
              <span style={{ color: '#6B7280' }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries(data2).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>{key}:</span>
              <span style={{ color: '#6B7280' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ComparisonListSection = ({ title, list1, list2, translations: t }) => {
  return (
    <div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          {list1.length > 0 ? (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', padding: 0 }}>
              {list1.map((item, index) => (
                <li key={index} style={{ fontSize: '0.875rem', color: '#4B5563', display: 'flex', alignItems: 'start' }}>
                  <span style={{ marginRight: '0.5rem' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>{t.noInfo}</p>
          )}
        </div>
        <div>
          {list2.length > 0 ? (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', padding: 0 }}>
              {list2.map((item, index) => (
                <li key={index} style={{ fontSize: '0.875rem', color: '#4B5563', display: 'flex', alignItems: 'start' }}>
                  <span style={{ marginRight: '0.5rem' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>{t.noInfo}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const SymptomOverlapSection = ({ disease1, disease2, overlap, translations: t }) => {
  const { common, unique1, unique2, percentage } = overlap;
  const getName = (disease) => disease.name || disease.nama || '';
  
  return (
    <div style={{ 
      background: 'linear-gradient(to right, #DBEAFE, #EDE9FE)', 
      borderRadius: '0.5rem', 
      padding: '1rem' 
    }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
        🔍 {t.symptomOverlap}
      </h3>
      
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563EB', marginBottom: '0.25rem' }}>
          {percentage}%
        </div>
        <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>
          Symptom Overlap ({common.length} common symptoms)
        </div>
      </div>
      
      <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '9999px', height: '0.75rem', marginBottom: '1rem', overflow: 'hidden' }}>
        <div 
          style={{ 
            background: '#2563EB', 
            height: '100%', 
            borderRadius: '9999px', 
            transition: 'width 0.5s',
            width: `${percentage}%`
          }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
        <div>
          <h4 style={{ fontWeight: '600', color: '#2563EB', marginBottom: '0.5rem' }}>
            {t.uniqueTo} {getName(disease1).split(' ')[0]}
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', padding: 0 }}>
            {unique1.slice(0, 5).map((symptom, i) => (
              <li key={i} style={{ color: '#4B5563' }}>• {symptom}</li>
            ))}
            {unique1.length > 5 && (
              <li style={{ color: '#9CA3AF', fontStyle: 'italic' }}>+ {unique1.length - 5} {t.more}</li>
            )}
          </ul>
        </div>
        
        <div>
          <h4 style={{ fontWeight: '600', color: '#7C3AED', marginBottom: '0.5rem' }}>
            {t.commonSymptoms}
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', padding: 0 }}>
            {common.slice(0, 5).map((symptom, i) => (
              <li key={i} style={{ color: '#4B5563' }}>• {symptom}</li>
            ))}
            {common.length > 5 && (
              <li style={{ color: '#9CA3AF', fontStyle: 'italic' }}>+ {common.length - 5} {t.more}</li>
            )}
          </ul>
        </div>
        
        <div>
          <h4 style={{ fontWeight: '600', color: '#EA580C', marginBottom: '0.5rem' }}>
            {t.uniqueTo} {getName(disease2).split(' ')[0]}
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', padding: 0 }}>
            {unique2.slice(0, 5).map((symptom, i) => (
              <li key={i} style={{ color: '#4B5563' }}>• {symptom}</li>
            ))}
            {unique2.length > 5 && (
              <li style={{ color: '#9CA3AF', fontStyle: 'italic' }}>+ {unique2.length - 5} {t.more}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const KeyDifferences = ({ disease1, disease2, translations: t }) => {
  const differences = [];
  
  const getName = (disease) => disease.name || disease.nama || '';
  const getCategory = (disease) => disease.category || disease.kategori || '';
  const getSeverity = (disease) => disease.severity || disease.tingkat_keparahan || '';
  const getZoonotic = (disease) => disease.zoonotic || disease.zoonosis || false;
  
  if (getCategory(disease1) !== getCategory(disease2)) {
    differences.push({
      aspect: t.cause,
      diff: `${getName(disease1)} ${t.is} ${getCategory(disease1)}, ${t.while} ${getName(disease2)} ${t.is} ${getCategory(disease2)}` 
    });
  }
  
  if (getSeverity(disease1) !== getSeverity(disease2)) {
    differences.push({
      aspect: t.severity,
      diff: `${getName(disease1)} ${t.is} ${getSeverity(disease1)} severity, ${getName(disease2)} ${t.is} ${getSeverity(disease2)}` 
    });
  }
  
  if (getZoonotic(disease1) !== getZoonotic(disease2)) {
    const zoonoticDisease = getZoonotic(disease1) ? getName(disease1) : getName(disease2);
    differences.push({
      aspect: t.zoonoticRisk,
      diff: `${zoonoticDisease} ${t.canInfectHumans}` 
    });
  }
  
  if (differences.length === 0) {
    return null;
  }
  
  return (
    <div style={{ 
      background: '#FEF3C7', 
      borderLeft: '4px solid #F59E0B', 
      padding: '1rem', 
      borderRadius: '0.25rem' 
    }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.75rem' }}>
        ⚠️ {t.keyDifferences}
      </h3>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
        {differences.map((diff, i) => (
          <li key={i} style={{ fontSize: '0.875rem' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>{diff.aspect}:</span>{' '}
            <span style={{ color: '#4B5563' }}>{diff.diff}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
