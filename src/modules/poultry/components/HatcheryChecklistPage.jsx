import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import PoultryTopNav from './common/PoultryTopNav';
import Chart from 'chart.js/auto';

const STORAGE_KEY = 'farmwell_hatchery_checklist_v1';
const HISTORY_KEY = 'farmwell_hatchery_checklist_history_v1';

const tr = {
  en: {
    title: 'Hatchery Checklist',
    tabBio: 'Biosecurity', tabTech: 'Technical', tabReport: 'Report',
    auditor: 'Auditor', hatchery: 'Hatchery', date: 'Date',
    grandTotal: 'Grand Total', sectionTotal: 'Section Total',
    save: 'Save Audit', saved: 'Saved!',
    reset: 'Reset', resetConfirm: 'Reset all scores?',
    excellent: 'Excellent', good: 'Good',
    needsImprovement: 'Needs Improvement', poor: 'Poor',
    reportTitle: 'Hatchery Audit Report',
    sectionScores: 'Section Scores',
    bioScore: 'Biosecurity Score', techScore: 'Technical Score',
    trendChart: 'Total Score Trend (Last 8 Audits)',
    noHistory: 'No history yet. Save an audit to see trends.',
    exportJSON: 'Export JSON',
    criteria: 'Criteria', maxLabel: 'Max', scoreLabel: 'Score', notePlh: 'Note...',
  },
  vi: {
    title: 'Kiểm Tra Trại Ấp',
    tabBio: 'An Toàn Sinh Học', tabTech: 'Kỹ Thuật', tabReport: 'Báo Cáo',
    auditor: 'Người kiểm tra', hatchery: 'Trại ấp', date: 'Ngày',
    grandTotal: 'Tổng điểm', sectionTotal: 'Tổng mục',
    save: 'Lưu kiểm tra', saved: 'Đã lưu!',
    reset: 'Đặt lại', resetConfirm: 'Đặt lại tất cả điểm?',
    excellent: 'Xuất sắc', good: 'Tốt',
    needsImprovement: 'Cần cải thiện', poor: 'Kém',
    reportTitle: 'Báo Cáo Kiểm Tra Trại Ấp',
    sectionScores: 'Điểm theo mục',
    bioScore: 'Điểm An Toàn Sinh Học', techScore: 'Điểm Kỹ Thuật',
    trendChart: 'Xu hướng tổng điểm (8 lần gần nhất)',
    noHistory: 'Chưa có lịch sử. Lưu kiểm tra để xem xu hướng.',
    exportJSON: 'Xuất JSON',
    criteria: 'Tiêu chí', maxLabel: 'Tối đa', scoreLabel: 'Điểm', notePlh: 'Ghi chú...',
  }
};

const SECTIONS = [
  // ── BIOSECURITY ──
  {
    id:'I', part:'bio',
    title_en:'SITE ACCESS & PERIMETER', subtitle_en:'Perimeter security, vehicle and visitor control',
    title_vi:'KIỂM SOÁT LỐI VÀO & RANH GIỚI', subtitle_vi:'An ninh ranh giới, kiểm soát xe cộ và khách thăm',
    max_score:100,
    criteria:[
      { no:1,  title_en:'Perimeter fence',            req_en:'Intact and secured; no gaps allowing unauthorized entry',                    title_vi:'Hàng rào ranh giới',         req_vi:'Nguyên vẹn, bảo đảm; không có khoảng trống cho phép vào trái phép', max_score:20 },
      { no:2,  title_en:'Entry / exit control',        req_en:'Single authorized point; visitor and vehicle log up to date',                title_vi:'Kiểm soát ra vào',           req_vi:'Một điểm ra vào được phép; sổ nhật ký khách/xe cập nhật đầy đủ',     max_score:25 },
      { no:3,  title_en:'Vehicle disinfection',        req_en:'All vehicles cleaned and disinfected before entering site',                 title_vi:'Khử trùng xe',               req_vi:'Tất cả xe được vệ sinh và khử trùng trước khi vào trại',            max_score:25 },
      { no:4,  title_en:'Visitor biosecurity',         req_en:'Clean coveralls and boots provided; procedure enforced at entry',           title_vi:'An toàn sinh học cho khách', req_vi:'Cung cấp quần áo bảo hộ và ủng sạch; quy trình được thực thi',       max_score:20 },
      { no:5,  title_en:'Contact restriction',         req_en:'Staff/visitors had no recent contact with other poultry farms',             title_vi:'Hạn chế tiếp xúc',           req_vi:'Nhân viên/khách không tiếp xúc với trại gia cầm khác gần đây',      max_score:10 },
    ]
  },
  {
    id:'II', part:'bio',
    title_en:'PERSONNEL & HYGIENE', subtitle_en:'Staff hygiene protocols and PPE compliance',
    title_vi:'NHÂN VIÊN & VỆ SINH', subtitle_vi:'Quy trình vệ sinh nhân viên và tuân thủ PPE',
    max_score:100,
    criteria:[
      { no:6,  title_en:'Shower-in protocol',          req_en:'Staff shower or change into clean clothes and footwear at entry',           title_vi:'Quy trình tắm/thay đồ',     req_vi:'Nhân viên tắm hoặc thay quần áo và giày dép sạch khi vào',           max_score:25 },
      { no:7,  title_en:'Zone-specific PPE',            req_en:'Dedicated coveralls and footwear per production zone',                     title_vi:'PPE theo khu vực',           req_vi:'Quần áo và giày dép riêng cho từng khu vực sản xuất',                max_score:20 },
      { no:8,  title_en:'Hand hygiene',                 req_en:'Handwash or sanitization before entering each production area',            title_vi:'Vệ sinh tay',               req_vi:'Rửa tay hoặc sát khuẩn trước khi vào từng khu vực sản xuất',        max_score:25 },
      { no:9,  title_en:'Footbath maintenance',         req_en:'Boot dip functional; solution changed regularly per manufacturer guidance', title_vi:'Bảo trì bể khử trùng',       req_vi:'Bể khử trùng hoạt động tốt; dung dịch thay đúng định kỳ',           max_score:20 },
      { no:10, title_en:'Health declaration',           req_en:'Staff health screening records or illness reporting system in place',       title_vi:'Khai báo sức khỏe',          req_vi:'Hồ sơ kiểm tra sức khỏe nhân viên hoặc hệ thống báo cáo bệnh',      max_score:10 },
    ]
  },
  {
    id:'III', part:'bio',
    title_en:'INTERNAL ZONE FLOW', subtitle_en:'Clean/dirty separation and unidirectional traffic',
    title_vi:'LUỒNG KHU VỰC NỘI BỘ', subtitle_vi:'Phân tách sạch/bẩn và luồng di chuyển một chiều',
    max_score:100,
    criteria:[
      { no:11, title_en:'Zone separation',             req_en:'Clean and dirty zones clearly marked, physically separated and enforced',   title_vi:'Phân tách khu vực',          req_vi:'Khu sạch và bẩn được đánh dấu rõ ràng, phân tách vật lý',           max_score:25 },
      { no:12, title_en:'Unidirectional flow',         req_en:'Product and personnel move in one direction only; no backflow observed',    title_vi:'Luồng di chuyển một chiều',  req_vi:'Sản phẩm và nhân viên chỉ di chuyển một chiều; không đi ngược',      max_score:25 },
      { no:13, title_en:'Egg vs. chick area separation', req_en:'Egg receiving area physically separate from chick dispatch area',         title_vi:'Phân tách khu nhận trứng/xuất gà', req_vi:'Khu nhận trứng tách biệt vật lý với khu xuất gà',              max_score:20 },
      { no:14, title_en:'Setter / hatcher separation', req_en:'No cross-traffic of personnel or equipment between setter and hatcher zones', title_vi:'Tách biệt khu ấp/nở',     req_vi:'Không có nhân viên hoặc thiết bị đi lẫn giữa khu ấp và khu nở',     max_score:20 },
      { no:15, title_en:'Waste routing',               req_en:'All waste removed via dedicated exit route; not through clean production areas', title_vi:'Đường thoát rác thải', req_vi:'Tất cả rác thải được đưa ra qua lối riêng; không đi qua khu sạch',  max_score:10 },
    ]
  },
  {
    id:'IV', part:'bio',
    title_en:'CLEANING & DISINFECTION', subtitle_en:'C&D protocols, verification and documentation',
    title_vi:'VỆ SINH & KHỬ TRÙNG', subtitle_vi:'Quy trình vệ sinh khử trùng, kiểm tra và ghi chép',
    max_score:100,
    criteria:[
      { no:16, title_en:'Machine cleaning log',        req_en:'Cleaning and disinfection log completed and current for all machines',      title_vi:'Sổ vệ sinh máy',             req_vi:'Sổ ghi vệ sinh và khử trùng đầy đủ, cập nhật cho tất cả máy',       max_score:20 },
      { no:17, title_en:'Hatcher room C&D',            req_en:'Full clean and disinfection of hatcher rooms between each hatch cycle',     title_vi:'Vệ sinh phòng nở',           req_vi:'Vệ sinh và khử trùng hoàn toàn phòng nở giữa mỗi chu kỳ nở',       max_score:25 },
      { no:18, title_en:'Disinfectant compliance',     req_en:'Approved disinfectants used at correct concentration; contact time observed', title_vi:'Tuân thủ khử trùng',       req_vi:'Sử dụng đúng sản phẩm khử trùng và nồng độ; đủ thời gian tiếp xúc', max_score:25 },
      { no:19, title_en:'Sanitization verification',   req_en:'Swab or residue test conducted after C&D to confirm efficacy',             title_vi:'Kiểm tra hiệu quả khử trùng', req_vi:'Kiểm tra gạc hoặc dư lượng sau C&D để xác nhận hiệu quả',          max_score:20 },
      { no:20, title_en:'Egg sanitization records',    req_en:'Egg fumigation or sanitization on receipt is documented per batch',         title_vi:'Hồ sơ khử trùng trứng',      req_vi:'Khử trùng trứng khi nhận được ghi chép theo từng lô',               max_score:10 },
    ]
  },
  {
    id:'V', part:'bio',
    title_en:'PEST CONTROL & WASTE', subtitle_en:'Rodent, bird exclusion and biological waste management',
    title_vi:'KIỂM SOÁT DỊCH HẠI & RÁC THẢI', subtitle_vi:'Kiểm soát chuột, chim và quản lý rác thải sinh học',
    max_score:100,
    criteria:[
      { no:21, title_en:'Pest control program',        req_en:'Documented pest control program; current records available for inspection',  title_vi:'Chương trình kiểm soát dịch hại', req_vi:'Chương trình kiểm soát dịch hại được lập; hồ sơ hiện hành',   max_score:20 },
      { no:22, title_en:'Rodent control',              req_en:'Bait stations maintained, inspected and recorded on schedule',              title_vi:'Kiểm soát chuột',            req_vi:'Bẫy mồi được bảo trì, kiểm tra và ghi chép đúng kỳ',                max_score:20 },
      { no:23, title_en:'Wild bird exclusion',         req_en:'All openings screened; no evidence of wild bird entry',                     title_vi:'Ngăn chặn chim hoang',       req_vi:'Tất cả lỗ thông đều có lưới bảo vệ; không có bằng chứng chim vào', max_score:20 },
      { no:24, title_en:'Biological waste disposal',   req_en:'Culled chick and dead-in-shell disposal compliant and documented',          title_vi:'Xử lý rác thải sinh học',    req_vi:'Xử lý gà loại và trứng không nở đúng quy định và được ghi chép',   max_score:25 },
      { no:25, title_en:'Waste storage area',          req_en:'Waste areas secured, cleaned and free of pest attractants',                 title_vi:'Khu lưu trữ rác thải',       req_vi:'Khu rác thải được bảo đảm, sạch sẽ và không thu hút dịch hại',      max_score:15 },
    ]
  },
  // ── TECHNICAL ──
  {
    id:'VI', part:'tech',
    title_en:'EGG RECEIPT & STORAGE', subtitle_en:'Source certification, inspection and storage conditions',
    title_vi:'NHẬN & LƯU TRỮ TRỨNG', subtitle_vi:'Chứng nhận nguồn gốc, kiểm tra và điều kiện bảo quản',
    max_score:100,
    criteria:[
      { no:26, title_en:'Source certification',        req_en:'Hatching eggs from certified disease-free breeder flocks with valid records', title_vi:'Chứng nhận nguồn gốc',      req_vi:'Trứng ấp từ đàn bố mẹ được chứng nhận sạch bệnh với hồ sơ hợp lệ', max_score:25 },
      { no:27, title_en:'Receipt inspection',          req_en:'Cracked, dirty, misshapen and oversized eggs rejected on receipt',           title_vi:'Kiểm tra khi nhận',          req_vi:'Loại trứng nứt, bẩn, dị hình và quá khổ khi nhận',                 max_score:20 },
      { no:28, title_en:'Storage temperature',         req_en:'Egg cooler maintained at 15–18°C; temperature logged daily',                title_vi:'Nhiệt độ bảo quản',          req_vi:'Tủ lạnh trứng duy trì 15–18°C; nhiệt độ ghi chép hàng ngày',       max_score:25 },
      { no:29, title_en:'Storage humidity',            req_en:'Egg room humidity maintained at 75–85% RH',                                 title_vi:'Độ ẩm bảo quản',             req_vi:'Độ ẩm phòng trứng duy trì 75–85% RH',                               max_score:15 },
      { no:30, title_en:'FIFO system',                 req_en:'Oldest eggs set first; egg storage time within acceptable limits (<7 days)', title_vi:'Hệ thống FIFO',              req_vi:'Trứng cũ nhất được ấp trước; thời gian lưu trữ phù hợp (<7 ngày)', max_score:15 },
    ]
  },
  {
    id:'VII', part:'tech',
    title_en:'SETTER / INCUBATION', subtitle_en:'Temperature, humidity, turning and ventilation',
    title_vi:'MÁY ẤP / Ủ TRỨNG', subtitle_vi:'Nhiệt độ, độ ẩm, lật trứng và thông gió',
    max_score:100,
    criteria:[
      { no:31, title_en:'Setter temperature',          req_en:'Calibrated and stable at 37.5–38.0°C throughout incubation',               title_vi:'Nhiệt độ máy ấp',            req_vi:'Được hiệu chuẩn, ổn định 37.5–38.0°C trong suốt quá trình ấp',      max_score:25 },
      { no:32, title_en:'Incubation humidity',         req_en:'Relative humidity maintained at 55–60% RH during incubation (days 1–18)',   title_vi:'Độ ẩm ủ trứng',              req_vi:'Độ ẩm tương đối duy trì 55–60% RH trong quá trình ấp (ngày 1–18)', max_score:20 },
      { no:33, title_en:'Egg turning',                 req_en:'Automatic turning operational; eggs turned at least hourly',                title_vi:'Lật trứng',                  req_vi:'Lật trứng tự động hoạt động; trứng được lật ít nhất mỗi giờ',       max_score:20 },
      { no:34, title_en:'Setter ventilation',          req_en:'Adequate fresh air exchange; CO₂ levels within acceptable range',           title_vi:'Thông gió máy ấp',           req_vi:'Thông khí tươi đầy đủ; mức CO₂ trong phạm vi cho phép',             max_score:15 },
      { no:35, title_en:'Incubation logs',             req_en:'Temperature and humidity recorded minimum every 4 hours and reviewed',      title_vi:'Nhật ký ấp trứng',           req_vi:'Nhiệt độ và độ ẩm ghi chép tối thiểu 4 giờ/lần và được xem xét',   max_score:20 },
    ]
  },
  {
    id:'VIII', part:'tech',
    title_en:'CANDLING & TRANSFER', subtitle_en:'Infertile removal, transfer timing and room hygiene',
    title_vi:'SOI TRỨNG & CHUYỂN TRỨNG', subtitle_vi:'Loại vô phôi, thời gian chuyển và vệ sinh phòng',
    max_score:100,
    criteria:[
      { no:36, title_en:'First candling',              req_en:'Performed at day 7–10; infertile and early dead removed and recorded',      title_vi:'Soi trứng lần 1',            req_vi:'Thực hiện ngày 7–10; loại vô phôi và chết sớm, ghi chép lại',       max_score:25 },
      { no:37, title_en:'Transfer timing',             req_en:'Eggs transferred to hatcher at day 18.0–18.5',                             title_vi:'Thời gian chuyển trứng',     req_vi:'Chuyển trứng sang máy nở ở ngày 18.0–18.5',                         max_score:25 },
      { no:38, title_en:'Transfer room hygiene',       req_en:'Transfer room cleaned and disinfected before each transfer',               title_vi:'Vệ sinh phòng chuyển trứng', req_vi:'Phòng chuyển trứng được vệ sinh và khử trùng trước mỗi lần chuyển', max_score:25 },
      { no:39, title_en:'Transfer mortality log',      req_en:'Dead-in-transfer rate recorded and compared to target',                    title_vi:'Nhật ký tử vong khi chuyển', req_vi:'Tỷ lệ chết khi chuyển được ghi chép và so sánh với mục tiêu',       max_score:15 },
      { no:40, title_en:'Hatcher basket condition',    req_en:'Baskets or trays clean and free of debris before loading',                  title_vi:'Tình trạng khay/rổ nở',      req_vi:'Khay hoặc rổ sạch sẽ, không có mảnh vụn trước khi xếp trứng',      max_score:10 },
    ]
  },
  {
    id:'IX', part:'tech',
    title_en:'HATCHER OPERATION', subtitle_en:'Lock-down conditions, pull timing and post-hatch hygiene',
    title_vi:'VẬN HÀNH MÁY NỞ', subtitle_vi:'Điều kiện khóa máy, thời gian rút gà và vệ sinh sau nở',
    max_score:100,
    criteria:[
      { no:41, title_en:'Hatcher temperature',         req_en:'Maintained at 37.0–37.5°C throughout hatching window',                     title_vi:'Nhiệt độ máy nở',            req_vi:'Duy trì 37.0–37.5°C trong suốt quá trình nở',                       max_score:25 },
      { no:42, title_en:'Lock-down humidity',          req_en:'Humidity increased to 65–70% RH at transfer (day 18)',                     title_vi:'Độ ẩm khóa máy',             req_vi:'Tăng độ ẩm lên 65–70% RH khi chuyển trứng (ngày 18)',               max_score:20 },
      { no:43, title_en:'Pull timing',                 req_en:'First pull optimized; navel condition and chick dryness checked before pull', title_vi:'Thời gian rút gà',         req_vi:'Thời gian rút gà tối ưu; kiểm tra rốn và độ khô của gà',            max_score:20 },
      { no:44, title_en:'Post-hatch waste removal',    req_en:'Hatcher waste (shells, fluff) removed promptly after each pull',            title_vi:'Dọn rác sau nở',             req_vi:'Rác nở (vỏ trứng, lông tơ) được dọn ngay sau mỗi lần rút gà',      max_score:20 },
      { no:45, title_en:'Hatch window record',         req_en:'Duration from first chick to last pull documented per batch',               title_vi:'Ghi nhận cửa sổ nở',         req_vi:'Thời gian từ gà đầu tiên đến lần rút cuối được ghi chép theo lô',   max_score:15 },
    ]
  },
  {
    id:'X', part:'tech',
    title_en:'CHICK QUALITY & BREAKOUT', subtitle_en:'Quality assessment, dead-in-shell analysis and hatchability',
    title_vi:'CHẤT LƯỢNG GÀ & PHÂN TÍCH NỞ', subtitle_vi:'Đánh giá chất lượng, phân tích trứng không nở và tỷ lệ nở',
    max_score:100,
    criteria:[
      { no:46, title_en:'Chick quality scoring',       req_en:'Navel healing, activity, leg condition and uniformity assessed per batch',  title_vi:'Đánh giá chất lượng gà',     req_vi:'Đánh giá rốn lành, hoạt động, chân và đồng đều theo từng lô',      max_score:25 },
      { no:47, title_en:'Dead-in-shell analysis',      req_en:'DIS embryo age and probable cause documented; compared to targets',         title_vi:'Phân tích trứng không nở',   req_vi:'Tuổi phôi và nguyên nhân DIS được ghi chép; so sánh với mục tiêu', max_score:25 },
      { no:48, title_en:'Hatchability rate',           req_en:'Calculated per batch and compared to breed/flock standard',                 title_vi:'Tỷ lệ nở',                   req_vi:'Tính theo từng lô và so sánh với tiêu chuẩn giống/đàn',             max_score:20 },
      { no:49, title_en:'Breakout sampling',           req_en:'Residual yolk breakout analysis performed per hatch batch',                 title_vi:'Kiểm tra noãn hoàng dư',     req_vi:'Phân tích noãn hoàng dư được thực hiện theo từng lô nở',            max_score:15 },
      { no:50, title_en:'Chick delivery containers',   req_en:'New or clean and disinfected containers used for chick delivery',           title_vi:'Thùng giao gà',              req_vi:'Thùng mới hoặc sạch và khử trùng được sử dụng để giao gà',         max_score:15 },
    ]
  },
];

const MAX_TOTAL   = 1000;
const BIO_IDS  = ['I','II','III','IV','V'];
const TECH_IDS = ['VI','VII','VIII','IX','X'];

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

const INP = { width:'100%', border:'1px solid #E5E7EB', borderRadius:6, padding:'6px 8px', fontSize:13, boxSizing:'border-box' };

export default function HatcheryChecklistPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const lang = language === 'vi' ? 'vi' : 'en';
  const t = tr[lang];

  const [scores,    setScores]    = useState({});
  const [notes,     setNotes]     = useState({});
  const [info,      setInfo]      = useState({ auditor:'', date:new Date().toISOString().split('T')[0], hatchery:'' });
  const [tab,       setTab]       = useState('bio');
  const [collapsed, setCollapsed] = useState({});
  const [mobile,    setMobile]    = useState(window.innerWidth < 640);
  const [saveMsg,   setSaveMsg]   = useState('');
  const [history,   setHistory]   = useState([]);

  const trdRef   = useRef(null);
  const trdChart = useRef(null);

  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (s.scores) setScores(s.scores);
    if (s.notes)  setNotes(s.notes);
    if (s.info)   setInfo(s.info);
    setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ scores, notes, info }));
  }, [scores, notes, info]);

  // Trend chart
  useEffect(() => {
    if (tab !== 'report') { trdChart.current?.destroy(); trdChart.current = null; return; }
    if (!trdRef.current || !history.length) return;
    trdChart.current?.destroy();
    const pts = history.slice(-8).map(a => ({ date: a.info?.date||'', total: a.grandTotal||0, pct: Math.round(((a.grandTotal||0)/MAX_TOTAL)*100) }));
    trdChart.current = new Chart(trdRef.current, {
      type: 'line',
      data: {
        labels: pts.map(p => p.date),
        datasets: [{
          label: '%', data: pts.map(p => p.pct),
          borderColor:'#2EAA5E', backgroundColor:'#2EAA5E20',
          tension:0.35, fill:true, pointBackgroundColor:'#2EAA5E', pointRadius:5,
        }]
      },
      options: {
        responsive:true,
        plugins:{ legend:{ display:false } },
        scales:{ y:{ min:0, max:100, ticks:{ callback:v => v+'%' } } }
      }
    });
  }, [history, tab]);

  const secScore    = s  => s.criteria.reduce((sum,c) => sum + (scores[c.no]||0), 0);
  const partScore   = ids => SECTIONS.filter(s => ids.includes(s.id)).reduce((sum,s) => sum + secScore(s), 0);
  const grandTotal  = ()  => SECTIONS.reduce((sum,s) => sum + secScore(s), 0);

  const handleReset = () => {
    if (!window.confirm(t.resetConfirm)) return;
    setScores({}); setNotes({});
  };

  const handleSave = () => {
    const gt = grandTotal();
    const rec = { id:String(Date.now()), savedAt:new Date().toISOString(), info, scores, notes, grandTotal:gt, grandPct:Math.round((gt/MAX_TOTAL)*100) };
    const updated = [...history, rec].slice(-10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
    setSaveMsg(t.saved); setTimeout(() => setSaveMsg(''), 2500);
  };

  const handleExport = () => {
    const gt   = grandTotal();
    const blob = new Blob([JSON.stringify({ info, scores, notes, grandTotal:gt, exportedAt:new Date().toISOString() },null,2)],{type:'application/json'});
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'hatchery_checklist_' + (info.date||'export') + '.json';
    a.click(); URL.revokeObjectURL(a.href);
  };

  const handlePrint = () => {
    const gt   = grandTotal();
    const gPct = Math.round((gt/MAX_TOTAL)*100);
    const gCol = sCol(gPct);
    const bioTotal  = partScore(BIO_IDS);
    const techTotal = partScore(TECH_IDS);
    const secRows = SECTIONS.map(s => {
      const sc=secScore(s), p=Math.round((sc/s.max_score)*100), c=sCol(p);
      return `<div class="sr"><div class="sb">${s.id}</div><div style="flex:1"><div style="font-size:12px;font-weight:600;margin-bottom:4px">${lang==='vi'?s.title_vi:s.title_en}</div><div class="bt"><div class="bf" style="width:${p}%;background:${c}"></div></div></div><div class="ss" style="color:${c}">${sc}/${s.max_score}</div></div>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hatchery Checklist - ${info.date||''}</title><style>*{box-sizing:border-box}body{font-family:sans-serif;margin:24px;color:#111;max-width:780px}h1{color:#2EAA5E;font-size:20px;margin:0 0 4px}h2{font-size:13px;font-weight:700;color:#374151;margin:20px 0 8px;border-bottom:1px solid #E5E7EB;padding-bottom:4px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#F9FAFB;padding:12px;border-radius:8px;font-size:13px;margin:12px 0}.sc{text-align:center;padding:20px;border:2px solid #2EAA5E;border-radius:12px;margin:16px 0}.sn{font-size:52px;font-weight:800;color:${gCol};line-height:1}.sr{display:flex;align-items:center;gap:12px;margin-bottom:10px}.sb{width:28px;height:28px;border-radius:6px;background:#2EAA5E;color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0}.bt{height:6px;background:#F3F4F6;border-radius:3px;overflow:hidden}.bf{height:6px;border-radius:3px}.ss{font-weight:700;font-size:13px;min-width:55px;text-align:right}.pt{display:flex;gap:16px;margin:12px 0}.pc{flex:1;background:#F9FAFB;border-radius:8px;padding:12px;text-align:center}.pv{font-size:24px;font-weight:800}.pl{font-size:11px;color:#6B7280;margin-top:2px}@media print{body{margin:10mm}}</style></head><body><h1>Hatchery Checklist Report</h1><div class="meta"><div>Auditor: <b>${info.auditor||'—'}</b></div><div>Hatchery: <b>${info.hatchery||'—'}</b></div><div>Date: <b>${info.date||'—'}</b></div></div><div class="sc"><div class="sn">${gt}</div><div style="font-size:14px;color:#6B7280;margin-top:6px">/${MAX_TOTAL} · ${gPct}% · ${sLbl(gPct,t)}</div></div><div class="pt"><div class="pc"><div class="pv" style="color:${sCol(Math.round((bioTotal/500)*100))}">${bioTotal}/500</div><div class="pl">${t.bioScore}</div></div><div class="pc"><div class="pv" style="color:${sCol(Math.round((techTotal/500)*100))}">${techTotal}/500</div><div class="pl">${t.techScore}</div></div></div><h2>${t.sectionScores}</h2>${secRows}</body></html>`;
    const w = window.open('','_blank','width=820,height=700');
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(() => w.print(), 400);
  };

  const gt   = grandTotal();
  const gPct = Math.round((gt/MAX_TOTAL)*100);
  const gCol = sCol(gPct);
  const bioTotal  = partScore(BIO_IDS);
  const techTotal = partScore(TECH_IDS);

  const activeSections = tab === 'bio'
    ? SECTIONS.filter(s => BIO_IDS.includes(s.id))
    : tab === 'tech'
    ? SECTIONS.filter(s => TECH_IDS.includes(s.id))
    : [];

  const TABS = ['bio','tech','report'];
  const TLBL = { bio:t.tabBio, tech:t.tabTech, report:t.tabReport };

  return (
    <div className="fw-module-page">
      <PoultryTopNav title={t.title} />

      {/* ── Audit info ── */}
      <div className="fw-mod-card" style={{marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'flex-end',padding:'8px 16px 0',gap:4}}>
          {['en','vi'].map(l => (
            <button key={l} onClick={() => setLanguage(l)}
              style={{padding:'3px 10px',borderRadius:6,border:'1px solid',fontSize:11,fontWeight:700,cursor:'pointer',textTransform:'uppercase',
                borderColor:lang===l?'#2EAA5E':'#E5E7EB',
                background:lang===l?'#2EAA5E':'white',
                color:lang===l?'white':'#9CA3AF'}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr 1fr',gap:12,padding:'12px 16px'}}>
          {[['auditor',t.auditor,'text'],['hatchery',t.hatchery,'text'],['date',t.date,'date']].map(([k,lbl,tp]) => (
            <div key={k}>
              <label style={{fontSize:11,color:'var(--fw-sub)',display:'block',marginBottom:4}}>{lbl}</label>
              <input type={tp} value={info[k]} placeholder={lbl}
                onChange={e => setInfo(p => ({...p,[k]:e.target.value}))} style={INP}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── Score summary ── */}
      <div className="fw-mod-card" style={{marginBottom:8,background:gCol+'0D'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
          <div>
            <div style={{fontSize:11,color:'var(--fw-sub)',textTransform:'uppercase',letterSpacing:1}}>{t.grandTotal}</div>
            <div style={{fontSize:28,fontWeight:800,color:gCol}}>
              {gt}<span style={{fontSize:14,fontWeight:500,color:'var(--fw-sub)'}}> /{MAX_TOTAL}</span>
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
        {/* Part score pills */}
        <div style={{display:'flex',gap:8,padding:'0 16px 12px'}}>
          {[
            [t.bioScore,  bioTotal,  500, BIO_IDS],
            [t.techScore, techTotal, 500, TECH_IDS],
          ].map(([lbl,sc,mx]) => {
            const p=Math.round((sc/mx)*100), c=sCol(p);
            return (
              <div key={lbl} style={{background:'white',border:'1px solid '+c+'40',borderRadius:8,padding:'6px 12px',fontSize:12}}>
                <span style={{fontWeight:600,color:'var(--fw-sub)',fontSize:11}}>{lbl}: </span>
                <span style={{fontWeight:800,color:c}}>{sc}/{mx}</span>
                <span style={{fontSize:11,color:c,marginLeft:4}}>{p}%</span>
              </div>
            );
          })}
        </div>
        {/* Section pills */}
        <div style={{display:'flex',gap:6,padding:'0 16px 12px',flexWrap:'wrap'}}>
          {SECTIONS.map(s => {
            const sc=secScore(s), p=Math.round((sc/s.max_score)*100), c=sCol(p);
            return (
              <div key={s.id} style={{background:'white',border:'1px solid '+c+'40',borderRadius:6,padding:'4px 8px',fontSize:11}}>
                <span style={{fontWeight:700,color:c}}>{s.id}</span>
                <span style={{color:'var(--fw-sub)',margin:'0 3px'}}>·</span>
                <span style={{fontWeight:600}}>{sc}/{s.max_score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div style={{position:'sticky',top:0,zIndex:40,background:'#F3F4F6',padding:'8px 0 10px',marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,marginBottom:0}}>
        <div style={{display:'flex',gap:6}}>
          {TABS.map(tb => (
            <button key={tb} onClick={() => setTab(tb)}
              style={{padding:'8px 20px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:12,whiteSpace:'nowrap',
                background:tab===tb?'#2EAA5E':'white',color:tab===tb?'white':'var(--fw-sub)',
                boxShadow:tab===tb?'0 2px 8px #2EAA5E40':'0 1px 3px rgba(0,0,0,0.08)'}}>
              {TLBL[tb]}
            </button>
          ))}
        </div>
      </div>
      <div style={{height:10}}/>

      {/* ═══════ CHECKLIST SECTIONS (bio / tech) ═══════ */}
      {(tab === 'bio' || tab === 'tech') && activeSections.map(section => {
        const sc=secScore(section), pct=Math.round((sc/section.max_score)*100), col=sCol(pct), isCol=collapsed[section.id];
        return (
          <div key={section.id} className="fw-mod-card" style={{marginBottom:8}}>
            <div onClick={() => setCollapsed(p => ({...p,[section.id]:!p[section.id]}))}
              style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',cursor:'pointer',userSelect:'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#2EAA5E,#1E7A42)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{color:'white',fontWeight:800,fontSize:12}}>{section.id}</span>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:mobile?12:14}}>{lang==='vi'?section.title_vi:section.title_en}</div>
                  {!mobile && <div style={{fontSize:11,color:'var(--fw-sub)'}}>{lang==='vi'?section.subtitle_vi:section.subtitle_en}</div>}
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
                  <div style={{display:'grid',gridTemplateColumns:'36px 1fr 220px 52px 64px 110px',gap:8,padding:'8px 16px',background:'#F9FAFB',fontSize:11,color:'var(--fw-sub)',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>
                    <div>#</div><div>{t.criteria}</div><div>Requirements</div>
                    <div style={{textAlign:'center'}}>{t.maxLabel}</div>
                    <div style={{textAlign:'center'}}>{t.scoreLabel}</div>
                    <div>Note</div>
                  </div>
                )}
                {section.criteria.map((c, idx) => {
                  const sv=scores[c.no]||0, cp=c.max_score>0?(sv/c.max_score)*100:0, cc=sCol(cp);
                  return (
                    <div key={c.no} style={{padding:mobile?'12px 16px':'10px 16px',borderBottom:idx<section.criteria.length-1?'1px solid #F3F4F6':'none',background:idx%2===0?'white':'#FAFAFA',display:mobile?'block':'grid',gridTemplateColumns:'36px 1fr 220px 52px 64px 110px',gap:8,alignItems:'start'}}>
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
                              onChange={e => { const n=Math.min(Math.max(parseInt(e.target.value)||0,0),c.max_score); setScores(p=>({...p,[c.no]:n})); }}
                              style={{width:52,textAlign:'center',border:'2px solid '+cc,borderRadius:6,padding:'4px',fontSize:14,fontWeight:700,color:cc,background:cc+'10',outline:'none'}}/>
                            <input type="text" value={notes[c.no]||''} placeholder={t.notePlh}
                              onChange={e => setNotes(p => ({...p,[c.no]:e.target.value}))}
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
                              onChange={e => { const n=Math.min(Math.max(parseInt(e.target.value)||0,0),c.max_score); setScores(p=>({...p,[c.no]:n})); }}
                              style={{width:52,textAlign:'center',border:'2px solid '+cc,borderRadius:6,padding:'4px',fontSize:14,fontWeight:700,color:cc,background:cc+'10',outline:'none'}}/>
                          </div>
                          <div>
                            <input type="text" value={notes[c.no]||''} placeholder={t.notePlh}
                              onChange={e => setNotes(p => ({...p,[c.no]:e.target.value}))}
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

      {/* ═══════ REPORT ═══════ */}
      {tab === 'report' && (
        <div>
          <div className="fw-mod-card" style={{marginBottom:8}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:15}}>{t.reportTitle}</div>
            <div style={{padding:'16px'}}>
              {/* Meta */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16,background:'#F9FAFB',borderRadius:8,padding:12}}>
                <div style={{fontSize:12,color:'var(--fw-sub)'}}>Auditor: <strong>{info.auditor||'—'}</strong></div>
                <div style={{fontSize:12,color:'var(--fw-sub)'}}>Hatchery: <strong>{info.hatchery||'—'}</strong></div>
                <div style={{fontSize:12,color:'var(--fw-sub)'}}>Date: <strong>{info.date||'—'}</strong></div>
              </div>
              {/* Grand total */}
              <div style={{textAlign:'center',padding:'20px 0',borderBottom:'1px solid #F3F4F6',marginBottom:16}}>
                <div style={{fontSize:11,color:'var(--fw-sub)',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{t.grandTotal}</div>
                <div style={{fontSize:52,fontWeight:800,color:gCol,lineHeight:1}}>{gt}</div>
                <div style={{fontSize:14,color:'var(--fw-sub)',marginTop:6}}>/{MAX_TOTAL} · {gPct}% · {sLbl(gPct,t)}</div>
              </div>
              {/* Part scores */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                {[
                  [t.bioScore,  bioTotal,  500],
                  [t.techScore, techTotal, 500],
                ].map(([lbl,sc,mx]) => {
                  const p=Math.round((sc/mx)*100), c=sCol(p);
                  return (
                    <div key={lbl} style={{background:'#F9FAFB',borderRadius:10,padding:'12px',textAlign:'center',border:'1px solid '+c+'30'}}>
                      <div style={{fontSize:11,color:'var(--fw-sub)',marginBottom:4}}>{lbl}</div>
                      <div style={{fontSize:24,fontWeight:800,color:c}}>{sc}/{mx}</div>
                      <div style={{fontSize:12,color:c,fontWeight:600}}>{p}%</div>
                    </div>
                  );
                })}
              </div>
              {/* Section bars */}
              <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>{t.sectionScores}</div>
              {SECTIONS.map(s => {
                const sc=secScore(s), p=Math.round((sc/s.max_score)*100), c=sCol(p);
                return (
                  <div key={s.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:28,height:28,borderRadius:6,background:'linear-gradient(135deg,#2EAA5E,#1E7A42)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <span style={{color:'white',fontWeight:800,fontSize:11}}>{s.id}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>{lang==='vi'?s.title_vi:s.title_en}</div>
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

          {/* Trend chart */}
          <div className="fw-mod-card" style={{marginBottom:8}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #F3F4F6',fontWeight:700,fontSize:14}}>{t.trendChart}</div>
            <div style={{padding:'16px'}}>
              {history.length > 0
                ? <canvas ref={trdRef} style={{maxHeight:240}}/>
                : <div style={{textAlign:'center',color:'var(--fw-sub)',fontSize:13,padding:'32px 0'}}>{t.noHistory}</div>
              }
            </div>
          </div>

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

      {/* Bottom nav */}
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
