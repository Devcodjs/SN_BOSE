export default function Avatar({ name = '', size = 'md', shape = 'rounded-xl', ring = false, className = '' }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const gradients = [
    'from-blue-600 to-sky-400',
    'from-orange-500 to-amber-400',
    'from-amber-500 to-yellow-400',
    'from-rose-500 to-pink-400',
    'from-violet-500 to-purple-400',
    'from-cyan-500 to-teal-400',
  ];
  const gradient = gradients[name.length % gradients.length];

  const sizes = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  return (
    <div
      className={[
        sizes[size] || sizes.md,
        shape,
        'bg-gradient-to-br', gradient,
        'flex items-center justify-center text-white font-bold shrink-0 select-none',
        ring ? 'ring-4 ring-white shadow-[0_0_0_3px_rgba(37,99,235,0.25)]' : '',
        className,
      ].join(' ')}
    >
      {initials || '?'}
    </div>
  );
}