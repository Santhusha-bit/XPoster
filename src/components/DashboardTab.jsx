import { useState } from 'react'
import { Flame, Sparkles, ListVideo, Heart, Copy, Check, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import s from './DashboardTab.module.css'

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className={s.statCard}>
      <div className={s.statIcon} style={{ background: color + '18', color }}>
        <Icon size={17} strokeWidth={2} />
      </div>
      <div className={s.statVal}>{value}</div>
      <div className={s.statLbl}>{label}</div>
    </div>
  )
}

function HeatMap({ history }) {
  const today = new Date()
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (34 - i))
    const key = d.toISOString().split('T')[0]
    const count = history.filter(h => h.postedDate === key).length
    return { key, count }
  })
  const max = Math.max(...cells.map(c => c.count), 1)
  return (
    <div className={s.heatMap}>
      {cells.map(c => (
        <div
          key={c.key}
          className={s.heatCell}
          title={`${c.key}: ${c.count} post${c.count !== 1 ? 's' : ''}`}
          style={{
            background: c.count === 0 ? 'var(--border)' : `rgba(91,76,255,${.2 + (c.count / max) * .8})`
          }}
        />
      ))}
    </div>
  )
}

export default function DashboardTab({
  profile, profileSaved, streak, totalPosted, postsThisWeek,
  history, queue, setTab, toggleHistoryLike
}) {
  const [copiedId, setCopiedId] = useState(null)

  const firstName = profile?.name?.split(' ')[0] || null

  const repostToX = (h) => {
    navigator.clipboard.writeText(h.content)
    window.open('https://x.com/compose/tweet', '_blank')
  }

  const copyPost = (h) => {
    navigator.clipboard.writeText(h.content)
    setCopiedId(h.historyId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>
            {firstName ? `Hey, ${firstName}` : 'Dashboard'}
          </h1>
          <p className={s.subtitle}>
            {streak.count > 0
              ? `${streak.count}-day streak. Keep posting.`
              : 'Start publishing to build your streak.'}
          </p>
        </div>
        <button className={s.cta} onClick={() => setTab('generate')}>
          <Sparkles size={14} />
          Generate posts
          <ArrowRight size={14} />
        </button>
      </div>

      {!profileSaved && (
        <div className={s.setupBanner}>
          <div>
            <p className={s.setupTitle}>Complete your profile first</p>
            <p className={s.setupText}>Your background makes every post sound authentically like you.</p>
          </div>
          <button className={s.setupBtn} onClick={() => setTab('profile')}>Set up profile</button>
        </div>
      )}

      <div className={s.statsGrid}>
        <StatCard icon={Flame}       value={streak.count}   label="Day streak"    color="#f97316" />
        <StatCard icon={TrendingUp}  value={postsThisWeek}  label="This week"     color="#5b4cff" />
        <StatCard icon={Sparkles}    value={totalPosted}    label="All time"      color="#059669" />
        <StatCard icon={ListVideo}   value={queue.length}   label="In queue"      color="#0ea5e9" />
      </div>

      <div className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Activity</h2>
          <span className={s.sectionSub}>Last 35 days</span>
        </div>
        <div className={s.card}>
          <HeatMap history={history} />
          <div className={s.heatLegend}>
            <span>Less</span>
            {[.2, .4, .65, .9].map(o => (
              <div key={o} className={s.legendDot} style={{ background: `rgba(91,76,255,${o})` }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {queue.length > 0 && (
        <div className={s.section}>
          <div className={s.sectionHead}>
            <h2 className={s.sectionTitle}>Up next</h2>
            <button className={s.sectionLink} onClick={() => setTab('queue')}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className={s.card} style={{ padding: 0, overflow: 'hidden' }}>
            {queue.slice(0, 3).map((post, i) => (
              <div key={post.queueId} className={s.queueRow}>
                <span className={s.queueNum}>{i + 1}</span>
                <div className={s.queueBody}>
                  <p className={s.queueText}>
                    {post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}
                  </p>
                  <div className={s.queueMeta}>
                    <span className={s.badge}>{post.format}</span>
                    {post.scheduledTime && (
                      <span className={s.queueTime}><Calendar size={10} />{post.scheduledTime}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Post history</h2>
          <span className={s.sectionSub}>{history.length} published</span>
        </div>

        {history.length === 0 ? (
          <div className={s.emptyCard}>
            <p className={s.emptyTitle}>Nothing published yet</p>
            <p className={s.emptyText}>Posts you mark as published from the queue will appear here.</p>
          </div>
        ) : (
          <div className={s.card} style={{ padding: 0, overflow: 'hidden' }}>
            {history.slice(0, 8).map(h => (
              <div key={h.historyId} className={s.historyRow}>
                <div className={s.historyTop}>
                  <span className={s.badge}>{h.format}</span>
                  <span className={s.historyDate}>{h.postedAt}</span>
                  <div className={s.historyActions}>
                    <button
                      className={`${s.likeBtn} ${h.liked ? s.liked : ''}`}
                      onClick={() => toggleHistoryLike(h.historyId)}
                    >
                      <Heart size={12} fill={h.liked ? 'currentColor' : 'none'} />
                    </button>
                    <button className={s.iconBtn} onClick={() => copyPost(h)}>
                      {copiedId === h.historyId ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                    <button className={s.repostBtn} onClick={() => repostToX(h)}>Repost</button>
                  </div>
                </div>
                <p className={s.historyContent}>{h.content.slice(0, 180)}{h.content.length > 180 ? '...' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
