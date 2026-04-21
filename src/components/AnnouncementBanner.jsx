import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import './AnnouncementBanner.css';

const STORAGE_KEY = 'farmwell_dismissed_announcements';

function getDismissed() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveDismissed(id) {
  const current = getDismissed();
  if (!current.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  }
}

export default function AnnouncementBanner() {
  const { language } = useTranslation();
  const lang = language || 'id';
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(getDismissed());

  useEffect(() => {
    fetch('/data/announcements.json')
      .then(r => r.json())
      .then(data => {
        const today = new Date().toISOString().split('T')[0];
        const active = data.filter(ann =>
          ann.active &&
          (!ann.startDate || ann.startDate <= today) &&
          (!ann.endDate   || ann.endDate   >= today)
        );
        setAnnouncements(active);
      })
      .catch(() => {});
  }, []);

  const visible = announcements.filter(ann => !dismissed.includes(ann.id));
  if (visible.length === 0) return null;

  const ann = visible[0];
  const tag       = ann.tag?.[lang]       || ann.tag?.en       || null;
  const title     = ann.title?.[lang]     || ann.title?.en     || '';
  const body      = ann.body?.[lang]      || ann.body?.en      || '';
  const linkLabel = ann.linkLabel?.[lang] || ann.linkLabel?.en || '';
  const meta      = ann.meta || [];

  const handleDismiss = () => {
    saveDismissed(ann.id);
    setDismissed(getDismissed());
  };

  const handleLink = () => {
    if (ann.link) navigate(ann.link);
    handleDismiss();
  };

  return (
    <div className={`ann-banner ann-banner--${ann.type} ann-banner--${ann.priority}`}>
      <div className="ann-content">
        <span className="ann-type-icon">
          {ann.type === 'outbreak' ? '🚨' :
           ann.type === 'product'  ? '🆕' :
           ann.type === 'tips'     ? '💡' : '📢'}
        </span>
        <div className="ann-text">
          {tag && <span className="ann-tag">{tag}</span>}
          <p className="ann-title">{title}</p>
          {meta.length > 0 && (
            <div className="ann-meta">
              {meta.map((m, i) => <span key={i} className="ann-meta-pill">{m}</span>)}
            </div>
          )}
          <p className="ann-body">{body}</p>
          {ann.link && (
            <button className="ann-link-btn" onClick={handleLink}>{linkLabel}</button>
          )}
        </div>
      </div>
      <button className="ann-close" onClick={handleDismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}
