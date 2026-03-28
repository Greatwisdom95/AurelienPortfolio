import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StudentTracker from './StudentTracker'

gsap.registerPlugin(ScrollTrigger)

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

// ==================== SECTION WRAPPER ====================
const Section = ({ children, id, style = {} }) => (
    <section
        id={id}
        style={{
            minHeight: '100vh',
            padding: 'clamp(3rem, 8vw, 8rem) clamp(1.5rem, 5vw, 6rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            ...style,
        }}
    >
        {children}
    </section>
)

// ==================== ANIMATED TEXT ====================
const RevealText = ({ children, delay = 0, style = {} }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={style}
        >
            {children}
        </motion.div>
    )
}

// ==================== GLASS CARD ====================
const GlassCard = ({ children, onClick, selected, correct, revealed, style = {} }) => {
    const base = {
        background: revealed
            ? correct
                ? 'rgba(34, 197, 94, 0.15)'
                : selected
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(255, 255, 255, 0.03)'
            : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: revealed
            ? correct
                ? '1px solid rgba(34, 197, 94, 0.4)'
                : selected
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: 'clamp(1rem, 2vw, 1.5rem)',
        cursor: revealed ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        ...style,
    }

    return (
        <motion.div
            style={base}
            onClick={onClick}
            whileHover={!revealed ? { scale: 1.02, background: 'rgba(255, 255, 255, 0.08)' } : {}}
            whileTap={!revealed ? { scale: 0.98 } : {}}
        >
            {children}
        </motion.div>
    )
}

// ==================== QUIZ DATA ====================
const quizData = [
    {
        question: "Qu'est-ce que la perspective a 1 point de fuite ?",
        options: [
            "Un dessin ou toutes les lignes de profondeur convergent vers un seul point",
            "Un dessin avec un seul objet au centre",
            "Une technique pour dessiner un seul personnage",
            "Un dessin fait avec un seul crayon",
        ],
        correct: 0,
        explanation: "En perspective a 1 point de fuite, toutes les lignes de profondeur convergent vers un unique point sur la ligne d'horizon. C'est la base de la representation de l'espace.",
    },
    {
        question: "Quelle technique permet de creer du volume sur un dessin ?",
        options: [
            "Le coloriage uniforme",
            "Les hachures et le clair-obscur",
            "Le decoupage",
            "L'ecriture cursive",
        ],
        correct: 1,
        explanation: "Les hachures (lignes croisees) et le clair-obscur (jeu de lumiere et d'ombre) permettent de donner l'illusion de volume et de profondeur a un dessin 2D.",
    },
    {
        question: "Combien d'axes a la perspective isometrique ?",
        options: ["2 axes", "3 axes", "4 axes", "1 axe"],
        correct: 1,
        explanation: "La perspective isometrique utilise 3 axes a 120 degres les uns des autres. Elle est tres utilisee en design industriel et dans les jeux video retro.",
    },
    {
        question: "Le clair-obscur sert a...",
        options: [
            "Rendre un dessin plus colore",
            "Creer une illusion de volume par le contraste lumiere/ombre",
            "Dessiner uniquement la nuit",
            "Effacer les erreurs de dessin",
        ],
        correct: 1,
        explanation: "Le clair-obscur (chiaroscuro en italien) est une technique maitrisee par les grands peintres comme Caravage. Elle utilise des contrastes forts entre zones eclairees et zones sombres.",
    },
    {
        question: "Dans une BD, une case (vignette) montre...",
        options: [
            "Toujours un personnage seul",
            "Un moment precis de l'action, comme une photo d'un film",
            "Uniquement du texte",
            "Un dessin decoratif sans histoire",
        ],
        correct: 1,
        explanation: "Chaque case de BD capture un instant narratif precis. La succession des cases cree le rythme du recit, comme les plans d'un film.",
    },
]

// ==================== QUIZ COMPONENT ====================
const Quiz = () => {
    const [currentQ, setCurrentQ] = useState(0)
    const [selected, setSelected] = useState(null)
    const [revealed, setRevealed] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const handleSelect = (idx) => {
        if (revealed) return
        setSelected(idx)
        setRevealed(true)
        if (idx === quizData[currentQ].correct) {
            setScore((s) => s + 1)
        }
    }

    const handleNext = () => {
        if (currentQ < quizData.length - 1) {
            setCurrentQ((q) => q + 1)
            setSelected(null)
            setRevealed(false)
        } else {
            setFinished(true)
        }
    }

    const handleRestart = () => {
        setCurrentQ(0)
        setSelected(null)
        setRevealed(false)
        setScore(0)
        setFinished(false)
    }

    if (finished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '3rem 0' }}
            >
                <motion.div
                    style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', marginBottom: '1rem' }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {score >= 4 ? '\u2B50' : score >= 2 ? '\u{1F44D}' : '\u{1F4AA}'}
                </motion.div>
                <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {score} / {quizData.length}
                </h3>
                <p style={{ opacity: 0.6, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', marginBottom: '2rem' }}>
                    {score === 5
                        ? 'Parfait ! Tu maitrises les bases des arts plastiques.'
                        : score >= 3
                            ? 'Tres bien ! Continue comme ca.'
                            : 'Pas mal ! Reviens apres la JPO pour retenter.'}
                </p>
                <motion.button
                    onClick={handleRestart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        padding: '0.8rem 2rem',
                        borderRadius: '999px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    Recommencer
                </motion.button>
            </motion.div>
        )
    }

    const q = quizData[currentQ]

    return (
        <div>
            {/* Progress */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem' }}>
                {quizData.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '3px',
                            borderRadius: '2px',
                            background: i <= currentQ ? '#fff' : 'rgba(255,255,255,0.15)',
                            transition: 'background 0.3s ease',
                        }}
                    />
                ))}
            </div>

            {/* Question number */}
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, marginBottom: '0.5rem' }}>
                Question {currentQ + 1} / {quizData.length}
            </p>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.h3
                    key={currentQ}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: 700,
                        marginBottom: '2rem',
                        lineHeight: 1.3,
                    }}
                >
                    {q.question}
                </motion.h3>
            </AnimatePresence>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((opt, i) => (
                    <GlassCard
                        key={`${currentQ}-${i}`}
                        onClick={() => handleSelect(i)}
                        selected={selected === i}
                        correct={i === q.correct}
                        revealed={revealed}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    flexShrink: 0,
                                    background: revealed && i === q.correct
                                        ? 'rgba(34, 197, 94, 0.3)'
                                        : revealed && selected === i && i !== q.correct
                                            ? 'rgba(239, 68, 68, 0.3)'
                                            : 'transparent',
                                }}
                            >
                                {String.fromCharCode(65 + i)}
                            </span>
                            <span style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', lineHeight: 1.4 }}>{opt}</span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Explanation + Next */}
            <AnimatePresence>
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ marginTop: '1.5rem' }}
                    >
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '1.2rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '0.5rem' }}>
                                Explication
                            </p>
                            <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', lineHeight: 1.6, opacity: 0.8 }}>
                                {q.explanation}
                            </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <motion.button
                                onClick={handleNext}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: '#fff',
                                    color: '#000',
                                    border: 'none',
                                    padding: '0.7rem 2rem',
                                    borderRadius: '999px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                {currentQ < quizData.length - 1 ? 'Suivant \u2192' : 'Voir le score'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ==================== AXE CARD ====================
const AxeCard = ({ number, title, description, delay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Number watermark */}
            <span
                style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '10px',
                    fontSize: 'clamp(4rem, 8vw, 6rem)',
                    fontWeight: 900,
                    opacity: 0.04,
                    lineHeight: 1,
                    pointerEvents: 'none',
                }}
            >
                {String(number).padStart(2, '0')}
            </span>
            <div
                style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    opacity: 0.4,
                    marginBottom: '0.5rem',
                }}
            >
                Axe {number}
            </div>
            <h3
                style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    lineHeight: 1.2,
                }}
            >
                {title}
            </h3>
            <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', opacity: 0.6, lineHeight: 1.6 }}>
                {description}
            </p>
        </motion.div>
    )
}

// ==================== RESOURCE LINK ====================
const ResourceLink = ({ title, description, url, icon }) => (
    <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        style={{
            display: 'block',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            textDecoration: 'none',
            color: '#fff',
            transition: 'border-color 0.3s ease',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>{icon}</span>
            <div>
                <h4 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {title}
                </h4>
                <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', opacity: 0.5, lineHeight: 1.4 }}>
                    {description}
                </p>
            </div>
        </div>
    </motion.a>
)

// ==================== STAT CARD ====================
const StatCard = ({ value, label, delay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-60px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay }}
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {value}
            </div>
            <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {label}
            </div>
        </motion.div>
    )
}

// ==================== NAV ====================
const Nav = () => {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const links = [
        { label: 'Vision', href: '#vision' },
        { label: 'Axes', href: '#axes' },
        { label: 'Progression', href: '#progression' },
        { label: 'Galerie', href: '#galerie' },
        { label: 'Quiz', href: '#quiz' },
        { label: 'IA & Art', href: '#ia' },
        { label: 'Ressources', href: '#ressources' },
    ]

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '1rem clamp(1.5rem, 5vw, 4rem)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: scrolled ? 'rgba(0,0,0,0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'background 0.3s, backdrop-filter 0.3s',
            }}
        >
            <a href="#hero" style={{ textDecoration: 'none', color: '#fff' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>EPBL</span>
                <span style={{ fontWeight: 300, fontSize: '0.85rem', opacity: 0.5, marginLeft: '0.5rem' }}>Arts & Musique</span>
            </a>

            {/* Desktop links */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {links.map((l) => (
                    <a
                        key={l.href}
                        href={l.href}
                        className="nav-link-desktop"
                        style={{
                            textDecoration: 'none',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.8rem',
                            letterSpacing: '0.02em',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.target.style.color = '#fff')}
                        onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.6)')}
                    >
                        {l.label}
                    </a>
                ))}
            </div>

            {/* Mobile burger */}
            <button
                className="nav-burger"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                    display: 'none',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '8px',
                }}
                aria-label="Menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {menuOpen ? (
                        <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                    ) : (
                        <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                    )}
                </svg>
            </button>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="nav-mobile-overlay"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.95)',
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2rem',
                            zIndex: 99,
                        }}
                    >
                        {links.map((l, i) => (
                            <motion.a
                                key={l.href}
                                href={l.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    textDecoration: 'none',
                                    color: '#fff',
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                }}
                            >
                                {l.label}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

// ==================== AXES DATA ====================
const axes = [
    {
        title: 'Geste, motricite et precision graphique',
        description: 'Maitriser le trait : exercices de coordination main-oeil, controle du geste, precision des lignes droites et courbes. La base de tout dessin.',
    },
    {
        title: 'Formes et volumes',
        description: 'Comprendre les formes 2D et 3D : cube, sphere, cylindre. Technique des hachures, du clair-obscur et des ombres portees pour creer l\'illusion de profondeur.',
    },
    {
        title: 'Perspective et espace',
        description: 'Representer l\'espace : perspective a 1 point de fuite, 2 points de fuite, perspective isometrique. Construire des scenes architecturales credibles.',
    },
    {
        title: 'Calligraphie et lettrage',
        description: 'L\'art de la lettre : traceurs calligraphiques, lettrages decoratifs, typographie creative. Du geste manuscrit a la composition visuelle.',
    },
    {
        title: 'Narration visuelle (BD, storyboard)',
        description: 'Raconter en images : decoupage en cases, cadrage, angles de vue, rythme narratif. Du comic strip au storyboard cinematographique.',
    },
    {
        title: 'Image et musique',
        description: 'Synesthesie creatrice : traduire le son en image. Rythme visuel, couleurs emotionnelles, compositions dynamiques inspirees par la musique.',
    },
]

// ==================== MAIN COMPONENT ====================
export default function JPO() {
    const isMobile = useIsMobile()
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll()
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

    // GSAP hero animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-title-line', {
                y: 120,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
                delay: 0.3,
            })

            gsap.from('.hero-subtitle', {
                y: 40,
                opacity: 0,
                duration: 1,
                delay: 0.9,
                ease: 'power3.out',
            })

            // Parallax on scroll
            gsap.to('.hero-title-line', {
                yPercent: -50,
                opacity: 0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            })
        }, heroRef)

        return () => ctx.revert()
    }, [])

    // GSAP axe cards stagger
    useEffect(() => {
        ScrollTrigger.batch('.axe-card', {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'power3.out',
                })
            },
            start: 'top 85%',
            once: true,
        })
    }, [])

    // Scroll progress bar
    const scaleX = useTransform(smoothProgress, [0, 1], [0, 1])

    return (
        <div style={{ background: '#000', color: '#fff', fontFamily: "'Inter', -apple-system, sans-serif", overflowX: 'hidden' }}>
            {/* Global styles for responsive nav */}
            <style>{`
                @media (max-width: 768px) {
                    .nav-link-desktop { display: none !important; }
                    .nav-burger { display: block !important; }
                }
                @media (min-width: 769px) {
                    .nav-burger { display: none !important; }
                    .nav-mobile-overlay { display: none !important; }
                }
                html { scroll-behavior: smooth; }
                * { box-sizing: border-box; }
                ::selection { background: rgba(255,255,255,0.2); }
            `}</style>

            {/* Scroll progress */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#fff',
                    transformOrigin: '0%',
                    scaleX,
                    zIndex: 200,
                }}
            />

            <Nav />

            {/* ==================== HERO ==================== */}
            <section
                id="hero"
                ref={heroRef}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 'clamp(6rem, 15vw, 10rem) clamp(1.5rem, 5vw, 6rem) clamp(3rem, 8vw, 6rem)',
                    position: 'relative',
                }}
            >
                {/* Background gradient */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(ellipse at 30% 50%, rgba(40,40,80,0.15) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                        className="hero-subtitle"
                        style={{
                            fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            opacity: 0.4,
                            marginBottom: '1.5rem',
                        }}
                    >
                        EPBL \u2022 Journee Portes Ouvertes 2025-2026
                    </div>

                    <h1 style={{ margin: 0, lineHeight: 0.95 }}>
                        <div
                            className="hero-title-line"
                            style={{
                                fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                            }}
                        >
                            Arts
                        </div>
                        <div
                            className="hero-title-line"
                            style={{
                                fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                            }}
                        >
                            Plastiques
                        </div>
                        <div
                            className="hero-title-line"
                            style={{
                                fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                                fontWeight: 300,
                                letterSpacing: '-0.02em',
                                opacity: 0.5,
                            }}
                        >
                            & Musique
                        </div>
                    </h1>

                    <div
                        className="hero-subtitle"
                        style={{
                            marginTop: 'clamp(2rem, 4vw, 3rem)',
                            display: 'flex',
                            gap: '2rem',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', opacity: 0.6 }}>
                            Aurelien Karydas
                        </span>
                        <span style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                        <span style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', opacity: 0.4 }}>
                            1ere & 2e secondaire
                        </span>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: 0.3,
                    }}
                >
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Scroll</span>
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 4 L8 20 M2 14 L8 20 L14 14" />
                    </svg>
                </motion.div>
            </section>

            {/* ==================== VISION ==================== */}
            <Section id="vision">
                <RevealText>
                    <p style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        opacity: 0.3,
                        marginBottom: '1.5rem',
                    }}>
                        Notre vision
                    </p>
                </RevealText>
                <RevealText delay={0.15}>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        maxWidth: '900px',
                    }}>
                        Apprendre a voir,{' '}
                        <span style={{ opacity: 0.4, fontWeight: 300 }}>apprendre a construire,</span>{' '}
                        apprendre a raconter.
                    </h2>
                </RevealText>
                <RevealText delay={0.3}>
                    <p style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        lineHeight: 1.7,
                        opacity: 0.5,
                        maxWidth: '650px',
                        marginTop: '2rem',
                    }}>
                        Le cours d'Arts Plastiques et Musique a l'EPBL developpe 6 axes de competences fondamentales.
                        De la maitrise du geste a la narration visuelle, chaque eleve construit son vocabulaire artistique
                        a travers une progression structuree sur deux annees.
                    </p>
                </RevealText>
            </Section>

            {/* ==================== 6 AXES ==================== */}
            <Section id="axes">
                <RevealText>
                    <p style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        opacity: 0.3,
                        marginBottom: '1rem',
                    }}>
                        Programme
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        marginBottom: 'clamp(2rem, 5vw, 4rem)',
                    }}>
                        6 axes de competences
                    </h2>
                </RevealText>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 'clamp(1rem, 2vw, 1.5rem)',
                        maxWidth: '1200px',
                    }}
                >
                    {axes.map((axe, i) => (
                        <div key={i} className="axe-card" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <AxeCard number={i + 1} title={axe.title} description={axe.description} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* ==================== PROGRESSION ==================== */}
            <Section id="progression">
                <RevealText>
                    <p style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        opacity: 0.3,
                        marginBottom: '1rem',
                    }}>
                        Parcours
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        marginBottom: 'clamp(2rem, 5vw, 4rem)',
                    }}>
                        Deux annees de progression
                    </h2>
                </RevealText>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: 'clamp(1.5rem, 3vw, 2rem)',
                        maxWidth: '1000px',
                    }}
                >
                    {/* 1ere secondaire */}
                    <RevealText delay={0.1}>
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '24px',
                                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                            }}
                        >
                            <div style={{
                                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                                fontWeight: 800,
                                opacity: 0.08,
                                lineHeight: 1,
                                marginBottom: '-0.5rem',
                            }}>
                                01
                            </div>
                            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 700, marginBottom: '1rem' }}>
                                1ere secondaire
                            </h3>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '1rem' }}>
                                Les bases fondamentales
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {[
                                    'Trait et geste : lignes droites, courbes, spirales',
                                    'Hachures simples et croisees',
                                    'Perspective a 1 point de fuite',
                                    'Perspective isometrique',
                                    'Lettrage et initiales decoratives',
                                    'BD : case, bulle, onomatopee',
                                    'Rythme et son en dessin',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            padding: '0.5rem 0',
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                                            opacity: 0.7,
                                            display: 'flex',
                                            gap: '0.75rem',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <span style={{ opacity: 0.3, flexShrink: 0 }}>\u2014</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </RevealText>

                    {/* 2e secondaire */}
                    <RevealText delay={0.25}>
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '24px',
                                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                            }}
                        >
                            <div style={{
                                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                                fontWeight: 800,
                                opacity: 0.08,
                                lineHeight: 1,
                                marginBottom: '-0.5rem',
                            }}>
                                02
                            </div>
                            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 700, marginBottom: '1rem' }}>
                                2e secondaire
                            </h3>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '1rem' }}>
                                Approfondissement
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {[
                                    'Clair-obscur et valeurs de gris',
                                    'Perspective a 2 points de fuite',
                                    'Perspective atmospherique',
                                    'Calligraphie expressive',
                                    'Storyboard cinematographique',
                                    'Character design et personnages',
                                    'Synesthesie : musique et couleur',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            padding: '0.5rem 0',
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                                            opacity: 0.7,
                                            display: 'flex',
                                            gap: '0.75rem',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <span style={{ opacity: 0.3, flexShrink: 0 }}>\u2014</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </RevealText>
                </div>
            </Section>

            {/* ==================== GALLERY ==================== */}
            <Section id="galerie" style={{ minHeight: 'auto', padding: 'clamp(3rem, 8vw, 8rem) 0' }}>
                <div style={{ padding: '0 clamp(1.5rem, 5vw, 6rem)', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                    <RevealText>
                        <p style={{
                            fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            opacity: 0.3,
                            marginBottom: '1rem',
                        }}>
                            Travaux d'eleves
                        </p>
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                        }}>
                            Galerie
                        </h2>
                    </RevealText>
                </div>
                <StudentTracker />
            </Section>

            {/* ==================== QUIZ ==================== */}
            <Section id="quiz">
                <RevealText>
                    <p style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        opacity: 0.3,
                        marginBottom: '1rem',
                    }}>
                        Teste tes connaissances
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        marginBottom: 'clamp(2rem, 5vw, 3rem)',
                    }}>
                        Quiz Arts Plastiques
                    </h2>
                </RevealText>

                <div style={{ maxWidth: '700px' }}>
                    <Quiz />
                </div>
            </Section>

            {/* ==================== IA & ART ==================== */}
            <Section id="ia">
                <RevealText>
                    <p style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        opacity: 0.3,
                        marginBottom: '1rem',
                    }}>
                        Innovation
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        marginBottom: '1.5rem',
                        maxWidth: '700px',
                    }}>
                        L'IA au service de la creativite
                    </h2>
                </RevealText>

                <RevealText delay={0.15}>
                    <p style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        lineHeight: 1.7,
                        opacity: 0.5,
                        maxWidth: '650px',
                        marginBottom: 'clamp(2rem, 5vw, 4rem)',
                    }}>
                        L'intelligence artificielle ne remplace pas l'artiste -- elle amplifie sa vision.
                        Au cours d'Arts Plastiques, nous integrons les outils IA comme accelerateurs de
                        creativite, tout en renfor\u00E7ant les competences fondamentales du dessin a la main.
                    </p>
                </RevealText>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                        gap: 'clamp(0.75rem, 2vw, 1.5rem)',
                        maxWidth: '900px',
                        marginBottom: 'clamp(2rem, 5vw, 4rem)',
                    }}
                >
                    <StatCard value="86%" label="Eleves utilisent l'IA" delay={0} />
                    <StatCard value="$8.7B" label="Investissement IA en RDC" delay={0.1} />
                    <StatCard value="6" label="Outils IA integres" delay={0.2} />
                    <StatCard value="2x" label="Productivite creative" delay={0.3} />
                </div>

                <RevealText delay={0.2}>
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '20px',
                            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                            maxWidth: '800px',
                        }}
                    >
                        <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 700, marginBottom: '1rem' }}>
                            Comment l'IA enrichit le cours
                        </h3>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                gap: '1rem',
                            }}
                        >
                            {[
                                { title: 'Generation d\'idees', desc: 'Brainstorming visuel avec Claude et Canva' },
                                { title: 'References visuelles', desc: 'NightCafe pour explorer des styles artistiques' },
                                { title: 'Quick Draw', desc: 'Entrainement ludique au dessin rapide avec l\'IA Google' },
                                { title: 'Analyse d\'oeuvres', desc: 'Comprendre les techniques des maitres grace a l\'IA' },
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <h4 style={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', opacity: 0.5, lineHeight: 1.5 }}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </RevealText>
            </Section>

            {/* ==================== RESOURCES ==================== */}
            <Section id="ressources">
                <RevealText>
                    <p style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        opacity: 0.3,
                        marginBottom: '1rem',
                    }}>
                        Boite a outils
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        marginBottom: 'clamp(2rem, 5vw, 3rem)',
                    }}>
                        Ressources
                    </h2>
                </RevealText>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'clamp(0.75rem, 2vw, 1rem)',
                        maxWidth: '900px',
                    }}
                >
                    <RevealText delay={0.05}>
                        <ResourceLink
                            title="Claude AI"
                            description="Assistant IA pour la recherche, le brainstorming et l'analyse d'oeuvres"
                            url="https://claude.ai"
                            icon="\u{1F916}"
                        />
                    </RevealText>
                    <RevealText delay={0.1}>
                        <ResourceLink
                            title="Canva"
                            description="Design graphique, collages, affiches et presentations visuelles"
                            url="https://canva.com"
                            icon="\u{1F3A8}"
                        />
                    </RevealText>
                    <RevealText delay={0.15}>
                        <ResourceLink
                            title="NightCafe Studio"
                            description="Generation d'images IA pour explorer des styles et techniques artistiques"
                            url="https://nightcafe.studio"
                            icon="\u{1F5BC}\uFE0F"
                        />
                    </RevealText>
                    <RevealText delay={0.2}>
                        <ResourceLink
                            title="Quick, Draw!"
                            description="Jeu Google pour entrainer le dessin rapide et la reconnaissance IA"
                            url="https://quickdraw.withgoogle.com"
                            icon="\u270D\uFE0F"
                        />
                    </RevealText>
                </div>
            </Section>

            {/* ==================== FOOTER ==================== */}
            <footer
                style={{
                    padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 6rem)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'center' : 'flex-end',
                    gap: '1.5rem',
                }}
            >
                <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                        EPBL
                    </h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.4 }}>
                        Arts Plastiques & Musique \u2022 2025-2026
                    </p>
                </div>
                <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
                    <p style={{ fontSize: '0.8rem', opacity: 0.3 }}>
                        Aurelien Karydas \u2022 Lubumbashi, RDC
                    </p>
                    <p style={{ fontSize: '0.7rem', opacity: 0.2, marginTop: '0.25rem' }}>
                        Construit avec React, Framer Motion & GSAP
                    </p>
                </div>
            </footer>
        </div>
    )
}
