import { useState } from 'react'
import { Sparkles, TrendingUp, Leaf } from 'lucide-react'
import { VIRAL_FORMATS } from '../lib/constants'
import { generatePosts } from '../lib/api'
import PostCard from './PostCard'
import s from './GenerateTab.module.css'

export default function GenerateTab({ profile, profileSaved, addToQueue, setTab }) {
  const [format, setFormat]         = useState(VIRAL_FORMATS[0])
  const [mode, setMode]             = useState('trending')
  const [customTopic, setCustomTopic] = useState('')
  const [posts, setPosts]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const handleGenerate = async () => {
    if (!profileSaved && !profile.name) { setTab('profile'); return }
    setLoading(true); setError(null); setPosts([])
    try {
      const results = await generatePosts({ profile, format, researchMode: mode, customTopic })
      setPosts(results)
    } catch {
      setError('Could not generate posts. Please check your connection and try again.')
    }
    setLoading(false)
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Generate Posts</h1>
          <p className={s.subtitle}>AI researches trends and writes viral posts tailored to your voice</p>
        </div>
        {!profileSaved && (
          <button className={s.profileNudge} onClick={() => setTab('profile')}>
            Set up profile first
          </button>
        )}
      </div>

      <div className={s.panel}>
        <div className={s.row}>
          <div className={s.field}>
            <label className={s.label}>Research mode</label>
            <div className={s.modeRow}>
              {[['trending', TrendingUp, 'Trending now'], ['evergreen', Leaf, 'Evergreen']].map(([id, Icon, lbl]) => (
                <button
                  key={id}
                  className={`${s.modeBtn} ${mode === id ? s.modeBtnActive : ''}`}
                  onClick={() => setMode(id)}
                >
                  <Icon size={14} />
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label}>Custom topic <span className={s.optional}>(optional)</span></label>
            <input
              className={s.input}
              placeholder="e.g. OpenAI o3, agentic AI, crypto summer..."
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
            />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Viral format</label>
          <div className={s.formatGrid}>
            {VIRAL_FORMATS.map(f => (
              <button
                key={f.id}
                className={`${s.formatChip} ${format.id === f.id ? s.formatChipActive : ''}`}
                onClick={() => setFormat(f)}
              >
                <span className={s.formatName}>{f.label}</span>
                <span className={s.formatDesc}>{f.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.preview}>
          <span className={s.previewLabel}>Format template</span>
          <pre className={s.previewText}>{format.template}</pre>
        </div>

        <button className={s.genBtn} onClick={handleGenerate} disabled={loading}>
          {loading
            ? <><span className={s.spinner} />Researching trends and crafting posts...</>
            : <><Sparkles size={15} />Generate 3 Viral Posts</>}
        </button>

        {error && <div className={s.error}>{error}</div>}
      </div>

      {posts.length > 0 && (
        <div className={s.results}>
          <p className={s.resultsLabel}>Generated posts</p>
          <div className={s.postList}>
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i}
                profile={profile}
                onAddToQueue={(p) => addToQueue(p || post)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
