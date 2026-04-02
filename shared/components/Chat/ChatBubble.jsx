import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GlowEffect } from './GlowEffect.jsx'
import { exportTXT, exportMD, exportCSV, exportDOC, exportPDF } from '../../lib/exportChat.js'

// Copy button shown on every code block
function CopyButton({ getText }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    const text = getText()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={handleCopy}
      title="Copiar"
      style={{
        position: 'absolute', top: 8, right: 8,
        padding: '3px 8px',
        borderRadius: 6,
        border: copied ? '1px solid rgba(0,229,196,0.4)' : '1px solid rgba(255,255,255,0.1)',
        backgroundColor: copied ? 'rgba(0,229,196,0.1)' : 'rgba(255,255,255,0.05)',
        color: copied ? 'var(--accent-teal)' : 'rgba(255,255,255,0.4)',
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        cursor: 'pointer',
        transition: 'all 0.2s',
        letterSpacing: '0.04em',
      }}
    >
      {copied ? '✓ copiado' : 'copiar'}
    </button>
  )
}

const mdComponents = {
  p: ({ children }) => <p style={{ margin: '0 0 0.55em', lineHeight: 1.7 }}>{children}</p>,
  strong: ({ children }) => <strong style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: 'var(--accent-warm)', fontStyle: 'italic' }}>{children}</em>,
  ul: ({ children }) => <ul style={{ paddingLeft: '1.25em', margin: '0.35em 0 0.55em', listStyle: 'none' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: '1.25em', margin: '0.35em 0 0.55em' }}>{children}</ol>,
  li: ({ children }) => (
    <li style={{ marginBottom: '0.3em', lineHeight: 1.65, display: 'flex', gap: '0.5em', alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--accent-teal)', fontSize: '0.75em', marginTop: '0.35em', flexShrink: 0 }}>▸</span>
      <span>{children}</span>
    </li>
  ),
  h1: ({ children }) => <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05em', fontWeight: 700, color: 'var(--text-primary)', margin: '0.6em 0 0.3em', lineHeight: 1.3 }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.98em', fontWeight: 600, color: 'var(--text-primary)', margin: '0.5em 0 0.25em', lineHeight: 1.3 }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: '0.9em', fontWeight: 600, color: 'var(--accent-teal)', margin: '0.4em 0 0.2em', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</h3>,
  code: ({ children }) => (
    <code style={{ backgroundColor: 'rgba(0,229,196,0.1)', border: '1px solid rgba(0,229,196,0.18)', borderRadius: 4, padding: '0.1em 0.38em', fontSize: '0.87em', color: 'var(--accent-teal)', fontFamily: "'DM Mono', monospace" }}>{children}</code>
  ),
  pre: ({ children }) => {
    // Extract raw text from children for copy
    const rawText = typeof children === 'object'
      ? (children?.props?.children ?? '')
      : (children ?? '')
    return (
      <div style={{ position: 'relative', margin: '0.4em 0 0.6em' }}>
        <pre style={{ backgroundColor: 'rgba(0,0,0,0.35)', border: '1px solid rgba(0,229,196,0.1)', borderRadius: 10, padding: '12px 14px', paddingRight: 72, overflowX: 'auto', fontSize: '0.86em', lineHeight: 1.55 }}>
          {typeof children === 'object'
            ? <code style={{ fontFamily: "'DM Mono', monospace", background: 'none', border: 'none', padding: 0, color: 'var(--text-primary)', fontSize: 'inherit' }}>{children?.props?.children}</code>
            : children}
        </pre>
        <CopyButton getText={() => String(rawText)} />
      </div>
    )
  },
  blockquote: ({ children }) => <blockquote style={{ borderLeft: '2px solid rgba(0,229,196,0.35)', paddingLeft: '0.85em', marginLeft: 0, margin: '0.3em 0 0.5em', color: 'var(--text-muted)', fontStyle: 'italic' }}>{children}</blockquote>,
  hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(0,229,196,0.1)', margin: '0.7em 0' }} />,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '0.5em 0 0.8em' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace", fontSize: '0.85em' }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ borderBottom: '1px solid rgba(0,229,196,0.3)' }}>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr style={{ borderBottom: '1px solid rgba(0,229,196,0.07)' }}>{children}</tr>,
  th: ({ children }) => <th style={{ padding: '6px 12px', textAlign: 'left', color: 'var(--accent-teal)', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.82em', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: '6px 12px', color: 'var(--text-primary)', verticalAlign: 'top', lineHeight: 1.5 }}>{children}</td>,
}

// Download bubble — rendered inline in chat when user triggers export
export function DownloadBubble({ messages, onDismiss }) {
  const formats = [
    { label: 'PDF', fn: () => exportPDF(messages) },
    { label: 'Word (.doc)', fn: () => exportDOC(messages) },
    { label: 'Markdown', fn: () => exportMD(messages) },
    { label: 'Texto .txt', fn: () => exportTXT(messages) },
    { label: 'Excel / CSV', fn: () => exportCSV(messages) },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
      <div style={{ maxWidth: '88%', padding: '14px 16px', borderRadius: 18, borderBottomLeftRadius: 4, backgroundColor: 'rgba(13,21,32,0.85)', border: '1px solid rgba(0,229,196,0.18)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
          Elige formato para descargar tu consulta:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {formats.map(({ label, fn }) => (
            <button key={label} onClick={() => { fn(); onDismiss?.() }}
              style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(0,229,196,0.25)', backgroundColor: 'rgba(0,229,196,0.06)', color: 'var(--accent-teal)', fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,229,196,0.14)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,229,196,0.06)'}
            >↓ {label}</button>
          ))}
        </div>
      </div>
    </div>
  )
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: 18, borderBottomRightRadius: 4, background: 'linear-gradient(135deg, rgba(240,192,96,0.14) 0%, rgba(240,192,96,0.08) 100%)', border: '1px solid rgba(240,192,96,0.2)', color: 'var(--text-primary)', fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
      <div className="relative" style={{ maxWidth: '88%', padding: '12px 15px', borderRadius: 18, borderBottomLeftRadius: 4, backgroundColor: 'rgba(13,21,32,0.85)', border: showGlow ? '1px solid rgba(0,229,196,0.45)' : '1px solid rgba(0,229,196,0.09)', color: 'var(--text-primary)', fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.65, backdropFilter: 'blur(8px)', boxShadow: showGlow ? '0 0 20px rgba(0,229,196,0.08)' : '0 2px 12px rgba(0,0,0,0.25)', transition: 'border-color 1.8s ease, box-shadow 1.8s ease', wordBreak: 'break-word' }}>
        {showGlow && <GlowEffect />}
        <div className="relative z-10">
          <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {message.content}
          </Markdown>
        </div>
      </div>
    </div>
  )
}
