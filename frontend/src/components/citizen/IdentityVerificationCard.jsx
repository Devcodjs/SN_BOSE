import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ShieldAlert, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IdentityVerificationCard({ user }) {
  const isVerified = user?.identityVerified || ['demo_verified', 'verified'].includes(user?.verificationStatus);

  if (isVerified) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50/30 border-emerald-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              Identity Verified (Demo) <CheckCircle2 size={18} className="text-emerald-500" />
            </h3>
            <p className="text-sm text-emerald-700/80 mt-1 max-w-md leading-relaxed">
              Your identity is verified using the Development Mock Aadhaar Provider. You have full authorization to submit civic issue reports.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="bg-gradient-to-br from-orange-50 to-amber-50/30 border-orange-100"
      style={{ padding: '2mm' }}
    >
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-orange-900">Identity Verification Required</h3>
            <p className="text-sm text-orange-800/80 mt-1 leading-relaxed">
              To prevent duplicate and spam submissions, citizens must verify their identity via 6-digit Aadhaar OTP before reporting issues.
            </p>
            <p className="text-[11px] font-bold text-orange-900 mt-2 uppercase tracking-wide">
              🔒 Privacy Assured: Raw Aadhaar numbers are never stored in database.
            </p>
          </div>
        </div>

        <div className="md:w-60 shrink-0">
          <Link to="/verify-identity?redirect=/issues/new">
            <Button
              type="button"
              className="w-full !bg-orange-600 hover:!bg-orange-700 !text-white shadow-orange-600/20 flex items-center justify-center gap-2"
              size="md"
            >
              Verify Identity <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
