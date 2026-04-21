import React, { useState, useEffect } from 'react';
import { getColorRange } from '../data/colorChickenRangeData';
import { BROILER_RANGE } from '../data/broilerRangeData';

export default function DailyEntry({ flock, history, onSave, onClose, t, module, variant, sex, initialDay, initialData }) {
  const rangeData=(module==='color_chicken')?getColorRange(variant||'choi',sex||'male'):BROILER_RANGE;
  const maxDay=rangeData.length>0?rangeData[rangeData.length-1].day:56;
  const calcCurrentDay = () => {
    const placed = new Date(flock.placement_date);
    const today = new Date();
    const diff = Math.floor((today - placed) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(diff, 1), maxDay);
  };

  const [selectedDay, setSelectedDay] = useState(initialDay || calcCurrentDay());
  const [bwInput, setBwInput] = useState(initialData?.bw_actual_g || '');
  const [feedInput, setFeedInput] = useState(initialData?.feed_actual_g || '');
  const [mortality, setMortality] = useState(initialData?.mortality || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const std = rangeData.find(r => r.day === selectedDay) || null;
  const week = std ? std.week : Math.ceil(selectedDay / 7);

  const cumMortality = history.reduce((sum, h) => sum + (h.mortality || 0), 0);

  useEffect(() => {
    const existing = history.find(h => h.day === selectedDay);
    if (existing) {
      setBwInput(existing.bw_actual_g || '');
      setFeedInput(existing.feed_actual_g || '');
      setMortality(existing.mortality || '');
      setNotes(existing.notes || '');
    } else {
      setBwInput('');
      setFeedInput('');
      setMortality('');
      setNotes('');
    }
  }, [selectedDay, history]);

  const bwDiff = bwInput && std ? parseInt(bwInput) - std.bw_avg : null;
  const getBwStatus = (bw, s) => {
    if (!s || !bw) return null;
    if (bw < s.bw_low_alert) return 'below';
    if (bw > s.bw_high_alert) return 'above';
    return 'on_track';
  };
  const bwStatus = getBwStatus(parseInt(bwInput), std);

  const handleSave = () => {
    if (!bwInput) return;
    onSave({
      day: selectedDay,
      week: week,
      entry_date: new Date().toISOString().split('T')[0],
      bw_actual_g: parseInt(bwInput),
      feed_actual_g: parseInt(feedInput) || null,
      mortality: parseInt(mortality) || 0,
      notes: notes,
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--fw-card)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>

        <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', color: 'var(--fw-text)' }}>
          {t('farmguide.inputDay') || 'Input Data'}
        </h2>
        <p style={{ color: 'var(--fw-sub)', marginBottom: '16px', fontSize: '0.875rem' }}>{flock.name}</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
            {t('farmguide.dayInput') || 'Hari ke-'}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="number"
              min="1"
              max={maxDay}
              value={selectedDay}
              onChange={e => {
                const v = Math.min(maxDay, Math.max(1, parseInt(e.target.value) || 1));
                setSelectedDay(v);
              }}
              style={{
                width: '120px',
                padding: '10px',
                fontSize: '20px',
                fontWeight: '700',
                textAlign: 'center',
                border: '2px solid var(--fw-teal)',
                borderRadius: '8px'
              }}
            />
            <span style={{ color: 'var(--fw-sub)', fontSize: '14px' }}>
              {t('farmguide.week')} {week} · DOC + {selectedDay} {t('farmguide.days')}
            </span>
          </div>
        </div>

        {std && (
          <div style={{
            background: '#F0FAF8',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '6px', color: 'var(--fw-teal)' }}>
              📋 {t('farmguide.stdReference') || 'Referensi Standar'} {t('farmguide.day')} {selectedDay}
            </div>
            <div>🐔 BW Range: <strong>{std.bw_low_alert}–{std.bw_high_alert} g</strong> (avg {std.bw_avg})</div>
            <div>🌾 {t('farmguide.feedPerDay') || 'Feed/hari'}: <strong>{std.feed_min}–{std.feed_max} g</strong> (avg {std.feed_avg})</div>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
            {t('farmguide.bwActual') || 'BW Aktual (g/ekor)'}
          </label>
          <input
            type="number"
            value={bwInput}
            onChange={e => setBwInput(e.target.value)}
            placeholder={std ? 'Target: ' + std.bw_low_alert + '–' + std.bw_high_alert + 'g (avg ' + std.bw_avg + ')' : 'Enter BW'}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--fw-border)',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {std && <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--fw-sub)' }}>
            Target Range: {std.bw_low_alert}–{std.bw_high_alert}g (avg {std.bw_avg}g)
          </p>}
          {bwDiff !== null && (
            <p style={{
              color: bwStatus === 'on_track' ? '#10b981' : 'var(--fw-orange)',
              fontWeight: '600',
              marginTop: '4px',
              fontSize: '0.875rem'
            }}>
              {bwDiff >= 0 ? '+' : ''}{bwDiff}g from avg {bwStatus === 'on_track' ? '✓ In Range' : bwStatus === 'below' ? '⚠ Below Range' : '↑ Above Range'}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
            {t('farmguide.feedActual') || 'Feed Aktual (g/ekor/hari)'}
          </label>
          <input
            type="number"
            value={feedInput}
            onChange={e => setFeedInput(e.target.value)}
            placeholder={std ? 'Target: ' + std.feed_min + '–' + std.feed_max + 'g (avg ' + std.feed_avg + ')' : 'g/bird/day'}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--fw-border)',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {std && feedInput && (
            <p style={{ color: 'var(--fw-sub)', fontSize: '12px', marginTop: '4px' }}>
              Diff: {parseInt(feedInput) - std.feed_avg > 0 ? '+' : ''}{parseInt(feedInput) - std.feed_avg}g from avg
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
            {t('farmguide.mortality') || 'Mortalitas Hari Ini (ekor)'}
          </label>
          <input
            type="number"
            value={mortality}
            onChange={e => setMortality(e.target.value)}
            placeholder="0"
            min="0"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--fw-border)',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          <p style={{ color: 'var(--fw-sub)', fontSize: '12px', marginTop: '4px' }}>
            {t('farmguide.totalMortality')}: {cumMortality + (parseInt(mortality) || 0)}
            ({(((cumMortality + (parseInt(mortality) || 0)) / flock.initial_pop) * 100).toFixed(2)}%)
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--fw-text)' }}>
            {t('farmguide.notes') || 'Catatan'} ({t('farmguide.optional') || 'opsional'})
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t('farmguide.notesPlaceholder') || 'Observations, special events, etc.'}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--fw-border)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={handleSave}
            disabled={!bwInput}
            style={{
              flex: 1,
              padding: '12px',
              background: bwInput ? 'var(--fw-teal)' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: bwInput ? 'pointer' : 'not-allowed',
              fontSize: '1rem'
            }}
          >
            {initialData ? (t('farmguide.update') || 'Update Entry') : (t('farmguide.saveEntry') || 'Save Entry')}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: '1px solid var(--fw-border)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {t('farmguide.cancel')}
          </button>
        </div>

      </div>
    </div>
  );
}
