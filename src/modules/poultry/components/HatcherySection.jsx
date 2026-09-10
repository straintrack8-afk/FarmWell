import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import PoultryTopNav from './common/PoultryTopNav';

const tr = {
  en: {
    title: 'Hatchery',
    select: 'Select Tool',
    auditName: 'Hatchery Audit',
    auditDesc: 'Microbiological environmental sampling — air plates, swabs, fungal colony counts',
    checklistName: 'Hatchery Checklist',
    checklistDesc: 'Field inspection — biosecurity, technical performance, print report on the spot',
  },
  id: {
    title: 'Hatchery',
    select: 'Pilih Alat',
    auditName: 'Hatchery Audit',
    auditDesc: 'Pengambilan sampel mikrobiologi — air plate, swab, hitung koloni jamur',
    checklistName: 'Hatchery Checklist',
    checklistDesc: 'Inspeksi lapangan — biosekuriti, performa teknis, cetak laporan langsung',
  },
  vi: {
    title: 'Trại Ấp',
    select: 'Chọn công cụ',
    auditName: 'Kiểm Tra Vi Sinh',
    auditDesc: 'Lấy mẫu vi sinh môi trường — đĩa không khí, tăm bông, đếm khuẩn lạc nấm',
    checklistName: 'Kiểm Tra Trại Ấp',
    checklistDesc: 'Kiểm tra thực địa — an toàn sinh học, hiệu suất kỹ thuật, in báo cáo tại chỗ',
  }
};

const AuditIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    style={{ width: 28, height: 28, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7"/>
    <path d="M12 2c4 0 7 4 7 8 0 3-1.5 5.5-4 7"/>
    <path d="M9 17c0 2.5 1.3 4 3 4s3-1.5 3-4"/>
    <circle cx="12" cy="11" r="2"/>
    <path d="M8 21h8"/>
  </svg>
);

const ChecklistIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    style={{ width: 28, height: 28, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="2"/>
    <path d="M9 12h6M9 16h4M14 16l2 2 4-4"/>
  </svg>
);

export default function HatcherySection() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = ['vi','id'].includes(language) ? language : 'en';
  const t = tr[lang];

  const tools = [
    {
      id: 'audit',
      icon: <AuditIcon />,
      name: t.auditName,
      desc: t.auditDesc,
      route: '/poultry/hatchery-audit',
      badge: lang === 'vi' ? 'Lab' : 'Lab',
    },
    {
      id: 'checklist',
      icon: <ChecklistIcon />,
      name: t.checklistName,
      desc: t.checklistDesc,
      route: '/poultry/hatchery-checklist',
      badge: lang === 'vi' ? 'Thực địa' : (lang === 'id' ? 'Lapangan' : 'Field'),
    },
  ];

  return (
    <div className="fw-module-page">
      <PoultryTopNav title={t.title} />

      <div className="fw-mod-card">
        <div className="fw-mod-content">
          <div className="fw-welcome-section-label">{t.title} — {t.select}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {tools.map(tool => (
              <div key={tool.id} onClick={() => navigate(tool.route)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', background: '#F4FBF7', border: '1px solid #C8E8D4', borderRadius: 14, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px #2EAA5E25'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg,#3DC470,#2EAA5E)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{tool.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, background: '#2EAA5E', color: 'white', padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tool.badge}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{tool.desc}</div>
                </div>
                <div style={{ fontSize: 20, color: '#2EAA5E', fontWeight: 700 }}>›</div>
              </div>
            ))}
          </div>
        </div>

        <div className="fw-mod-bnav">
          <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </button>
          <button className="fw-mod-bnav-alerts" onClick={() => navigate('/poultry')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/></svg>
            <span>PoultryWell</span>
          </button>
        </div>
      </div>
    </div>
  );
}
