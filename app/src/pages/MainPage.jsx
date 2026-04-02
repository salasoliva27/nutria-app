import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NutriaLogo } from '../components/ui/NutriaLogo.jsx'
import { ChatPanel } from '@shared/components/Chat/ChatPanel.jsx'
import { ChatFull } from '@shared/components/Chat/ChatFull.jsx'
import { useChat } from '@shared/hooks/useChat.js'
import { useProfile } from '@shared/hooks/useProfile.js'
import { extractProfileFromMessages } from '@shared/lib/profileExtractor.js'

export function MainPage({ userId }) {
  const [chatOpen, setChatOpen] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const { profile, saveProfile } = useProfile(userId)
  const { messages, isResponding, sendMessage, returning } = useChat({
    persist: !!userId,
    userId,
    patientProfile: profile,
  })

  // Track the last message count at which we ran extraction
  const lastExtractedAt = useRef(0)

  useEffect(() => {
    if (!userId || !saveProfile) return
    // Don't extract if intake is already complete
    if (profile?.intake_complete) return
    // Only extract at milestones: 8, 16, 24... messages
    if (messages.length < 8) return
    if (messages.length % 8 !== 0) return
    if (messages.length === lastExtractedAt.current) return

    lastExtractedAt.current = messages.length

    extractProfileFromMessages(messages).then((extracted) => {
      if (extracted) saveProfile(extracted)
    })
  }, [messages.length])

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,196,0.06) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <NutriaLogo size={88} />

        <div className="flex flex-col items-center gap-2">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            nutrIA
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
            {returning
              ? `bienvenido de vuelta${profile?.name ? ', ' + profile.name : ''} 🦦`
              : 'nutrición clínica · inteligencia artificial'}
          </p>
        </div>

        {/* CTA — fades out once chat opens */}
        <AnimatePresence>
          {!chatOpen && (
            <motion.button
              onClick={() => setChatOpen(true)}
              className="relative overflow-hidden"
              style={{
                borderRadius: 20,
                padding: '18px 32px',
                border: '1px solid rgba(0,229,196,0.3)',
                backgroundColor: 'rgba(0,229,196,0.05)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                minWidth: 220,
              }}
              animate={{
                boxShadow: [
                  '0 0 24px rgba(0,229,196,0.12), inset 0 0 24px rgba(0,229,196,0.03)',
                  '0 0 48px rgba(0,229,196,0.28), inset 0 0 32px rgba(0,229,196,0.07)',
                  '0 0 24px rgba(0,229,196,0.12), inset 0 0 24px rgba(0,229,196,0.03)',
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(0,229,196,0.08)' }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.18 } }}
            >
              {/* Scan line animation */}
              <motion.div
                style={{
                  position: 'absolute', left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(0,229,196,0.4), transparent)',
                  pointerEvents: 'none',
                }}
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
              />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1 }}>
                iniciar consulta
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--accent-teal)', letterSpacing: '0.14em', opacity: 0.8 }}>
                NUTRICIÓN CLÍNICA · IA
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {isMobile ? (
        <ChatFull isOpen={chatOpen} onClose={() => setChatOpen(false)} messages={messages} isResponding={isResponding} onSend={sendMessage} returning={returning} />
      ) : (
        <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} messages={messages} isResponding={isResponding} onSend={sendMessage} returning={returning} />
      )}
    </div>
  )
}
