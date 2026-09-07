import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md border border-primary-600/50',
  navy: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md border border-slate-800',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-sm hover:shadow-md',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400',
};

const sizes = {
  sm: 'px-4 py-2 text-xs font-semibold rounded-lg min-h-[36px]',
  md: 'px-5 py-2.5 text-sm font-semibold rounded-xl min-h-[44px]',
  lg: 'px-7 py-3.5 text-base font-semibold rounded-xl min-h-[50px]',
};

export default function Button({ variant = 'primary', size = 'md', loading, children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      className={`inline-flex items-center justify-center gap-2 font-display tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />}
      {children}
    </motion.button>
  );
}

