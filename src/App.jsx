import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== STYLES ====================
const styles = {
    container: {
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        overflowX: 'hidden',
    },
    section: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '5rem 3rem',
    },
}

// ==================== ANIMATED TEXT COMPONENT ====================
const AnimatedText = ({ children, delay = 0, className = '' }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 80 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 1.2,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// ==================== SPLIT TEXT ANIMATION ====================
const SplitText = ({ children, delay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const words = children.split(' ')

    return (
        <span ref={ref} style={{ display: 'inline' }}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                    transition={{
                        duration: 0.8,
                        delay: delay + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                        display: 'inline-block',
                        marginRight: '0.3em',
                        transformOrigin: 'bottom',
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    )
}

// ==================== AUTO TYPING TEXT ====================
const TypingText = ({ texts, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000 }) => {
    const [currentText, setCurrentText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const text = texts[currentIndex]

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < text.length) {
                    setCurrentText(text.slice(0, currentText.length + 1))
                } else {
                    setTimeout(() => setIsDeleting(true), pauseTime)
                }
            } else {
                if (currentText.length > 0) {
                    setCurrentText(text.slice(0, currentText.length - 1))
                } else {
                    setIsDeleting(false)
                    setCurrentIndex((prev) => (prev + 1) % texts.length)
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed)

        return () => clearTimeout(timeout)
    }, [currentText, currentIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseTime])

    return (
        <span>
            {currentText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ display: 'inline-block', width: '3px', height: '1em', background: '#fff', marginLeft: '2px', verticalAlign: 'middle' }}
            />
        </span>
    )
}

// ==================== MARQUEE TEXT ====================
const MarqueeText = ({ children, speed = 20 }) => {
    return (
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-flex', gap: '4rem' }}
            >
                {[...Array(4)].map((_, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4rem' }}>
                        {children}
                        <span style={{ opacity: 0.3 }}>✦</span>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

// ==================== HORIZONTAL SCROLL SECTION ====================
const HorizontalScroll = ({ children }) => {
    const containerRef = useRef(null)
    const scrollRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        const scroll = scrollRef.current
        if (!container || !scroll) return

        const scrollWidth = scroll.scrollWidth - window.innerWidth

        gsap.to(scroll, {
            x: -scrollWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: () => `+=${scrollWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
            },
        })

        return () => ScrollTrigger.getAll().forEach(t => t.kill())
    }, [])

    return (
        <div ref={containerRef} style={{ overflow: 'hidden' }}>
            <div ref={scrollRef} style={{ display: 'flex', width: 'max-content' }}>
                {children}
            </div>
        </div>
    )
}

// ==================== PARALLAX IMAGE ====================
const ParallaxImage = ({ src, alt, speed = 0.5 }) => {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2])

    return (
        <div ref={ref} style={{ overflow: 'hidden', height: '100%', width: '100%' }}>
            <motion.div
                style={{ y, scale, height: '120%', width: '100%' }}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#333',
                    fontSize: '0.8rem',
                }}>
                    {alt}
                </div>
            </motion.div>
        </div>
    )
}

// ==================== MAGNETIC BUTTON ====================
const MagneticButton = ({ children, href = '#' }) => {
    const ref = useRef(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouse = (e) => {
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const x = (clientX - left - width / 2) * 0.3
        const y = (clientY - top - height / 2) * 0.3
        setPosition({ x, y })
    }

    const reset = () => setPosition({ x: 0, y: 0 })

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            style={{
                display: 'inline-flex',
                padding: '1.2rem 2.5rem',
                border: '1px solid #fff',
                borderRadius: '100px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
            }}
            whileHover={{ background: '#fff', color: '#000' }}
        >
            {children}
        </motion.a>
    )
}

// ==================== INFINITE MARQUEE IMAGE ====================
const InfiniteMarquee = ({ images, speed = 15 }) => {
    return (
        <div style={{ overflow: 'hidden', display: 'flex', width: '100%', height: '100%' }}>
            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', height: '100%' }}
            >
                {[...images, ...images].map((src, i) => (
                    <div key={i} style={{
                        flexShrink: 0,
                        width: '300px',
                        height: '100%',
                        paddingRight: '1rem',
                        position: 'relative'
                    }}>
                        <img
                            src={src}
                            alt={`Gallery item ${i}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// ==================== SKILL ITEM ====================
const SkillItem = ({ icon, title, index }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            <span style={{ fontSize: '2rem' }}>{icon}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>{title}</span>
        </motion.div>
    )
}

// ==================== MAIN APP ====================
function App() {
    const containerRef = useRef(null)
    const heroRef = useRef(null)

    const { scrollYProgress } = useScroll()
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

    const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9])
    const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0])

    // Roles for typing animation
    const roles = [
        'Creative Technologist',
        'Image Manipulator',
        'Automation Architect',
        'Full-Stack Builder',
        'Data & Management Analyst',
        'Technical Trainer',
    ]

    const skills = [
        { icon: '◈', title: 'Creative AI & Image Generation' },
        { icon: '◈', title: 'Automation & Intelligent Workflows' },
        { icon: '◈', title: 'Full-Stack Development' },
        { icon: '◈', title: 'Data Analysis & Management (Excel/VBA)' },
        { icon: '◈', title: '3D Visualization & VR' },
        { icon: '◈', title: 'Branding & Visual Identity' },
        { icon: '◈', title: 'Technical Training & Workshops' },
    ]

    return (
        <div ref={containerRef} style={styles.container}>

            {/* Progress Bar */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#fff',
                    transformOrigin: 'left',
                    scaleX: smoothProgress,
                    zIndex: 1000,
                }}
            />

            {/* ========== HERO SECTION ========== */}
            <motion.section
                ref={heroRef}
                style={{
                    ...styles.section,
                    minHeight: '100vh',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    scale: heroScale,
                    opacity: heroOpacity,
                }}
            >
                {/* Large Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        fontSize: 'clamp(4rem, 20vw, 15rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.05em',
                        lineHeight: 0.9,
                        textAlign: 'center',
                        margin: 0,
                    }}
                >
                    Aurelien
                </motion.h1>

                {/* Typing Subtitle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    style={{
                        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                        fontWeight: 300,
                        marginTop: '2rem',
                        color: 'rgba(255,255,255,0.6)',
                        height: '2em',
                    }}
                >
                    <TypingText texts={roles} />
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    style={{
                        position: 'absolute',
                        bottom: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ fontSize: '1.5rem' }}
                    >
                        ↓
                    </motion.div>
                    <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', opacity: 0.5 }}>SCROLL</span>
                </motion.div>
            </motion.section>

            {/* ========== MARQUEE SECTION ========== */}
            <section style={{ padding: '3rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <MarqueeText speed={25}>
                    <span style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 500, opacity: 0.7 }}>
                        CREATIVE TECHNOLOGIST
                    </span>
                    <span style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 500, opacity: 0.7 }}>
                        BASED IN LUBUMBASHI
                    </span>
                    <span style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 500, opacity: 0.7 }}>
                        AVAILABLE FOR PROJECTS
                    </span>
                </MarqueeText>
            </section>

            {/* ========== ABOUT SECTION ========== */}
            <section style={{ ...styles.section, alignItems: 'flex-start', minHeight: 'auto', padding: '8rem 5vw' }}>
                <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
                    <AnimatedText>
                        <span style={{
                            fontSize: '0.8rem',
                            letterSpacing: '0.2em',
                            opacity: 0.5,
                            display: 'block',
                            marginBottom: '2rem',
                        }}>
                            ABOUT
                        </span>
                    </AnimatedText>

                    <AnimatedText delay={0.2}>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            maxWidth: '1000px',
                            marginBottom: '4rem',
                        }}>
                            <SplitText delay={0.3}>
                                Creative Technologist. AI Pioneer. Community Builder.
                            </SplitText>
                        </h2>
                    </AnimatedText>

                    {/* Three-column grid for About content */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', marginTop: '3rem' }}>

                        {/* Origins */}
                        <AnimatedText delay={0.4}>
                            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', opacity: 0.9 }}>
                                    Origins
                                </h3>
                                <p style={{ fontSize: '1rem', lineHeight: 1.9, opacity: 0.7 }}>
                                    Born and raised in <strong>Lubumbashi</strong>, I speak <strong>Swahili, French, and English</strong>.
                                    My local roots give me a unique perspective — I understand my community deeply
                                    and bridge worlds between tradition and innovation.
                                </p>
                            </div>
                        </AnimatedText>

                        {/* Journey */}
                        <AnimatedText delay={0.5}>
                            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', opacity: 0.9 }}>
                                    Journey
                                </h3>
                                <p style={{ fontSize: '1rem', lineHeight: 1.9, opacity: 0.7 }}>
                                    From <strong>traditional painting</strong> to <strong>AI-powered creation</strong>,
                                    my path spans Adobe Suite, 3D animation, and now generative AI.
                                    I've embraced each technological leap to amplify human creativity.
                                </p>
                            </div>
                        </AnimatedText>

                        {/* Impact */}
                        <AnimatedText delay={0.6}>
                            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', opacity: 0.9 }}>
                                    Impact
                                </h3>
                                <p style={{ fontSize: '1rem', lineHeight: 1.9, opacity: 0.7 }}>
                                    With AI as my ally, I deliver the output of <strong>20-30 professionals</strong>.
                                    From managing events with <strong>2000+ attendees</strong> to training the next generation —
                                    I multiply possibilities.
                                </p>
                            </div>
                        </AnimatedText>
                    </div>

                    {/* Philosophy Quote */}
                    <AnimatedText delay={0.8}>
                        <div style={{
                            marginTop: '5rem',
                            padding: '3rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <p style={{
                                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                                fontStyle: 'italic',
                                lineHeight: 1.6,
                                opacity: 0.8,
                                maxWidth: '800px',
                            }}>
                                "Noblesse oblige — those with the capacity to help are morally obligated to do so."
                            </p>
                            <span style={{ display: 'block', marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.5 }}>
                                — My guiding philosophy
                            </span>
                        </div>
                    </AnimatedText>
                </div>
            </section>

            {/* ========== SKILLS SECTION ========== */}
            <section style={{ ...styles.section, background: '#0a0a0a' }}>
                <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
                    <AnimatedText>
                        <span style={{
                            fontSize: '0.8rem',
                            letterSpacing: '0.2em',
                            opacity: 0.5,
                            display: 'block',
                            marginBottom: '2rem',
                        }}>
                            EXPERTISE
                        </span>
                    </AnimatedText>

                    <AnimatedText delay={0.1}>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 600,
                            marginBottom: '3rem',
                        }}>
                            What I Do Best
                        </h2>
                    </AnimatedText>

                    <div>
                        {skills.map((skill, i) => (
                            <SkillItem key={skill.title} {...skill} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== WORK SECTION ========== */}
            <section style={{ ...styles.section, flexDirection: 'column', gap: '6rem', padding: '8rem 0' }}>

                {/* Section Header */}
                <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 5vw' }}>
                    <AnimatedText>
                        <span style={{
                            fontSize: '0.8rem',
                            letterSpacing: '0.2em',
                            opacity: 0.5,
                            display: 'block',
                            marginBottom: '2rem',
                        }}>
                            SELECTED WORK
                        </span>
                    </AnimatedText>

                    <AnimatedText delay={0.1}>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 600,
                            marginBottom: '2rem',
                        }}>
                            Projects
                        </h2>
                    </AnimatedText>
                </div>

                {/* ===== UNIFIED VIDEO GRID ===== */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '350px 1fr',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 5vw',
                }}>
                    {/* LEFT COLUMN - Portrait Videos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
                                        AR / 3D
                                    </span>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                                        Immersive 3D Capture
                                    </h3>
                                </div>
                                <button
                                    onClick={() => { document.getElementById('arVideo').muted = !document.getElementById('arVideo').muted; }}
                                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, padding: '4px' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                </button>
                            </div>
                            <video
                                id="arVideo"
                                src="/assets/videos/AR 3D/5B2ECB90-3246-4ACA-875E-474480F6AA4F.mp4"
                                autoPlay muted loop playsInline preload="metadata"
                                style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </motion.div>

                        {/* Food Branding - Portrait */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
                                        Food Branding
                                    </span>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                                        Mr & Mrs Fries
                                    </h3>
                                </div>
                                <button
                                    onClick={() => { document.getElementById('foodVideo').muted = !document.getElementById('foodVideo').muted; }}
                                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, padding: '4px' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                </button>
                            </div>
                            <video
                                id="foodVideo"
                                src="/assets/videos/FoodBrand/Mr & Mrs Fries/1A54FC2C-6C0C-4A94-B579-B8D862F92921.MP4"
                                autoPlay muted loop playsInline preload="metadata"
                                style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN - Landscape Videos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                        {/* Motion Design - Landscape */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
                                        Motion Design
                                    </span>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                                        Logo Animation
                                    </h3>
                                </div>
                                <button
                                    onClick={() => { document.getElementById('motionVideo').muted = !document.getElementById('motionVideo').muted; }}
                                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, padding: '4px' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                </button>
                            </div>
                            <video
                                id="motionVideo"
                                src="/assets/videos/motion-design/Agrizex/agrizex-logo-1.mp4"
                                autoPlay muted loop playsInline preload="metadata"
                                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </motion.div>

                        {/* Website - Landscape with Sound */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
                                        Web Development
                                    </span>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                                        Website Showcase
                                    </h3>
                                </div>
                                <button
                                    onClick={() => { document.getElementById('websiteVideo').muted = !document.getElementById('websiteVideo').muted; }}
                                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, padding: '4px' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                </button>
                            </div>
                            <video
                                id="websiteVideo"
                                src="/assets/videos/FullStackWebsite/jolisite website (1).mp4"
                                autoPlay muted loop playsInline preload="metadata"
                                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* ===== AI BRANDING - Full Width Marquee ===== */}
                <div style={{ width: '100%' }}>
                    <div style={{ padding: '0 5vw', marginBottom: '2rem' }}>
                        <AnimatedText>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>
                                AI Branding — Mokonzi Fashion
                            </span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                AI-Generated Fashion Visuals
                            </h3>
                        </AnimatedText>
                    </div>
                    <MarqueeText speed={40}>
                        {[
                            '/assets/Images/ClothesBrand/Mokonzi/Mokonzi_00006_.webp',
                            '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00336_.webp',
                            '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00338_.webp',
                            '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00339_.webp',
                            '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00374_.webp',
                            '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00383_.webp',
                        ].map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Mokonzi ${i}`}
                                loading="lazy"
                                style={{
                                    height: '400px',
                                    width: 'auto',
                                    objectFit: 'cover',
                                    marginRight: '1rem',
                                }}
                            />
                        ))}
                    </MarqueeText>
                </div>

                {/* ===== VISUAL IDENTITY - Full Width Marquee ===== */}
                <div style={{ width: '100%' }}>
                    <div style={{ padding: '0 5vw', marginBottom: '2rem' }}>
                        <AnimatedText>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>
                                Visual Identity — Brasimba
                            </span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                Beverage Brand Campaign
                            </h3>
                        </AnimatedText>
                    </div>
                    <MarqueeText speed={35}>
                        {[
                            '/assets/Images/DrinksBrand/Brasimba/ComfyUI_00098_.webp',
                            '/assets/Images/DrinksBrand/Brasimba/ComfyUI_00069_.webp',
                            '/assets/Images/DrinksBrand/Brasimba/ComfyUI_00098_.webp',
                            '/assets/Images/DrinksBrand/Brasimba/ComfyUI_00069_.webp',
                        ].map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Brasimba ${i}`}
                                loading="lazy"
                                style={{
                                    height: '350px',
                                    width: 'auto',
                                    objectFit: 'cover',
                                    marginRight: '1rem',
                                }}
                            />
                        ))}
                    </MarqueeText>
                </div>

                {/* ===== AI BRANDING - LubumArt Marquee ===== */}
                <div style={{ width: '100%' }}>
                    <div style={{ padding: '0 5vw', marginBottom: '2rem' }}>
                        <AnimatedText>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>
                                AI Branding — LubumArt
                            </span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                Local Fashion Identity
                            </h3>
                        </AnimatedText>
                    </div>
                    <MarqueeText speed={30}>
                        {[
                            '/assets/Images/ClothesBrand/LubumArt/KimomosOnGreen.webp',
                            '/assets/Images/ClothesBrand/LubumArt/LubumArt_Fashion_01.webp',
                            '/assets/Images/ClothesBrand/LubumArt/LubumArt_Fashion_02.webp',
                            '/assets/Images/ClothesBrand/LubumArt/LubumArt_Fashion_03.webp',
                            '/assets/Images/ClothesBrand/LubumArt/LubumArt_Fashion_04.webp',
                        ].map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`LubumArt ${i}`}
                                loading="lazy"
                                style={{
                                    height: '400px',
                                    width: 'auto',
                                    objectFit: 'cover',
                                    marginRight: '1rem',
                                }}
                            />
                        ))}
                    </MarqueeText>
                </div>

            </section>

            {/* ========== FEATURED CLIENT SECTION - IMMOROSE/MIROIRMALL ========== */}
            <section style={{ ...styles.section, flexDirection: 'column', gap: '6rem', padding: '8rem 0' }}>

                {/* Section Header */}
                <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 5vw' }}>
                    <AnimatedText>
                        <span style={{
                            fontSize: '0.8rem',
                            letterSpacing: '0.2em',
                            opacity: 0.5,
                            display: 'block',
                            marginBottom: '2rem',
                        }}>
                            FEATURED CLIENT
                        </span>
                    </AnimatedText>

                    <AnimatedText delay={0.1}>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 600,
                            marginBottom: '2rem',
                        }}>
                            ImmoRose × MiroirMall
                        </h2>
                    </AnimatedText>
                </div>

                {/* ===== IMMOROSE - Portrait Video (Left) + Text (Right) ===== */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '350px 1fr',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 5vw',
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
                                    Brand Identity
                                </span>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                                    ImmoRose — Logo Animation
                                </h3>
                            </div>
                            <button
                                onClick={() => { document.getElementById('immoroseVideo').muted = !document.getElementById('immoroseVideo').muted; }}
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, padding: '4px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                            </button>
                        </div>
                        <video
                            id="immoroseVideo"
                            src="/assets/videos/FeaturedCLIENTImmorose/Logo immorose animation/084FEDFC-0985-4CFC-A52D-104CA7011B9D (1).mp4"
                            autoPlay muted loop playsInline preload="metadata"
                            style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', borderRadius: '12px' }}
                        />
                    </motion.div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <AnimatedText>
                            <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                                <SplitText delay={0.2}>ImmoRose</SplitText>
                            </h3>
                        </AnimatedText>
                        <AnimatedText delay={0.1}>
                            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.9, opacity: 0.7, marginBottom: '1.5rem' }}>
                                <strong>First luxury real estate promoter in DRC</strong> — pioneering high-end construction in the Democratic Republic of Congo since 2019.
                            </p>
                        </AnimatedText>
                        <AnimatedText delay={0.2}>
                            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.9, opacity: 0.7 }}>
                                ImmoRose transforms the Congolese urban landscape with innovative residential and commercial projects, combining international quality standards with local market understanding.
                            </p>
                        </AnimatedText>
                    </div>
                </div>

                {/* ImmoRose Metrics Marquee */}
                <section style={{ padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <MarqueeText speed={50}>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            FOUNDED 2019
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            KINSHASA HQ
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            FIRST LUXURY PROMOTER IN DRC
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            9 CARATS VILLAS PROJECT
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            HIGH-END REAL ESTATE
                        </span>
                    </MarqueeText>
                </section>

                {/* ===== MIROIR MALL - Text (Left) + Portrait Video (Right) ===== */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 350px',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 5vw',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <AnimatedText>
                            <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                                <SplitText delay={0.2}>Miroir Mall</SplitText>
                            </h3>
                        </AnimatedText>
                        <AnimatedText delay={0.1}>
                            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.9, opacity: 0.7, marginBottom: '1.5rem' }}>
                                <strong>The largest shopping mall in DRC</strong> — 30,000 m² total surface with 18,000 m² dedicated to the main retail structure. Located at the prestigious Lac Kipopo in Lubumbashi.
                            </p>
                        </AnimatedText>
                        <AnimatedText delay={0.2}>
                            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.9, opacity: 0.7 }}>
                                A landmark destination bringing together over 100 brands, entertainment venues, and premium dining experiences. Grand opening scheduled for December 2026.
                            </p>
                        </AnimatedText>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
                                    Motion Design
                                </span>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>
                                    Miroir Mall — Logo Animation
                                </h3>
                            </div>
                            <button
                                onClick={() => { document.getElementById('miroirMallVideo').muted = !document.getElementById('miroirMallVideo').muted; }}
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, padding: '4px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                            </button>
                        </div>
                        <video
                            id="miroirMallVideo"
                            src="/assets/videos/FeaturedCLIENTImmorose/Logo Miroir mall animation/6E81B99B-68FD-4636-8543-679E9172DBF8.mp4"
                            autoPlay muted loop playsInline preload="metadata"
                            style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', borderRadius: '12px' }}
                        />
                    </motion.div>
                </div>

                {/* Miroir Mall Metrics Marquee */}
                <section style={{ padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <MarqueeText speed={50}>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            30 000 M² SURFACE
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            18 000 M² RETAIL
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            100+ BRANDS
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            350 PARKING SPOTS
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            1 000+ JOBS CREATED
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            15 000 VISITORS/DAY
                        </span>
                        <span style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 500, opacity: 0.7 }}>
                            DECEMBER 2026
                        </span>
                    </MarqueeText>
                </section>

                {/* ===== Photorealistic Exteriors - Miroir Mall Building ===== */}
                <div style={{ width: '100%' }}>
                    <div style={{ padding: '0 5vw', marginBottom: '2rem' }}>
                        <AnimatedText>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>
                                Photorealistic Exteriors — Miroir Mall Building
                            </span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                Architectural Vision
                            </h3>
                        </AnimatedText>
                    </div>
                    <MarqueeText speed={150}>
                        {[
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Miroir mall building/1d7a217c-e700-4d61-ba7a-5e58cf6ba7b0.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Miroir mall building/353b252a-c4c5-46a2-acaf-efa2f26fdfb3.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Miroir mall building/3b315225-e613-4730-bc90-00c1cd0d79b7.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Miroir mall building/b3cbc484-7344-4a14-a234-294321989edf.webp',
                        ].map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Miroir Mall Building ${i + 1}`}
                                loading="lazy"
                                style={{
                                    height: '400px',
                                    width: 'auto',
                                    objectFit: 'cover',
                                    marginRight: '1rem',
                                }}
                            />
                        ))}
                    </MarqueeText>
                </div>

                {/* ===== Photorealistic Interiors - Le Sheesha Lounge ===== */}
                <div style={{ width: '100%' }}>
                    <div style={{ padding: '0 5vw', marginBottom: '2rem' }}>
                        <AnimatedText>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>
                                Photorealistic Interiors — Le Sheesha Lounge
                            </span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                Premium Lounge Experience
                            </h3>
                        </AnimatedText>
                    </div>
                    <MarqueeText speed={130}>
                        {[
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Le Sheesha Lounge/041b13da-67fe-4794-9de0-db80b07ee4a7.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Le Sheesha Lounge/860430e1-adee-4f30-8d5a-ccab93c0d60c.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Le Sheesha Lounge/d3daa198-6278-4dea-9032-11d0723c2eaf.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Le Sheesha Lounge/d79c908b-fe7f-415b-b432-08f9565b8f79.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Le Sheesha Lounge/e68e5b78-d404-419e-91de-a07685cd9bde.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Le Sheesha Lounge/f4f365c4-1201-436b-aa70-ecb801e7228c.webp',
                        ].map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Sheesha Lounge ${i + 1}`}
                                loading="lazy"
                                style={{
                                    height: '400px',
                                    width: 'auto',
                                    objectFit: 'cover',
                                    marginRight: '1rem',
                                }}
                            />
                        ))}
                    </MarqueeText>
                </div>

                {/* ===== Photorealistic Interiors - Banquet Hall ===== */}
                <div style={{ width: '100%' }}>
                    <div style={{ padding: '0 5vw', marginBottom: '2rem' }}>
                        <AnimatedText>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5 }}>
                                Photorealistic Interiors — Banquet Hall
                            </span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                Grand Event Space
                            </h3>
                        </AnimatedText>
                    </div>
                    <MarqueeText speed={120}>
                        {[
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/07c56606-be35-40c0-bd83-4dbdf6e6572e.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/1f7727dc-2c12-4c62-9d5a-36a439eb2f22.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/3f36cc37-7506-48ab-93a1-16e6482d9977 (1).webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/49ab5a60-efbd-4e8c-94a6-c8caa40274f7.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/89334f91-150b-433d-a1f2-3db868fa306f (1).webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/9896306f-339f-4264-80ee-40b4620dc8a4.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/99ef4ba4-58e8-48c7-8a50-b304c72c5307.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/cba2fa3d-0b1e-48f8-a95c-90527609c0d3.webp',
                            '/assets/Images/FeaturedClientImmorose/Miroir Mall places/Banquet Hall/f504de92-fda8-40d2-8f5e-2b4af3b81684.webp',
                        ].map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Banquet Hall ${i + 1}`}
                                loading="lazy"
                                style={{
                                    height: '400px',
                                    width: 'auto',
                                    objectFit: 'cover',
                                    marginRight: '1rem',
                                }}
                            />
                        ))}
                    </MarqueeText>
                </div>

                {/* ===== FINANCIAL PROJECTIONS & ANALYTICS ===== */}
                <div style={{
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '4rem 5vw',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                }}>
                    <AnimatedText>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, display: 'block', marginBottom: '1rem' }}>
                            Data Intelligence Report
                        </span>
                        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '3rem' }}>
                            <SplitText delay={0.2}>Revenue Projections 2027-2028</SplitText>
                        </h3>
                    </AnimatedText>

                    {/* Key Metrics Grid - Animated Counters */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginBottom: '4rem',
                    }}>
                        {[
                            { value: '$4M', label: 'Realistic Revenue 2028', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
                            { value: '15K', label: 'Visitors Per Day', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
                            { value: '18K', label: 'm² Leasable Area', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg> },
                            { value: '1,000+', label: 'Jobs Created', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                        ].map((metric, i) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.15 }}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    textAlign: 'center',
                                }}
                            >
                                <span style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>{metric.icon}</span>
                                <motion.span
                                    style={{
                                        fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                                        fontWeight: 800,
                                        display: 'block',
                                        background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {metric.value}
                                </motion.span>
                                <span style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '0.5rem', display: 'block' }}>
                                    {metric.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Revenue Projections Chart */}
                    <AnimatedText delay={0.3}>
                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '16px',
                            padding: '2rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '2rem', opacity: 0.8 }}>
                                Annual Revenue Scenarios (USD)
                            </h4>

                            {/* Chart Bars */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    { year: '2027', pessimistic: 1.8, realistic: 2.7, optimistic: 3.6 },
                                    { year: '2028', pessimistic: 2.8, realistic: 4.0, optimistic: 4.8 },
                                ].map((data, i) => (
                                    <div key={data.year}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, opacity: 0.9 }}>{data.year}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', height: '40px', alignItems: 'center' }}>
                                            {/* Pessimistic Bar */}
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${data.pessimistic * 15}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, delay: i * 0.2 }}
                                                style={{
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: '0.75rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    minWidth: 'fit-content',
                                                }}
                                            >
                                                ${data.pessimistic}M
                                            </motion.div>
                                            {/* Realistic Bar */}
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${data.realistic * 15}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, delay: i * 0.2 + 0.1 }}
                                                style={{
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #fff 0%, #e5e7eb 100%)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: '0.75rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    color: '#000',
                                                    minWidth: 'fit-content',
                                                }}
                                            >
                                                ${data.realistic}M
                                            </motion.div>
                                            {/* Optimistic Bar */}
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${data.optimistic * 15}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, delay: i * 0.2 + 0.2 }}
                                                style={{
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: '0.75rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    color: '#fff',
                                                    minWidth: 'fit-content',
                                                }}
                                            >
                                                ${data.optimistic}M
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#6b7280' }}></div>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Pessimistic</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#fff' }}></div>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Realistic</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#10b981' }}></div>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Optimistic</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedText>

                    {/* Economic Context */}
                    <AnimatedText delay={0.4}>
                        <div style={{
                            marginTop: '2rem',
                            padding: '1.5rem 2rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, opacity: 0.7, margin: 0 }}>
                                <strong style={{ opacity: 1 }}>Economic Context:</strong> DRC GDP projected at $76.1B (2025) with 5.3% growth.
                                Lubumbashi population: 3M+ with 15% middle class. MiroirMall targets 10,000-15,000 visitors/day.
                            </p>
                        </div>
                    </AnimatedText>
                </div>

                {/* Full Report Access */}
                <div style={{
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '4rem 5vw',
                }}>
                    <AnimatedText>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, display: 'block', marginBottom: '1rem' }}>
                            Data Intelligence & Advanced Excel
                        </span>
                        <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '1.5rem' }}>
                            <SplitText delay={0.2}>Access Complete Analysis</SplitText>
                        </h3>
                    </AnimatedText>
                    <AnimatedText delay={0.1}>
                        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', lineHeight: 1.9, opacity: 0.7, maxWidth: '700px', marginBottom: '2rem' }}>
                            10-sheet Excel workbook featuring market research, revenue projections across 3 scenarios, competitor analysis, prospect database, and comprehensive economic data for the DRC retail sector.
                        </p>
                    </AnimatedText>
                    <AnimatedText delay={0.2}>
                        <MagneticButton href="https://1drv.ms/x/c/9c6f3514f4638c89/IQDBG7OR0kZQR6O_liFLE8nNAfamZUYCET9Jaba8xyqWHQI?e=iEyZvu">
                            Access Full Report →
                        </MagneticButton>
                    </AnimatedText>
                    <AnimatedText delay={0.3}>
                        <p style={{ fontSize: '0.75rem', opacity: 0.35, marginTop: '2rem', fontStyle: 'italic', maxWidth: '600px' }}>
                            Portfolio demonstration — projections based on public sources. ImmoRose SARL holds actual project data.
                        </p>
                    </AnimatedText>
                </div>

            </section>

            {/* ========== CONTACT SECTION ========== */}
            <section style={{
                ...styles.section,
                minHeight: '80vh',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
            }}>
                <AnimatedText>
                    <span style={{
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em',
                        opacity: 0.5,
                        display: 'block',
                        marginBottom: '2rem',
                    }}>
                        CONTACT
                    </span>
                </AnimatedText>

                <AnimatedText delay={0.1}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        marginBottom: '2rem',
                    }}>
                        Let's Create<br />Something Great
                    </h2>
                </AnimatedText>

                <AnimatedText delay={0.3}>
                    <p style={{ fontSize: '1.2rem', opacity: 0.6, marginBottom: '3rem', maxWidth: '500px' }}>
                        Ready to transform your ideas into exceptional experiences?
                    </p>
                </AnimatedText>

                <AnimatedText delay={0.4}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <a
                            href="mailto:kaluluexpress@gmail.com"
                            style={{
                                fontSize: '1.3rem',
                                fontWeight: 600,
                                color: '#fff',
                                textDecoration: 'none',
                                transition: 'opacity 0.3s ease',
                                opacity: 0.9,
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.9}
                        >
                            kaluluexpress@gmail.com
                        </a>
                        <a
                            href="https://wa.me/243852259279"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: '1.1rem',
                                opacity: 0.7,
                                color: '#fff',
                                textDecoration: 'none',
                                transition: 'opacity 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.7}
                        >
                            +243 852 259 279 (WhatsApp)
                        </a>
                    </div>
                </AnimatedText>

                <AnimatedText delay={0.5}>
                    <p style={{ fontSize: '0.9rem', opacity: 0.4, marginTop: '3rem', fontStyle: 'italic' }}>
                        Available for freelance projects, collaborations, and training sessions worldwide.
                    </p>
                </AnimatedText>

                <AnimatedText delay={0.6}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                        <a
                            href="/skills-resume.html"
                            target="_blank"
                            style={{
                                display: 'inline-block',
                                padding: '12px 24px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                opacity: 0.7,
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = 1;
                                e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = 0.7;
                                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                            }}
                        >
                            Skills & Expertise →
                        </a>
                        <a
                            href="/cv.html"
                            target="_blank"
                            style={{
                                display: 'inline-block',
                                padding: '12px 24px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                opacity: 0.7,
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = 1;
                                e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = 0.7;
                                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                            }}
                        >
                            View Full CV →
                        </a>
                    </div>
                </AnimatedText>
            </section>

            {/* ========== FOOTER ========== */}
            <footer style={{
                padding: '3rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>
                    © 2025 Aurelien Karydas
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>
                    Lubumbashi, RDC
                </span>
            </footer>
        </div>
    )
}

export default App
