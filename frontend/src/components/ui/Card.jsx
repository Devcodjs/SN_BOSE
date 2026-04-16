import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, boxShadow: 'var(--shadow-card-hover)' } : {}}
      className={`bg-white rounded-xl shadow-[var(--shadow-card)] border border-gray-100 transition-all duration-300 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
