"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Send, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabase from '@/lib/supabase';
import Image from "next/image";

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
    function generateSquares(count: number) {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
      }));
    }
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const currentRef = containerRef.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

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
  particleDensity = 200, // higher value = fewer particles
  particleSize = 1,
  particleColor = "#333333",
  activeColor = "#8b5cf6",
  maxBlastRadius = 180,
  interactionDistance = 40,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  const blastRef = useRef({ active: false, x: 0, y: 0, radius: 0, maxRadius: maxBlastRadius })
  const animationRef = useRef<number>(0)
  const needsUpdate = useRef(false)
  let frameSkip = 0;

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
      this.density = Math.random() * 2 + 1 // less variance
      this.color = particleColor
      this.vx = 0
      this.vy = 0
      this.friction = 0.92 // more friction, less movement
    }

    draw() {
      if (!contextRef.current) return
      contextRef.current.globalAlpha = 0.8
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
        // Simpler, lighter force
        const force = (interactionDistance - distance) / interactionDistance
        this.vx -= (dx / (distance || 1)) * force * 0.7
        this.vy -= (dy / (distance || 1)) * force * 0.7
        this.color = activeColor
      } else {
        // Snap back to base, but gently
        this.vx += (this.baseX - this.x) * 0.04
        this.vy += (this.baseY - this.y) * 0.04
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
          this.vx += blastForceX * blastForce * 7
          this.vy += blastForceY * blastForce * 7
          this.color = `rgba(180, 100, 255, 0.7)`
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
      contextRef.current.globalCompositeOperation = "source-over"
    }
    const handleResize = () => {
      const pixelRatio = 1 // always 1 for low-end
      canvas.width = window.innerWidth * pixelRatio
      canvas.height = window.innerHeight * pixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      if (contextRef.current) {
        contextRef.current.setTransform(1, 0, 0, 1, 0, 0)
        contextRef.current.scale(pixelRatio, pixelRatio)
      }
      initParticles()
      needsUpdate.current = true
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    window.addEventListener("mousemove", (e) => {
      const prevX = mouseRef.current.x
      const prevY = mouseRef.current.y
      mouseRef.current = { x: e.x, y: e.y, prevX, prevY }
      needsUpdate.current = true
    })
    window.addEventListener("click", (e) => {
      triggerBlast(e.x, e.y)
      needsUpdate.current = true
    })
    animate()
    return () => {
      window.removeEventListener("resize", handleResize)
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
    const duration = 180
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
        }, 40)
      }
    }
    requestAnimationFrame(expandBlast)
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
    // Only update every 2nd frame for less CPU
    frameSkip = (frameSkip + 1) % 2
    if (frameSkip !== 0 && !needsUpdate.current) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }
    needsUpdate.current = false
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current.forEach((particle) => {
      particle.update()
    })
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const cleanup = init();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

function CoXistAIContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPageAnimation, setShowPageAnimation] = useState(false);

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
    
    try {
      const saved = await saveToSupabase(formData);
      
      if (saved) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setShowPageAnimation(true);
        
        // Reset form after animation
        setTimeout(() => {
          setShowPageAnimation(false);
          setIsSubmitted(false);
          setFormData({ name: '', email: '' });
        }, 4000);
      } else {
        setIsSubmitting(false);
        // Handle error case
        setErrors({ email: 'Failed to submit. Please try again.' });
      }
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ email: 'Failed to submit. Please try again.' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0
    }
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
          particleDensity={200}
          particleSize={1}
          particleColor="#333333"
          activeColor="#8b5cf6"
          maxBlastRadius={180}
          interactionDistance={40}
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

      {/* Page-wide success animation overlay */}
      <AnimatePresence>
        {showPageAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center"
            >
              <motion.div
                className="w-32 h-32 mx-auto mb-8 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 animate-pulse" />
                <CheckCircle className="w-32 h-32 text-green-400" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent flex items-center justify-center gap-3"
              >
                <Image src="/1x.png" alt="CoXistAI Logo" width={40} height={40} className="h-10 w-10 object-contain inline-block" />
                CoXistAI
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-white/80"
              >
                Thank you for reaching out to CoXistAI
              </motion.p>
              {/* Celebration particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 400],
                      y: [0, (Math.random() - 0.5) * 400],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
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
                <Sparkles className="h-4 w-4 text-purple-300" />
              </motion.div>
              <span className="text-sm font-medium text-white/80">
                AI-Powered Solutions
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
              className="text-lg text-white/60 leading-relaxed max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              The all-in-one app for your notes, AI-powered presentations, and more.
              Don&#39;t juggle apps and start organizing your success.
            </motion.p>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/[0.15] p-8 pt-0 shadow-2xl"
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
                  transition={{ duration: 0.18 }} // snappier
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-2">Get in Touch</h2>
                    <p className="text-white/60">Ready to explore AI solutions? We&#39;d love to hear from you.</p>
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
                          className={`pl-10 bg-white/[0.08] border-white/[0.15] text-white placeholder-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-150 ease-out ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                          autoComplete="off"
                          autoFocus
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
                          className={`pl-10 bg-white/[0.08] border-white/[0.15] text-white placeholder-white/40 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-150 ease-out ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                          autoComplete="off"
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
                        <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-150 disabled:opacity-50 border-0 shadow-lg"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                        transition={{ duration: 0.4 }}
                        />
                        <span className="relative flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <>
                            <Send className="h-5 w-5" />
                            Connect with CoXistAI
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
                        className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/60 text-sm">
                    Thank you for reaching out. Our team will get back to you soon.
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
              © 2025 CoXistAI. Pioneering the future of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactForm() {
  return <CoXistAIContactForm />;
}
