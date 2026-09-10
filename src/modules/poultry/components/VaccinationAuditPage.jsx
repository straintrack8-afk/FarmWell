import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import PoultryTopNav from './common/PoultryTopNav';
import Chart from 'chart.js/auto';

const STORAGE_KEY = 'farmwell_vax_audit_v2';
const HISTORY_KEY = 'farmwell_vax_audit_history_v2';

const tr = {
  en: {
    title:'Vaccination Audit',
    tabChecklist:'Checklist', tabInjection:'Injection Quality',
    tabSpray:'Spray Quality', tabEquipment:'Equipment', tabReport:'Report',
    auditor:'Auditor', farm:'Farm / Hatchery', date:'Date',
    auditType:'Audit Type', typeHatchery:'Hatchery', typeFarm:'Farm',
    grandTotal:'Grand Total', sectionTotal:'Section Total',
    save:'Save Audit', saved:'Audit saved!',
    reset:'Reset', resetConfirm:'Reset all data?',
    excellent:'Excellent', good:'Good', needsImprovement:'Needs Improvement', poor:'Poor',
    injTitle:'Injection Quality Results', operatorName:'Operator', totalChicks:'Total Chicks',
    rGood:'Good', rWet:'Wet', rVeryWet:'Very Wet', rBleed:'Bleed',
    rNoVax:'No Vaccine', rDead:'Dead', goodPct:'Good %',
    addOp:'+ Add Operator', injChart:'Per-Operator Results',
    trendChart:'Good% Trend (Last 8 Audits)',
    noHistory:'No history yet. Save an audit to build the trend chart.',
    sprayTitle:'Spray Quality Metrics',
    roomTemp:'Room Temp (°C)', pressure:'Spray Pressure (bar)',
    dropletOK:'Droplet Size OK (100–150 µm)',
    coveragePct:'Coverage (%)', dosingErr:'Dosing Error (%)',
    airDryMin:'Air Dry Time (min)',
    yes:'Yes', no:'No', notes:'Notes',
    equipTitle:'Injector Equipment',
    machineType:'Injector Type', serialNo:'Serial No.', lastMaint:'Last Maintenance',
    reportTitle:'Audit Report', sectionScores:'Section Scores', exportJSON:'Export JSON',
    criteria:'Criteria', maxLabel:'Max', scoreLabel:'Score', notePlh:'Note...',
  },
  id: {
    title:'Audit Vaksinasi',
    tabChecklist:'Checklist', tabInjection:'Kualitas Injeksi',
    tabSpray:'Kualitas Spray', tabEquipment:'Peralatan', tabReport:'Laporan',
    auditor:'Auditor', farm:'Farm / Hatchery', date:'Tanggal',
    auditType:'Tipe Audit', typeHatchery:'Hatchery', typeFarm:'Farm',
    grandTotal:'Total Skor', sectionTotal:'Total Seksi',
    save:'Simpan Audit', saved:'Tersimpan!',
    reset:'Reset', resetConfirm:'Reset semua data?',
    excellent:'Sangat Baik', good:'Baik', needsImprovement:'Perlu Perbaikan', poor:'Kurang',
    injTitle:'Hasil Kualitas Injeksi', operatorName:'Operator', totalChicks:'Jumlah DOC',
    rGood:'Baik', rWet:'Basah', rVeryWet:'Sangat Basah', rBleed:'Berdarah',
    rNoVax:'Tanpa Vaksin', rDead:'Mati', goodPct:'Baik %',
    addOp:'+ Tambah Operator', injChart:'Hasil Per Operator',
    trendChart:'Tren Baik% (8 Audit Terakhir)',
    noHistory:'Belum ada riwayat. Simpan audit untuk membangun grafik tren.',
    sprayTitle:'Metrik Kualitas Spray',
    roomTemp:'Suhu Ruang (°C)', pressure:'Tekanan Spray (bar)',
    dropletOK:'Ukuran Tetesan OK (100–150 µm)',
    coveragePct:'Cakupan (%)', dosingErr:'Error Dosis (%)',
    airDryMin:'Waktu Kering (menit)',
    yes:'Ya', no:'Tidak', notes:'Catatan',
    equipTitle:'Peralatan Injector',
    machineType:'Tipe Injector', serialNo:'No. Seri', lastMaint:'Perawatan Terakhir',
    reportTitle:'Laporan Audit', sectionScores:'Skor Per Seksi', exportJSON:'Ekspor JSON',
    criteria:'Kriteria', maxLabel:'Maks', scoreLabel:'Skor', notePlh:'Catatan...',
  },
  vi: {
    title:'Kiểm Tra Tiêm Phòng',
    tabChecklist:'Checklist', tabInjection:'Chất Lượng Tiêm',
    tabSpray:'Chất Lượng Phun', tabEquipment:'Thiết Bị', tabReport:'Báo Cáo',
    auditor:'Người kiểm tra', farm:'Trại / Hatchery', date:'Ngày',
    auditType:'Loại kiểm tra', typeHatchery:'Trại ấp', typeFarm:'Trang trại',
    grandTotal:'Tổng điểm', sectionTotal:'Tổng mục',
    save:'Lưu kiểm tra', saved:'Đã lưu!',
    reset:'Đặt lại', resetConfirm:'Đặt lại tất cả dữ liệu?',
    excellent:'Xuất sắc', good:'Tốt', needsImprovement:'Cần cải thiện', poor:'Kém',
    injTitle:'Kết Quả Chất Lượng Tiêm', operatorName:'Người tiêm', totalChicks:'Số gà',
    rGood:'Tốt', rWet:'Ướt', rVeryWet:'Rất ướt', rBleed:'Chảy máu',
    rNoVax:'Không vaccine', rDead:'Chết', goodPct:'Tốt %',
    addOp:'+ Thêm người tiêm', injChart:'Kết quả theo người tiêm',
    trendChart:'Xu hướng Tốt% (8 lần gần nhất)',
    noHistory:'Chưa có lịch sử. Lưu kiểm tra để xem xu hướng.',
    sprayTitle:'Chỉ Số Chất Lượng Phun Sương',
    roomTemp:'Nhiệt độ phòng (°C)', pressure:'Áp suất phun (bar)',
    dropletOK:'Kích thước hạt sương OK (100–150 µm)',
    coveragePct:'Độ phủ (%)', dosingErr:'Sai số liều (%)',
    airDryMin:'Thời gian khô (phút)',
    yes:'Có', no:'Không', notes:'Ghi chú',
    equipTitle:'Thiết Bị Máy Tiêm',
    machineType:'Loại máy tiêm', serialNo:'Số sê-ri', lastMaint:'Bảo dưỡng lần cuối',
    reportTitle:'Báo Cáo Kiểm Tra', sectionScores:'Điểm theo mục', exportJSON:'Xuất JSON',
    criteria:'Tiêu chí', maxLabel:'Tối đa', scoreLabel:'Điểm', notePlh:'Ghi chú...',
  }
};

function sCol(pct) {
  if (pct >= 80) return '#2EAA5E';
  if (pct >= 60) return '#F59E0B';
  if (pct >= 40) return '#EF4444';
  return '#DC2626';
}
function sLbl(pct, t) {
  if (pct >= 80) return t.excellent;
  if (pct >= 60) return t.good;
  if (pct >= 40) return t.needsImprovement;
  return t.poor;
}

const blankSpray = { roomTemp:'', pressureBar:'', dropletOK:true, coveragePct:'', dosingErr:'', airDryMin:'', notes:'' };
const blankEquip = { machineType:'', serialNo:'', lastMaint:'', notes:'' };
const blankRow = () => ({ id: Date.now() + Math.random(), name:'', totalChicks:'', good:'', wet:'', veryWet:'', bleed:'', noVax:'', dead:'' });

const INJ_FIELDS = ['name','totalChicks','good','wet','veryWet','bleed','noVax','dead'];
const INJ_NUM    = ['totalChicks','good','wet','veryWet','bleed','noVax','dead'];
const INP = { width:'100%', border:'1px solid #E5E7EB', borderRadius:6, padding:'6px 8px', fontSize:13, boxSizing:'border-box' };

export default function VaccinationAuditPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const lang = ['vi','id'].includes(language) ? language : 'en';
  const t = tr[lang];

  const [data,      setData]      = useState(null);
  const [scores,    setScores]    = useState({});
  const [notes,     setNotes]     = useState({});
  const [rows,      setRows]      = useState([blankRow()]);
  const [spray,     setSpray]     = useState(blankSpray);
  const [equip,     setEquip]     = useState(blankEquip);
  const [info,      setInfo]      = useState({ auditor:'', date:new Date().toISOString().split('T')[0], farm:'', auditType:'hatchery' });
  const [tab,       setTab]       = useState('checklist');
  const [collapsed, setCollapsed] = useState({});
  const [mobile,    setMobile]    = useState(window.innerWidth < 640);
  const [saveMsg,   setSaveMsg]   = useState('');
  const [history,   setHistory]   = useState([]);

  const injRef   = useRef(null);
  const injChart = useRef(null);
  const trdRef   = useRef(null);
  const trdChart = useRef(null);

  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/data/poultry/vaccination_audit_checklist.json')
      .then(r => r.json())
      .then(d => {
        setData(d);
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (s.scores) setScores(s.scores);
        if (s.notes)  setNotes(s.notes);
        if (s.rows)   setRows(s.rows);
        if (s.spray)  setSpray(s.spray);
        if (s.equip)  setEquip(s.equip);
        if (s.info)   setInfo(s.info);
        setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
      });
  }, []);

  useEffect(() => {
    if (!data) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ scores, notes, rows, spray, equip, info }));
  }, [scores, notes, rows, spray, equip, info, data]);

  // Injection stacked bar
  useEffect(() => {
    if (tab !== 'injection') {
      injChart.current?.destroy();
      injChart.current = null;
      return;
    }
    if (!injRef.current) return;
    injChart.current?.destroy();
    const valid = rows.filter(r => r.name);
    if (!valid.length) return;
    injChart.current = new Chart(injRef.current, {
      type: 'bar',
      data: {
        labels: valid.map(r => r.name),
        datasets: [
          { label:t.rGood,    data:valid.map(r=>+r.good||0),    backgroundColor:'#2EAA5E' },
          { label:t.rWet,     data:valid.map(r=>+r.wet||0),     backgroundColor:'#93C5FD' },
          { label:t.rVeryWet, data:valid.map(r=>+r.veryWet||0), backgroundColor:'#3B82F6' },
          { label:t.rBleed,   data:valid.map(r=>+r.bleed||0),   backgroundColor:'#F59E0B' },
          { label:t.rNoVax,   data:valid.map(r=>+r.noVax||0),   backgroundColor:'#EF4444' },
          { label:t.rDead,    data:valid.map(r=>+r.dead||0),    backgroundColor:'#DC2626' },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position:'bottom', labels:{ font:{size:11} } } },
        scales: { x:{ stacked:true }, y:{ stacked:true, beginAtZero:true } }
      }
    });
  }, [rows, tab, lang]);

  // Trend line chart
  useEffect(() => {
    if (tab !== 'injection') {
      trdChart.current?.destroy();
      trdChart.current = null;
      return;
    }
    if (!trdRef.current || !history.length) return;
    trdChart.current?.destroy();
    const pts = history.slice(-8).map(a => {
      const r   = a.rows || [];
      const tot = r.reduce((s,x) => s + (+x.totalChicks||0), 0);
      const gd  = r.reduce((s,x) => s + (+x.good||0), 0);
      return { date: a.info?.date || '', pct: tot > 0 ? Math.round((gd/tot)*100) : 0 };
    });
    trdChart.current = new Chart(trdRef.current, {
      type: 'line',
      data: {
        labels: pts.map(p => p.date),
        datasets: [{
          label: t.goodPct, data: pts.map(p => p.pct),
          borderColor: '#2EAA5E', backgroundColor: '#2EAA5E20',
          tension: 0.35, fill: true, pointBackgroundColor: '#2EAA5E', pointRadius: 5,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display:false } },
        scales: { y: { min:0, max:100, ticks: { callback: v => v+'%' } } }
      }
    });
  }, [history, tab, lang]);

  const secScore   = s  => s.criteria.reduce((sum,c) => sum + (scores[c.no]||0), 0);
  const grandTotal = () => data ? data.sections.reduce((sum,s) => sum + secScore(s), 0) : 0;

  const handleReset = () => {
    if (!window.confirm(t.resetConfirm)) return;
    setScores({}); setNotes({});
    setRows([blankRow()]); setSpray(blankSpray); setEquip(blankEquip);
  };

  const handleSave = () => {
    const gt  = grandTotal();
    const rec = { id:String(Date.now()), savedAt:new Date().toISOString(), info, scores, notes, rows, spray, equip, grandTotal:gt, grandPct:Math.round((gt/500)*100) };
    const updated = [...history, rec].slice(-10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
    setSaveMsg(t.saved);
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const handleExport = () => {
    const gt   = grandTotal();
    const blob = new Blob([JSON.stringify({ info, scores, notes, rows, spray, equip, grandTotal:gt, exportedAt:new Date().toISOString() },null,2)],{type:'application/json'});
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'vaccination_audit_' + (info.date||'export') + '.json';
    a.click(); URL.revokeObjectURL(a.href);
  };

  const handlePrint = () => {
    const gt2  = grandTotal();
    const gP2  = Math.round((gt2/500)*100);
    const gC2  = sCol(gP2);
    const rows2 = data.sections.map(s => {
      const sc = secScore(s), p = Math.round((sc/s.max_score)*100), c = sCol(p);
      return `<div class="sr"><div class="sb">${s.id}</div><div style="flex:1"><div style="font-size:12px;font-weight:600;margin-bottom:4px">${lang==='vi'?s.title_vi:s.title_en}</div><div class="bt"><div class="bf" style="width:${p}%;background:${c}"></div></div></div><div class="ss" style="color:${c}">${sc}/${s.max_score}</div></div>`;
    }).join('');
    const sprayHtml = (spray.roomTemp||spray.pressureBar) ? `<h2>${t.sprayTitle}</h2><div class="g2">${spray.roomTemp?`<div>${t.roomTemp}: <b>${spray.roomTemp}°C</b></div>`:''} ${spray.pressureBar?`<div>${t.pressure}: <b>${spray.pressureBar} bar</b></div>`:''} ${spray.coveragePct?`<div>${t.coveragePct}: <b>${spray.coveragePct}%</b></div>`:''} ${spray.dosingErr?`<div>${t.dosingErr}: <b>${spray.dosingErr}%</b></div>`:''} ${spray.airDryMin?`<div>${t.airDryMin}: <b>${spray.airDryMin} min</b></div>`:''}<div>${t.dropletOK}: <b style="color:${spray.dropletOK?'#2EAA5E':'#EF4444'}">${spray.dropletOK?t.yes:t.no}</b></div></div>` : '';
    const equipHtml = (equip.machineType||equip.serialNo) ? `<h2>${t.equipTitle}</h2><div class="g2">${equip.machineType?`<div>${t.machineType}: <b>${equip.machineType}</b></div>`:''} ${equip.serialNo?`<div>${t.serialNo}: <b>${equip.serialNo}</b></div>`:''} ${equip.lastMaint?`<div>${t.lastMaint}: <b>${equip.lastMaint}</b></div>`:''}</div>` : '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Vaccination Audit - ${info.date||''}</title><style>*{box-sizing:border-box}body{font-family:sans-serif;margin:24px;color:#111;max-width:780px}h1{color:#2EAA5E;font-size:20px;margin:0 0 4px}h2{font-size:13px;font-weight:700;color:#374151;margin:20px 0 8px;border-bottom:1px solid #E5E7EB;padding-bottom:4px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#F9FAFB;padding:12px;border-radius:8px;font-size:13px;margin:12px 0}.sc{text-align:center;padding:20px;border:2px solid #2EAA5E;border-radius:12px;margin:16px 0}.sn{font-size:52px;font-weight:800;color:${gC2};line-height:1}.sr{display:flex;align-items:center;gap:12px;margin-bottom:10px}.sb{width:28px;height:28px;border-radius:6px;background:#2EAA5E;color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;flex-shrink:0}.bt{height:6px;background:#F3F4F6;border-radius:3px;overflow:hidden}.bf{height:6px;border-radius:3px}.ss{font-weight:700;font-size:13px;min-width:55px;text-align:right}.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px}@media print{body{margin:10mm}}</style></head><body><h1>Vaccination Audit Report</h1><div class="meta"><div>Auditor: <b>${info.auditor||'—'}</b></div><div>Farm: <b>${info.farm||'—'}</b></div><div>Date: <b>${info.date||'—'}</b></div><div>Type: <b>${info.auditType==='hatchery'?t.typeHatchery:t.typeFarm}</b></div></div><div class="sc"><div class="sn">${gt2}</div><div style="font-size:14px;color:#6B7280;margin-top:6px">/500 · ${gP2}% · ${sLbl(gP2,t)}</div></div><h2>${t.sectionScores}</h2>${rows2}${sprayHtml}${equipHtml}</body></html>`;
    const w = window.open('','_blank','width=820,height=700');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  if (!data) return (
    <div className="fw-module-page">
      <div className="fw-mod-card" style={{padding:40,textAlign:'center'}}>Loading...</div>
    </div>
  );

  const gt   = grandTotal();
  const gPct = Math.round((gt/500)*100);
  const gCol = sCol(gPct);

  const TABS = ['checklist','injection','spray','equipment','report'];
  const TLBL = { checklist:t.tabChecklist, injection:t.tabInjection, spray:t.tabSpray, equipment:t.tabEquipment, report:t.tabReport };

  return (
    <div className="fw-module-page">
      <PoultryTopNav title={t.title} />

      {/* ── Audit info ── */}
      <div className="fw-mod-card" style={{marginBottom:8}}>
        {/* Language toggle */}
        <div style={{display:'flex',justifyContent:'flex-end',padding:'8px 16px 0',gap:4}}>
          {['en','id','vi'].map(l=>(
            <button key={l} onClick={()=>setLanguage(l)}
              style={{padding:'3px 10px',borderRadius:6,border:'1px solid',fontSize:11,fontWeight:700,cursor:'pointer',
                borderColor:lang===l?'#2EAA5E':'#E5E7EB',
                background:lang===l?'#2EAA5E':'white',
                color:lang===l?'white':'#9CA3AF',textTransform:'uppercase'}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr 1fr':'1fr 1fr 1fr 1fr',gap:12,padding:'12px 16px'}}>
          {[['auditor',t.auditor,'text'],['farm',t.farm,'text'],['date',t.date,'date']].map(([k,lbl,tp])=>(
            <div key={k}>
              <label style={{fontSize:11,color:'var(--fw-sub)',display:'block',marginBottom:4}}>{lbl}</label>
              <input type={tp} value={info[k]} placeholder={lbl}
                onChange={e=>setInfo(p=>({...p,[k]:e.target.value}))} style={INP}/>
            </div>
          ))}
          <div>
            <label style={{fontSize:11,color:'var(--fw-sub)',display:'block',marginBottom:4}}>{t.auditType}</label>
            <div style={{display:'flex',gap:6}}>
              {[['hatchery',t.typeHatchery],['farm',t.typeFarm]].map(([v,lbl])=>(
                <button key={v} onClick={()=>setInfo(p=>({...p,auditType:v}))}
                  style={{flex:1,padding:'7px 4px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,
                    background:info.auditType===v?'#2EAA5E':'#F3F4F6',
                    color:info.auditType===v?'white':'var(--fw-sub)'}}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Score summary ── */}
      <div className="fw-mod-card" style={{marginBottom:8,background:gCol+'0D'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
          <div>
            <div style={{fontSize:11,color:'var(--fw-sub)',textTransform:'uppercase',letterSpacing:1}}>{t.grandTotal}</div>
            <div style={{fontSize:28,fontWeight:800,color:gCol}}>
              {gt}<span style={{fontSize:14,fontWeight:500,color:'var(--fw-sub)'}}> /500</span>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:gCol}}>{gPct}% — {sLbl(gPct,t)}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'flex-end'}}>
            <button onClick={handleSave}
              style={{background:'#2EAA5E',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer',fontWeight:600,color:'white'}}>
              {t.save}
            </button>
            <button onClick={handleReset}
              style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer',fontWeight:600,color:'#EF4444'}}>
              {t.reset}
            </button>
          </div>
        </div>
        {saveMsg && <div style={{padding:'0 16px 8px',fontSize:12,color:'#2EAA5E',fontWeight:600}}>✓ {saveMsg}</div>}
        <div style={{display:'flex',gap:6,padding:'0 16px 12px',flexWrap:'wrap'}}>
          {data.sections.map(s=>{
            const sc=secScore(s), p=Math.round((sc/s.max_score)*100), c=sCol(p);
            return (
              <div key={s.id} style={{background:'white',border:'1px solid '+c+'40',borderRadius:6,padding:'4px 10px',fontSize:11}}>
                <span style={{fontWeight:700,color:c}}>{s.id}</span>
                <span style={{color:'var(--fw-sub)',margin:'0 4px'}}>·</span>
                <span style={{fontWeight:600}}>{sc}/{s.max_score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div style={{
        position:'sticky', top:0, zIndex:40,
        background:'#F3F4F6', padding:'8px 0 10px',
        marginLeft:-16, marginRight:-16, paddingLeft:16, paddingRight:16,
        marginBottom:0
      }}>
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:2,WebkitOverflowScrolling:'touch'}}>
          {TABS.map(tb=>(
            <button key={tb} onClick={()=>setTab(tb)}
              style={{padding:'8px 14px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:12,whiteSpace:'nowrap',flexShrink:0,
                background:tab===tb?'#2EAA5E':'white',color:tab===tb?'white':'var(--fw-sub)',
                boxShadow:tab===tb?'0 2px 8px #2EAA5E40':'0 1px 3px rgba(0,0,0,0.08)'}}>
              {TLBL[tb]}
            </button>
          ))}
        </div>
      </div>
      <div style={{height:10}}/>

      {/* ═══════════════ CHECKLIST ═══════════════ */}
      {tab==='checklist' && data.sections.map(section=>{
        const sc=secScore(section), pct=Math.round((sc/section.max_score)*100), col=sCol(pct), isCol=collapsed[section.id];
        return (
          <div key={section.id} className="fw-mod-card" style={{marginBottom:8}}>
            <div onClick={()=>setCollapsed(p=>({...p,[section.id]:!p[section.id]}))}
              style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',cursor:'pointer',userSelect:'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#2EAA5E,#1E7A42)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{color:'white',fontWeight:800,fontSize:13}}>{section.id}</span>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:mobile?13:14}}>
                    {lang==='vi' ? section.title_vi : section.title_en}
                  </div>
                  {!mobile && (
                    <div style={{fontSize:11,color:'var(--fw-sub)'}}>
                      {lang==='vi' ? section.subtitle_vi : section.subtitle_en}
                    </div>
                  )}
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:mobile?14:16,fontWeight:800,color:col}}>{sc}/{section.max_score}</div>
                  <div style={{fontSize:11,color:col,fontWeight:600}}>{pct}%</div>
                </div>
                <div style={{fontSize:16,color:'var(--fw-sub)',transform:isCol?'rotate(-90deg)':'rotate(0deg)',transition:'0.2s'}}>▾</div>
              </div>
            </div>

            {!isCol && (
              <div style={{borderTop:'1px solid #F3F4F6'}}>
                {!mobile && (
                  <div style={{display:'grid',gridTemplateColumns:'36px 1fr 200px 52px 64px 110px',gap:8,padding:'8px 16px',background:'#F9FAFB',fontSize:11,color:'var(--fw-sub)',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>
                    <div>#</div><div>{t.criteria}</div><div>Requirements</div>
                    <div style={{textAlign:'center'}}>{t.maxLabel}</div>
                    <div style={{textAlign:'center'}}>{t.scoreLabel}</div>
                    <div>Note</div>
                  </div>
                )}
                {section.criteria.map((c,idx)=>{
                  const sv=scores[c.no]||0, cp=c.max_score>0?(sv/c.max_score)*100:0, cc=sCol(cp);
                  return (
                    <div key={c.no} style={{padding:mobile?'12px 16px':'10px 16px',borderBottom:idx<section.criteria.length-1?'1px solid #F3F4F6':'none',background:idx%2===0?'white':'#FAFAFA',display:mobile?'block':'grid',gridTemplateColumns:'36px 1fr 200px 52px 64px 110px',gap:8,alignItems:'start'}}>
                      {mobile ? (
                        <>
                          <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:6}}>
                            <div style={{width:24,height:24,borderRadius:6,background:cc+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:cc,flexShrink:0}}>{c.no}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600}}>{lang==='vi'?c.title_vi:c.title_en}</div>
                              <div style={{fontSize:11,color:'var(--fw-sub)',marginTop:2,lineHeight:1.4}}>{lang==='vi'?c.req_vi:c.req_en}</div>
                            </div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontSize:11,color:'var(--fw-sub)'}}>Max: {c.max_score}</span>
                            <input type="number" min={0} max={c.max_score} value={scores[c.no]??''} placeholder="0"
                              onChange={e=>{const n=Math.min(Math.max(parseInt(e.target.value)||0,0),c.max_score);setScores(p=>({...p,[c.no]:n}));}}
                              style={{width:52,textAlign:'center',border:'2px solid '+cc,borderRadius:6,padding:'4px',fontSize:14,fontWeight:700,color:cc,background:cc+'10',outline:'none'}}/>
                            <input type="text" value={notes[c.no]||''} placeholder={t.notePlh}
                              onChange={e=>setNotes(p=>({...p,[c.no]:e.target.value}))}
                              style={{flex:1,border:'1px solid #E5E7EB',borderRadius:6,padding:'4px 6px',fontSize:12}}/>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{width:24,height:24,borderRadius:6,background:cc+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:cc,marginTop:2}}>{c.no}</div>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,lineHeight:1.3}}>{lang==='vi'?c.title_vi:c.title_en}</div>
                            {lang==='vi' && <div style={{fontSize:11,color:'var(--fw-sub)',marginTop:2}}>{c.title_en}</div>}
                          </div>
                          <div style={{fontSize:11,color:'var(--fw-sub)',lineHeight:1.4}}>{lang==='vi'?c.req_vi:c.req_en}</div>
                          <div style={{textAlign:'center',fontSize:13,fontWeight:600,color:'var(--fw-sub)',paddingTop:4}}>{c.max_score}</div>
                          <div style={{textAlign:'center'}}>
                            <input type="number" min={0} max={c.max_score} value={scores[c.no]??''} placeholder="0"
                              onChange={e=>{const n=Math.min(Math.max(parseInt(e.target.value)||0,0),c.max_score);setScores(p=>({...p,[c.no]:n}));}}
                              style={{width:52,textAlign:'center',border:'2px solid '+cc,borderRadius:6,padding:'4px',fontSize:14,fontWeight:700,color:cc,background:cc+'10',outline:'none'}}/>
                          </div>
                          <div>
                            <input type="text" value={notes[c.no]||''} placeholder={t.notePlh}
                              onChange={e=>setNotes(p=>({...p,[c.no]:e.target.value}))}
                              style={{width:'100%',border:'1px solid #E5E7EB',borderRadius:6,padding:'4px 6px',fontSize:12}}/>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:12,padding:'10px 16px',background:col+'08',borderTop:'1px solid '+col+'20'}}>
                  <span style={{fontSize:12,color:'var(--fw-sub)',fontWeight:600}}>{t.sectionTotal}:</span>
                  <span style={{fontSize:18,fontWeight:800,color:col}}>{sc} / {section.max_score}</span>
                  <span style={{fontSize:12,fontWeight:600,color:col,background:col+'20',padding:'2px 8px',borderRadius:20}}>{pct}%</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ═══════════════ INJECTION ═══════════════ */}
      {tab==='injection' && (
        <div>
          {/* Operator table */}
          <div className="fw-mod-card" style={{marginBottom:8}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6'}}>
              <div style={{fontWeight:700,fontSize:15}}>{t.injTitle}</div>
              <div style={{fontSize:12,color:'var(--fw-sub)',marginTop:2}}>Sub-Q injection test — record results per operator</div>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead>
                  <tr style={{background:'#F9FAFB'}}>
                    {[t.operatorName,t.totalChicks,t.rGood,t.rWet,t.rVeryWet,t.rBleed,t.rNoVax,t.rDead,t.goodPct,''].map((h,i)=>(
                      <th key={i} style={{padding:'8px 8px',textAlign:i===0?'left':'center',fontSize:11,fontWeight:700,color:'var(--fw-sub)',textTransform:'uppercase',letterSpacing:0.4,whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row,idx)=>{
                    const tot=+row.totalChicks||0, gd=+row.good||0;
                    const pct=tot>0?Math.round((gd/tot)*100):null;
                    return (
                      <tr key={row.id} style={{borderBottom:'1px solid #F3F4F6',background:idx%2===0?'white':'#FAFAFA'}}>
                        {INJ_FIELDS.map(col=>(
                          <td key={col} style={{padding:'5px 5px'}}>
                            <input type={INJ_NUM.includes(col)?'number':'text'} value={row[col]}
                              onChange={e=>setRows(p=>p.map(r=>r.id===row.id?{...r,[col]:e.target.value}:r))}
                              style={{width:'100%',border:'1px solid #E5E7EB',borderRadius:6,padding:'5px 5px',fontSize:12,textAlign:INJ_NUM.includes(col)?'center':'left',minWidth:col==='name'?90:44,boxSizing:'border-box'}}/>
                          </td>
                        ))}
                        <td style={{padding:'5px 6px',textAlign:'center'}}>
                          {pct!==null && <span style={{fontWeight:700,fontSize:12,color:sCol(pct)}}>{pct}%</span>}
                        </td>
                        <td style={{padding:'5px 4px',textAlign:'center'}}>
                          <button onClick={()=>setRows(p=>p.filter(r=>r.id!==row.id))}
                            style={{background:'none',border:'none',cursor:'pointer',color:'#EF4444',fontSize:18,lineHeight:1}}>×</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{padding:'12px 16px'}}>
              <button onClick={()=>setRows(p=>[...p,blankRow()])}
                style={{background:'#F0FDF4',border:'1px dashed #2EAA5E',borderRadius:8,padding:'8px 16px',fontSize:13,color:'#2EAA5E',fontWeight:600,cursor:'pointer'}}>
                {t.addOp}
              </button>
            </div>
          </div>

          {/* Stacked bar chart */}
          <div className="fw-mod-card" style={{marginBottom:8}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:14}}>{t.injChart}</div>
            <div style={{padding:'16px'}}>
              {rows.some(r=>r.name)
                ? <canvas ref={injRef} style={{maxHeight:280}}/>
                : <div style={{textAlign:'center',color:'var(--fw-sub)',fontSize:13,padding:'32px 0'}}>Add operators above to see the chart</div>
              }
            </div>
          </div>

          {/* Trend chart */}
          <div className="fw-mod-card">
            <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:14}}>{t.trendChart}</div>
            <div style={{padding:'16px'}}>
              {history.length > 0
                ? <canvas ref={trdRef} style={{maxHeight:240}}/>
                : <div style={{textAlign:'center',color:'var(--fw-sub)',fontSize:13,padding:'32px 0'}}>{t.noHistory}</div>
              }
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SPRAY ═══════════════ */}
      {tab==='spray' && (
        <div className="fw-mod-card">
          <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:15}}>{t.sprayTitle}</div>
          <div style={{padding:'16px',display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:16}}>
            {[
              ['roomTemp',    t.roomTemp,    'number'],
              ['pressureBar', t.pressure,    'number'],
              ['coveragePct', t.coveragePct, 'number'],
              ['dosingErr',   t.dosingErr,   'number'],
              ['airDryMin',   t.airDryMin,   'number'],
            ].map(([k,lbl,tp])=>(
              <div key={k}>
                <label style={{fontSize:12,color:'var(--fw-sub)',display:'block',marginBottom:6,fontWeight:600}}>{lbl}</label>
                <input type={tp} value={spray[k]} onChange={e=>setSpray(p=>({...p,[k]:e.target.value}))}
                  style={{...INP,padding:'8px 12px'}}/>
              </div>
            ))}
            <div>
              <label style={{fontSize:12,color:'var(--fw-sub)',display:'block',marginBottom:6,fontWeight:600}}>{t.dropletOK}</label>
              <div style={{display:'flex',gap:8}}>
                {[[true,t.yes],[false,t.no]].map(([v,lbl])=>(
                  <button key={String(v)} onClick={()=>setSpray(p=>({...p,dropletOK:v}))}
                    style={{flex:1,padding:'9px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,
                      background:spray.dropletOK===v?'#2EAA5E':'#F3F4F6',
                      color:spray.dropletOK===v?'white':'var(--fw-sub)'}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{padding:'0 16px 16px'}}>
            <label style={{fontSize:12,color:'var(--fw-sub)',display:'block',marginBottom:6,fontWeight:600}}>{t.notes}</label>
            <textarea value={spray.notes} onChange={e=>setSpray(p=>({...p,notes:e.target.value}))}
              rows={3} style={{...INP,resize:'vertical'}}/>
          </div>
        </div>
      )}

      {/* ═══════════════ EQUIPMENT ═══════════════ */}
      {tab==='equipment' && (
        <div className="fw-mod-card">
          <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:15}}>{t.equipTitle}</div>
          <div style={{padding:'16px',display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:16}}>
            {[
              ['machineType', t.machineType, 'text'],
              ['serialNo',    t.serialNo,    'text'],
              ['lastMaint',   t.lastMaint,   'date'],
            ].map(([k,lbl,tp])=>(
              <div key={k}>
                <label style={{fontSize:12,color:'var(--fw-sub)',display:'block',marginBottom:6,fontWeight:600}}>{lbl}</label>
                <input type={tp} value={equip[k]} onChange={e=>setEquip(p=>({...p,[k]:e.target.value}))}
                  style={{...INP,padding:'8px 12px'}}/>
              </div>
            ))}
          </div>
          <div style={{padding:'0 16px 16px'}}>
            <label style={{fontSize:12,color:'var(--fw-sub)',display:'block',marginBottom:6,fontWeight:600}}>{t.notes}</label>
            <textarea value={equip.notes} onChange={e=>setEquip(p=>({...p,notes:e.target.value}))}
              rows={3} style={{...INP,resize:'vertical'}}/>
          </div>
        </div>
      )}

      {/* ═══════════════ REPORT ═══════════════ */}
      {tab==='report' && (
        <div>
          <div className="fw-mod-card" style={{marginBottom:8}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:15}}>{t.reportTitle}</div>
            <div style={{padding:'16px'}}>
              {/* Meta */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16,background:'#F9FAFB',borderRadius:8,padding:12}}>
                <div style={{fontSize:12,color:'var(--fw-sub)'}}>Auditor: <strong>{info.auditor||'—'}</strong></div>
                <div style={{fontSize:12,color:'var(--fw-sub)'}}>Farm: <strong>{info.farm||'—'}</strong></div>
                <div style={{fontSize:12,color:'var(--fw-sub)'}}>Date: <strong>{info.date||'—'}</strong></div>
                <div style={{fontSize:12,color:'var(--fw-sub)'}}>Type: <strong>{info.auditType==='hatchery'?t.typeHatchery:t.typeFarm}</strong></div>
              </div>
              {/* Grand total */}
              <div style={{textAlign:'center',padding:'20px 0',borderBottom:'1px solid #F3F4F6',marginBottom:20}}>
                <div style={{fontSize:11,color:'var(--fw-sub)',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{t.grandTotal}</div>
                <div style={{fontSize:56,fontWeight:800,color:gCol,lineHeight:1}}>{gt}</div>
                <div style={{fontSize:14,color:'var(--fw-sub)',marginTop:6}}>/500 &nbsp;·&nbsp; {gPct}% &nbsp;·&nbsp; {sLbl(gPct,t)}</div>
              </div>
              {/* Section bars */}
              <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>{t.sectionScores}</div>
              {data.sections.map(s=>{
                const sc=secScore(s), p=Math.round((sc/s.max_score)*100), c=sCol(p);
                return (
                  <div key={s.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                    <div style={{width:28,height:28,borderRadius:6,background:'linear-gradient(135deg,#2EAA5E,#1E7A42)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <span style={{color:'white',fontWeight:800,fontSize:12}}>{s.id}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>
                        {lang==='vi'?s.title_vi:s.title_en}
                      </div>
                      <div style={{height:6,background:'#F3F4F6',borderRadius:3}}>
                        <div style={{height:6,borderRadius:3,background:c,width:p+'%',transition:'width 0.6s'}}/>
                      </div>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:c,minWidth:55,textAlign:'right'}}>{sc}/{s.max_score}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spray summary — only if filled */}
          {(spray.roomTemp||spray.pressureBar||spray.coveragePct) && (
            <div className="fw-mod-card" style={{marginBottom:8}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:14}}>{t.sprayTitle}</div>
              <div style={{padding:'12px 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {spray.roomTemp    && <div style={{fontSize:12}}>{t.roomTemp}: <strong>{spray.roomTemp}°C</strong></div>}
                {spray.pressureBar && <div style={{fontSize:12}}>{t.pressure}: <strong>{spray.pressureBar} bar</strong></div>}
                {spray.coveragePct && <div style={{fontSize:12}}>{t.coveragePct}: <strong>{spray.coveragePct}%</strong></div>}
                {spray.dosingErr   && <div style={{fontSize:12}}>{t.dosingErr}: <strong>{spray.dosingErr}%</strong></div>}
                {spray.airDryMin   && <div style={{fontSize:12}}>{t.airDryMin}: <strong>{spray.airDryMin} min</strong></div>}
                <div style={{fontSize:12}}>{t.dropletOK}: <strong style={{color:spray.dropletOK?'#2EAA5E':'#EF4444'}}>{spray.dropletOK?t.yes:t.no}</strong></div>
              </div>
            </div>
          )}

          {/* Equipment summary — only if filled */}
          {(equip.machineType||equip.serialNo) && (
            <div className="fw-mod-card" style={{marginBottom:8}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:14}}>{t.equipTitle}</div>
              <div style={{padding:'12px 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {equip.machineType && <div style={{fontSize:12}}>{t.machineType}: <strong>{equip.machineType}</strong></div>}
                {equip.serialNo    && <div style={{fontSize:12}}>{t.serialNo}: <strong>{equip.serialNo}</strong></div>}
                {equip.lastMaint   && <div style={{fontSize:12}}>{t.lastMaint}: <strong>{equip.lastMaint}</strong></div>}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="fw-mod-card">
            <div style={{padding:'16px',display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              <button onClick={handlePrint}
                style={{background:'#2EAA5E',border:'none',borderRadius:8,padding:'10px 28px',fontSize:14,cursor:'pointer',fontWeight:700,color:'white',display:'flex',alignItems:'center',gap:8}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print / PDF
              </button>
              <button onClick={handleExport}
                style={{background:'white',border:'1px solid #E5E7EB',borderRadius:8,padding:'10px 28px',fontSize:13,cursor:'pointer',fontWeight:600,color:'#6B7280',display:'flex',alignItems:'center',gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {t.exportJSON}
              </button>
            </div>
          </div>
        </div>
      )}

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
  );
}
