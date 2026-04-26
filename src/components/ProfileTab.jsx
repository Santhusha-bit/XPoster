import { useState } from 'react'
import { Check } from 'lucide-react'
import { TONE_OPTIONS, TOPIC_SUGGESTIONS } from '../lib/constants'
import s from './ProfileTab.module.css'

export default function ProfileTab({ profile, profileSaved, onSave }) {
  const [form, setForm] = useState({ ...profile })
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const toggleTopic = t => {
    const next = form.topics.includes(t) ? form.topics.filter(x => x !== t) : [...form.topics, t]
    set('topics', next)
  }

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Your Profile</h1>
        <p className={s.subtitle}>The more context you give, the more posts sound like you.</p>
      </div>

      <div className={s.form}>
        <div className={s.row}>
          <div className={s.field}>
            <label className={s.label}>Full name</label>
            <input className={s.input} placeholder="Alex Chen" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>X handle <span className={s.hint}>(without @)</span></label>
            <div className={s.prefixWrap}>
              <span className={s.prefix}>@</span>
              <input className={`${s.input} ${s.prefixed}`} placeholder="alexchen" value={form.handle} onChange={e => set('handle', e.target.value)} />
            </div>
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Background and expertise</label>
          <p className={s.fieldHint}>Be specific. Mention your job, achievements, passions, and what you have built.</p>
          <textarea
            className={`${s.input} ${s.textarea}`}
            placeholder="I am a software engineer at a Series B startup, former Stanford AI Lab researcher. I built 3 products, one reached 50k users. I care deeply about AI safety and developer tools."
            value={form.background}
            onChange={e => set('background', e.target.value)}
          />
        </div>

        <div className={s.field}>
          <label className={s.label}>Your niche</label>
          <input
            className={s.input}
            placeholder="AI product development, indie hacking, founder of @YourStartup"
            value={form.niche}
            onChange={e => set('niche', e.target.value)}
          />
        </div>

        <div className={s.field}>
          <label className={s.label}>Writing tone</label>
          <div className={s.chips}>
            {TONE_OPTIONS.map(t => (
              <button
                key={t}
                className={`${s.chip} ${form.tone === t ? s.chipActive : ''}`}
                onClick={() => set('tone', t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Topic areas</label>
          <div className={s.topics}>
            {TOPIC_SUGGESTIONS.map(t => (
              <button
                key={t}
                className={`${s.topicChip} ${form.topics.includes(t) ? s.topicActive : ''}`}
                onClick={() => toggleTopic(t)}
              >
                {form.topics.includes(t) && <Check size={11} />}
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className={s.saveRow}>
          <button className={s.saveBtn} onClick={handleSave}>
            {saved ? <><Check size={15} />Saved</> : 'Save Profile'}
          </button>
          {saved && <span className={s.savedMsg}>Profile saved. Posts will now be tailored to you.</span>}
          {profileSaved && !saved && <span className={s.activeMsg}>Profile is active</span>}
        </div>
      </div>
    </div>
  )
}
