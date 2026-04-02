import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { GlowEffect } from './GlowEffect.jsx'

const mdComponents = {
  p: ({ children }) => (
    <p style={{ margin: '0 0 0.55em', lineHeight: 1.7 }}>{children}</p>
  ),
  strong: ({ children }) => (
    <strong style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: 'var(--accent-warm)', fontStyle: 'italic' }}>{children}</em>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1.25em', margin: '0.35em 0 0.55em', listStyle: 'none' }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: '1.25em', margin: '0.35em 0 0.55em' }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: '0.3em', lineHeight: 1.65, display: 'flex', gap: '0.5em', alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--accent-teal)', fontSize: '0.75em', marginTop: '0.35em', flexShrink: 0 }}>▸</span>
      <span>{children}</span>
    </li>
  ),
  h1: ({ children }) => (
    <h1 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.05em',
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: '0.6em 0 0.3em',
      lineHeight: 1.3,
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '0.98em',
      fontWeight: 600,
      color: 'var(--text-primary)',
      margin: '0.5em 0 0.25em',
      lineHeight: 1.3,
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontSize: '0.9em',
      fontWeight: 600,
      color: 'var(--accent-teal)',
      margin: '0.4em 0 0.2em',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    }}>{children}</h3>
  ),
  // In react-markdown v10, `code` = inline only; block code comes via `pre > code`
  code: ({ children }) => (
    <code style={{
      backgroundColor: 'rgba(0,229,196,0.1)',
      border: '1px solid rgba(0,229,196,0.18)',
      borderRadius: 4,
      padding: '0.1em 0.38em',
      fontSize: '0.87em',
      color: 'var(--accent-teal)',
      fontFamily: "'DM Mono', monospace",
    }}>{children}</code>
  ),
  pre: ({ children }) => (
    <pre style={{
      backgroundColor: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(0,229,196,0.1)',
      borderRadius: 10,
      padding: '12px 14px',
      overflowX: 'auto',
      margin: '0.4em 0 0.6em',
      fontSize: '0.86em',
      lineHeight: 1.55,
    }}>
      {/* Reset inline code styling inside pre blocks */}
      {typeof children === 'object'
        ? <code style={{ fontFamily: "'DM Mono', monospace", background: 'none', border: 'none', padding: 0, color: 'var(--text-primary)', fontSize: 'inherit' }}>
            {children?.props?.children}
          </code>
        : children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '2px solid rgba(0,229,196,0.35)',
      paddingLeft: '0.85em',
      marginLeft: 0,
      margin: '0.3em 0 0.5em',
      color: 'var(--text-muted)',
      fontStyle: 'italic',
    }}>{children}</blockquote>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid rgba(0,229,196,0.1)', margin: '0.7em 0' }} />
  ),
}

export function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  const [showGlow, setShowGlow] = useState(message.isNew === true)

  useEffect(() => {
    if (showGlow) {
      const t = setTimeout(() => setShowGlow(false), 2800)
      return () => clearTimeout(t)
    }
  }, [showGlow])

  if (isUser) {
    return (
      <div className="flex justify-end" style={{ marginBottom: 12 }}>
        <div
          style={{
            maxWidth: '78%',
            padding: '10px 14px',
            borderRadius: 18,
            borderBottomRightRadius: 4,
            background: 'linear-gradient(135deg, rgba(240,192,96,0.14) 0%, rgba(240,192,96,0.08) 100%)',
            border: '1px solid rgba(240,192,96,0.2)',
            color: 'var(--text-primary)',
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start" style={{ marginBottom: 12 }}>
      <div
        className="relative"
        style={{
          maxWidth: '88%',
          padding: '12px 15px',
          borderRadius: 18,
          borderBottomLeftRadius: 4,
          backgroundColor: 'rgba(13,21,32,0.85)',
          border: showGlow
            ? '1px solid rgba(0,229,196,0.45)'
            : '1px solid rgba(0,229,196,0.09)',
          color: 'var(--text-primary)',
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          lineHeight: 1.65,
          backdropFilter: 'blur(8px)',
          boxShadow: showGlow
            ? '0 0 20px rgba(0,229,196,0.08)'
            : '0 2px 12px rgba(0,0,0,0.25)',
          transition: 'border-color 1.8s ease, box-shadow 1.8s ease',
          wordBreak: 'break-word',
        }}
      >
        {showGlow && <GlowEffect />}
        <div className="relative z-10">
          <Markdown components={mdComponents}>
            {message.content}
          </Markdown>
        </div>
      </div>
    </div>
  )
}
