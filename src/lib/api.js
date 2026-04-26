export async function generatePosts({ profile, format, researchMode, customTopic, count = 3 }) {
  const topicContext = customTopic ||
    (profile.topics && profile.topics.length > 0
      ? profile.topics.join(', ')
      : 'technology and AI trends')

  const systemPrompt = `You are an elite X (Twitter) content strategist who creates viral posts.
You research current trends deeply and craft posts that get massive engagement.
Always respond ONLY with a valid JSON array. No markdown. No explanation. No backticks.`

  const userPrompt = `Create ${count} viral X (Twitter) posts for this person:

NAME: ${profile.name || 'Professional'}
HANDLE: @${profile.handle || 'user'}
BACKGROUND: ${profile.background || 'Tech professional with expertise in their field'}
NICHE: ${profile.niche || 'Technology'}
TONE: ${profile.tone || 'Insightful & Educational'}
TOPICS: ${topicContext}
FORMAT TO USE: ${format.label}
RESEARCH MODE: ${researchMode === 'trending' ? 'Focus on what is trending RIGHT NOW. Use current data and recent developments.' : 'Focus on evergreen insights that provide timeless value.'}

Format template to follow:
${format.template}

Rules:
- Each post under 280 characters if single, up to 1000 if thread format
- Use the exact viral format specified
- Make it feel authentic to this person voice and background
- Include real-feeling statistics, insights, or frameworks
- Add 1 to 2 relevant hashtags at most
- Make hooks irresistible
- Do not use em dashes anywhere. Use commas, colons, or new lines instead.
- Vary the posts so they feel distinct from each other

Respond with ONLY a JSON array of exactly ${count} objects (no markdown, no backticks):
[
  {"id":"1","content":"post text","format":"format name","estimatedEngagement":"High","bestTime":"8 to 10 AM","explanation":"why this performs well","hashtags":["tag1"]},
  ...
]`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()

  const textBlock = data.content?.find(b => b.type === 'text')
  if (!textBlock?.text) throw new Error('No text response from API')

  const clean = textBlock.text.trim().replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function regeneratePost({ post, profile }) {
  const systemPrompt = `You are an elite X (Twitter) content strategist.
Rewrite the given post with a fresh angle. Keep the same format and topic but make it feel completely different.
Respond ONLY with a valid JSON object. No markdown. No backticks.`

  const userPrompt = `Rewrite this post with a fresh angle:

ORIGINAL: ${post.content}
FORMAT: ${post.format}
AUTHOR BACKGROUND: ${profile.background || 'Tech professional'}
TONE: ${profile.tone || 'Insightful & Educational'}

Rules:
- Same format, fresh hook and body
- Do not use em dashes. Use commas, colons, or new lines instead.
- Make it noticeably different from the original

Respond with ONLY this JSON (no markdown, no backticks):
{"content":"new post text","estimatedEngagement":"High","bestTime":"8 to 10 AM","explanation":"why this version works"}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  const textBlock = data.content?.find(b => b.type === 'text')
  if (!textBlock?.text) throw new Error('No response')
  const clean = textBlock.text.trim().replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
