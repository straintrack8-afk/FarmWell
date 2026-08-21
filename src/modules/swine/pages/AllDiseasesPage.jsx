import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import PigWellTopNav from '../components/common/PigWellTopNav';

const translations = {
  en: {
    pageTitle: 'All Swine Diseases & Conditions',
    searchPlaceholder: 'Search by name...',
    categoryLabel: 'Category', severityLabel: 'Severity', all: 'All',
    showing: 'Showing', of: 'of', diseases: 'diseases',
    viewDetails: 'View Details →', noResults: 'No diseases found',
    affects: 'Affects', zoonotic: 'Zoonotic',
  },
  id: {
    pageTitle: 'Semua Penyakit & Kondisi Babi',
    searchPlaceholder: 'Cari berdasarkan nama...',
    categoryLabel: 'Kategori', severityLabel: 'Keparahan', all: 'Semua',
    showing: 'Menampilkan', of: 'dari', diseases: 'penyakit',
    viewDetails: 'Lihat Detail →', noResults: 'Tidak ada penyakit',
    affects: 'Mempengaruhi', zoonotic: 'Zoonosis',
  },
  vi: {
    pageTitle: 'Tất Cả Bệnh Lợn & Tình Trạng',
    searchPlaceholder: 'Tìm theo tên...',
    categoryLabel: 'Danh mục', severityLabel: 'Mức độ', all: 'Tất cả',
    showing: 'Hiển thị', of: 'của', diseases: 'bệnh',
    viewDetails: 'Xem Chi Tiết →', noResults: 'Không tìm thấy bệnh',
    affects: 'Ảnh hưởng', zoonotic: 'Lây sang người',
  }
};

function AllDiseasesPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { diseases } = useDiagnosis();
  const t = translations[language] || translations.en;

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [sevFilter, setSevFilter] = useState('All');

  const categories = useMemo(() => {
    if (!diseases) return [];
    const cats = [...new Set(diseases.map(d => d.category).filter(Boolean))];
    return [t.all, ...cats];
  }, [diseases, t.all]);

  const severities = useMemo(() => {
    if (!diseases) return [];
    const sevs = [...new Set(diseases.map(d => d.severity).filter(Boolean))];
    return [t.all, ...sevs];
  }, [diseases, t.all]);

  const filtered = useMemo(() => {
    if (!diseases) return [];
    return diseases.filter(d => {
      const name = (typeof d.name === 'object' ? d.name[language] || d.name.en : d.name) || '';
      const matchSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === t.all || catFilter === 'All' || d.category === catFilter;
      const matchSev = sevFilter === t.all || sevFilter === 'All' || d.severity === sevFilter;
      return matchSearch && matchCat && matchSev;
    });
  }, [diseases, search, catFilter, sevFilter, language, t.all]);

  return (
    <div className="fw-module-page">
      <PigWellTopNav title={t.pageTitle} />

      <div className="fw-mod-card" style={{ marginTop: -18, borderRadius: '16px 16px 12px 12px' }}>
        <div className="fw-mod-content">
          {/* Search + Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 8,
                padding: '8px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{ flex: 1, border: '1.5px solid #E5E7EB', borderRadius: 8, padding: '7px 10px', fontSize: 12 }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sevFilter} onChange={e => setSevFilter(e.target.value)}
                style={{ flex: 1, border: '1.5px solid #E5E7EB', borderRadius: 8, padding: '7px 10px', fontSize: 12 }}>
                {severities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fw-sub)' }}>
              {t.showing} <strong>{filtered.length}</strong> {t.of} <strong>{diseases?.length || 0}</strong> {t.diseases}
            </div>
          </div>

          {/* Disease list */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--fw-sub)' }}>{t.noResults}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(d => {
                const name = typeof d.name === 'object' ? d.name[language] || d.name.en : d.name;
                const desc = typeof d.description === 'object' ? d.description[language] || d.description.en : d.description;
                const affects = Array.isArray(d.ageGroups) ? d.ageGroups.join(', ') : '';
                return (
                  <div key={d.id} className="fw-mod-item-card"
                    onClick={() => navigate('/swine/diagnosis/disease/' + d.id)}
                    style={{ cursor: 'pointer', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fw-text)', marginBottom: 4 }}>{name}</div>
                        {d.category && (
                          <span style={{
                            background: '#E8F5EE', color: '#2EAA5E', fontSize: 10, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 20, marginBottom: 6, display: 'inline-block'
                          }}>{d.category}</span>
                        )}
                        {d.zoonotic && (
                          <span style={{
                            background: '#FEF3C7', color: '#D97706', fontSize: 10, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 20, marginLeft: 4, display: 'inline-block'
                          }}>{t.zoonotic}</span>
                        )}
                        {desc && <div style={{ fontSize: 12, color: 'var(--fw-sub)', marginTop: 4, lineHeight: 1.4 }}>{desc?.slice(0, 100)}{desc?.length > 100 ? '...' : ''}</div>}
                        {affects && <div style={{ fontSize: 11, color: 'var(--fw-sub)', marginTop: 4 }}>{t.affects}: {affects}</div>}
                      </div>
                      <svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:'#2EAA5E',fill:'none',strokeWidth:2,flexShrink:0,marginTop:4}}>
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="fw-mod-bnav">
        <button className="fw-mod-bnav-home" onClick={() => navigate('/swine')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>PigWell</span>
        </button>
        <button className="fw-mod-bnav-alerts" onClick={() => navigate('/swine/diagnostic')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <span>Diagnostic</span>
        </button>
      </div>
    </div>
  );
}

export default AllDiseasesPage;
