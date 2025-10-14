
import React from 'react';
import { motion } from 'motion/react';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'flip' | 'bounce';
  stagger?: number;
  hover?: boolean;
  tap?: boolean;
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  },
  slideRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  rotate: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 }
  },
  flip: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 }
  },
  bounce: {
    initial: { opacity: 0, y: -100 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    exit: { opacity: 0, y: -100 }
  }
};

const hoverAnimations = {
  lift: {
    y: -8,
    rotateX: 5,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.3 }
  },
  tilt: {
    rotateX: 5,
    rotateY: -5,
    scale: 1.05,
    transition: { duration: 0.3 }
  },
  glow: {
    boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3 }
  },
  rotate: {
    rotateZ: 5,
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  type = 'fadeIn',
  stagger = 0,
  hover = false,
  tap = false
}) => {
  const animation = animations[type];
  
  const motionProps: any = {
    initial: animation.initial,
    animate: animation.animate,
    exit: animation.exit,
    transition: {
      duration,
      delay: delay + stagger,
      ease: [0.25, 0.46, 0.45, 0.94]
    },
    className
  };

  if (hover) {
    motionProps.whileHover = hoverAnimations.lift;
  }

  if (tap) {
    motionProps.whileTap = { scale: 0.95 };
  }

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
};

export const AnimatedGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => {
        // Use the child's key if it exists, otherwise use index
        const childKey = React.isValidElement(child) && child.key ? child.key : `animated-grid-${index}`;
        return (
          <motion.div
            key={childKey}
            variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }
          }}
        >
          {child}
        </motion.div>
        );
      })}
    </motion.div>
  );
};

export const AnimatedText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(' ');

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay
          }
        }
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const FloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}> = ({ children, className = '', intensity = 10, duration = 3 }) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        rotateZ: [-2, 2, -2]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export const PulseElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  scale?: [number, number];
  duration?: number;
}> = ({ children, className = '', scale = [1, 1.05], duration = 2 }) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

