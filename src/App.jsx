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
    ]

    const skills = [
        { icon: '◈', title: 'Creative AI & Image Generation' },
        { icon: '◈', title: 'Automation & Intelligent Workflows' },
        { icon: '◈', title: 'Full-Stack Development' },
        { icon: '◈', title: 'Data Analysis & Management (Excel/VBA)' },
        { icon: '◈', title: '3D Visualization & VR' },
        { icon: '◈', title: 'Branding & Visual Identity' },
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
                                    🌍 Origins
                                </h3>
                                <p style={{ fontSize: '1rem', lineHeight: 1.9, opacity: 0.7 }}>
                                    Born and raised in <strong>Lubumbashi</strong>, I speak <strong>Swahili, French, and Lingala</strong>.
                                    My local roots give me a unique perspective — I understand my community deeply
                                    and bridge worlds between tradition and innovation.
                                </p>
                            </div>
                        </AnimatedText>

                        {/* Journey */}
                        <AnimatedText delay={0.5}>
                            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', opacity: 0.9 }}>
                                    🎨 Journey
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
                                    🚀 Impact
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
            <section style={{ ...styles.section, flexDirection: 'column', gap: '4rem' }}>
                <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
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
                            marginBottom: '4rem',
                        }}>
                            Projects
                        </h2>
                    </AnimatedText>

                    {/* ========== FEATURED PROJECT (AR/3D) ========== */}
                    <AnimatedText delay={0.2}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                width: '100%',
                                aspectRatio: '21/9',
                                background: '#0a0a0a',
                                borderRadius: '16px',
                                position: 'relative',
                                overflow: 'hidden',
                                marginBottom: '3rem',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <video
                                src="/assets/videos/AR 3D/5B2ECB90-3246-4ACA-875E-474480F6AA4F.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '3rem',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    opacity: 0.7,
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                }}>
                                    AR / 3D — Gaussian Splatting
                                </span>
                                <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, margin: 0 }}>
                                    Immersive 3D Capture
                                </h3>
                                <p style={{ fontSize: '1rem', opacity: 0.6, marginTop: '0.5rem', maxWidth: '500px' }}>
                                    Luma AI Gaussian Splatting composition for spatial computing experiences.
                                </p>
                            </div>
                        </motion.div>
                    </AnimatedText>

                    {/* ========== PROJECT GRID ========== */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                        {[
                            {
                                title: 'Agrizex Motion',
                                category: 'Motion Design',
                                video: '/assets/videos/motion-design/agrizex-logo-1.mp4',
                                description: 'Logo animation & brand identity',
                                year: '2024'
                            },
                            {
                                title: 'Mokonzi Fashion',
                                category: 'AI Branding',
                                gallery: [
                                    '/assets/Images/ClothesBrand/Mokonzi/Mokonzi_00006_.png',
                                    '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00336_.png',
                                    '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00338_.png',
                                    '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00339_.png',
                                    '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00374_.png',
                                    '/assets/Images/ClothesBrand/Mokonzi/ComfyUI_00383_.png',
                                ],
                                description: 'AI-generated fashion visuals',
                                year: '2024'
                            },
                            {
                                title: 'Brasimba Campaign',
                                category: 'Visual Identity',
                                gallery: [
                                    '/assets/Images/DrinksBrand/Brasimba/ComfyUI_00098_.png',
                                    '/assets/Images/DrinksBrand/Brasimba/ComfyUI_00069_.png',
                                ],
                                description: 'Beverage brand imagery',
                                year: '2023'
                            },
                            {
                                title: 'LubumArt Identity',
                                category: 'AI Branding',
                                gallery: [
                                    '/assets/Images/ClothesBrand/LubumArt/ComfyUI_00138_.png',
                                    '/assets/Images/ClothesBrand/LubumArt/ComfyUI_00169_.png',
                                ],
                                description: 'Local fashion brand visuals',
                                year: '2023'
                            }
                        ].map((project, i) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* Media Container */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.4 }}
                                    style={{
                                        aspectRatio: '16/10',
                                        background: '#111',
                                        borderRadius: '12px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    {project.video ? (
                                        <video
                                            src={project.video}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : project.gallery ? (
                                        <InfiniteMarquee images={project.gallery} speed={25} />
                                    ) : null}
                                </motion.div>

                                {/* Text Below Card (CV Style) */}
                                <div style={{ marginTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
                                            {project.category}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>{project.year}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>
                                        {project.title}
                                    </h3>
                                    <p style={{ fontSize: '0.95rem', opacity: 0.6, marginTop: '0.5rem' }}>
                                        {project.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                    <MagneticButton href="mailto:contact@aurelienkarydas.com">
                        Get in Touch →
                    </MagneticButton>
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
                    © 2024 Aurelien Karydas
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>
                    Lubumbashi, RDC
                </span>
            </footer>
        </div>
    )
}

export default App
