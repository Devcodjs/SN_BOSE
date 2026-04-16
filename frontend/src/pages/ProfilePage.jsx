import { useQuery } from '@tanstack/react-query';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import { TreeCounter, BadgeDisplay, CertificateCard } from '../components/rewards/RewardWidgets';
import { Mail, Phone, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: rewards } = useQuery({
    queryKey: ['my-rewards'],
    queryFn: () => API.get('/rewards/my').then(r => r.data.data),
  });

  if (!user) return null;

  return (
    <PageWrapper className="py-12">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card hover={false} className="p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <Avatar name={user.name} size="lg" className="w-24 h-24 text-3xl" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary-50 text-primary-700 uppercase tracking-wide">
                <Shield size={14} /> {user.role}
              </span>
              <div className="mt-6 space-y-3 text-base text-gray-500">
                <p className="flex items-center gap-3"><Mail size={18} /> {user.email}</p>
                {user.phone && <p className="flex items-center gap-3"><Phone size={18} /> {user.phone}</p>}
                <p className="flex items-center gap-3"><Calendar size={18} /> Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Rewards Section */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">🎖️ Rewards & Achievements</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <TreeCounter count={rewards?.summary?.treesPlanted || user.rewards?.treesPlanted || 0} />
          {rewards?.summary?.certificates?.length > 0 && (
            <CertificateCard url={rewards.summary.certificates[rewards.summary.certificates.length - 1]} />
          )}
        </div>

        {(rewards?.summary?.badges?.length > 0 || user.rewards?.badges?.length > 0) && (
          <Card hover={false} className="p-8 mb-8">
            <h3 className="text-base font-bold text-gray-800 mb-5">🇮🇳 National Badges</h3>
            <BadgeDisplay badges={rewards?.summary?.badges || user.rewards?.badges || []} />
          </Card>
        )}

        {/* Reward History */}
        {rewards?.rewards?.length > 0 && (
          <Card hover={false} className="p-8">
            <h3 className="text-base font-bold text-gray-800 mb-5">📜 Reward History</h3>
            <div className="space-y-4">
              {rewards.rewards.map((r, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary border border-gray-100">
                  <span className="text-2xl">{r.type === 'tree' ? '🌳' : r.type === 'certificate' ? '📜' : '🏅'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 capitalize">{r.type} reward</p>
                    <p className="text-sm text-gray-500">{r.issue?.title || 'Issue'} · {format(new Date(r.createdAt), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}
