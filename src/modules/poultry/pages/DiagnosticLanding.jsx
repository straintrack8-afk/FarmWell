import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const translations = {
  en: {
    pageTitle: 'Disease Diagnostic Tools',
    pageSubtitle: 'Comprehensive tools for poultry disease diagnosis, comparison, and information management',
    allDiseases: {
      title: 'All Diseases & Conditions',
      description: 'Browse complete disease database with detailed information on 129 poultry diseases'
    },
    diagnosis: {
      title: 'Diagnosis Tools',
      description: 'Select symptoms to diagnose conditions with confidence scoring and treatment recommendations'
    },
    compare: {
      title: 'Compare Diseases',
      description: 'Side-by-side comparison of disease characteristics, symptoms, and treatment options'
    },
    openTool: 'Open Tool'
  },
  id: {
    pageTitle: 'Alat Diagnostik Penyakit',
    pageSubtitle: 'Alat komprehensif untuk diagnosis penyakit unggas, perbandingan, dan manajemen informasi',
    allDiseases: {
      title: 'Semua Penyakit & Kondisi',
      description: 'Jelajahi database penyakit lengkap dengan informasi detail tentang 129 penyakit unggas'
    },
    diagnosis: {
      title: 'Alat Diagnosis',
      description: 'Pilih gejala untuk mendiagnosis kondisi dengan skor kepercayaan dan rekomendasi pengobatan'
    },
    compare: {
      title: 'Bandingkan Penyakit',
      description: 'Perbandingan side-by-side karakteristik penyakit, gejala, dan pilihan pengobatan'
    },
    openTool: 'Buka Alat'
  },
  vn: {
    pageTitle: 'Công Cụ Chẩn Đoán Bệnh',
    pageSubtitle: 'Công cụ toàn diện cho chẩn đoán bệnh gia cầm, so sánh và quản lý thông tin',
    allDiseases: {
      title: 'Tất Cả Bệnh & Tình Trạng',
      description: 'Duyệt cơ sở dữ liệu bệnh đầy đủ với thông tin chi tiết về 129 bệnh gia cầm'
    },
    diagnosis: {
      title: 'Công Cụ Chẩn Đoán',
      description: 'Chọn triệu chứng để chẩn đoán tình trạng với điểm tin cậy và khuyến nghị điều trị'
    },
    compare: {
      title: 'So Sánh Bệnh',
      description: 'So sánh đặc điểm bệnh, triệu chứng và phương án điều trị song song'
    },
    openTool: 'Mở Công Cụ'
  }
};

const DiagnosticLanding = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const normalizedLang = language === 'vt' ? 'vn' : language;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const t = translations[normalizedLang] || translations.en;
  
  const tools = [
    {
      id: 'all-diseases',
      icon: '📋',
      title: t.allDiseases.title,
      description: t.allDiseases.description,
      route: '/poultry/diseases',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    {
      id: 'diagnosis',
      icon: '🔍',
      title: t.diagnosis.title,
      description: t.diagnosis.description,
      route: '/poultry/diagnostic/age',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    {
      id: 'compare',
      icon: '⚖️',
      title: t.compare.title,
      description: t.compare.description,
      route: '/poultry/compare',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    }
  ];
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #F0FDF4, #FFFFFF, #DBEAFE)', padding: '3rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '4rem' }}>🐔</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
            {t.pageTitle}
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6B7280', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            {t.pageSubtitle}
          </p>
        </div>
        
        {/* Tool Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem'
        }}>
          {tools.map(tool => (
            <ToolCard
              key={tool.id}
              {...tool}
              onClick={() => navigate(tool.route)}
              buttonText={t.openTool}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ icon, title, description, gradient, onClick, buttonText }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' : '0 10px 15px -3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        cursor: 'pointer',
        border: '2px solid #E5E7EB'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Icon Header with Gradient */}
      <div style={{
        background: gradient,
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{icon}</div>
      </div>
      
      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '0.75rem' 
        }}>
          {title}
        </h3>
        <p style={{ 
          color: '#6B7280', 
          fontSize: '0.875rem', 
          marginBottom: '2rem', 
          lineHeight: '1.6' 
        }}>
          {description}
        </p>
        
        {/* Button */}
        <button
          style={{
            width: '100%',
            background: '#10B981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={e => e.target.style.background = '#059669'}
          onMouseLeave={e => e.target.style.background = '#10B981'}
        >
          <span>{buttonText}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default DiagnosticLanding;
