export const VIRAL_FORMATS = [
  {
    id: 'hook-list',
    label: 'Hook + List',
    description: 'Hook then bullet list of insights',
    template: `[Attention-grabbing statement]\n\nHere is what most people miss:\n\n- Point one\n- Point two\n- Point three\n- Point four\n- Point five\n\nBookmark this.`,
  },
  {
    id: 'contrarian',
    label: 'Contrarian Take',
    description: 'Bold claim that challenges consensus',
    template: `Unpopular opinion:\n\n[Bold claim that challenges mainstream thinking]\n\nHere is the data:\n\n[Evidence]\n\nThe sooner you accept this, the better.`,
  },
  {
    id: 'story-arc',
    label: 'Story Arc',
    description: 'Personal transformation narrative',
    template: `6 months ago, [low point or problem].\n\nToday, [transformation or result].\n\nHere is exactly what changed:\n\n[Key insight 1]\n[Key insight 2]\n[Key insight 3]\n\nThread below.`,
  },
  {
    id: 'number-fact',
    label: 'Number + Insight',
    description: 'Specific stat leads to a takeaway',
    template: `[Specific number] [subject].\n\nMost people ignore this.\n\n[Context and why it matters]\n\n[Actionable takeaway]`,
  },
  {
    id: 'then-now',
    label: 'Then vs Now',
    description: 'Before and after contrast',
    template: `2020: [Old way]\n2025: [New way]\n\nThis shift is bigger than people realize.\n\n[Why it matters and who it affects]`,
  },
  {
    id: 'question-hook',
    label: 'Question Hook',
    description: 'Opens with a question then delivers',
    template: `Why do [successful people] always [achieve result] while [others] struggle?\n\nI studied this for [timeframe].\n\nThe answer surprised me:\n\n[Core insight]\n\nHere is what this means for you.`,
  },
]

export const TONE_OPTIONS = [
  'Insightful & Educational',
  'Bold & Contrarian',
  'Inspirational',
  'Data-Driven',
  'Conversational',
  'Technical Expert',
]

export const TOPIC_SUGGESTIONS = [
  'AI & Technology',
  'Startup & Entrepreneurship',
  'Career & Growth',
  'Finance & Investing',
  'Productivity',
  'Science & Research',
]

export const BEST_TIMES = [
  { label: 'Morning', time: '7 to 9 AM', note: 'Commute scroll' },
  { label: 'Lunch', time: '12 to 1 PM', note: 'Peak browsing' },
  { label: 'Evening', time: '6 to 9 PM', note: 'Highest reach' },
]

export const SCHEDULE_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM',
  '12:00 PM', '1:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM',
  '9:00 PM',
]
