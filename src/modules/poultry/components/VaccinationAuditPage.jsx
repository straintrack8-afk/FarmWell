import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import PoultryTopNav from './common/PoultryTopNav';

const STORAGE_KEY = 'farmwell_vaccination_audit';

const t = {
  en: {
    title: 'Vaccination Audit Checklist',
    tabAudit: 'Vaccination Audit',
    tabInjection: 'Injection Test',
    section: 'Section',
    criteria: 'Criteria',
    technicalReq: 'Technical Requirement',
    maxScore: 'Max',
    actualScore: 'Score',
    sectionTotal: 'Section Total',
    grandTotal: 'Grand Total',
    reset: 'Reset',
    print: 'Print',
    note: 'Note',
    addRow: '+ Add Row',
    excellent: 'Excellent',
    good: 'Good',
    needsImprovement: 'Needs Improvement',
    poor: 'Poor',
    back: 'Back',
    saveNote: 'Notes saved automatically',
  },
  vi: {
    title: 'Bảng Kiểm Tra Tiêm Phòng',
    tabAudit: 'Kiểm Tra Tiêm Phòng',
    tabInjection: 'Kiểm Tra Tiêm',
    section: 'Mục',
    criteria: 'Tiêu chí',
    technicalReq: 'Yêu cầu kỹ thuật',
    maxScore: 'Tối đa',
    actualScore: 'Điểm',
    sectionTotal: 'Tổng mục',
    grandTotal: 'Tổng điểm',
    reset: 'Đặt lại',
    print: 'In',
    note: 'Ghi chú',
    addRow: '+ Thêm hàng',
    excellent: 'Xuất sắc',
    good: 'Tốt',
    needsImprovement: 'Cần cải thiện',
    poor: 'Kém',
    back: 'Quay lại',
    saveNote: 'Ghi chú được lưu tự động',
  }
};

function getScoreColor(pct) {
  if (pct >= 80) return '#10B981';
  if (pct >= 60) return '#F59E0B';
  if (pct >= 40) return '#EF4444';
  return '#DC2626';
}

function getScoreLabel(pct, lang) {
  if (pct >= 80) return t[lang].excellent;
  if (pct >= 60) return t[lang].good;
  if (pct >= 40) return t[lang].needsImprovement;
  return t[lang].poor;
}

const VaccineIcon = () => (
  <svg viewBox="0 0 24 24" style={{width:20,height:20,stroke:'white',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
    <path d="M10 2v2M14 2v2M12 4v4M8 8h8l1 10H7L8 8z"/>
    <path d="M9 12h6M9 15h4"/>
  </svg>
);

export default function VaccinationAuditPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language === 'id' ? 'vi' : (language === 'vi' ? 'vi' : 'en');
  const tr = t[lang];

  const [data, setData] = useState(null);
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState({});
  const [injectionRows, setInjectionRows] = useState([{ id: 1, name: '', no_of_chick: '', wet: '', very_wet: '', bleed: '', no_vaccine: '', dead: '', good: '' }]);
  const [activeTab, setActiveTab] = useState('audit');
  const [collapsed, setCollapsed] = useState({});
  const [auditorInfo, setAuditorInfo] = useState({ auditor: '', date: new Date().toISOString().split('T')[0], hatchery: '' });

  useEffect(() => {
    fetch('/data/poultry/vaccination_audit_checklist.json')
      .then(r => r.json())
      .then(d => {
        setData(d);
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (saved.scores) setScores(saved.scores);
        if (saved.notes) setNotes(saved.notes);
        if (saved.injectionRows) setInjectionRows(saved.injectionRows);
        if (saved.auditorInfo) setAuditorInfo(saved.auditorInfo);
      });
  }, []);

  useEffect(() => {
    if (!data) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ scores, notes, injectionRows, auditorInfo }));
  }, [scores, notes, injectionRows, auditorInfo, data]);

  const handleScore = (criteriaNo, value, maxScore) => {
    const num = Math.min(Math.max(parseInt(value) || 0, 0), maxScore);
    setScores(prev => ({ ...prev, [criteriaNo]: num }));
  };

  const handleNote = (criteriaNo, value) => {
    setNotes(prev => ({ ...prev, [criteriaNo]: value }));
  };

  const getSectionScore = (section) => {
    return section.criteria.reduce((sum, c) => sum + (scores[c.no] || 0), 0);
  };

  const getGrandTotal = () => {
    if (!data) return 0;
    return data.sections.reduce((sum, s) => sum + getSectionScore(s), 0);
  };

  const handleReset = () => {
    if (!window.confirm(lang === 'vi' ? 'Đặt lại tất cả điểm?' : 'Reset all scores?')) return;
    setScores({});
    setNotes({});
    setInjectionRows([{ id: 1, name: '', no_of_chick: '', wet: '', very_wet: '', bleed: '', no_vaccine: '', dead: '', good: '' }]);
  };

  const toggleSection = (id) => setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const addInjectionRow = () => {
    setInjectionRows(prev => [...prev, { id: Date.now(), name: '', no_of_chick: '', wet: '', very_wet: '', bleed: '', no_vaccine: '', dead: '', good: '' }]);
  };

  const updateInjectionRow = (id, field, value) => {
    setInjectionRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeInjectionRow = (id) => {
    setInjectionRows(prev => prev.filter(r => r.id !== id));
  };

  if (!data) return <div className="fw-module-page"><div className="fw-mod-card" style={{padding:40,textAlign:'center'}}>Loading...</div></div>;

  const grandTotal = getGrandTotal();
  const grandPct = Math.round((grandTotal / 500) * 100);
  const scoreColor = getScoreColor(grandPct);

  return (
    <div className="fw-module-page">
      <PoultryTopNav title={tr.title} />

      {/* Header info */}
      <div className="fw-mod-card" style={{marginBottom:8}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,padding:'12px 16px'}}>
          <div>
            <label style={{fontSize:11,color:'var(--fw-sub)',display:'block',marginBottom:4}}>{lang==='vi'?'Người kiểm tra':'Auditor'}</label>
            <input value={auditorInfo.auditor} onChange={e=>setAuditorInfo(p=>({...p,auditor:e.target.value}))}
              style={{width:'100%',border:'1px solid #E5E7EB',borderRadius:6,padding:'6px 8px',fontSize:13}} placeholder={lang==='vi'?'Tên người kiểm tra':'Auditor name'} />
          </div>
          <div>
            <label style={{fontSize:11,color:'var(--fw-sub)',display:'block',marginBottom:4}}>{lang==='vi'?'Trại ấp':'Hatchery'}</label>
            <input value={auditorInfo.hatchery} onChange={e=>setAuditorInfo(p=>({...p,hatchery:e.target.value}))}
              style={{width:'100%',border:'1px solid #E5E7EB',borderRadius:6,padding:'6px 8px',fontSize:13}} placeholder={lang==='vi'?'Tên trại ấp':'Hatchery name'} />
          </div>
          <div>
            <label style={{fontSize:11,color:'var(--fw-sub)',display:'block',marginBottom:4}}>{lang==='vi'?'Ngày':'Date'}</label>
            <input type="date" value={auditorInfo.date} onChange={e=>setAuditorInfo(p=>({...p,date:e.target.value}))}
              style={{width:'100%',border:'1px solid #E5E7EB',borderRadius:6,padding:'6px 8px',fontSize:13}} />
          </div>
        </div>
      </div>

      {/* Score summary bar */}
      <div className="fw-mod-card" style={{marginBottom:8,background:`linear-gradient(135deg, ${scoreColor}15, ${scoreColor}08)`}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
          <div>
            <div style={{fontSize:11,color:'var(--fw-sub)',textTransform:'uppercase',letterSpacing:1}}>{tr.grandTotal}</div>
            <div style={{fontSize:28,fontWeight:800,color:scoreColor}}>{grandTotal}<span style={{fontSize:14,fontWeight:500,color:'var(--fw-sub)'}}>/500</span></div>
            <div style={{fontSize:12,fontWeight:600,color:scoreColor}}>{grandPct}% — {getScoreLabel(grandPct, lang)}</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>window.print()} style={{background:'white',border:'1px solid #E5E7EB',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer',fontWeight:600}}>{tr.print}</button>
            <button onClick={handleReset} style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer',fontWeight:600,color:'#EF4444'}}>{tr.reset}</button>
          </div>
        </div>
        {/* Section score pills */}
        <div style={{display:'flex',gap:8,padding:'0 16px 12px',flexWrap:'wrap'}}>
          {data.sections.map(s => {
            const sec = getSectionScore(s);
            const pct = Math.round((sec/s.max_score)*100);
            const col = getScoreColor(pct);
            return (
              <div key={s.id} style={{background:'white',border:`1px solid ${col}40`,borderRadius:6,padding:'4px 10px',fontSize:11}}>
                <span style={{fontWeight:700,color:col}}>{s.id}</span>
                <span style={{color:'var(--fw-sub)',margin:'0 4px'}}>·</span>
                <span style={{fontWeight:600}}>{sec}/{s.max_score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:8,marginBottom:8,padding:'0 0'}}>
        {['audit','injection'].map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{
            padding:'8px 20px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,
            background: activeTab===tab ? '#2EAA5E' : 'white',
            color: activeTab===tab ? 'white' : 'var(--fw-sub)',
            boxShadow: activeTab===tab ? '0 2px 8px #2EAA5E40' : '0 1px 3px rgba(0,0,0,0.08)'
          }}>{tab==='audit'?tr.tabAudit:tr.tabInjection}</button>
        ))}
      </div>

      {/* AUDIT TAB */}
      {activeTab === 'audit' && data.sections.map(section => {
        const secScore = getSectionScore(section);
        const secPct = Math.round((secScore/section.max_score)*100);
        const secColor = getScoreColor(secPct);
        const isCollapsed = collapsed[section.id];
        return (
          <div key={section.id} className="fw-mod-card" style={{marginBottom:8}}>
            {/* Section header */}
            <div onClick={()=>toggleSection(section.id)} style={{
              display:'flex',alignItems:'center',justifyContent:'space-between',
              padding:'12px 16px',cursor:'pointer',userSelect:'none'
            }}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{
                  width:32,height:32,borderRadius:8,background:`linear-gradient(135deg, #2EAA5E, #1E7A42)`,
                  display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0
                }}>
                  <span style={{color:'white',fontWeight:800,fontSize:13}}>{section.id}</span>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>
                    {lang==='vi' ? section.title_vi : section.title_en}
                  </div>
                  <div style={{fontSize:11,color:'var(--fw-sub)'}}>
                    {lang==='vi' ? section.subtitle_vi : section.subtitle_en}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:16,fontWeight:800,color:secColor}}>{secScore}/{section.max_score}</div>
                  <div style={{fontSize:11,color:secColor,fontWeight:600}}>{secPct}%</div>
                </div>
                <div style={{fontSize:18,color:'var(--fw-sub)',transform:isCollapsed?'rotate(-90deg)':'rotate(0deg)',transition:'0.2s'}}>▾</div>
              </div>
            </div>

            {/* Criteria table */}
            {!isCollapsed && (
              <div style={{borderTop:'1px solid #F3F4F6'}}>
                {/* Table header */}
                <div style={{
                  display:'grid',gridTemplateColumns:'36px 1fr 180px 64px 64px 120px',
                  gap:8,padding:'8px 16px',background:'#F9FAFB',
                  fontSize:11,color:'var(--fw-sub)',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5
                }}>
                  <div>#</div>
                  <div>{tr.criteria}</div>
                  <div>{tr.technicalReq}</div>
                  <div style={{textAlign:'center'}}>{tr.maxScore}</div>
                  <div style={{textAlign:'center'}}>{tr.actualScore}</div>
                  <div>{tr.note}</div>
                </div>

                {section.criteria.map((c, idx) => {
                  const score = scores[c.no] || 0;
                  const pct = c.max_score > 0 ? (score/c.max_score)*100 : 0;
                  const rowColor = getScoreColor(pct);
                  return (
                    <div key={c.no} style={{
                      display:'grid',gridTemplateColumns:'36px 1fr 180px 64px 64px 120px',
                      gap:8,padding:'10px 16px',alignItems:'start',
                      borderBottom: idx < section.criteria.length-1 ? '1px solid #F3F4F6' : 'none',
                      background: idx%2===0 ? 'white' : '#FAFAFA'
                    }}>
                      <div style={{
                        width:24,height:24,borderRadius:6,background:`${rowColor}20`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:11,fontWeight:700,color:rowColor,flexShrink:0,marginTop:2
                      }}>{c.no}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,lineHeight:1.3}}>
                          {lang==='vi' ? c.title_vi : c.title_en}
                        </div>
                        {lang==='vi' && (
                          <div style={{fontSize:11,color:'var(--fw-sub)',marginTop:2}}>{c.title_en}</div>
                        )}
                      </div>
                      <div style={{fontSize:11,color:'var(--fw-sub)',lineHeight:1.4}}>
                        {lang==='vi' ? c.req_vi : c.req_en}
                      </div>
                      <div style={{textAlign:'center',fontSize:13,fontWeight:600,color:'var(--fw-sub)',paddingTop:4}}>{c.max_score}</div>
                      <div style={{textAlign:'center'}}>
                        <input
                          type="number" min={0} max={c.max_score}
                          value={scores[c.no] ?? ''}
                          onChange={e => handleScore(c.no, e.target.value, c.max_score)}
                          style={{
                            width:52,textAlign:'center',border:`2px solid ${rowColor}`,
                            borderRadius:6,padding:'4px',fontSize:14,fontWeight:700,
                            color:rowColor,background:`${rowColor}10`,outline:'none'
                          }}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={notes[c.no] || ''}
                          onChange={e => handleNote(c.no, e.target.value)}
                          style={{width:'100%',border:'1px solid #E5E7EB',borderRadius:6,padding:'4px 6px',fontSize:12}}
                          placeholder={lang==='vi'?'Ghi chú...':'Note...'}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Section footer */}
                <div style={{
                  display:'flex',justifyContent:'flex-end',alignItems:'center',gap:12,
                  padding:'10px 16px',background:`${secColor}08`,borderTop:`1px solid ${secColor}20`
                }}>
                  <span style={{fontSize:12,color:'var(--fw-sub)',fontWeight:600}}>{tr.sectionTotal}:</span>
                  <span style={{fontSize:18,fontWeight:800,color:secColor}}>{secScore} / {section.max_score}</span>
                  <span style={{fontSize:12,fontWeight:600,color:secColor,background:`${secColor}20`,padding:'2px 8px',borderRadius:20}}>{secPct}%</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* INJECTION TEST TAB */}
      {activeTab === 'injection' && (
        <div className="fw-mod-card">
          <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6'}}>
            <div style={{fontWeight:700,fontSize:15}}>
              {lang==='vi' ? 'Kết Quả Kiểm Tra Tiêm' : 'Injection Test Results'}
            </div>
            <div style={{fontSize:12,color:'var(--fw-sub)',marginTop:2}}>
              {lang==='vi' ? 'Ghi lại kết quả kiểm tra tiêm sub-Q' : 'Record sub-Q injection test outcomes'}
            </div>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr style={{background:'#F9FAFB'}}>
                  {data.injection_test.columns.map(col => (
                    <th key={col.id} style={{padding:'8px 12px',textAlign:'left',fontSize:11,fontWeight:700,color:'var(--fw-sub)',textTransform:'uppercase',letterSpacing:0.5,whiteSpace:'nowrap'}}>
                      {lang==='vi' ? col.title_vi : col.title_en}
                    </th>
                  ))}
                  <th style={{padding:'8px 12px',width:40}}></th>
                </tr>
              </thead>
              <tbody>
                {injectionRows.map((row, idx) => (
                  <tr key={row.id} style={{borderBottom:'1px solid #F3F4F6',background:idx%2===0?'white':'#FAFAFA'}}>
                    {data.injection_test.columns.map(col => (
                      <td key={col.id} style={{padding:'6px 8px'}}>
                        <input
                          type={['no_of_chick','wet','very_wet','bleed','no_vaccine','dead','good'].includes(col.id)?'number':'text'}
                          value={row[col.id]}
                          onChange={e => updateInjectionRow(row.id, col.id, e.target.value)}
                          style={{width:'100%',border:'1px solid #E5E7EB',borderRadius:6,padding:'5px 8px',fontSize:13,minWidth: col.id==='name'?120:60}}
                        />
                      </td>
                    ))}
                    <td style={{padding:'6px 8px',textAlign:'center'}}>
                      <button onClick={()=>removeInjectionRow(row.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',fontSize:16,lineHeight:1}}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:'12px 16px'}}>
            <button onClick={addInjectionRow} style={{
              background:'#F0FDF4',border:'1px dashed #2EAA5E',borderRadius:8,
              padding:'8px 16px',fontSize:13,color:'#2EAA5E',fontWeight:600,cursor:'pointer'
            }}>{tr.addRow}</button>
          </div>
        </div>
      )}

      <div style={{height:24}} />
    </div>
  );
}