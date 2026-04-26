import { useState } from 'react'
import { Copy, Check, Plus, ExternalLink, Clock, Zap, RefreshCw, Pencil } from 'lucide-react'
import { regeneratePost } from '../lib/api'
import { useToast } from '../lib/toast'
import EditModal from './EditModal'
import s from './PostCard.module.css'

const ENG = {
  'Viral':     { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
  'Very High': { bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6' },
  'High':      { bg: '#f5f3ff', text: '#5b21b6', dot: '#8b5cf6' },
}

export default function PostCard({ post: initial, index, profile, onAddToQueue }) {
  const [post, setPost]       = useState(initial)
  const [copied, setCopied]   = useState(false)
  const [queued, setQueued]   = useState(false)
  const [regen, setRegen]     = useState(false)
  const [regenErr, setRegenErr] = useState(false)
  const [editing, setEditing] = useState(false)
  const toast = useToast()

  const color = ENG[post.estimatedEngagement] || ENG['High']
  const pct   = Math.min((post.content.length / 280) * 100, 100)
  const barColor = post.content.length > 260 ? '#d97706'
                 : post.content.length > 200 ? '#5b4cff'
                 : '#059669'

  const copyPost = () => {
    navigator.clipboard.writeText(post.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast('Copied to clipboard', 'success', 2000)
  }

  const postToX = () => {
    navigator.clipboard.writeText(post.content)
    window.open('https://x.com/compose/tweet', '_blank')
    toast('Opening X. Text copied!', 'success')
  }

  const handleQueue = () => {
    onAddToQueue(post)
    setQueued(true)
    setTimeout(() => setQueued(false), 2500)
    toast('Added to queue', 'success', 2000)
  }

  const handleRegen = async () => {
    setRegen(true)
    setRegenErr(false)
    try {
      const fresh = await regeneratePost({ post, profile })
      setPost(prev => ({ ...prev, ...fresh }))
      toast('Post rewritten with a fresh angle', 'success')
    } catch {
      setRegenErr(true)
      toast('Could not rewrite. Try again.', 'error')
    }
    setRegen(false)
  }

  const handleEditSave = (updated) => {
    onAddToQueue(updated)
    toast('Edited post added to queue', 'success')
  }

  return (
    <>
      {editing && (
        <EditModal
          post={post}
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={handleEditSave}
          onPostToX={postToX}
        />
      )}

      <div className={s.card} style={{ animationDelay: `${index * .07}s` }}>
        <div className={s.header}>
          <span className={s.num}>Post {index + 1}</span>
          <span className={s.formatBadge}>{post.format}</span>
          <span className={s.engBadge} style={{ background: color.bg, color: color.text }}>
            <span className={s.engDot} style={{ background: color.dot }} />
            {post.estimatedEngagement}
          </span>
          {post.bestTime && (
            <span className={s.timeBadge}><Clock size={10} />{post.bestTime}</span>
          )}
          <div className={s.headerActions}>
            <button
              className={s.iconActionBtn}
              onClick={() => setEditing(true)}
              title="Edit before posting"
            >
              <Pencil size={12} />
            </button>
            <button className={s.regenBtn} onClick={handleRegen} disabled={regen}>
              <RefreshCw size={12} className={regen ? s.spinning : ''} />
              {regen ? 'Rewriting...' : 'Rewrite'}
            </button>
          </div>
        </div>

        <div className={s.tweet}>
          <div className={s.tweetAuthor}>
            <div className={s.avatar}>{(profile?.name || 'Y')[0].toUpperCase()}</div>
            <div>
              <span className={s.authorName}>{profile?.name || 'Your Name'}</span>
              <span className={s.authorHandle}>@{profile?.handle || 'yourhandle'}</span>
            </div>
          </div>
          <p className={s.content}>{post.content}</p>
          <div className={s.charRow}>
            <div className={s.charBar}>
              <div className={s.charFill} style={{ width: `${pct}%`, background: barColor }} />
            </div>
            <span
              className={s.charCount}
              style={{ color: post.content.length > 260 ? '#d97706' : 'var(--faint)' }}
            >
              {post.content.length}/280
            </span>
          </div>
        </div>

        {post.explanation && (
          <div className={s.why}>
            <Zap size={11} className={s.whyIcon} />
            <p>{post.explanation}</p>
          </div>
        )}

        {regenErr && <div className={s.err}>Could not rewrite. Please try again.</div>}

        <div className={s.actions}>
          <button className={s.postBtn} onClick={postToX}>
            <ExternalLink size={13} />Post to X
          </button>
          <button className={s.editBtn} onClick={() => setEditing(true)}>
            <Pencil size={13} />Edit
          </button>
          <button className={s.queueBtn} onClick={handleQueue} disabled={queued}>
            {queued ? <Check size={13} /> : <Plus size={13} />}
            {queued ? 'Added' : 'Queue'}
          </button>
          <button className={s.copyBtn} onClick={copyPost}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </>
  )
}
