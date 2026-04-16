export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-primary-600', 'bg-orange-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-cyan-500'];
  const color = colors[name.length % colors.length];
  const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-xl' };

  return (
    <div className={`${sizes[size]} ${color} rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${className}`}>
      {initials || '?'}
    </div>
  );
}
