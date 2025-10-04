"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import supabase from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  DollarSign,
  Mail,
  Send,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

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
          : sq
      )
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const blastRef = useRef({
    active: false,
    x: 0,
    y: 0,
    radius: 0,
    maxRadius: maxBlastRadius,
  });
  const animationRef = useRef<number>(0);
  const needsUpdate = useRef(false);
  let frameSkip = 0;

  class Particle {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;
    color: string;
    vx: number;
    vy: number;
    friction: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = Math.random() * particleSize + 0.5;
      this.density = Math.random() * 2 + 1; // less variance
      this.color = particleColor;
      this.vx = 0;
      this.vy = 0;
      this.friction = 0.92; // more friction, less movement
    }

    draw() {
      if (!contextRef.current) return;
      contextRef.current.globalAlpha = 0.8;
      contextRef.current.fillStyle = this.color;
      contextRef.current.beginPath();
      contextRef.current.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      contextRef.current.closePath();
      contextRef.current.fill();
    }

    update() {
      if (!contextRef.current) return;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= this.friction;
      this.vy *= this.friction;
      const dx = mouseRef.current.x - this.x;
      const dy = mouseRef.current.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < interactionDistance) {
        // Simpler, lighter force
        const force = (interactionDistance - distance) / interactionDistance;
        this.vx -= (dx / (distance || 1)) * force * 0.7;
        this.vy -= (dy / (distance || 1)) * force * 0.7;
        this.color = activeColor;
      } else {
        // Snap back to base, but gently
        this.vx += (this.baseX - this.x) * 0.04;
        this.vy += (this.baseY - this.y) * 0.04;
        this.color = particleColor;
      }
      if (blastRef.current.active) {
        const blastDx = this.x - blastRef.current.x;
        const blastDy = this.y - blastRef.current.y;
        const blastDistance = Math.sqrt(blastDx * blastDx + blastDy * blastDy);
        if (blastDistance < blastRef.current.radius) {
          const blastForceX = blastDx / (blastDistance || 1);
          const blastForceY = blastDy / (blastDistance || 1);
          const blastForce =
            (blastRef.current.radius - blastDistance) / blastRef.current.radius;
          this.vx += blastForceX * blastForce * 7;
          this.vy += blastForceY * blastForce * 7;
          this.color = `rgba(180, 100, 255, 0.7)`;
        }
      }
      this.draw();
    }
  }

  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    contextRef.current = canvas.getContext("2d", { alpha: true });
    if (contextRef.current) {
      contextRef.current.globalCompositeOperation = "source-over";
    }
    const handleResize = () => {
      const pixelRatio = 1; // always 1 for low-end
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      if (contextRef.current) {
        contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
        contextRef.current.scale(pixelRatio, pixelRatio);
      }
      initParticles();
      needsUpdate.current = true;
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    window.addEventListener("mousemove", (e) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current = { x: e.x, y: e.y, prevX, prevY };
      needsUpdate.current = true;
    });
    window.addEventListener("click", (e) => {
      triggerBlast(e.x, e.y);
      needsUpdate.current = true;
    });
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  };

  const triggerBlast = (x: number, y: number) => {
    blastRef.current = {
      active: true,
      x,
      y,
      radius: 0,
      maxRadius: maxBlastRadius,
    };
    const startTime = performance.now();
    const duration = 180;
    const expandBlast = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress * (2 - progress);
      blastRef.current.radius = easedProgress * blastRef.current.maxRadius;
      if (progress < 1) {
        requestAnimationFrame(expandBlast);
      } else {
        setTimeout(() => {
          blastRef.current.active = false;
        }, 40);
      }
    };
    requestAnimationFrame(expandBlast);
  };

  const initParticles = () => {
    particlesRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const particleCount = Math.floor(
      (window.innerWidth * window.innerHeight) / particleDensity
    );
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      particlesRef.current.push(new Particle(x, y));
    }
  };

  const animate = () => {
    // Only update every 2nd frame for less CPU
    frameSkip = (frameSkip + 1) % 2;
    if (frameSkip !== 0 && !needsUpdate.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    needsUpdate.current = false;
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current.forEach((particle) => {
      particle.update();
    });
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const cleanup = init();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

interface ContactFormData {
  name: string;
  email: string;
  companyName: string;
  revenueMaking: string;
  mrr: string;
  investmentRaised: string;
  investmentAmount: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  companyName?: string;
  revenueMaking?: string;
  mrr?: string;
  investmentRaised?: string;
  investmentAmount?: string;
}

function CoXistAIContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    companyName: "",
    revenueMaking: "",
    mrr: "",
    investmentRaised: "",
    investmentAmount: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Founder name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.revenueMaking) {
      newErrors.revenueMaking = "Please select if you're making revenue";
    }

    if (formData.revenueMaking === "yes" && !formData.mrr.trim()) {
      newErrors.mrr = "MRR is required when making revenue";
    }

    if (
      formData.investmentRaised === "yes" &&
      !formData.investmentAmount.trim()
    ) {
      newErrors.investmentAmount =
        "Investment amount is required when you've raised investment";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToSupabase = async (data: ContactFormData) => {
    try {
      const { error } = await supabase.from("subscribers").insert([
        {
          name: data.name,
          email: data.email,
          company_name: data.companyName,
          revenue_making: data.revenueMaking,
          mrr: data.mrr || null,
          investment_raised: data.investmentRaised || null,
          investment_amount: data.investmentAmount || null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      return true;
    } catch {
      // Error saving to Supabase
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

        // Reset form after showing success message
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            companyName: "",
            revenueMaking: "",
            mrr: "",
            investmentRaised: "",
            investmentAmount: "",
          });
        }, 3000);
      } else {
        setIsSubmitting(false);
        // Handle error case
        setErrors({ email: "Failed to submit. Please try again." });
      }
    } catch {
      setIsSubmitting(false);
      setErrors({ email: "Failed to submit. Please try again." });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <FluidParticles
          particleDensity={300}
          particleSize={0.8}
          particleColor="#475569"
          activeColor="#3b82f6"
          maxBlastRadius={120}
          interactionDistance={30}
        />

        <AnimatedGridPattern
          numSquares={60}
          maxOpacity={0.03}
          duration={4}
          repeatDelay={2}
          className="[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        />

        {/* Professional geometric elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/6 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg blur-xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/5 w-20 h-20 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-lg blur-lg"
            animate={{
              x: [0, -40, 0],
              y: [0, -30, 0],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Professional gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 via-transparent to-blue-900/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-700/3 to-transparent" />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 h-screen flex items-center justify-center px-6 py-4 overflow-hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <motion.div className="text-center mb-6" variants={fadeInUp}>
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm mb-6"
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-sm font-medium text-white/70 tracking-wide">
                ENTERPRISE AI SOLUTIONS
              </span>
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
              variants={fadeInUp}
            >
              <motion.div className="inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/5x.png"
                  alt="CoXistAI Logo"
                  className="h-16 w-16 object-contain inline-block mr-3"
                />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 pr-1">
                  CoXist
                </span>
                <motion.span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  AI
                </motion.span>
              </motion.div>
            </motion.h1>

            <motion.p
              className="text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-light"
              variants={fadeInUp}
            >
              Transform your business with intelligent automation and
              data-driven insights. Join forward-thinking companies leveraging
              AI for competitive advantage.
            </motion.p>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 shadow-xl max-h-[50vh] overflow-y-auto"
            variants={fadeInUp}
            whileHover={{ borderColor: "rgba(59, 130, 246, 0.2)" }}
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
                    <h2 className="text-2xl font-semibold text-white mb-3">
                      Business Partnership Inquiry
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Share your company details and we&#39;ll explore how our
                      AI solutions can drive your business forward.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-white/80 font-medium"
                      >
                        Founder Name *
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`pl-10 bg-white/[0.05] border-white/[0.1] text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 ease-out ${
                            errors.name
                              ? "border-red-400 focus:border-red-400"
                              : ""
                          }`}
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
                      <Label
                        htmlFor="email"
                        className="text-white/80 font-medium"
                      >
                        Email Address *
                      </Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`pl-10 bg-white/[0.05] border-white/[0.1] text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 ease-out ${
                            errors.email
                              ? "border-red-400 focus:border-red-400"
                              : ""
                          }`}
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
                    <div>
                      <Label
                        htmlFor="companyName"
                        className="text-white/80 font-medium"
                      >
                        Company Name *
                      </Label>
                      <div className="relative mt-2">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Enter your company name"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange("companyName", e.target.value)
                          }
                          className={`pl-10 bg-white/[0.05] border-white/[0.1] text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 ease-out ${
                            errors.companyName
                              ? "border-red-400 focus:border-red-400"
                              : ""
                          }`}
                          autoComplete="off"
                        />
                      </div>
                      {errors.companyName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-2"
                        >
                          {errors.companyName}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="revenueMaking"
                        className="text-white/80 font-medium"
                      >
                        Are you making revenue? *
                      </Label>
                      <div className="relative mt-2">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 z-10" />
                        <Select
                          value={formData.revenueMaking}
                          onValueChange={(value) =>
                            handleInputChange("revenueMaking", value)
                          }
                        >
                          <SelectTrigger
                            className={`pl-10 bg-white/[0.05] border-white/[0.1] text-white focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 ease-out ${
                              errors.revenueMaking
                                ? "border-red-400 focus:border-red-400"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600 text-white">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.revenueMaking && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-2"
                        >
                          {errors.revenueMaking}
                        </motion.p>
                      )}
                    </div>
                    {formData.revenueMaking === "yes" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label
                          htmlFor="mrr"
                          className="text-white/80 font-medium"
                        >
                          Monthly Recurring Revenue (MRR)
                        </Label>
                        <div className="relative mt-2">
                          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                          <Input
                            id="mrr"
                            type="text"
                            placeholder="e.g., $5,000"
                            value={formData.mrr}
                            onChange={(e) =>
                              handleInputChange("mrr", e.target.value)
                            }
                            className={`pl-10 bg-white/[0.05] border-white/[0.1] text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 ease-out ${
                              errors.mrr
                                ? "border-red-400 focus:border-red-400"
                                : ""
                            }`}
                            autoComplete="off"
                          />
                        </div>
                        {errors.mrr && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.mrr}
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                    <div>
                      <Label
                        htmlFor="investmentRaised"
                        className="text-white/80 font-medium"
                      >
                        Have you raised investment?
                      </Label>
                      <div className="relative mt-2">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 z-10" />
                        <Select
                          value={formData.investmentRaised}
                          onValueChange={(value) =>
                            handleInputChange("investmentRaised", value)
                          }
                        >
                          <SelectTrigger className="pl-10 bg-white/[0.05] border-white/[0.1] text-white focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 ease-out">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600 text-white">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formData.investmentRaised === "yes" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label
                          htmlFor="investmentAmount"
                          className="text-white/80 font-medium"
                        >
                          Investment Amount
                        </Label>
                        <div className="relative mt-2">
                          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                          <Input
                            id="investmentAmount"
                            type="text"
                            placeholder="e.g., $100,000"
                            value={formData.investmentAmount}
                            onChange={(e) =>
                              handleInputChange(
                                "investmentAmount",
                                e.target.value
                              )
                            }
                            className={`pl-10 bg-white/[0.05] border-white/[0.1] text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 ease-out ${
                              errors.investmentAmount
                                ? "border-red-400 focus:border-red-400"
                                : ""
                            }`}
                            autoComplete="off"
                          />
                        </div>
                        {errors.investmentAmount && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.investmentAmount}
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 border-0 shadow-lg"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Partnership Inquiry
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
                  className="text-center py-12"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Partnership Inquiry Submitted
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                    Thank you for your interest in CoXistAI. Our business
                    development team will review your information and contact
                    you within 24-48 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.div className="text-center mt-6" variants={fadeInUp}>
            <p className="text-slate-500 text-xs tracking-wide">
              © 2025 CoXistAI. Enterprise AI Solutions for Modern Business.
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
