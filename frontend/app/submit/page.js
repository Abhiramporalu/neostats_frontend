"use client"

import { useState } from "react"
import axios from "axios"

const inputStyle = {
  width: '100%',
  background: 'var(--bg-3)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '14px 16px',
  color: 'var(--text)',
  fontFamily: "'DM Mono', monospace",
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const labelStyle = {
  display: 'block',
  fontFamily: "'DM Mono', monospace",
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-faint)',
  marginBottom: '6px',
}

const CATEGORIES = ['Infrastructure', 'HR', 'IT Support', 'Finance', 'Operations', 'Legal', 'Other']
const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Legal', 'Management']
const SEVERITIES = [
  { val: 'Low', color: '#2dd4bf' },
  { val: 'Medium', color: 'var(--accent)' },
  { val: 'High', color: '#f43f5e' },
  { val: 'Critical', color: '#f43f5e' },
]

export default function SubmitPage() {
  const [form, setForm] = useState({ category: '', department: '', location: '', severity: '', description: '', anonymous: false })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submitCase = async () => {
    if (!form.category || !form.department || !form.description) return
    setLoading(true)
    try {
      await axios.post("https://neoconnect-platform.onrender.com/api/cases", form)
      setSubmitted(true)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ minHeight: 'calc(100vh - 57px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        textAlign: 'center',
        padding: '64px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        maxWidth: '440px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', marginBottom: '12px' }}>Submitted</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Your complaint has been logged and assigned a tracking ID.</p>
        <button onClick={() => setSubmitted(false)} style={{
          background: 'var(--accent)', color: '#000',
          fontFamily: "'DM Mono', monospace", fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '11px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer',
        }}>Submit Another</button>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: 'calc(100vh - 57px)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '48px 32px',
      gap: '48px',
      alignItems: 'start',
    }}>

      {/* Left — Info panel */}
      <div style={{ paddingTop: '8px' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '16px',
        }}>New Complaint</div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '52px',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          marginBottom: '20px',
        }}>
          Report an<br />
          <span style={{ color: 'var(--accent)' }}>Issue</span>
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          marginBottom: '40px',
          fontFamily: "'Instrument Serif', serif",
          fontSize: '16px',
          fontStyle: 'italic',
        }}>
          All complaints are handled with confidentiality. Anonymous submissions are fully supported and untraceable.
        </p>

        {['Confidential', 'Anonymous support', 'Tracked in real-time', 'Escalation ready'].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '10px', color: 'var(--text-muted)', fontSize: '12px',
            fontFamily: "'DM Mono', monospace",
          }}>
            <span style={{ color: 'var(--accent)', fontSize: '16px' }}>—</span>
            {item}
          </div>
        ))}
      </div>

      {/* Right — Form */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '36px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Department */}
          <div>
            <label style={labelStyle}>Department</label>
            <select
              value={form.department}
              onChange={e => set('department', e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Location</label>
            <input
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="Building, floor, area…"
              style={{
                ...inputStyle,
                borderColor: focusedField === 'location' ? 'var(--accent)' : 'var(--border)',
                boxShadow: focusedField === 'location' ? '0 0 0 3px rgba(245,166,35,0.1)' : 'none',
              }}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField('')}
            />
          </div>

          {/* Severity chips */}
          <div>
            <label style={labelStyle}>Severity</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SEVERITIES.map(s => (
                <button
                  key={s.val}
                  onClick={() => set('severity', s.val)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '6px',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: form.severity === s.val ? `${s.color}22` : 'var(--bg-3)',
                    border: `1px solid ${form.severity === s.val ? s.color : 'var(--border)'}`,
                    color: form.severity === s.val ? s.color : 'var(--text-muted)',
                  }}
                >
                  {s.val}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the issue in detail…"
              rows={5}
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: '1.6',
                borderColor: focusedField === 'desc' ? 'var(--accent)' : 'var(--border)',
                boxShadow: focusedField === 'desc' ? '0 0 0 3px rgba(245,166,35,0.1)' : 'none',
              }}
              onFocus={() => setFocusedField('desc')}
              onBlur={() => setFocusedField('')}
            />
          </div>

          {/* Anonymous toggle */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', userSelect: 'none',
          }}>
            <div
              onClick={() => set('anonymous', !form.anonymous)}
              style={{
                width: '40px', height: '22px',
                background: form.anonymous ? 'var(--accent)' : 'var(--bg-3)',
                border: `1px solid ${form.anonymous ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '100px',
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                width: '16px', height: '16px',
                background: form.anonymous ? '#000' : 'var(--text-faint)',
                borderRadius: '50%',
                top: '2px',
                left: form.anonymous ? '20px' : '2px',
                transition: 'left 0.2s',
              }} />
            </div>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              color: form.anonymous ? 'var(--text)' : 'var(--text-muted)',
            }}>
              Submit anonymously
            </span>
          </label>

          {/* Submit */}
          <button
            onClick={submitCase}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? 'var(--surface-2)' : 'var(--accent)',
              color: loading ? 'var(--text-faint)' : '#000',
              border: 'none',
              borderRadius: '8px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 0 24px rgba(245,166,35,0.25)',
            }}
          >
            {loading ? 'Submitting…' : 'Submit Complaint →'}
          </button>

        </div>
      </div>

      <style>{`
        select option { background: #1c1c21; color: #f0eff5; }
      `}</style>
    </div>
  )
}