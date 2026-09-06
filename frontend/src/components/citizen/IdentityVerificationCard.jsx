import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ShieldAlert, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IdentityVerificationCard({ user }) {
  const queryClient = useQueryClient();
  const [aadhaar, setAadhaar] = useState('');

  const verifyMutation = useMutation({
    mutationFn: async (aadhaarNumber) => {
      const res = await API.post('/identity/verify', { aadhaarNumber });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Identity verified successfully! 🎉');
      queryClient.invalidateQueries(['auth-me']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (aadhaar.length !== 12) {
      toast.error('Aadhaar number must be exactly 12 digits');
      return;
    }
    verifyMutation.mutate(aadhaar);
  };

  if (user?.identityVerified) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50/30 border-emerald-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              Identity Verified <CheckCircle2 size={18} className="text-emerald-500" />
            </h3>
            <p className="text-sm text-emerald-700/80 mt-1 max-w-md leading-relaxed">
              Your identity has been verified securely. You now have full access to report issues and earn rewards on the platform.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50/30 border-orange-100 p-[30px]">      <div className="flex flex-col md:flex-row gap-6 md:items-center">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-orange-900">Verify Your Identity</h3>
          <p className="text-sm text-orange-800/80 mt-1 leading-relaxed">
            To maintain the integrity of the platform and prevent spam, you must verify your identity using your Aadhaar number before you can report issues.
          </p>
          <p className="text-[11px] font-bold text-red-800 mt-2 uppercase tracking-wide">
            🔒 Privacy Assured: We do not store your raw Aadhaar number.
          </p>
        </div>
      </div>

      <div className="md:w-72 shrink-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-sm border border-orange-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FileText size={16} />
            </div>
            <input
              type="text"
              placeholder="12-digit Aadhaar Number"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
              disabled={verifyMutation.isPending}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <Button
            type="submit"
            loading={verifyMutation.isPending}
            disabled={aadhaar.length !== 12}
            className="w-full !bg-orange-600 hover:!bg-orange-700 !text-white shadow-orange-600/20 mt-1"
            size="sm"
          >
            Verify Securely
          </Button>
        </form>
      </div>
    </div>
    </Card>
  );
}
