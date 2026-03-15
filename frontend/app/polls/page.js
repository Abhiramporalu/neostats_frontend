"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const COLORS = ['#f5a623', '#6366f1', '#2dd4bf', '#e84393', '#a855f7', '#f43f5e']

export default function PollPage() {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState({})
  const [voting, setVoting] = useState(null)

  useEffect(() => { fetchPolls() }, [])

  const fetchPolls = async () => {
    setLoading(true)
    const res = await axios.get("https://neoconnect-platform.onrender.com/api/polls")
    setPolls(res.data)
    setLoading(false)
  }

  const vote = async (pollId, index) => {
    setVoting(`${pollId}-${index}`)
    await axios.post("https://neoconnect-platform.onrender.com/api/polls/vote", {
      pollId, optionIndex: index, userId: "user1"
    })
    setVoted(v => ({ ...v, [pollId]: index }))
    await fetchPolls()
    setVoting(null)
  }

  if (loading) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '96px 32px', textAlign: 'center', color: 'var(--text-faint)', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
      Loading polls…
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 32px' }}>

      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: '10px',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: '10px',
        }}>Community Voice</div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: '40px', letterSpacing: '-0.03em',
        }}>Active Polls</h1>
        <p style={{
          color: 'var(--text-muted)', marginTop: '10px',
          fontFamily: "'Instrument Serif', serif", fontSize: '16px', fontStyle: 'italic',
        }}>Cast your vote and see real-time results from your colleagues.</p>
      </div>

      {polls.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '64px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '12px', color: 'var(--text-faint)',
          fontFamily: "'DM Mono', monospace", fontSize: '12px',
        }}>No active polls at the moment.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {polls.map((poll, pi) => {
          const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0)
          const hasVoted = voted[poll._id] !== undefined
          return (
            <div key={poll._id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '16px', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Poll header */}
              <div style={{
                padding: '24px 28px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: '10px',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: COLORS[pi % COLORS.length], marginBottom: '8px',
                  }}>Poll #{pi + 1}</div>
                  <h2 style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    fontSize: '20px', letterSpacing: '-0.02em',
                  }}>{poll.question}</h2>
                </div>
                <div style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  borderRadius: '6px', padding: '5px 12px',
                  fontFamily: "'DM Mono', monospace", fontSize: '10px',
                  color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '20px',
                }}>
                  {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Options */}
              <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {poll.options.map((opt, idx) => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes || 0) / totalVotes * 100) : 0
                  const isVoted = voted[poll._id] === idx
                  const color = COLORS[idx % COLORS.length]
                  const isVoting = voting === `${poll._id}-${idx}`
                  return (
                    <button
                      key={idx}
                      onClick={() => !hasVoted && vote(poll._id, idx)}
                      disabled={hasVoted || !!voting}
                      style={{
                        position: 'relative',
                        width: '100%', padding: '14px 16px',
                        background: isVoted ? `${color}10` : 'var(--bg-3)',
                        border: `1px solid ${isVoted ? color : 'var(--border)'}`,
                        borderRadius: '8px',
                        cursor: hasVoted ? 'default' : 'pointer',
                        textAlign: 'left', overflow: 'hidden',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Progress bar fill */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: hasVoted ? `${pct}%` : '0%',
                        background: `${color}18`,
                        transition: 'width 0.5s ease',
                        borderRadius: 'inherit',
                      }} />

                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {isVoted && (
                            <span style={{ color, fontSize: '12px' }}>✓</span>
                          )}
                          <span style={{
                            fontFamily: "'DM Mono', monospace", fontSize: '13px',
                            color: isVoted ? color : 'var(--text)',
                          }}>
                            {isVoting ? 'Voting…' : opt.text}
                          </span>
                        </div>
                        {hasVoted && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              fontFamily: "'DM Mono', monospace", fontSize: '11px',
                              color: 'var(--text-muted)',
                            }}>{opt.votes || 0}</span>
                            <span style={{
                              fontFamily: "'Syne', sans-serif", fontWeight: 700,
                              fontSize: '15px', color: isVoted ? color : 'var(--text-muted)',
                            }}>{pct}%</span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}

                {hasVoted && (
                  <p style={{
                    textAlign: 'center', marginTop: '4px',
                    fontFamily: "'DM Mono', monospace", fontSize: '10px',
                    letterSpacing: '0.08em', color: 'var(--text-faint)',
                    textTransform: 'uppercase',
                  }}>Vote recorded</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}