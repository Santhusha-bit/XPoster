import { User, Sparkles, Layers, Send, Calendar, Clock, ArrowRight } from 'lucide-react'
import { BEST_TIMES } from '../lib/constants'
import s from './GuideTab.module.css'

const STEPS = [
  { icon: User,     num: '01', title: 'Set up your profile',   body: 'Fill in your background, expertise, tone, and topics. Every post will sound authentically like you, not a generic AI.' },
  { icon: Sparkles, num: '02', title: 'Generate posts daily',  body: 'Hit Generate Posts each day. AI uses web search to find trending topics, then crafts 3 viral-format posts tailored to your niche.' },
  { icon: Layers,   num: '03', title: 'Pick your format',      body: 'Choose from 6 proven viral formats including Hook + List, Contrarian Take, Story Arc, Number + Insight, Then vs Now, and Question Hook.' },
  { icon: Send,     num: '04', title: 'Post or queue',         body: 'Click "Post to X" to copy and open compose. Or add to your queue, schedule a time, and batch post later.' },
  { icon: Calendar, num: '05', title: 'Track your streak',     body: 'Click "Mark posted" after each post goes live. This logs your history and builds your posting streak shown in the sidebar.' },
]

const FORMATS = [
  { name: 'Hook + List',     best: 'Educational content and saves' },
  { name: 'Contrarian Take', best: 'Replies and debate' },
  { name: 'Story Arc',       best: 'Personal brand building' },
  { name: 'Number + Insight',best: 'Establishing authority' },
  { name: 'Then vs Now',     best: 'Trend commentary' },
  { name: 'Question Hook',   best: 'Maximizing engagement rate' },
]

export default function GuideTab() {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>How to use X Poster</h1>
        <p className={s.subtitle}>Get consistent, viral-ready content on X every single day.</p>
      </div>

      <div className={s.stepsCard}>
        {STEPS.map(({ icon: Icon, num, title, body }, i) => (
          <div key={num} className={s.step}>
            <div className={s.stepLeft}>
              <div className={s.stepIconWrap}><Icon size={16} strokeWidth={2} /></div>
              {i < STEPS.length - 1 && <div className={s.stepLine} />}
            </div>
            <div className={s.stepBody}>
              <span className={s.stepNum}>{num}</span>
              <h3 className={s.stepTitle}>{title}</h3>
              <p className={s.stepText}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={s.timingCard}>
        <div className={s.timingHeader}>
          <Clock size={14} />
          Best times to post on X
        </div>
        <div className={s.timingGrid}>
          {BEST_TIMES.map(({ label, time, note }) => (
            <div key={label} className={s.timingItem}>
              <p className={s.timingLabel}>{label}</p>
              <p className={s.timingTime}>{time}</p>
              <p className={s.timingNote}>{note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={s.formatsCard}>
        <h2 className={s.formatsTitle}>When to use each format</h2>
        <div className={s.formatsGrid}>
          {FORMATS.map(({ name, best }) => (
            <div key={name} className={s.formatItem}>
              <div className={s.formatArrow}><ArrowRight size={11} /></div>
              <div>
                <p className={s.formatName}>{name}</p>
                <p className={s.formatBest}>Best for: {best}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
