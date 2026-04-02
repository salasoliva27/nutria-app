import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { WidgetButton } from './WidgetButton.jsx'
import { WidgetPanel } from './WidgetPanel.jsx'
import { ChatFull } from '../../shared/components/Chat/ChatFull.jsx'
import { useChat } from '../../shared/hooks/useChat.js'

// Default nutrIA theme
const DEFAULT_THEME = {
  bgDeep: '#080c10',
  bgSurface: '#0d1520',
  accentPrimary: '#00e5c4',
  accentWarm: '#f0c060',
  textPrimary: '#e8f4f0',
  textMuted: '#4a7a70',
}

export default function Widget({ config = {} }) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const { messages, isResponding, sendMessage } = useChat({ persist: false })

  const theme = { ...DEFAULT_THEME, ...(config.theme || {}) }

  const btnRight = 24
  const btnBottom = 24
  const btnSize = 56

  const cssVars = `
    :host {
      --bg-deep: ${theme.bgDeep};
      --bg-surface: ${theme.bgSurface};
      --accent-teal: ${theme.accentPrimary};
      --accent-warm: ${theme.accentWarm};
      --text-primary: ${theme.textPrimary};
      --text-muted: ${theme.textMuted};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: ${theme.accentPrimary}33; border-radius: 2px; }
  `

  return (
    <>
      <style>{cssVars}</style>
      <WidgetButton
        isOpen={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        theme={theme}
        btnRight={btnRight}
        btnBottom={btnBottom}
      />
      <AnimatePresence>
        {isOpen && (
          isMobile ? (
            <ChatFull
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              messages={messages}
              isResponding={isResponding}
              onSend={sendMessage}
            />
          ) : (
            <WidgetPanel
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              messages={messages}
              isResponding={isResponding}
              onSend={sendMessage}
              theme={theme}
              btnRight={btnRight}
              btnBottom={btnBottom}
              btnSize={btnSize}
            />
          )
        )}
      </AnimatePresence>
    </>
  )
}
