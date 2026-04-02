import { motion } from 'framer-motion'

export function WidgetButton({ isOpen, onClick, theme = {}, btnRight = 24, btnBottom = 24 }) {
  const accent = theme.accentPrimary || '#00e5c4'
  const bg = theme.bgSurface || '#0d1520'

  return (
    <motion.button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: btnBottom,
        right: btnRight,
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: bg,
        border: `1.5px solid ${accent}66`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999998,
        outline: 'none',
      }}
      animate={{
        y: isOpen ? 0 : [0, -4, 0],
        boxShadow: isOpen
          ? `0 0 0 ${accent}00`
          : [
              `0 0 12px ${accent}40`,
              `0 0 28px ${accent}80`,
              `0 0 12px ${accent}40`,
            ],
      }}
      transition={isOpen ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.1, boxShadow: `0 0 32px ${accent}99` }}
      whileTap={{ scale: 0.95 }}
      title="Hablar con nutrIA"
    >
      {isOpen ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <OtterIcon accent={accent} bg={bg} />
      )}
    </motion.button>
  )
}

function OtterIcon({ accent = '#00e5c4', bg = '#0d1520' }) {
  return (
    <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
      {/* Round head */}
      <circle cx="32" cy="30" r="20" fill={bg} stroke={accent} strokeWidth="1.8" />
      {/* Small rounded ears */}
      <circle cx="16" cy="14" r="5" fill={bg} stroke={accent} strokeWidth="1.5" />
      <circle cx="48" cy="14" r="5" fill={bg} stroke={accent} strokeWidth="1.5" />
      <circle cx="16" cy="14" r="2.5" fill={`${accent}1f`} />
      <circle cx="48" cy="14" r="2.5" fill={`${accent}1f`} />
      {/* Light face patch */}
      <ellipse cx="32" cy="35" rx="11" ry="9" fill={`${accent}12`} stroke={`${accent}26`} strokeWidth="1" />
      {/* Eyes */}
      <circle cx="24" cy="27" r="4" fill="#f0c060" />
      <circle cx="40" cy="27" r="4" fill="#f0c060" />
      <circle cx="24.8" cy="26.5" r="2" fill="#080c10" />
      <circle cx="40.8" cy="26.5" r="2" fill="#080c10" />
      <circle cx="25.6" cy="25.6" r="0.8" fill="white" opacity="0.9" />
      <circle cx="41.6" cy="25.6" r="0.8" fill="white" opacity="0.9" />
      {/* Wide flat nose */}
      <ellipse cx="32" cy="33" rx="4.5" ry="2.8" fill={accent} opacity="0.7" />
      <ellipse cx="32" cy="32.5" rx="2.5" ry="1.5" fill={accent} />
      {/* Whisker dots */}
      <circle cx="20" cy="34" r="0.9" fill={`${accent}80`} />
      <circle cx="21.5" cy="36" r="0.9" fill={`${accent}80`} />
      <circle cx="44" cy="34" r="0.9" fill={`${accent}80`} />
      <circle cx="42.5" cy="36" r="0.9" fill={`${accent}80`} />
    </svg>
  )
}
