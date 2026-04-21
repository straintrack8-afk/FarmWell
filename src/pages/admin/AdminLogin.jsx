import { useState } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import './AdminLogin.css';

export default function AdminLogin({ onSuccess }) {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(password);
      if (ok) { onSuccess(); }
      else { setError('Incorrect password. Please try again.'); setPassword(''); }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="al-overlay">
      <div className="al-card">
        <div className="al-logo">
          <img src="/images/FarmWell_Logo.png" alt="FarmWell"
            style={{ height: '56px', width: 'auto' }} />
        </div>
        <div className="al-badge">🔐 Admin Panel</div>
        <h1 className="al-title">Sign in to continue</h1>
        <p className="al-desc">Access is restricted to FarmWell administrators only.</p>
        <form onSubmit={handleSubmit} className="al-form">
          <div className="al-field">
            <label className="al-label">Admin Password</label>
            <input
              type="password"
              className={`al-input${error ? ' al-input--error' : ''}`}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
            />
            {error && <p className="al-error">{error}</p>}
          </div>
          <button type="submit" className="al-btn" disabled={!password || loading}>
            {loading ? 'Verifying...' : 'Sign In →'}
          </button>
        </form>
        <p className="al-footer">
          <a href="/" className="al-back">← Back to FarmWell</a>
        </p>
      </div>
    </div>
  );
}
