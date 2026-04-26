import { useState, useEffect, useRef } from 'react'
import { X, ExternalLink, Plus } from 'lucide-react'
import s from './EditModal.module.css'

export default function EditModal({ post, profile, onClose, onSave, onPostToX }) {
  const [text, setText] = useState(post.content)
  const taRef = useRef(null)

  useEffect(() => {
    taRef.current?.focus()
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  const charOk = text.length <= 280
  const barPct = Math.min((text.length / 280) * 100, 100)
  const barColor = text.length > 265 ? '#d97706' : text.length > 220 ? '#5b4cff' : '#059669'

  const handlePostToX = () => {
    navigator.clipboard.writeText(text)
    window.open('https://x.com/compose/tweet', '_blank')
    onClose()
  }

  const handleSaveToQueue = () => {
    onSave({ ...post, content: text })
    onClose()
  }

  return (
    <div className={s.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={s.modal}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <div className={s.avatar}>{(profile?.name || 'Y')[0].toUpperCase()}</div>
            <div>
              <span className={s.authorName}>{profile?.name || 'Your Name'}</span>
              <span className={s.authorHandle}>@{profile?.handle || 'yourhandle'}</span>
            </div>
          </div>
          <button className={s.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <textarea
          ref={taRef}
          className={s.textarea}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What is happening?"
        />

        <div className={s.footer}>
          <div className={s.charArea}>
            <div className={s.charBar}>
              <div className={s.charFill} style={{ width: `${barPct}%`, background: barColor }} />
            </div>
            <span className={s.charCount} style={{ color: !charOk ? '#d97706' : 'var(--faint)' }}>
              {text.length}/280
            </span>
          </div>
          <div className={s.actions}>
            <button className={s.queueBtn} onClick={handleSaveToQueue}>
              <Plus size={13} />
              Add to queue
            </button>
            <button className={s.postBtn} onClick={handlePostToX}>
              <ExternalLink size={13} />
              Post to X
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
