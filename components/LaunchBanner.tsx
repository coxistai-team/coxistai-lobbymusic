"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ExternalLink, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function LaunchBanner() {
  const [countdown, setCountdown] = useState(5);
  const [isVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "https://www.coxistai.com/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    window.location.href = "https://www.coxistai.com/";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
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
                ease: "easeInOut",
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
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-violet-500/30 to-purple-500/30 transform rotate-45"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-violet-900/5 to-transparent" />
          </div>

          {/* Main Banner */}
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.8,
            }}
            className="relative max-w-lg w-full mx-4"
          >
            {/* Glassmorphism Container */}
            <div className="relative bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/[0.15] p-8 shadow-2xl overflow-hidden">
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              />

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Success Icon with Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.3,
                  }}
                  className="mb-6"
                >
                  <div className="relative inline-block">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <CheckCircle className="w-16 h-16 text-green-400 drop-shadow-lg relative z-10" />
                  </div>
                </motion.div>

                {/* Title with Gradient */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-violet-200 bg-clip-text text-transparent"
                >
                  🚀 We&apos;re Live!
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-white/80 mb-6 leading-relaxed"
                >
                  CoXistAI has officially launched! You&apos;re being redirected
                  to our main website.
                </motion.p>

                {/* Countdown Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-6"
                >
                  <div className="text-sm text-white/60 mb-2">
                    Redirecting in:
                  </div>
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.2, color: "#fbbf24" }}
                    animate={{ scale: 1, color: "#ffffff" }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl font-bold text-yellow-300 mb-4"
                  >
                    {countdown}
                  </motion.div>

                  {/* Animated Progress Bar */}
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full relative"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Skip Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  onClick={handleSkip}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border-0 group overflow-hidden relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                  <ExternalLink className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Skip & Go Now</span>
                </motion.button>

                {/* Floating Sparkles */}
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap className="w-4 h-4 text-blue-300" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
