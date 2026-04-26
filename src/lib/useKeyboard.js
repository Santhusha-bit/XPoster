import { useEffect } from 'react'

export function useKeyboard(bindings) {
  useEffect(() => {
    const handle = (e) => {
      // Skip when typing in inputs
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return

      const key = [
        e.metaKey || e.ctrlKey ? 'mod' : null,
        e.shiftKey ? 'shift' : null,
        e.key.toLowerCase(),
      ].filter(Boolean).join('+')

      bindings[key]?.()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [bindings])
}
