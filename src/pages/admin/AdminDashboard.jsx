import { useState, useEffect } from 'react';
import { fetchAnnouncements, saveAnnouncements } from '../../services/githubService';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import './AdminDashboard.css';

const EMPTY_BANNER = {
  id: '', active: true, type: 'product', priority: 'normal',
  startDate: new Date().toISOString().split('T')[0], endDate: '',
  tag: { en: '', id: '', vi: '' },
  title: { en: '', id: '', vi: '' },
  meta: [],
  body: { en: '', id: '', vi: '' },
  link: '',
  linkLabel: { en: '', id: '', vi: '' },
};

const TYPE_ICONS  = { outbreak: '🚨', product: '🆕', tips: '💡', update: '📢' };
const TYPE_LABELS = { outbreak: 'Outbreak', product: 'Product', tips: 'Tips', update: 'Update' };

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [sha, setSha] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_BANNER);
  const [metaInput, setMetaInput] = useState('');

  useEffect(() => {
    fetchAnnouncements()
      .then(({ announcements, sha }) => { setAnnouncements(announcements); setSha(sha); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveStatus('');
    try {
      const result = await saveAnnouncements(announcements, sha);
      setSha(result.content.sha);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch { setSaveStatus('error'); }
    setSaving(false);
  };

  const toggleActive = (id) =>
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));

  const handleDelete = (id) => {
    if (!window.confirm('Delete this banner?')) return;
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const openEdit = (ann) => {
    setFormData({ ...EMPTY_BANNER, ...ann,
      tag: { en:'', id:'', vi:'', ...ann.tag },
      title: { en:'', id:'', vi:'', ...ann.title },
      body: { en:'', id:'', vi:'', ...ann.body },
      linkLabel: { en:'', id:'', vi:'', ...ann.linkLabel },
      meta: ann.meta || [],
    });
    setMetaInput(''); setEditingId(ann.id);
  };

  const openNew = () => {
    setFormData({ ...EMPTY_BANNER, id: `ann_${Date.now()}` });
    setMetaInput(''); setEditingId('new');
  };

  const handleFormSave = () => {
    if (!formData.title.en || !formData.body.en) {
      alert('Title (EN) and Body (EN) are required.'); return;
    }
    if (editingId === 'new') setAnnouncements(prev => [...prev, formData]);
    else setAnnouncements(prev => prev.map(a => a.id === editingId ? formData : a));
    setEditingId(null);
  };

  const setField = (f, v) => setFormData(p => ({ ...p, [f]: v }));
  const setMLField = (f, l, v) => setFormData(p => ({ ...p, [f]: { ...p[f], [l]: v } }));
  const addMeta = () => { if (!metaInput.trim()) return; setFormData(p => ({ ...p, meta: [...p.meta, metaInput.trim()] })); setMetaInput(''); };
  const removeMeta = (i) => setFormData(p => ({ ...p, meta: p.meta.filter((_, idx) => idx !== i) }));

  if (loading) return (
    <div className="adm-loading">
      <div className="adm-spinner"></div>
      <p>Loading from GitHub...</p>
    </div>
  );

  if (editingId !== null) return (
    <div className="adm-page">
      <div className="adm-ribbon">
        <div className="adm-ribbon-left">
          <span className="adm-ribbon-title">FarmWell</span>
          <span className="adm-ribbon-badge">🔐 Admin</span>
        </div>
        <button className="adm-ribbon-btn" onClick={() => setEditingId(null)}>← Back to list</button>
      </div>
      <div className="adm-body">
        <h2 className="adm-form-title">{editingId === 'new' ? '+ New Banner' : 'Edit Banner'}</h2>

        <div className="adm-form-section">
          <label className="adm-flabel">Banner ID <span className="adm-req">*</span></label>
          <input className="adm-finput" value={formData.id} onChange={e => setField('id', e.target.value)} placeholder="ann_001" />
        </div>

        <div className="adm-form-row">
          <div className="adm-form-section">
            <label className="adm-flabel">Type</label>
            <select className="adm-fselect" value={formData.type} onChange={e => setField('type', e.target.value)}>
              <option value="outbreak">🚨 Outbreak</option>
              <option value="product">🆕 Product</option>
              <option value="tips">💡 Tips</option>
              <option value="update">📢 Update</option>
            </select>
          </div>
          <div className="adm-form-section">
            <label className="adm-flabel">Priority</label>
            <select className="adm-fselect" value={formData.priority} onChange={e => setField('priority', e.target.value)}>
              <option value="high">🔴 High</option>
              <option value="normal">🟢 Normal</option>
            </select>
          </div>
          <div className="adm-form-section">
            <label className="adm-flabel">Status</label>
            <select className="adm-fselect" value={formData.active ? 'true' : 'false'} onChange={e => setField('active', e.target.value === 'true')}>
              <option value="true">● Active</option>
              <option value="false">○ Inactive</option>
            </select>
          </div>
        </div>

        <div className="adm-form-row">
          <div className="adm-form-section">
            <label className="adm-flabel">Start Date</label>
            <input className="adm-finput" type="date" value={formData.startDate} onChange={e => setField('startDate', e.target.value)} />
          </div>
          <div className="adm-form-section">
            <label className="adm-flabel">End Date</label>
            <input className="adm-finput" type="date" value={formData.endDate} onChange={e => setField('endDate', e.target.value)} />
          </div>
          <div className="adm-form-section">
            <label className="adm-flabel">Link (route)</label>
            <input className="adm-finput" value={formData.link} onChange={e => setField('link', e.target.value)} placeholder="/poultry" />
          </div>
        </div>

        {[
          { key: 'tag', label: 'Tag badge (optional)', placeholder: '⚠ Outbreak Alert' },
          { key: 'title', label: 'Title', placeholder: 'Banner title', required: true },
          { key: 'linkLabel', label: 'CTA Button text', placeholder: 'View Guide →' },
        ].map(({ key, label, placeholder, required }) => (
          <div key={key} className="adm-ml-group">
            <label className="adm-flabel">{label} {required && <span className="adm-req">* EN required</span>}</label>
            <div className="adm-ml-row">
              {['en','id','vi'].map(l => (
                <div key={l} className="adm-ml-field">
                  <span className="adm-lang-tag">{l.toUpperCase()}</span>
                  <input className="adm-finput" value={formData[key][l]} onChange={e => setMLField(key, l, e.target.value)} placeholder={l === 'en' ? placeholder : `${placeholder} (${l.toUpperCase()})`} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="adm-ml-group">
          <label className="adm-flabel">Body <span className="adm-req">* EN required</span></label>
          <div className="adm-ml-row">
            {['en','id','vi'].map(l => (
              <div key={l} className="adm-ml-field">
                <span className="adm-lang-tag">{l.toUpperCase()}</span>
                <textarea className="adm-ftextarea" value={formData.body[l]} onChange={e => setMLField('body', l, e.target.value)} placeholder={`Body text (${l.toUpperCase()})`} rows={3} />
              </div>
            ))}
          </div>
        </div>

        <div className="adm-form-section">
          <label className="adm-flabel">Meta pills — location, strain, species (optional)</label>
          <div className="adm-meta-input-row">
            <input className="adm-finput" value={metaInput} onChange={e => setMetaInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMeta()} placeholder="e.g. 📍 Phú Thọ, Vietnam" />
            <button className="adm-btn-add-meta" onClick={addMeta}>+ Add</button>
          </div>
          <div className="adm-meta-pills">
            {formData.meta.map((m, i) => (
              <span key={i} className="adm-meta-pill">{m} <button onClick={() => removeMeta(i)}>✕</button></span>
            ))}
          </div>
        </div>

        <div className="adm-form-actions">
          <button className="adm-btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
          <button className="adm-btn-save-form" onClick={handleFormSave}>Save Banner</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="adm-page">
      <div className="adm-ribbon">
        <div className="adm-ribbon-left">
          <span className="adm-ribbon-title">FarmWell</span>
          <span className="adm-ribbon-badge">🔐 Admin</span>
        </div>
        <div className="adm-ribbon-right">
          <button className="adm-ribbon-btn" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="adm-body">
        <div className="adm-header">
          <div>
            <h1 className="adm-title">Announcement Banners</h1>
            <p className="adm-sub">Changes save to GitHub → Vercel auto-deploys in ~60 seconds</p>
          </div>
          <div className="adm-header-actions">
            {saveStatus === 'success' && <span className="adm-status adm-status--ok">✓ Saved & deployed!</span>}
            {saveStatus === 'error'   && <span className="adm-status adm-status--err">✕ Save failed — try again</span>}
            <button className="adm-btn-new" onClick={openNew}>+ New Banner</button>
            <button className="adm-btn-push" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : '🚀 Save & Deploy'}
            </button>
          </div>
        </div>

        {announcements.length === 0 && (
          <div className="adm-empty">No banners yet. Click "+ New Banner" to create one.</div>
        )}

        <div className="adm-list">
          {announcements.map(ann => (
            <div key={ann.id} className={`adm-card${!ann.active ? ' adm-card--inactive' : ''}`}>
              <div className="adm-card-top">
                <span className="adm-card-icon">{TYPE_ICONS[ann.type] || '📢'}</span>
                <div className="adm-card-info">
                  <div className="adm-card-title-row">
                    <span className="adm-card-title">{ann.title?.en || ann.id}</span>
                    <span className={`adm-type-pill adm-tp-${ann.type}`}>{TYPE_LABELS[ann.type]}</span>
                    <span className={`adm-priority-dot adm-pd-${ann.priority}`} title={ann.priority}></span>
                  </div>
                  <div className="adm-card-meta">
                    {ann.startDate && <span>📅 {ann.startDate}{ann.endDate ? ` – ${ann.endDate}` : ''}</span>}
                    {ann.link && <span>🔗 {ann.link}</span>}
                    <span>🌐 EN / ID / VI</span>
                  </div>
                </div>
                <div className="adm-card-actions">
                  <button className={`adm-btn-toggle ${ann.active ? 'adm-btn-on' : 'adm-btn-off'}`} onClick={() => toggleActive(ann.id)}>
                    {ann.active ? '● Active' : '○ Inactive'}
                  </button>
                  <button className="adm-btn-edit" onClick={() => openEdit(ann)}>✏ Edit</button>
                  <button className="adm-btn-del" onClick={() => handleDelete(ann.id)}>✕</button>
                </div>
              </div>
              <div className="adm-card-bottom">
                <span className={`adm-status-dot ${ann.active ? 'adm-sd-active' : 'adm-sd-inactive'}`}></span>
                <span className={`adm-status-txt ${ann.active ? 'adm-st-active' : 'adm-st-inactive'}`}>
                  {ann.active ? 'Showing to users now' : 'Hidden from users'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="adm-info-box">
          <span>ℹ</span>
          <span>After any changes, click <strong>"🚀 Save & Deploy"</strong> to push to GitHub. Vercel auto-deploys in ~60 seconds.</span>
        </div>
      </div>
    </div>
  );
}
