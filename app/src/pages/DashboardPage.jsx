import { useProfile } from '@shared/hooks/useProfile.js'

export function DashboardPage({ userId, onLogout }) {
  const { profile, loading } = useProfile(userId)

  const stats = [
    { label: 'Edad', value: profile?.age, unit: 'años' },
    { label: 'Peso', value: profile?.weight_kg, unit: 'kg' },
    { label: 'Talla', value: profile?.height_cm, unit: 'cm' },
    { label: 'BMI', value: profile?.bmi ? Number(profile.bmi).toFixed(1) : null, unit: '' },
  ]

  const tags = [
    ...(profile?.conditions?.map(c => ({ label: c, color: 'rgba(255,120,100,0.12)', border: 'rgba(255,120,100,0.28)' })) || []),
    ...(profile?.medications?.map(m => ({ label: m, color: 'rgba(100,160,255,0.1)', border: 'rgba(100,160,255,0.25)' })) || []),
    ...(profile?.allergies?.map(a => ({ label: `⚠ ${a}`, color: 'rgba(255,200,50,0.1)', border: 'rgba(255,200,50,0.25)' })) || []),
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: 'transparent' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,229,196,0.08)' }}
      >
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {loading ? '...' : profile?.name || 'Mi perfil'}
          </h2>
          {profile?.intake_complete && (
            <p style={{ fontSize: 10, color: 'var(--accent-teal)', fontFamily: "'DM Mono', monospace", marginTop: 2, letterSpacing: '0.06em' }}>
              INTAKE COMPLETADO
            </p>
          )}
        </div>
        <button
          onClick={onLogout}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: 'var(--text-muted)',
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.07)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.borderColor = 'rgba(255,107,107,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
        >
          cerrar sesión
        </button>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col gap-5">

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(0,229,196,0.04)', border: '1px solid rgba(0,229,196,0.08)' }}
            >
              <p style={{ fontSize: 26, fontFamily: "'DM Mono', monospace", color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1 }}>
                {s.value ?? '—'}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginTop: 5 }}>
                {s.unit ? `${s.unit} · ` : ''}{s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Goal */}
        {profile?.goal && (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'rgba(0,229,196,0.04)', border: '1px solid rgba(0,229,196,0.08)' }}
          >
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginBottom: 6, letterSpacing: '0.06em' }}>
              OBJETIVO
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: "'DM Mono', monospace", lineHeight: 1.55 }}>
              {profile.goal}
            </p>
          </div>
        )}

        {/* Activity */}
        {profile?.activity_level && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
            Actividad · {{
              sedentary: 'Sedentario',
              light: 'Ligero (1–3 días)',
              moderate: 'Moderado (3–5 días)',
              active: 'Activo (6–7 días)',
              very_active: 'Muy activo',
            }[profile.activity_level] ?? profile.activity_level}
          </p>
        )}

        {/* Conditions / meds / allergies */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span
                key={i}
                className="rounded-full px-3 py-1"
                style={{
                  backgroundColor: t.color,
                  border: `1px solid ${t.border}`,
                  color: 'var(--text-primary)',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}

        {/* Empty state — prompt to start intake */}
        {!loading && !profile?.intake_complete && (
          <div
            className="rounded-2xl p-6 flex flex-col items-center gap-3 mt-2"
            style={{ border: '1px dashed rgba(0,229,196,0.18)', backgroundColor: 'rgba(0,229,196,0.02)' }}
          >
            <p style={{ fontSize: 28 }}>🦦</p>
            <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", fontSize: 12, textAlign: 'center', lineHeight: 1.7 }}>
              {profile?.name
                ? `Hola ${profile.name}, aún no terminamos el intake.`
                : 'Habla con nutrIA para completar tu perfil clínico.'}
              <br />
              Desliza a la izquierda para continuar.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
