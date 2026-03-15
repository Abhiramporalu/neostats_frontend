"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const STATUS_COLORS = {
  'New': '#6366f1',
  'Assigned': '#a855f7',
  'In Progress': '#f5a623',
  'Pending': '#8888a0',
  'Resolved': '#2dd4bf',
  'Escalated': '#f43f5e',
}

const BAR_COLORS = ['#f5a623', '#6366f1', '#2dd4bf', '#e84393', '#a855f7', '#f43f5e', '#38bdf8']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1c1c21', border: '1px solid #2e2e38',
      borderRadius: '8px', padding: '10px 14px',
      fontFamily: "'DM Mono', monospace", fontSize: '12px',
    }}>
      <div style={{ color: '#8888a0', marginBottom: '4px', fontSize: '10px', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ color: '#f5a623', fontWeight: 500 }}>{payload[0].value} cases</div>
    </div>
  )
}

const StatCard = ({ label, value, sub, color }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '24px 28px',
    borderLeft: `3px solid ${color || 'var(--accent)'}`,
  }}>
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: '10px',
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--text-faint)', marginBottom: '10px',
    }}>{label}</div>
    <div style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 800,
      fontSize: '36px', letterSpacing: '-0.03em', color: color || 'var(--text)',
      lineHeight: 1,
    }}>{value}</div>
    {sub && <div style={{ marginTop: '8px', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>}
  </div>
)

export default function AnalyticsPage() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCases() }, [])

  const fetchCases = async () => {
    setLoading(true)
    const res = await axios.get("https://neoconnect-platform.onrender.com/api/cases")
    setCases(res.data)
    setLoading(false)
  }

  const departmentData = Object.values(
    cases.reduce((acc, c) => {
      if (!acc[c.department]) acc[c.department] = { department: c.department, count: 0 }
      acc[c.department].count++
      return acc
    }, {})
  ).sort((a, b) => b.count - a.count)

  const statusData = Object.values(
    cases.reduce((acc, c) => {
      if (!acc[c.status]) acc[c.status] = { status: c.status, count: 0 }
      acc[c.status].count++
      return acc
    }, {})
  )

  const hotspots = Object.values(
    cases.reduce((acc, c) => {
      const key = c.department + "-" + c.category
      if (!acc[key]) acc[key] = { department: c.department, category: c.category, count: 0 }
      acc[key].count++
      return acc
    }, {})
  ).filter(h => h.count >= 5).sort((a, b) => b.count - a.count)

  const resolved = cases.filter(c => c.status === 'Resolved').length
  const escalated = cases.filter(c => c.status === 'Escalated').length
  const resRate = cases.length > 0 ? Math.round(resolved / cases.length * 100) : 0

  if (loading) return (
    <div style={{ padding: '96px 32px', textAlign: 'center', color: 'var(--text-faint)', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
      Loading analytics…
    </div>
  )

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: '10px',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: '10px',
        }}>Live Data</div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: '40px', letterSpacing: '-0.03em',
        }}>Analytics</h1>
      </div>

      {/* Hotspot alert */}
      {hotspots.length > 0 && (
        <div style={{
          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)',
          borderRadius: '10px', padding: '16px 20px', marginBottom: '28px',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>⚠</span>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '14px', color: '#f43f5e', marginBottom: '4px' }}>
              Hotspot Alert — {hotspots.length} pattern{hotspots.length > 1 ? 's' : ''} detected
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)' }}>
              {hotspots.map(h => `${h.department} / ${h.category} (${h.count})`).join(' · ')}
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '40px',
      }}>
        <StatCard label="Total Cases" value={cases.length} color="var(--accent)" />
        <StatCard label="Resolved" value={resolved} sub={`${resRate}% resolution rate`} color="#2dd4bf" />
        <StatCard label="Escalated" value={escalated} color="#f43f5e" />
        <StatCard label="Departments" value={departmentData.length} color="#6366f1" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Bar chart */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px',
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: '10px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text-faint)', marginBottom: '6px',
          }}>Volume</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em', marginBottom: '24px' }}>
            Cases by Department
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentData} barSize={24}>
              <XAxis
                dataKey="department"
                tick={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: '#8888a0' }}
                axisLine={{ stroke: '#2e2e38' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: '#8888a0' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,166,35,0.05)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {departmentData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px',
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: '10px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text-faint)', marginBottom: '6px',
          }}>Distribution</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Cases by Status
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <ResponsiveContainer width="60%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status] || BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [v, n]}
                  contentStyle={{
                    background: '#1c1c21', border: '1px solid #2e2e38',
                    borderRadius: '8px', fontFamily: "'DM Mono', monospace", fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {statusData.map((s, i) => {
                const color = STATUS_COLORS[s.status] || BAR_COLORS[i % BAR_COLORS.length]
                const pct = cases.length > 0 ? Math.round(s.count / cases.length * 100) : 0
                return (
                  <div key={s.status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', flex: 1 }}>{s.status}</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color }}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hotspot table */}
      {hotspots.length > 0 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em' }}>
              Hotspot Clusters
            </h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Department', 'Category', 'Count', 'Severity'].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left',
                    fontFamily: "'DM Mono', monospace", fontSize: '10px',
                    fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hotspots.map((h, i) => (
                <tr key={i} style={{ borderBottom: i < hotspots.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>{h.department}</td>
                  <td style={{ padding: '14px 20px', fontFamily: "'DM Mono', monospace", fontSize: '13px', color: 'var(--text-muted)' }}>{h.category}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: '18px', color: '#f43f5e',
                    }}>{h.count}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{
                      width: `${Math.min(h.count / hotspots[0].count * 100, 100)}%`,
                      minWidth: '30px', maxWidth: '200px',
                      height: '6px', background: '#f43f5e',
                      borderRadius: '3px', opacity: 0.6 + (i === 0 ? 0.4 : 0),
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}