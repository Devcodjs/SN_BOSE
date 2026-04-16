import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ icon, value, label, trend, color = 'bg-primary-50 text-primary-600', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-[1.5rem] p-8 shadow-[0_15px_30px_-5px_rgba(2,132,199,0.08)] border border-sky-100 hover:shadow-[0_25px_40px_-5px_rgba(2,132,199,0.12)] transition-all duration-300 flex flex-col items-center text-center"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm border border-sky-50 ${color}`}>
        {icon}
      </div>
      <p className="text-4xl font-black text-slate-800 tracking-tight mb-3">{value}</p>
      
      <div className="flex flex-col items-center gap-2 mt-2 w-full">
        <p className="text-base text-slate-500 font-bold tracking-wide uppercase">{label}</p>
        {trend !== undefined && (
          <span className={`flex items-center gap-1.5 text-sm font-black px-3 py-1 bg-opacity-10 rounded-full ${trend >= 0 ? 'text-emerald-600 bg-emerald-100' : 'text-red-500 bg-red-100'}`}>
            {trend >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
