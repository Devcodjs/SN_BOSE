import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import {
  Send, ImagePlus, MapPin, FileText,
  ChevronRight, ChevronLeft, ChevronDown,
  X, CheckCircle2,
} from 'lucide-react';
import API from '../../services/api';
import PageWrapper from '../../components/layout/PageWrapper';
import MapPicker from '../../components/map/MapPicker';
import Button from '../../components/ui/Button';

/* ─────────────── Constants ─────────────── */
const categories = [
  { name: 'Roads',       icon: '🛣️' },
  { name: 'Water',       icon: '💧' },
  { name: 'Garbage',     icon: '🗑️' },
  { name: 'Electricity', icon: '⚡' },
  { name: 'Sanitation',  icon: '🧹' },
  { name: 'Other',       icon: '📋' },
];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

const PRIORITY_META = {
  Low:      { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  Medium:   { color: '#ca8a04', bg: '#fefce8', border: '#fef08a' },
  High:     { color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  Critical: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};

/* ─────────────── Inline Styles ─────────────── */
const S = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)',
    padding: '3rem 0 4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '760px',
    padding: '0 1.5rem',
  },

  /* Header */
  headerWrap: { textAlign: 'center', marginBottom: '2.5rem' },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '999px',
    padding: '5px 16px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#1d4ed8',
    marginBottom: '1rem',
    letterSpacing: '0.02em',
  },
  h1: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 0.75rem',
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#64748b',
    fontWeight: 400,
    maxWidth: '520px',
    margin: '0 auto',
    lineHeight: 1.65,
  },

  /* Stepper */
  stepperWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2.5rem',
    gap: 0,
  },
  stepCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },

  /* Card */
  card: {
    width: '100%',
    background: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 60px -10px rgba(59,130,246,0.08)',
    padding: 'clamp(1.5rem, 4vw, 3rem)',
  },

  /* Section label */
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '10px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  required: { color: '#ef4444', marginLeft: '3px' },
  optional: { color: '#94a3b8', fontWeight: 500, textTransform: 'none', letterSpacing: 0, marginLeft: '6px', fontSize: '12px' },

  /* Input */
  input: {
    width: '100%',
    padding: '13px 18px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    background: '#f8fafc',
    color: '#0f172a',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '13px 18px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    background: '#f8fafc',
    color: '#0f172a',
    fontSize: '15px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, background 0.15s',
  },

  /* Divider between form sections */
  divider: {
    borderTop: '1.5px dashed #f1f5f9',
    margin: '2rem 0',
  },

  /* Category grid */
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
  },

  /* Navigation footer */
  navFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2.5rem',
    paddingTop: '1.75rem',
    borderTop: '1.5px solid #f1f5f9',
  },
};

/* ─────────────── Sub-components ─────────────── */
function SectionBlock({ children }) {
  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #f1f5f9',
      borderRadius: '16px',
      padding: '1.5rem',
    }}>
      {children}
    </div>
  );
}

function StyledInput({ style, ...props }) {
  return (
    <input
      {...props}
      style={{ ...S.input, ...style }}
      onFocus={e => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.background = '#fff';
        e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
      }}
      onBlur={e => {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.background = '#f8fafc';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

function StyledTextarea({ style, ...props }) {
  return (
    <textarea
      {...props}
      style={{ ...S.textarea, ...style }}
      onFocus={e => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.background = '#fff';
        e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
      }}
      onBlur={e => {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.background = '#f8fafc';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

/* ─────────────── Main Page ─────────────── */
export default function CreateIssuePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'Medium',
    address: '', latitude: '', longitude: '', files: [],
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleCategory = (cat) => setForm(f => ({ ...f, category: cat }));
  const handleLocation = useCallback(
    (loc) => setForm(f => ({ ...f, latitude: loc.latitude, longitude: loc.longitude })),
    []
  );

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) toast.error('Max 5MB per file');
    setForm(f => ({ ...f, files: valid }));
    setPreviews(valid.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (i) => {
    setForm(f => ({ ...f, files: f.files.filter((_, j) => j !== i) }));
    setPreviews(p => p.filter((_, j) => j !== i));
  };

  const canNext = () => {
    if (step === 1) return form.title && form.category && form.description;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('category', form.category);
      data.append('priority', form.priority);
      data.append('address', form.address);
      data.append('latitude', form.latitude);
      data.append('longitude', form.longitude);
      form.files.forEach(f => data.append('images', f));

      const res = await API.post('/issues', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors: ['#2563eb', '#3b82f6', '#93c5fd', '#dbeafe'] });
      toast.success('Issue reported successfully! 🎉');
      setTimeout(() => navigate(`/issues/${res.data.data._id}`), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { n: 1, icon: <FileText size={17} />, label: 'Details' },
    { n: 2, icon: <MapPin size={17} />,   label: 'Location' },
    { n: 3, icon: <ImagePlus size={17} />, label: 'Media' },
  ];

  const priorityMeta = PRIORITY_META[form.priority] || PRIORITY_META.Medium;

  return (
    <PageWrapper style={S.page}>
      <div style={S.container}>

        {/* ── Header ── */}
        <div style={S.headerWrap}>
          <div style={S.badge}>
            <Send size={13} /> Report a Community Issue
          </div>
          <h1 style={S.h1}>Make Your Voice Heard</h1>
          <p style={S.subtitle}>
            Your report goes directly to local authorities. Help improve your community by sharing what you observe.
          </p>
        </div>

        {/* ── Step Indicator ── */}
        <div style={S.stepperWrap}>
          {steps.map((s, i) => {
            const completed = step > s.n;
            const active    = step === s.n;
            return (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={S.stepCol}>
                  {/* Circle */}
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '15px',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                    ...(active    ? { background: '#2563eb', color: '#fff', boxShadow: '0 0 0 5px #dbeafe', transform: 'scale(1.08)' } :
                        completed ? { background: '#0f172a', color: '#fff' } :
                                    { background: '#f1f5f9', color: '#94a3b8', border: '1.5px solid #e2e8f0' }),
                  }}>
                    {completed ? <CheckCircle2 size={19} /> : s.icon}
                  </div>
                  {/* Label */}
                  <span style={{
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    color: active ? '#2563eb' : completed ? '#0f172a' : '#94a3b8',
                  }}>
                    {s.label}
                  </span>
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{
                    width: 'clamp(3rem, 8vw, 6rem)', height: '3px',
                    background: '#f1f5f9', borderRadius: '2px',
                    margin: '0 12px 20px',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      background: '#0f172a', borderRadius: '2px',
                      width: completed ? '100%' : '0%',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Form Card ── */}
        <div style={S.card}>
          <AnimatePresence mode="wait">

            {/* STEP 1 — Details */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                {/* Category */}
                <SectionBlock>
                  <label style={S.label}>
                    Issue type <span style={S.required}>*</span>
                  </label>
                  <div style={S.catGrid}>
                    {categories.map(c => {
                      const sel = form.category === c.name;
                      return (
                        <button
                          key={c.name} type="button"
                          onClick={() => handleCategory(c.name)}
                          style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            padding: '18px 8px', borderRadius: '14px', cursor: 'pointer',
                            border: sel ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                            background: sel ? '#eff6ff' : '#fff',
                            color: sel ? '#1d4ed8' : '#475569',
                            transition: 'all 0.15s ease',
                            transform: sel ? 'translateY(-2px)' : 'none',
                            boxShadow: sel ? '0 4px 12px rgba(37,99,235,0.15)' : 'none',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontSize: '26px' }}>{c.icon}</span>
                          <span style={{ fontWeight: 700, fontSize: '13px' }}>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </SectionBlock>

                {/* Title */}
                <SectionBlock>
                  <label style={S.label}>
                    Issue title <span style={S.required}>*</span>
                  </label>
                  <StyledInput
                    name="title" value={form.title} onChange={handleChange}
                    maxLength={100} placeholder="e.g., Deep pothole on MG Road near the flyover"
                  />
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', textAlign: 'right', fontWeight: 500 }}>
                    {form.title.length}/100
                  </p>
                </SectionBlock>

                {/* Description */}
                <SectionBlock>
                  <label style={S.label}>
                    Detailed description <span style={S.required}>*</span>
                  </label>
                  <StyledTextarea
                    name="description" value={form.description}
                    onChange={handleChange} rows={5} maxLength={2000}
                    placeholder="Be specific — mention landmarks, size of damage, how long the issue has persisted, and any safety concerns…"
                  />
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', textAlign: 'right', fontWeight: 500 }}>
                    {form.description.length}/2000
                  </p>
                </SectionBlock>
              </motion.div>
            )}

            {/* STEP 2 — Location */}
            {step === 2 && (
              <motion.div key="s2"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                {/* Priority */}
                <SectionBlock>
                  <label style={S.label}>Urgency / Priority</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="priority" value={form.priority} onChange={handleChange}
                      style={{
                        ...S.input,
                        appearance: 'none',
                        cursor: 'pointer',
                        fontWeight: 700,
                        paddingRight: '42px',
                        color: priorityMeta.color,
                        background: priorityMeta.bg,
                        borderColor: priorityMeta.border,
                        border: `1.5px solid ${priorityMeta.border}`,
                      }}
                    >
                      {priorities.map(p => <option key={p} value={p}>{p} Priority</option>)}
                    </select>
                    <div style={{
                      pointerEvents: 'none', position: 'absolute',
                      inset: 0, right: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'flex-end',
                      paddingRight: '14px', color: priorityMeta.color,
                    }}>
                      <ChevronDown size={17} />
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', fontWeight: 500 }}>
                    Select how urgently this needs attention from local authorities.
                  </p>
                </SectionBlock>

                {/* Address */}
                <SectionBlock>
                  <label style={S.label}>
                    Street address or landmark
                    <span style={S.optional}>(optional)</span>
                  </label>
                  <StyledInput
                    name="address" value={form.address} onChange={handleChange}
                    placeholder="e.g., Near City Mall, MG Road cross-section, Guwahati"
                  />
                </SectionBlock>

                {/* Map */}
                <SectionBlock>
                  <label style={S.label}>Pin exact location on map</label>
                  <div style={{
                    borderRadius: '14px', overflow: 'hidden',
                    border: '1.5px solid #e2e8f0', height: '320px',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
                  }}>
                    <MapPicker onChange={handleLocation} />
                  </div>
                  {form.latitude && form.longitude && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      marginTop: '10px', fontSize: '12px', color: '#16a34a', fontWeight: 600,
                    }}>
                      <CheckCircle2 size={14} />
                      Location pinned — {parseFloat(form.latitude).toFixed(5)}, {parseFloat(form.longitude).toFixed(5)}
                    </div>
                  )}
                  {!form.latitude && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px', fontWeight: 500 }}>
                      Drag the marker to pinpoint the exact location of the issue.
                    </p>
                  )}
                </SectionBlock>
              </motion.div>
            )}

            {/* STEP 3 — Media */}
            {step === 3 && (
              <motion.div key="s3"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                {/* Upload zone */}
                <SectionBlock>
                  <label style={S.label}>
                    Photographic evidence
                    <span style={S.optional}>max 3 images · 5MB each</span>
                  </label>

                  <input
                    type="file" id="images"
                    accept="image/jpeg,image/png,image/webp"
                    multiple onChange={handleFiles} style={{ display: 'none' }}
                  />
                  <label htmlFor="images" style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed #93c5fd', borderRadius: '16px',
                    padding: '2.5rem 1.5rem', cursor: 'pointer',
                    background: '#f0f9ff', transition: 'background 0.15s, border-color 0.15s',
                    textAlign: 'center', gap: '12px',
                  }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: '#dbeafe', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ImagePlus size={26} color="#2563eb" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', margin: 0 }}>
                        Click to upload photos
                      </p>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', fontWeight: 400 }}>
                        JPEG, PNG, WebP — up to 5MB per file
                      </p>
                    </div>
                  </label>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px', marginTop: '1.25rem',
                    }}>
                      {previews.map((url, i) => (
                        <div key={i} style={{
                          position: 'relative', borderRadius: '12px',
                          overflow: 'hidden', border: '1.5px solid #e2e8f0',
                          aspectRatio: '16/10',
                        }}>
                          <img
                            src={url} alt={`Preview ${i + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          <button
                            type="button" onClick={() => removeFile(i)}
                            style={{
                              position: 'absolute', top: '8px', right: '8px',
                              width: '26px', height: '26px', borderRadius: '50%',
                              background: 'rgba(0,0,0,0.55)', border: 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', color: '#fff',
                            }}
                          >
                            <X size={13} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionBlock>

                {/* Summary card */}
                <SectionBlock>
                  <label style={S.label}>Submission summary</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { key: 'Category',    val: form.category    || '—' },
                      { key: 'Title',       val: form.title       || '—' },
                      { key: 'Priority',    val: form.priority    || 'Medium' },
                      { key: 'Address',     val: form.address     || 'Not provided' },
                      { key: 'Photos',      val: `${previews.length} attached` },
                    ].map(row => (
                      <div key={row.key} style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '10px 14px',
                        background: '#fff', borderRadius: '10px',
                        border: '1px solid #f1f5f9',
                      }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{row.key}</span>
                        <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-word' }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </SectionBlock>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation Footer ── */}
          <div style={S.navFooter}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '11px 22px', borderRadius: '12px',
                  border: '1.5px solid #e2e8f0', background: '#fff',
                  color: '#475569', fontWeight: 700, fontSize: '15px',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <ChevronLeft size={18} strokeWidth={2.5} /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '12px 28px', borderRadius: '12px',
                  background: canNext() ? '#0f172a' : '#e2e8f0',
                  color: canNext() ? '#fff' : '#94a3b8',
                  border: 'none', fontWeight: 700, fontSize: '15px',
                  cursor: canNext() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                  boxShadow: canNext() ? '0 4px 14px rgba(15,23,42,0.18)' : 'none',
                }}
              >
                Continue <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !form.title || !form.category || !form.description}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '13px 32px', borderRadius: '12px',
                  background: '#2563eb', color: '#fff', border: 'none',
                  fontWeight: 700, fontSize: '15px',
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  transition: 'all 0.15s',
                  opacity: (!form.title || !form.category || !form.description) ? 0.5 : 1,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTopColor: '#fff',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block',
                    }} />
                    Submitting…
                  </>
                ) : (
                  <><Send size={16} strokeWidth={2.5} /> Submit Report</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover:not(:disabled) { opacity: 0.88; }
        select option { background: #fff; color: #0f172a; }
      `}</style>
    </PageWrapper>
  );
}