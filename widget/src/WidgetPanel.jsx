import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubble } from '../../shared/components/Chat/ChatBubble.jsx'

// Compact chat panel for embedded widget use.
// Positioned to the LEFT of the floating button, not on top of it.
export function WidgetPanel({ isOpen, onClose, messages, isResponding, onSend, theme = {}, btnRight = 24, btnBottom = 24, btnSize = 56 }) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const accent = theme.accentPrimary || '#00e5c4'
  const bg = theme.bgSurface || '#0d1520'
  const bgDeep = theme.bgDeep || '#080c10'
  const textPrimary = theme.textPrimary || '#e8f4f0'
  const textMuted = theme.textMuted || '#4a7a70'

  // Position panel to the left of the button with a 12px gap
  const panelWidth = 360
  const panelHeight = 520
  const panelRight = btnRight + btnSize + 12
  const panelBottom = btnBottom

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isResponding) return
    onSend(text)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: 'fixed',
            bottom: panelBottom,
            right: panelRight,
            width: panelWidth,
            height: panelHeight,
            borderRadius: 16,
            backgroundColor: `${bgDeep}f0`,
            backdropFilter: 'blur(24px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
            border: `1px solid ${accent}24`,
            boxShadow: `0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 ${accent}14`,
            zIndex: 999997,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          {/* Ambient glow */}
          <div style={{
            pointerEvents: 'none',
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}0f 0%, transparent 70%)`,
            top: -40,
            right: -30,
            zIndex: 0,
          }} />

          {/* Header */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderBottom: `1px solid ${accent}14`,
            background: `linear-gradient(180deg, ${accent}0a 0%, transparent 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <OtterMini accent={accent} bg={bg} />
              <div>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: textPrimary,
                  lineHeight: 1.2,
                  margin: 0,
                }}>nutrIA</p>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: accent,
                  opacity: 0.7,
                  lineHeight: 1,
                  marginTop: 2,
                }}>
                  {isResponding ? 'escribiendo...' : 'en línea'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.div
                style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: accent }}
                animate={{ opacity: isResponding ? [1, 0.3, 1] : 1 }}
                transition={{ duration: 1.2, repeat: isResponding ? Infinity : 0 }}
              />
              <button
                onClick={onClose}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: textMuted,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            overflowY: 'auto',
            padding: '14px 12px 6px',
          }}>
            {messages.length === 0 && (
              <motion.div
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <p style={{ fontSize: 24 }}>🦦</p>
                <p style={{
                  color: textMuted,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  textAlign: 'center',
                  lineHeight: 1.7,
                }}>
                  Hola, soy nutrIA.<br />¿En qué puedo ayudarte?
                </p>
              </motion.div>
            )}
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                <ChatBubble message={msg} />
              </motion.div>
            ))}
            {isResponding && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '8px 12px', borderRadius: 12, borderBottomLeftRadius: 3,
                  backgroundColor: `${bg}e6`, border: `1px solid ${accent}1a`,
                }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i}
                      style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: accent }}
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              padding: '10px 12px 12px',
              borderTop: `1px solid ${accent}14`,
              background: `linear-gradient(0deg, ${accent}08 0%, transparent 100%)`,
            }}
          >
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: focused ? `1px solid ${accent}59` : '1px solid rgba(255,255,255,0.07)',
              boxShadow: focused ? `0 0 0 3px ${accent}0f` : 'none',
              minHeight: 40,
              padding: '8px 12px',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Escribe un mensaje..."
                rows={1}
                disabled={isResponding}
                style={{
                  width: '100%',
                  resize: 'none',
                  outline: 'none',
                  background: 'transparent',
                  border: 'none',
                  color: textPrimary,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                  overflowY: 'hidden',
                  caretColor: accent,
                }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() || isResponding}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: input.trim() && !isResponding
                  ? `linear-gradient(135deg, ${accent} 0%, ${bg} 100%)`
                  : `${accent}1f`,
                border: 'none',
                cursor: input.trim() && !isResponding ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              whileTap={input.trim() && !isResponding ? { scale: 0.92 } : {}}
              whileHover={input.trim() && !isResponding ? { scale: 1.06 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"
                  stroke={input.trim() && !isResponding ? bgDeep : `${accent}66`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function OtterMini({ accent = '#00e5c4', bg = '#0d1520' }) {
  return (
    <div style={{
      width: 30,
      height: 30,
      borderRadius: '50%',
      backgroundColor: `${accent}14`,
      border: `1px solid ${accent}33`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="30" r="20" fill={bg} stroke={accent} strokeWidth="1.8" />
        <circle cx="16" cy="14" r="5" fill={bg} stroke={accent} strokeWidth="1.5" />
        <circle cx="48" cy="14" r="5" fill={bg} stroke={accent} strokeWidth="1.5" />
        <circle cx="16" cy="14" r="2.5" fill={`${accent}26`} />
        <circle cx="48" cy="14" r="2.5" fill={`${accent}26`} />
        <ellipse cx="32" cy="35" rx="11" ry="9" fill={`${accent}12`} />
        <circle cx="24" cy="27" r="4" fill="#f0c060" />
        <circle cx="40" cy="27" r="4" fill="#f0c060" />
        <circle cx="24.8" cy="26.5" r="2" fill="#080c10" />
        <circle cx="40.8" cy="26.5" r="2" fill="#080c10" />
        <circle cx="25.6" cy="25.6" r="0.8" fill="white" opacity="0.9" />
        <circle cx="41.6" cy="25.6" r="0.8" fill="white" opacity="0.9" />
        <ellipse cx="32" cy="33" rx="4.5" ry="2.8" fill={accent} opacity="0.7" />
        <ellipse cx="32" cy="32.5" rx="2.5" ry="1.5" fill={accent} />
        <circle cx="20" cy="35" r="0.9" fill={`${accent}80`} />
        <circle cx="44" cy="35" r="0.9" fill={`${accent}80`} />
      </svg>
    </div>
  )
}
