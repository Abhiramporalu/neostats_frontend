"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const STATUS_META = {
  'New':        { color: '#a5b4fc', bg: 'rgba(99,102,241,0.1)',  dot: '#6366f1' },
  'Assigned':   { color: '#c084fc', bg: 'rgba(168,85,247,0.1)', dot: '#a855f7' },
  'In Progress':{ color: '#f5a623', bg: 'rgba(245,166,35,0.1)', dot: '#f5a623' },
  'Pending':    { color: '#8888a0', bg: 'rgba(136,136,160,0.1)',dot: '#8888a0' },
  'Resolved':   { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)', dot: '#2dd4bf' },
  'Escalated':  { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',  dot: '#f43f5e' },
}

const STATUSES = Object.keys(STATUS_META)

export default function CasesPage() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [updating, setUpdating] = useState(null)

  useEffect(() => { fetchCases() }, [])

  const fetchCases = async () => {
    setLoading(true)
    const res = await axios.get("https://neoconnect-platform.onrender.com/api/cases")
    setCases(res.data)
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await axios.put(`https://neoconnect-platform.onrender.com/api/cases/${id}/status`, { status })
    await fetchCases()
    setUpdating(null)
  }

  const displayed = filter === 'All' ? cases : cases.filter(c => c.status === filter)
  const counts = cases.reduce((a, c) => ({ ...a, [c.status]: (a[c.status] || 0) + 1 }), {})

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: '10px',
        }}>Case Management</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: '40px', letterSpacing: '-0.03em',
          }}>
            All Cases
            <span style={{
              marginLeft: '16px', fontSize: '18px', fontWeight: 400,
              color: 'var(--text-muted)', letterSpacing: '0',
            }}>({cases.length})</span>
          </h1>
          <button
            onClick={fetchCases}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '8px 18px',
              color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace",
              fontSize: '11px', letterSpacing: '0.08em', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >↻ Refresh</button>
        </div>
      </div>

      {/* Stat chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {['All', ...STATUSES].map(s => {
          const meta = STATUS_META[s] || { color: 'var(--text-muted)', bg: 'var(--surface)', dot: 'var(--text-faint)' }
          const active = filter === s
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '7px 16px',
                background: active ? meta.bg : 'var(--surface)',
                border: `1px solid ${active ? meta.dot : 'var(--border)'}`,
                borderRadius: '100px',
                color: active ? meta.color : 'var(--text-muted)',
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px', letterSpacing: '0.06em',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {s !== 'All' && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: meta.dot, flexShrink: 0 }} />
              )}
              {s}
              <span style={{
                background: active ? meta.dot : 'var(--bg-3)',
                color: active ? '#000' : 'var(--text-faint)',
                borderRadius: '3px', padding: '1px 6px', fontSize: '9px',
              }}>
                {s === 'All' ? cases.length : (counts[s] || 0)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-faint)', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
            Loading cases…
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Tracking ID', 'Category', 'Department', 'Status', 'Update'].map(h => (
                  <th key={h} style={{
                    padding: '14px 20px', textAlign: 'left',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '10px', fontWeight: 500,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((c, i) => {
                const meta = STATUS_META[c.status] || STATUS_META['New']
                return (
                  <tr
                    key={c._id}
                    style={{
                      borderBottom: i < displayed.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: '12px',
                        color: 'var(--accent)', letterSpacing: '0.06em',
                      }}>
                        #{c.trackingId || c._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>
                      {c.category}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>
                      {c.department}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: meta.bg, color: meta.color,
                        border: `1px solid ${meta.dot}30`,
                        borderRadius: '4px', padding: '3px 10px',
                        fontFamily: "'DM Mono', monospace", fontSize: '10px',
                        letterSpacing: '0.08em',
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: meta.dot }} />
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        disabled={updating === c._id}
                        onChange={e => updateStatus(c._id, e.target.value)}
                        defaultValue=""
                        style={{
                          background: 'var(--bg-3)', border: '1px solid var(--border)',
                          borderRadius: '6px', padding: '7px 12px',
                          color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace",
                          fontSize: '11px', cursor: 'pointer', outline: 'none',
                          appearance: 'none', minWidth: '130px',
                          opacity: updating === c._id ? 0.5 : 1,
                        }}
                      >
                        <option value="" disabled>Set status…</option>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {!loading && displayed.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-faint)', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
            No cases found for this filter.
          </div>
        )}
      </div>

      <style>{`
        select option { background: #1c1c21; color: #f0eff5; }
      `}</style>
    </div>
  )
}