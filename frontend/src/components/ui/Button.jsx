import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-md',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
};
const sizes = {
  sm: 'px-5 py-2.5 text-sm rounded-md min-h-[38px]',
  md: 'px-7 py-3.5 text-base rounded-md min-h-[46px]',
  lg: 'px-10 py-4 text-base rounded-md min-h-[52px]',
};

export default function Button({ variant = 'primary', size = 'md', loading, children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />}
      {children}
    </motion.button>
  );
}
