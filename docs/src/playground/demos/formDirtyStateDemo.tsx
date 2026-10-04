import React, { useState, useEffect } from 'react';
import { useFormDirtyState } from '@pareeshy/form-dirty-state';
import { PlaygroundDemoProps } from '../types';

interface FormSchema {
  username: string;
  email: string;
  role: string;
  bio: string;
}

const INITIAL_DATA: FormSchema = {
  username: 'pareesh_dev',
  email: 'pareesh@example.com',
  role: 'Engineer',
  bio: 'Building modular production frontend libraries.'
};

export function FormDirtyStateDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [formData, setFormData] = useState<FormSchema>(INITIAL_DATA);
  const { isDirty, dirtyFields, resetBaseline } = useFormDirtyState<FormSchema>(
    formData,
    INITIAL_DATA,
    {
      warnOnBeforeUnload: false
    }
  );

  useEffect(() => {
    setFormData(INITIAL_DATA);
    resetBaseline(INITIAL_DATA);
    log('info', 'Initialized @pareeshy/form-dirty-state with deep diff tracking');
  }, [resetKey]);

  useEffect(() => {
    if (isDirty) {
      log('warning', `Form is DIRTY! Modified fields: [${dirtyFields.join(', ')}]`);
    } else {
      log('info', 'Form is CLEAN (Matches baseline values)');
    }
  }, [isDirty, dirtyFields.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Dirty Status Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isDirty ? 'rgba(217, 119, 6, 0.1)' : 'var(--success-bg)',
          border: `1px solid ${isDirty ? 'rgba(217, 119, 6, 0.3)' : 'var(--success-border)'}`
        }}
      >
        <div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.9rem',
              color: isDirty ? 'var(--warning)' : 'var(--success)'
            }}
          >
            {isDirty ? '⚠️ FORM HAS UNSAVED CHANGES' : '✓ ALL CHANGES SAVED (PRISTINE)'}
          </span>
          {isDirty && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Dirty Fields: {dirtyFields.map((f) => `"${String(f)}"`).join(', ')}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => {
              resetBaseline(formData);
              log('success', 'Saved form! Reset baseline to current values.');
            }}
            disabled={!isDirty}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: isDirty ? 'pointer' : 'not-allowed',
              opacity: isDirty ? 1 : 0.5
            }}
          >
            Save (Update Baseline)
          </button>
          <button
            onClick={() => {
              setFormData(INITIAL_DATA);
              log('info', 'Discarded changes back to initial state');
            }}
            disabled={!isDirty}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg-subtle)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: isDirty ? 'pointer' : 'not-allowed',
              opacity: isDirty ? 1 : 0.5
            }}
          >
            Discard
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}
      >
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Username{' '}
            {dirtyFields.includes('username') && <span style={{ color: 'var(--warning)' }}>*</span>}
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${dirtyFields.includes('username') ? 'var(--warning)' : 'var(--stripe-border)'}`,
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)'
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Email{' '}
            {dirtyFields.includes('email') && <span style={{ color: 'var(--warning)' }}>*</span>}
          </label>
          <input
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${dirtyFields.includes('email') ? 'var(--warning)' : 'var(--stripe-border)'}`,
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)'
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Role{' '}
            {dirtyFields.includes('role') && <span style={{ color: 'var(--warning)' }}>*</span>}
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${dirtyFields.includes('role') ? 'var(--warning)' : 'var(--stripe-border)'}`,
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)'
            }}
          >
            <option value="Engineer">Engineer</option>
            <option value="Designer">Designer</option>
            <option value="Product Manager">Product Manager</option>
          </select>
        </div>
      </div>

      <div>
        <label
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-head)',
            display: 'block',
            marginBottom: 4
          }}
        >
          Bio {dirtyFields.includes('bio') && <span style={{ color: 'var(--warning)' }}>*</span>}
        </label>
        <textarea
          rows={2}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${dirtyFields.includes('bio') ? 'var(--warning)' : 'var(--stripe-border)'}`,
            backgroundColor: 'var(--stripe-bg)',
            color: 'var(--text-head)'
          }}
        />
      </div>
    </div>
  );
}
