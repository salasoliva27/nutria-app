import { useState, useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { MainPage } from '../../pages/MainPage.jsx'
import { DashboardPage } from '../../pages/DashboardPage.jsx'

export function PageCarousel({ userId, onLogout }) {
  const [page, setPage] = useState(0)
  const x = useMotionValue(0)
  const dragStart = useRef(0)
  const containerRef = useRef(null)

  function onDragStart() {
    dragStart.current = x.get()
  }

  function onDragEnd() {
    const delta = x.get() - dragStart.current
    if (delta < -60 && page === 0) setPage(1)
    else if (delta > 60 && page === 1) setPage(0)
  }

  return (
    <div ref={containerRef} className="relative h-full overflow-hidden" style={{ backgroundColor: 'rgba(8,12,16,0.87)' }}>
      <motion.div
        className="flex h-full"
        style={{ width: '200%' }}
        animate={{ x: page === 0 ? '0%' : '-50%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        drag="x"
        dragConstraints={{ left: -20, right: 20 }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="h-full" style={{ width: '50%' }}>
          <MainPage userId={userId} />
        </div>
        <div className="h-full" style={{ width: '50%' }}>
          <DashboardPage userId={userId} onLogout={onLogout} />
        </div>
      </motion.div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className="rounded-full transition-all"
            style={{
              width: page === i ? 20 : 6,
              height: 6,
              backgroundColor: page === i ? 'var(--accent-teal)' : 'rgba(0,229,196,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
