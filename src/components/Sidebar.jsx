import { useState } from 'react'
import { Sparkles, ListVideo, User, BookOpen, Zap, LayoutDashboard, Flame, X, Menu } from 'lucide-react'
import s from './Sidebar.module.css'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'generate',  label: 'Generate',   icon: Sparkles },
  { id: 'queue',     label: 'Queue',      icon: ListVideo },
  { id: 'profile',   label: 'Profile',    icon: User },
  { id: 'guide',     label: 'Guide',      icon: BookOpen },
]

export default function Sidebar({ tab, setTab, profileSaved, handle, queueCount, streak, totalPosted }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (
    <nav className={s.nav}>
      {NAV.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`${s.navBtn} ${tab === id ? s.active : ''}`}
          onClick={() => { setTab(id); setMobileOpen(false) }}
        >
          <Icon size={16} strokeWidth={tab === id ? 2.5 : 2} />
          <span>{label}</span>
          {id === 'queue' && queueCount > 0 && (
            <span className={s.badge}>{queueCount}</span>
          )}
        </button>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className={s.mobileBar}>
        <div className={s.mobileLogo}>
          <div className={s.logoIcon}><Zap size={14} strokeWidth={2.5} /></div>
          <span className={s.logoName}>X Poster</span>
        </div>
        <button className={s.menuBtn} onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && <div className={s.overlay} onClick={() => setMobileOpen(false)} />}
      <div className={`${s.mobileDrawer} ${mobileOpen ? s.drawerOpen : ''}`}>
        <div className={s.logo}>
          <div className={s.logoIcon}><Zap size={16} strokeWidth={2.5} /></div>
          <div>
            <div className={s.logoName}>X Poster</div>
            <div className={s.logoSub}>AI content engine</div>
          </div>
        </div>
        {profileSaved && (
          <div className={s.profilePill}>
            <span className={s.profileDot} />
            @{handle || 'you'}
          </div>
        )}
        {nav}
        <div className={s.stats}>
          <div className={s.stat}>
            <Flame size={13} className={s.statIcon} />
            <div>
              <div className={s.statVal}>{streak}</div>
              <div className={s.statLbl}>day streak</div>
            </div>
          </div>
          <div className={s.statDiv} />
          <div className={s.stat}>
            <Sparkles size={13} className={s.statIcon} />
            <div>
              <div className={s.statVal}>{totalPosted}</div>
              <div className={s.statLbl}>published</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className={s.sidebar}>
        <div className={s.logo}>
          <div className={s.logoIcon}><Zap size={16} strokeWidth={2.5} /></div>
          <div>
            <div className={s.logoName}>X Poster</div>
            <div className={s.logoSub}>AI content engine</div>
          </div>
        </div>

        {profileSaved && (
          <div className={s.profilePill}>
            <span className={s.profileDot} />
            @{handle || 'you'}
          </div>
        )}

        {nav}

        <div className={s.stats}>
          <div className={s.stat}>
            <Flame size={13} className={s.statIcon} />
            <div>
              <div className={s.statVal}>{streak}</div>
              <div className={s.statLbl}>day streak</div>
            </div>
          </div>
          <div className={s.statDiv} />
          <div className={s.stat}>
            <Sparkles size={13} className={s.statIcon} />
            <div>
              <div className={s.statVal}>{totalPosted}</div>
              <div className={s.statLbl}>published</div>
            </div>
          </div>
        </div>

        <div className={s.tip}>
          <p className={s.tipTitle}>Pro tip</p>
          <p className={s.tipText}>Use Buffer or Typefully to schedule posts automatically.</p>
        </div>
      </aside>
    </>
  )
}
