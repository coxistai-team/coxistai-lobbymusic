"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Send, CheckCircle, Sparkles, ArrowRight, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabase";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className = "",
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(() => generateSquares(numSquares));

  function getPos() {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }

  function generateSquares(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  }

  const updateSquarePosition = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id
          ? {
              ...sq,
              pos: getPos(),
            }
          : sq,
      ),
    );
  };

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30 ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}

function FluidParticles({
  particleDensity = 100,
  particleSize = 1,
  particleColor = "#555555",
  activeColor = "#ffffff", 
  maxBlastRadius = 300, 
  hoverDelay = 100,
  interactionDistance = 10,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  const blastRef = useRef({ active: false, x: 0, y: 0, radius: 0, maxRadius: maxBlastRadius })
  const animationRef = useRef<number>(0)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  class Particle {
    x: number
    y: number
    size: number
    baseX: number
    baseY: number
    density: number
    color: string
    vx: number
    vy: number
    friction: number

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.baseX = x
      this.baseY = y
      this.size = Math.random() * particleSize + 0.5
      this.density = Math.random() * 3 + 1
      this.color = particleColor
      this.vx = 0
      this.vy = 0
      this.friction = 0.9 - 0.01 * this.density
    }

    draw() {
      if (!contextRef.current) return

      contextRef.current.fillStyle = this.color
      contextRef.current.beginPath()
      contextRef.current.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      contextRef.current.closePath()
      contextRef.current.fill()
    }

    update() {
      if (!contextRef.current) return

      this.x += this.vx
      this.y += this.vy
      this.vx *= this.friction
      this.vy *= this.friction

      const dx = mouseRef.current.x - this.x
      const dy = mouseRef.current.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < interactionDistance) {
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const force = (interactionDistance - distance) / interactionDistance

        this.x -= forceDirectionX * force * this.density * 0.6
        this.y -= forceDirectionY * force * this.density * 0.6
        this.color = activeColor
      } else {
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX
          this.x -= dx / 20
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY
          this.y -= dy / 20
        }
        this.color = particleColor
      }

      if (blastRef.current.active) {
        const blastDx = this.x - blastRef.current.x
        const blastDy = this.y - blastRef.current.y
        const blastDistance = Math.sqrt(blastDx * blastDx + blastDy * blastDy)

        if (blastDistance < blastRef.current.radius) {
          const blastForceX = blastDx / (blastDistance || 1)
          const blastForceY = blastDy / (blastDistance || 1)
          const blastForce = (blastRef.current.radius - blastDistance) / blastRef.current.radius

          this.vx += blastForceX * blastForce * 15
          this.vy += blastForceY * blastForce * 15

          const intensity = Math.min(255, Math.floor(255 - blastDistance))
          this.color = `rgba(${intensity}, 100, 255, 0.8)`
        }
      }

      this.draw()
    }
  }

  const init = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    contextRef.current = canvas.getContext("2d", { alpha: true })

    if (contextRef.current) {
      contextRef.current.globalCompositeOperation = "lighter"
    }

    const handleResize = () => {
      const pixelRatio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * pixelRatio
      canvas.height = window.innerHeight * pixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      if (contextRef.current) {
        contextRef.current.scale(pixelRatio, pixelRatio)
      }

      initParticles()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    let lastMoveTime = 0
    const moveThrottle = 10

    window.addEventListener("mousemove", (e) => {
      const now = performance.now()
      if (now - lastMoveTime < moveThrottle) return
      lastMoveTime = now

      const prevX = mouseRef.current.x
      const prevY = mouseRef.current.y
      mouseRef.current = { x: e.x, y: e.y, prevX, prevY }

      const dx = mouseRef.current.x - mouseRef.current.prevX
      const dy = mouseRef.current.y - mouseRef.current.prevY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 5) {
        if (hoverTimerRef.current === null) {
          hoverTimerRef.current = setTimeout(() => {
            triggerBlast(e.x, e.y)
          }, hoverDelay)
        }
      } else {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current)
          hoverTimerRef.current = null
        }
      }
    })

    window.addEventListener("click", (e) => {
      triggerBlast(e.x, e.y)
    })

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      cancelAnimationFrame(animationRef.current)
    }
  }

  const triggerBlast = (x: number, y: number) => {
    blastRef.current = {
      active: true,
      x,
      y,
      radius: 0,
      maxRadius: maxBlastRadius,
    }

    const startTime = performance.now()
    const duration = 300

    const expandBlast = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easedProgress = progress * (2 - progress)
      blastRef.current.radius = easedProgress * blastRef.current.maxRadius

      if (progress < 1) {
        requestAnimationFrame(expandBlast)
      } else {
        setTimeout(() => {
          blastRef.current.active = false
        }, 100)
      }
    }

    requestAnimationFrame(expandBlast)

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  const initParticles = () => {
    particlesRef.current = []
    const canvas = canvasRef.current
    if (!canvas) return

    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / particleDensity)

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      particlesRef.current.push(new Particle(x, y))
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    particlesRef.current.forEach((particle) => {
      particle.update()
    })

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const cleanup = init()
    return cleanup
  }, [])

  return (
    <div className="">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

interface ContactFormData {
  name: string;
  email: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
}

function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToSupabase = async (data: ContactFormData) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([
          {
            name: data.name,
            email: data.email,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Save to Supabase
      const saved = await saveToSupabase(formData);
      
      if (saved) {
        setSubmitStatus('success');
        setIsSubmitted(true);
        setShowSuccessAnimation(true);
        
        // Reset form after animation
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setIsSubmitted(false);
          setFormData({ name: '', email: '' });
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <FluidParticles
          particleDensity={120}
          particleSize={1.5}
          particleColor="#333333"
          activeColor="#8b5cf6"
          maxBlastRadius={250}
          hoverDelay={50}
          interactionDistance={80}
        />
        
        <AnimatedGridPattern
          numSquares={40}
          maxOpacity={0.08}
          duration={3}
          repeatDelay={1}
          className="[mask-image:radial-gradient(800px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        />

        {/* Abstract Art Elements */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/5 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg blur-lg"
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Pseudo elements with CSS */}
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-violet-500/30 to-purple-500/30 transform rotate-45 animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full animate-bounce" />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-violet-900/5 to-transparent" />
      </div>

      {/* Modern Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                duration: 0.6 
              }}
              className="text-center max-w-md mx-auto p-8"
            >
              {/* Animated Success Icon */}
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center mx-auto relative">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 0.4, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <CheckCircle className="w-16 h-16 text-white relative z-10" />
                </div>
                
                {/* Radiating circles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                    animate={{
                      scale: [1, 2.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                ))}
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  You're on the list!
                </h2>
                <p className="text-xl text-white/80 mb-6">
                  We'll notify you as soon as CoXistAI launches.
                </p>
                
                {/* Floating notification particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                    style={{
                      left: `${50 + (Math.random() - 0.5) * 200}%`,
                      top: `${50 + (Math.random() - 0.5) * 200}%`,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 min-h-screen flex items-center justify-center px-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm mb-6"
              whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.5)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-4 w-4 text-purple-300" />
              </motion.div>
              <span className="text-sm font-medium text-white/80">
                Coming Soon
              </span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
              variants={fadeInUp}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                CoXist
              </span>
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                AI
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-white/60 leading-relaxed"
              variants={fadeInUp}
            >
              Be the first to know when we launch. Join our notification list and stay ahead of the AI revolution.
            </motion.p>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/[0.15] p-8 shadow-2xl"
            variants={fadeInUp}
            whileHover={{ borderColor: "rgba(139, 92, 246, 0.3)" }}
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      className="inline-flex items-center gap-2 mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Bell className="h-5 w-5 text-purple-400" />
                      <h2 className="text-2xl font-semibold text-white">Get Notified</h2>
                    </motion.div>
                    <p className="text-white/60">Enter your details below and we'll notify you when we launch.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white/80 font-medium">
                        Your Name
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`pl-10 bg-white/[0.08] border-white/[0.15] text-white placeholder-white/40 focus:border-purple-400 focus:ring-purple-400/20 ${
                            errors.name ? 'border-red-400 focus:border-red-400' : ''
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-2"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white/80 font-medium">
                        Email Address
                      </Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`pl-10 bg-white/[0.08] border-white/[0.15] text-white placeholder-white/40 focus:border-purple-400 focus:ring-purple-400/20 ${
                            errors.email ? 'border-red-400 focus:border-red-400' : ''
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-2"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-sm"
                    >
                      Something went wrong. Please try again.
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 border-0"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <>
                            <Bell className="h-5 w-5" />
                            Notify Me
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
                  <p className="text-white/60 text-sm">
                    We'll notify you when CoXistAI launches.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center mt-8"
            variants={fadeInUp}
          >
            <p className="text-white/40 text-sm">
              © 2024 CoXistAI. Pioneering the future of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactFormDemo() {
  return <ContactForm />;
}
