import { useState } from 'react'
import { ExternalLink, Trash2, Check, Inbox, Sparkles, Clock, ChevronDown } from 'lucide-react'
import { SCHEDULE_SLOTS } from '../lib/constants'
import { useToast } from '../lib/toast'
import s from './QueueTab.module.css'

function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={s.pickerWrap}>
      <button
        className={`${s.pickerBtn} ${value ? s.pickerSet : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <Clock size={11} />
        {value || 'Schedule'}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className={s.pickerDrop}>
          <button className={s.pickerOpt} onClick={() => { onChange(null); setOpen(false) }}>
            No time
          </button>
          {SCHEDULE_SLOTS.map(slot => (
            <button
              key={slot}
              className={`${s.pickerOpt} ${value === slot ? s.pickerOptActive : ''}`}
              onClick={() => { onChange(slot); setOpen(false) }}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function QueueTab({ queue, removeFromQueue, clearQueue, updateQueueItem, markPosted, setTab }) {
  const [postedId, setPostedId] = useState(null)
  const toast = useToast()

  const handleMark = (post) => {
    setPostedId(post.queueId)
    setTimeout(() => { markPosted(post); setPostedId(null); toast('Post marked as published. Streak updated!', 'success') }, 500)
  }

  const handleClear = () => { clearQueue(); toast('Queue cleared', 'info', 2000) }

  const sorted = [...queue].sort((a, b) => {
    if (!a.scheduledTime && !b.scheduledTime) return 0
    if (!a.scheduledTime) return 1
    if (!b.scheduledTime) return -1
    return a.scheduledTime.localeCompare(b.scheduledTime)
  })

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Post Queue</h1>
          <p className={s.subtitle}>
            {queue.length === 0 ? 'No posts queued' : `${queue.length} post${queue.length === 1 ? '' : 's'} ready`}
          </p>
        </div>
        {queue.length > 0 && (
          <button className={s.clearBtn} onClick={handleClear}><Trash2 size={13} />Clear all</button>
        )}
      </div>

      {queue.length === 0 ? (
        <div className={s.empty}>
          <div className={s.emptyIcon}><Inbox size={28} strokeWidth={1.5} /></div>
          <p className={s.emptyTitle}>Queue is empty</p>
          <p className={s.emptyText}>Generate posts and add them here to build your content calendar.</p>
          <button className={s.goGenBtn} onClick={() => setTab('generate')}>
            <Sparkles size={14} />Generate posts
          </button>
        </div>
      ) : (
        <>
          <div className={s.tip}>
            <strong>Tip:</strong> Set a time on each post, paste into Buffer or Typefully, then click "Mark posted" after publishing to track your streak.
          </div>
          <div className={s.list}>
            {sorted.map((post, i) => (
              <div
                key={post.queueId}
                className={`${s.item} ${postedId === post.queueId ? s.itemGone : ''}`}
              >
                <div className={s.itemLeft}>
                  <div className={s.itemNum}>{i + 1}</div>
                </div>
                <div className={s.itemBody}>
                  <div className={s.itemTop}>
                    <TimePicker
                      value={post.scheduledTime}
                      onChange={t => updateQueueItem(post.queueId, { scheduledTime: t })}
                    />
                    <span className={s.fmtBadge}>{post.format}</span>
                    <span className={s.dateText}>Added {post.addedAt}</span>
                  </div>
                  <p className={s.itemContent}>{post.content}</p>
                  <div className={s.itemActions}>
                    <button className={s.xBtn} onClick={() => { navigator.clipboard.writeText(post.content); window.open('https://x.com/compose/tweet','_blank') }}>
                      <ExternalLink size={12} />Open in X
                    </button>
                    <button className={s.markBtn} onClick={() => handleMark(post)}>
                      <Check size={12} />Mark posted
                    </button>
                    <button className={s.delBtn} onClick={() => removeFromQueue(post.queueId)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
