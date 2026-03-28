import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { students, classes } from './data/students'

// ==================== HOOKS ====================
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    return isMobile
}

// ==================== PLACEHOLDER IMAGE ====================
const PlaceholderImage = ({ technique, name }) => {
    // Generate a deterministic color from the technique name
    const hash = technique.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const hue = hash % 360
    const patterns = [
        // Geometric shapes as SVG placeholders
        `<rect x="20" y="20" width="60" height="60" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`,
        `<circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`,
        `<polygon points="50,15 85,85 15,85" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`,
        `<line x1="10" y1="90" x2="90" y2="10" stroke="rgba(255,255,255,0.08)" stroke-width="1"/><line x1="10" y1="10" x2="90" y2="90" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`,
    ]
    const pattern = patterns[hash % patterns.length]

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, hsl(${hue}, 15%, 8%) 0%, hsl(${(hue + 40) % 360}, 10%, 5%) 100%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* SVG pattern */}
            <svg
                viewBox="0 0 100 100"
                style={{
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    opacity: 0.6,
                }}
                dangerouslySetInnerHTML={{ __html: pattern }}
            />
            {/* Initials */}
            <span
                style={{
                    position: 'relative',
                    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                    fontWeight: 800,
                    opacity: 0.12,
                    letterSpacing: '0.05em',
                }}
            >
                {name.split(' ').map(w => w[0]).join('')}
            </span>
        </div>
    )
}

// ==================== STUDENT CARD ====================
const StudentCard = ({ student, layout, delay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-40px' })
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)

    const isLandscape = layout === 'landscape'

    const gradeColor = (grade) => {
        if (grade.startsWith('A+')) return 'rgba(34, 197, 94, 0.8)'
        if (grade.startsWith('A')) return 'rgba(34, 197, 94, 0.6)'
        if (grade.startsWith('B+')) return 'rgba(250, 204, 21, 0.7)'
        return 'rgba(250, 204, 21, 0.5)'
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'default',
                display: isLandscape ? 'flex' : 'block',
                transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
            {/* Thumbnail */}
            <div
                style={{
                    width: isLandscape ? '140px' : '100%',
                    height: isLandscape ? '100%' : '180px',
                    minHeight: isLandscape ? '120px' : undefined,
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {!imgError ? (
                    <img
                        src={student.thumbnail}
                        alt={`${student.name} - ${student.technique}`}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: imgLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                        }}
                    />
                ) : null}
                {(!imgLoaded || imgError) && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                        <PlaceholderImage technique={student.technique} name={student.name} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: 600, lineHeight: 1.2 }}>
                        {student.name}
                    </h4>
                    <span
                        style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: gradeColor(student.grade),
                            background: 'rgba(255,255,255,0.05)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            flexShrink: 0,
                            marginLeft: '0.5rem',
                        }}
                    >
                        {student.grade}
                    </span>
                </div>

                <p style={{
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                    opacity: 0.5,
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                }}>
                    {student.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                        style={{
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            opacity: 0.35,
                            background: 'rgba(255,255,255,0.05)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                        }}
                    >
                        {student.technique}
                    </span>
                    <span
                        style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            opacity: 0.3,
                        }}
                    >
                        {student.classe}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

// ==================== FILTER BUTTON ====================
const FilterBtn = ({ label, active, onClick, count }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
            background: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: active ? 600 : 400,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
        }}
    >
        {label}
        {count !== undefined && (
            <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>({count})</span>
        )}
    </motion.button>
)

// ==================== MAIN COMPONENT ====================
export default function StudentTracker() {
    const [activeClass, setActiveClass] = useState('all')
    const [layout, setLayout] = useState('portrait') // 'portrait' | 'landscape'
    const isMobile = useIsMobile()

    const filtered = useMemo(() => {
        if (activeClass === 'all') return students
        return students.filter((s) => s.classe === activeClass)
    }, [activeClass])

    const classCounts = useMemo(() => {
        const counts = { all: students.length }
        classes.forEach((c) => {
            counts[c] = students.filter((s) => s.classe === c).length
        })
        return counts
    }, [])

    return (
        <div style={{ padding: '0 clamp(1.5rem, 5vw, 6rem)' }}>
            {/* Controls */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <FilterBtn
                        label="Tous"
                        active={activeClass === 'all'}
                        onClick={() => setActiveClass('all')}
                        count={classCounts.all}
                    />
                    {classes.map((c) => (
                        <FilterBtn
                            key={c}
                            label={c}
                            active={activeClass === c}
                            onClick={() => setActiveClass(c)}
                            count={classCounts[c]}
                        />
                    ))}
                </div>

                {/* Layout toggle */}
                <div
                    style={{
                        display: 'flex',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                    }}
                >
                    <button
                        onClick={() => setLayout('portrait')}
                        aria-label="Grille portrait"
                        style={{
                            background: layout === 'portrait' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: 'none',
                            color: '#fff',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: layout === 'portrait' ? 1 : 0.4,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {/* Grid icon */}
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="1" y="1" width="6" height="7" rx="1" />
                            <rect x="11" y="1" width="6" height="7" rx="1" />
                            <rect x="1" y="10" width="6" height="7" rx="1" />
                            <rect x="11" y="10" width="6" height="7" rx="1" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setLayout('landscape')}
                        aria-label="Liste paysage"
                        style={{
                            background: layout === 'landscape' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: 'none',
                            color: '#fff',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: layout === 'landscape' ? 1 : 0.4,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {/* List icon */}
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="1" y="1" width="16" height="4" rx="1" />
                            <rect x="1" y="7" width="16" height="4" rx="1" />
                            <rect x="1" y="13" width="16" height="4" rx="1" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${activeClass}-${layout}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            layout === 'landscape'
                                ? isMobile
                                    ? '1fr'
                                    : 'repeat(auto-fill, minmax(400px, 1fr))'
                                : isMobile
                                    ? 'repeat(2, 1fr)'
                                    : 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: 'clamp(0.75rem, 2vw, 1rem)',
                    }}
                >
                    {filtered.map((student, i) => (
                        <StudentCard key={student.id} student={student} layout={layout} delay={i} />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.3 }}>
                    <p style={{ fontSize: '1.2rem' }}>Aucun travail dans cette classe.</p>
                </div>
            )}

            {/* Count */}
            <p
                style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    fontSize: '0.75rem',
                    opacity: 0.25,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                }}
            >
                {filtered.length} travaux affiches
            </p>
        </div>
    )
}
