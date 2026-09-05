import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SkeletonStats } from '../ui/Skeleton';
import { format } from 'date-fns';
import { AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AbuseManagement() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('pending');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['abuseFlags', filter, page],
    queryFn: async () => {
      const res = await API.get(`/admin/abuse/flags?status=${filter}&page=${page}&limit=10`);
      return res.data;
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, action, comment }) => {
      return await API.post(`/admin/abuse/${id}/review`, { action, comment });
    },
    onSuccess: () => {
      toast.success('Abuse flag reviewed successfully');
      queryClient.invalidateQueries(['abuseFlags']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to review flag');
    }
  });

  const handleReview = (id, action) => {
    // In a real app, you'd open a modal for comment. For now, we'll pass a default comment.
    const comment = action === 'reviewed_safe' ? 'Reviewed and found to be a legitimate report.' : 'Violation confirmed. Trust score impacted.';
    reviewMutation.mutate({ id, action, comment });
  };

  if (isLoading) return <div className="p-6"><SkeletonStats /></div>;

  const flags = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-500" />
            Abuse & Spam Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Review flagged citizens to protect the platform's integrity.</p>
        </div>
        
        <div className="flex gap-2">
          {['pending', 'warned', 'restricted', 'reviewed_safe'].map(status => (
            <button
              key={status}
              onClick={() => { setFilter(status); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === status 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {flags.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
            <ShieldCheck size={40} className="mx-auto text-emerald-400 mb-3 opacity-50" />
            <p className="font-medium text-gray-700">No {filter.replace('_', ' ')} flags found.</p>
            <p className="text-sm">The platform is currently clean.</p>
          </div>
        ) : (
          flags.map(flag => (
            <Card key={flag._id} className="p-5 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-700 border border-red-200 rounded-md">
                    {flag.reason.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    Risk Score: 
                    <span className={`px-1.5 py-0.5 rounded ${flag.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {flag.riskScore}/100
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(flag.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Citizen</div>
                    <div className="font-semibold text-sm text-gray-900">{flag.citizen?.name}</div>
                    <div className="text-xs text-gray-600">{flag.citizen?.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Reputation</div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      Trust Score: <span className={flag.citizen?.trustScore < 50 ? 'text-red-600' : 'text-emerald-600'}>{flag.citizen?.trustScore}/100</span>
                    </div>
                    <div className="text-xs text-gray-600">{flag.citizen?.totalReports} total reports</div>
                  </div>
                </div>

                {flag.issue && (
                  <div className="text-sm">
                    <span className="text-gray-500 font-medium">Related Issue: </span>
                    <span className="font-semibold text-gray-800">{flag.issue.title}</span>
                  </div>
                )}
              </div>

              {flag.status === 'pending' && (
                <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                  <Button 
                    variant="danger" size="sm" className="w-full justify-start"
                    onClick={() => handleReview(flag._id, 'restricted')}
                    loading={reviewMutation.isPending}
                  >
                    <Ban size={15} /> Restrict User
                  </Button>
                  <Button 
                    variant="secondary" size="sm" className="w-full justify-start !text-orange-600 !border-orange-200 hover:!bg-orange-50"
                    onClick={() => handleReview(flag._id, 'warned')}
                    loading={reviewMutation.isPending}
                  >
                    <AlertTriangle size={15} /> Issue Warning
                  </Button>
                  <Button 
                    variant="secondary" size="sm" className="w-full justify-start !text-emerald-600 !border-emerald-200 hover:!bg-emerald-50"
                    onClick={() => handleReview(flag._id, 'reviewed_safe')}
                    loading={reviewMutation.isPending}
                  >
                    <CheckCircle size={15} /> Mark as Safe
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
