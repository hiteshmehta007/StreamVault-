
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface AnimatedBrandNameProps {
  className?: string;
}

export const AnimatedBrandName: React.FC<AnimatedBrandNameProps> = ({ className = '' }) => {
  const brandText = "StreamVault";
  const letters = brandText.split('');

  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Animated Logo Icon */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 0 8px rgba(59, 130, 246, 0.1)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Play className="w-4 h-4" />
          </motion.div>
        </motion.div>
        
        {/* Orbiting particles */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transformOrigin: "-12px 12px" }}
        />
      </motion.div>

      {/* Animated Brand Text */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block font-bold text-xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% 100%'
              }}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 50,
                  rotateX: -90,
                  scale: 0.5
                },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                    duration: 0.6
                  }
                }
              }}
              whileHover={{
                scale: 1.2,
                rotateY: 15,
                color: "var(--color-scheme-accent)",
                transition: { duration: 0.2 }
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                backgroundPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        />

        {/* Floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Premium Badge */}
      <motion.div
        className="hidden lg:flex items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.span
          className="text-xs font-medium text-muted-foreground px-2 py-1 rounded-full border border-border bg-muted/50"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
          }}
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            opacity: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          Premium
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export const AnimatedBrandNameMinimal: React.FC<AnimatedBrandNameProps> = ({ className = '' }) => {
  const brandText = "StreamVault";

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <Play className="w-3 h-3" />
      </motion.div>
      
      <motion.span
        className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        {brandText}
      </motion.span>
    </motion.div>
  );
};

