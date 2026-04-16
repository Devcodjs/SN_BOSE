import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import { StatusBadge, CategoryBadge, PriorityBadge } from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusTimeline from '../../components/issues/StatusTimeline';
import BeforeAfterSlider from '../../components/issues/BeforeAfterSlider';
import MapView from '../../components/map/MapView';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { ThumbsUp, Trash2, MapPin, Calendar, User, Clock, Building2 } from 'lucide-react';
import { format } from 'date-fns';

/* ─── small reusable meta pill ─────────────────────────────────────────── */
function MetaPill({ icon, children, color = '#0369a1', bg = '#e0f2fe', border = '#bae6fd' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '7px',
      background: bg, border: `1px solid ${border}`,
      borderRadius: '99px', padding: '6px 14px',
      fontSize: '13px', color, fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {icon}
      {children}
    </span>
  );
}

/* ─── section card wrapper ──────────────────────────────────────────────── */
function SectionCard({ title, icon, children, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #bae6fd',
      borderRadius: '16px',
      overflow: 'hidden',
      ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '18px 24px',
          borderBottom: '1px solid #e0f2fe',
          background: '#f8fcff',
        }}>
          <span style={{ fontSize: '15px' }}>{icon}</span>
          <h3 style={{
            fontSize: '14px', fontWeight: 500,
            color: '#0c4a6e', margin: 0,
          }}>{title}</h3>
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const res = await API.get(`/issues/${id}`);
      return res.data.data;
    },
  });

  const upvoteMut = useMutation({
    mutationFn: () => API.post(`/issues/${id}/upvote`),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['issue', id] });
      const prev = qc.getQueryData(['issue', id]);
      qc.setQueryData(['issue', id], old => ({
        ...old,
        hasUpvoted: !old.hasUpvoted,
        upvoteCount: old.hasUpvoted ? old.upvoteCount - 1 : old.upvoteCount + 1,
      }));
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(['issue', id], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['issue', id] }),
  });

  const deleteMut = useMutation({
    mutationFn: () => API.delete(`/issues/${id}`),
    onSuccess: () => { toast.success('Issue deleted'); navigate('/dashboard'); },
  });

  /* ── loading ── */
  if (isLoading) return (
    <PageWrapper>
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '48px 24px' }}>
        <SkeletonCard />
        <div style={{ marginTop: '24px' }}><SkeletonCard /></div>
      </div>
    </PageWrapper>
  );

  if (!issue) return null;

  const isOwner = user && issue.submittedBy?._id === user._id;
  const beforeImg = issue.images?.[0];
  const afterImg  = issue.proofImages?.[0];

  return (
    <PageWrapper>
      <div style={{
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '48px 24px 80px',
      }}>

        {/* ══ HEADER ══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '40px' }}
        >
          {/* Badges row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', gap: '10px',
            marginBottom: '20px',
          }}>
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
            {issue.priority && <PriorityBadge priority={issue.priority} />}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 500,
            color: '#0c4a6e',
            lineHeight: 1.25,
            marginBottom: '24px',
            maxWidth: '820px',
          }}>
            {issue.title}
          </h1>

          {/* Meta pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            padding: '16px 20px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            marginBottom: '28px',
          }}>
            <MetaPill
              icon={<User size={13} color="#0369a1" />}
              color="#0369a1" bg="#e0f2fe" border="#bae6fd"
            >
              {issue.submittedBy?.name}
            </MetaPill>

            <MetaPill
              icon={<Calendar size={13} color="#0369a1" />}
              color="#0369a1" bg="#e0f2fe" border="#bae6fd"
            >
              {format(new Date(issue.createdAt), 'dd MMM yyyy')}
            </MetaPill>

            {issue.department && (
              <MetaPill
                icon={<Building2 size={13} color="#065f46" />}
                color="#065f46" bg="#dcfce7" border="#bbf7d0"
              >
                {issue.department.name}
              </MetaPill>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => upvoteMut.mutate()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '11px 24px',
                borderRadius: '10px',
                fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                border: issue.hasUpvoted ? 'none' : '1px solid #bae6fd',
                background: issue.hasUpvoted ? '#0ea5e9' : '#fff',
                color: issue.hasUpvoted ? '#fff' : '#0369a1',
                boxShadow: issue.hasUpvoted ? '0 2px 12px rgba(14,165,233,0.25)' : 'none',
              }}
            >
              <ThumbsUp size={16} />
              {issue.upvoteCount || 0} Upvote{(issue.upvoteCount || 0) !== 1 ? 's' : ''}
            </button>

            {(isOwner || user?.role === 'admin') && (
              <button
                onClick={() => { if (confirm('Delete this issue?')) deleteMut.mutate(); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '11px 24px',
                  borderRadius: '10px',
                  fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer',
                  background: '#fff5f5',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  transition: 'background 0.15s',
                }}
              >
                <Trash2 size={16} />
                Delete issue
              </button>
            )}
          </div>
        </motion.div>

        {/* ══ BODY GRID ════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)',
          gap: '24px',
          alignItems: 'start',
        }}>

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Before / After slider */}
            {beforeImg && afterImg && (
              <SectionCard title="Before & after" icon="📷">
                <BeforeAfterSlider beforeImage={beforeImg} afterImage={afterImg} />
              </SectionCard>
            )}

            {/* Images (when no slider) */}
            {issue.images?.length > 0 && !(beforeImg && afterImg) && (
              <SectionCard title="Photos" icon="🖼️" style={{ padding: 0 }}>
                <div style={{ padding: 0 }}>
                  <img
                    src={issue.images[0]}
                    alt={issue.title}
                    style={{
                      width: '100%', maxHeight: '380px',
                      objectFit: 'cover', display: 'block',
                      borderRadius: issue.images.length > 1 ? '0' : '0 0 15px 15px',
                    }}
                  />
                  {issue.images.length > 1 && (
                    <div style={{
                      display: 'flex', gap: '10px',
                      padding: '14px 16px',
                      background: '#f8fcff',
                      borderTop: '1px solid #e0f2fe',
                    }}>
                      {issue.images.slice(1).map((img, i) => (
                        <img
                          key={i} src={img} alt=""
                          style={{
                            width: '88px', height: '64px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Description */}
            <SectionCard title="Description" icon="📝">
              <p style={{
                fontSize: '14px',
                color: '#334155',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}>
                {issue.description}
              </p>
            </SectionCard>

            {/* Map */}
            {issue.location?.address && (
              <SectionCard title="Location" icon="📍">
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', color: '#64748b',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  marginBottom: '16px',
                }}>
                  <MapPin size={13} color="#0284c7" />
                  {issue.location.address}
                </div>
                <MapView
                  coordinates={issue.location.coordinates}
                  address={issue.location.address}
                  title={issue.title}
                />
              </SectionCard>
            )}
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Status timeline */}
            <SectionCard title="Status timeline" icon="📊">
              <StatusTimeline updates={issue.updates || []} />
            </SectionCard>

            {/* Resolved banner */}
            {issue.status === 'Resolved' && issue.resolvedAt && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                padding: '20px 22px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '10px',
                }}>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '15px' }}>✅</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#065f46' }}>
                    Issue resolved
                  </span>
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '6px',
                  paddingLeft: '40px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', color: '#059669',
                  }}>
                    <Calendar size={12} />
                    {format(new Date(issue.resolvedAt), 'dd MMM yyyy')}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', color: '#059669',
                  }}>
                    <Clock size={12} />
                    {Math.round(
                      (new Date(issue.resolvedAt) - new Date(issue.createdAt)) / 3600000
                    )} hours to resolve
                  </div>
                </div>
              </div>
            )}

            {/* Quick info card */}
            <div style={{
              background: '#f8fcff',
              border: '1px solid #bae6fd',
              borderRadius: '14px',
              padding: '20px 22px',
            }}>
              <p style={{
                fontSize: '11px', color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                marginBottom: '14px', fontWeight: 500,
              }}>
                Issue details
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Submitted by', value: issue.submittedBy?.name },
                  { label: 'Category',     value: issue.category },
                  { label: 'Priority',     value: issue.priority || '—' },
                  { label: 'Department',   value: issue.department?.name || '—' },
                  { label: 'Reported on',  value: format(new Date(issue.createdAt), 'dd MMM yyyy') },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: i < 4 ? '1px solid #e0f2fe' : 'none',
                  }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', color: '#0c4a6e', fontWeight: 500, textAlign: 'right' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}