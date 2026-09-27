import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    role: 'farmer',
    mobile: '+91',
    name: '',
    district: '',
    taluka: '',
    village: '',
    pincode: ''
  });
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const sendOTP = async () => {
    if (!/^\+91[6-9]\d{9}$/.test(form.mobile)) {
      alert('वैध मोबाइल नंबर द्या (+91XXXXXXXXXX)');
      return;
    }
    if (!form.name.trim()) {
      alert('तुमचे नाव भरा');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/send-otp', { mobile: form.mobile });
      setStep(2);
      if (data.otp) setDevOtp(data.otp);
    } catch (e) {
      alert(e.response?.data?.error || 'OTP पाठवता आला नाही');
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (otp.length !== 6) {
      alert('6-अंकी OTP द्या');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-otp', {
        mobile: form.mobile,
        otp,
        role: form.role,
        name: form.name
      });

      localStorage.setItem('kv_token', data.token);

      const extras = {
        district: form.district || '',
        taluka: form.taluka || '',
        village: form.village || '',
        pincode: form.pincode || ''
      };

      const fullUser = { ...data.user, ...extras };
      localStorage.setItem('kv_user', JSON.stringify(fullUser));

      if (Object.values(extras).some((v) => v)) {
        try {
          await API.patch('/users/me', extras);
        } catch (err) {
          console.error('Profile update failed:', err);
        }
      }

      window.location.href = `/${data.user.role}`;
    } catch (e) {
      alert(e.response?.data?.error || 'चुकीचा OTP');
    } finally {
      setLoading(false);
    }
  };

  const autoFillOTP = () => setOtp(devOtp);

  const DISTRICTS = [
    'अहमदनगर', 'अकोला', 'अमरावती', 'औरंगाबाद', 'बीड',
    'भंडारा', 'बुलढाणा', 'चंद्रपूर', 'धुळे', 'गडचिरोली',
    'गोंदिया', 'हिंगोली', 'जळगाव', 'जालना', 'कोल्हापूर',
    'लातूर', 'मुंबई', 'नागपूर', 'नांदेड', 'नंदुरबार',
    'नाशिक', 'उस्मानाबाद', 'परभणी', 'पुणे', 'रायगड',
    'रत्नागिरी', 'सांगली', 'सातारा', 'सिंधुदुर्ग', 'सोलापूर',
    'ठाणे', 'वर्धा', 'वाशिम', 'यवतमाळ', 'पालघर'
  ];

  return (
    <div style={s.container}>
      <header style={s.header}>
        <div style={s.logoWrap} onClick={() => nav('/')}>
          <span style={s.logoIcon}>🌾</span>
          <span style={s.logoText}>कृषीवृंदा</span>
        </div>
        <Link to="/" style={s.backLink}>← मुख्यपृष्ठ</Link>
      </header>

      <div style={s.content}>
        {/* Left — Info */}
        <div style={s.leftPanel}>
          <div style={s.heroBadge}>🚀 मोफत नोंदणी</div>
          <h1 style={s.heroTitle}>
            कृषीवृंदा मध्ये<br />
            <span style={s.heroAccent}>स्वागत आहे!</span>
          </h1>
          <p style={s.heroSub}>
            3 मिनिटांत खाते तयार करा आणि<br />
            महाराष्ट्राच्या कृषी क्रांतीत सहभागी व्हा.
          </p>

          <div style={s.benefitsList}>
            <Benefit icon="✅" text="100% मोफत" />
            <Benefit icon="🔒" text="सुरक्षित OTP लॉगिन" />
            <Benefit icon="🗣️" text="संपूर्ण ॲप मराठीत" />
            <Benefit icon="🎤" text="आवाज शोध" />
            <Benefit icon="📞" text="थेट WhatsApp संपर्क" />
            <Benefit icon="📍" text="स्थान आपोआप सेव्ह" />
          </div>

          <div style={s.testimonialBox}>
            <p style={s.testiText}>
              "पहिल्यांदाच माझा कांदा थेट व्यापाऱ्याला विकला. मध्यस्थ नाही, जास्त नफा!"
            </p>
            <div style={s.testiAuthor}>
              <div style={s.testiAvatar}>रा</div>
              <div>
                <div style={s.testiName}>राम पाटील</div>
                <div style={s.testiMeta}>🌾 शेतकरी • नाशिक</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div style={s.formPanel}>
          <div style={s.formCard}>
            {/* Progress */}
            <div style={s.progressRow}>
              <div style={step >= 1 ? s.progressActive : s.progressStep}>
                <span style={s.progressNum}>1</span>
                <span style={s.progressLabel}>माहिती</span>
              </div>
              <div style={step >= 2 ? s.progressLine : s.progressLineGray} />
              <div style={step >= 2 ? s.progressActive : s.progressStep}>
                <span style={step >= 2 ? s.progressNum : s.progressNumGray}>2</span>
                <span style={step >= 2 ? s.progressLabel : s.progressLabelGray}>
                  OTP
                </span>
              </div>
            </div>

            <h2 style={s.formTitle}>
              {step === 1 ? '📝 खाते तयार करा' : '📱 OTP तपासा'}
            </h2>
            <p style={s.formSub}>
              {step === 1
                ? 'तुमची माहिती भरा — फक्त 3 मिनिटांत तयार'
                : `${form.mobile} वर OTP पाठवला`}
            </p>

            {step === 1 && (
              <>
                <label style={s.label}>तुम्ही कोण आहात? *</label>
                <div style={s.roleGrid}>
                  {[
                    { v: 'farmer', icon: '🌾', title: 'शेतकरी', color: '#2e7d32' },
                    { v: 'dealer', icon: '🛒', title: 'व्यापारी', color: '#1565c0' },
                    { v: 'worker', icon: '👷', title: 'कामगार', color: '#e65100' }
                  ].map((r) => (
                    <button
                      key={r.v}
                      type="button"
                      style={
                        form.role === r.v
                          ? { ...s.roleCard, borderColor: r.color, background: `${r.color}10` }
                          : s.roleCard
                      }
                      onClick={() => set('role', r.v)}
                    >
                      <span style={s.roleIcon}>{r.icon}</span>
                      <div style={s.roleCardTitle}>{r.title}</div>
                      {form.role === r.v && (
                        <div style={{ ...s.roleCheck, background: r.color }}>✓</div>
                      )}
                    </button>
                  ))}
                </div>

                <label style={s.label}>पूर्ण नाव *</label>
                <input
                  style={s.input}
                  value={form.name}
                  placeholder="उदा. राम पाटील"
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                />

                <label style={s.label}>मोबाइल नंबर *</label>
                <input
                  style={s.input}
                  type="tel"
                  value={form.mobile}
                  placeholder="+91XXXXXXXXXX"
                  onChange={(e) => set('mobile', e.target.value)}
                  inputMode="numeric"
                  autoComplete="tel"
                />

                <div style={s.divider}>
                  <span style={s.dividerText}>📍 पत्ता (पर्यायी)</span>
                </div>

                <label style={s.label}>जिल्हा</label>
                <select
                  style={s.select}
                  value={form.district}
                  onChange={(e) => set('district', e.target.value)}
                >
                  <option value="">-- जिल्हा निवडा --</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <div style={s.row}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={s.label}>तालुका</label>
                    <input
                      style={s.input}
                      value={form.taluka}
                      placeholder="उदा. निफाड"
                      onChange={(e) => set('taluka', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={s.label}>गाव</label>
                    <input
                      style={s.input}
                      value={form.village}
                      placeholder="उदा. पिंपळगाव"
                      onChange={(e) => set('village', e.target.value)}
                    />
                  </div>
                </div>

                <label style={s.label}>पिनकोड</label>
                <input
                  style={s.input}
                  value={form.pincode}
                  placeholder="उदा. 422001"
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
                />

                <button
                  style={s.submitBtn}
                  onClick={sendOTP}
                  disabled={loading}
                >
                  {loading ? 'पाठवत आहे...' : '📱 OTP पाठवा'}
                </button>

                <p style={s.terms}>
                  पुढे जाऊन तुम्ही आमच्या{' '}
                  <span style={s.termsLink}>अटी व शर्ती</span> आणि{' '}
                  <span style={s.termsLink}>गोपनीयता धोरण</span> स्वीकारता.
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <div style={s.otpInfo}>
                  <div style={s.otpPhone}>
                    <span style={{ fontSize: 36 }}>📱</span>
                    <div style={s.otpPhoneNum}>{form.mobile}</div>
                  </div>
                </div>

                {devOtp && (
                  <div style={s.devOtpBox}>
                    <div style={s.devOtpLabel}>🔧 Development OTP:</div>
                    <div style={s.devOtpValue}>{devOtp}</div>
                    <button style={s.devOtpBtn} onClick={autoFillOTP}>
                      📋 आपोआप भरा
                    </button>
                  </div>
                )}

                <label style={s.label}>6-अंकी OTP</label>
                <input
                  style={{
                    ...s.input,
                    textAlign: 'center',
                    fontSize: 24,
                    letterSpacing: 8,
                    fontWeight: 800
                  }}
                  value={otp}
                  placeholder="______"
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />

                <button
                  style={s.submitBtn}
                  onClick={verify}
                  disabled={loading}
                >
                  {loading ? 'तपासत आहे...' : '✅ खाते तयार करा'}
                </button>

                <div style={s.otpActions}>
                  <button
                    style={s.linkBtn}
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setDevOtp('');
                    }}
                  >
                    ← मागे जा
                  </button>
                  <button
                    style={s.linkBtn}
                    onClick={sendOTP}
                    disabled={loading}
                  >
                    🔄 पुन्हा पाठवा
                  </button>
                </div>
              </>
            )}

            <div style={s.bottomLink}>
              आधीच खाते आहे?{' '}
              <Link to="/login" style={s.bottomLinkAnchor}>
                लॉगिन करा
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Benefit({ icon, text }) {
  return (
    <div style={s.benefitRow}>
      <span style={s.benefitIcon}>{icon}</span>
      <span style={s.benefitText}>{text}</span>
    </div>
  );
}

const s = {
  container: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 50%, #c8e6c9 100%)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    paddingBottom: 'env(safe-area-inset-bottom)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px clamp(16px, 4vw, 24px)',
    paddingTop: 'calc(14px + env(safe-area-inset-top))',
    maxWidth: 1400,
    margin: '0 auto',
    gap: 12
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    minWidth: 0
  },
  logoIcon: {
    fontSize: 'clamp(24px, 6vw, 30px)'
  },
  logoText: {
    fontSize: 'clamp(16px, 4.5vw, 20px)',
    fontWeight: 900,
    color: '#1b5e20'
  },
  backLink: {
    color: '#2e7d32',
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap'
  },

  content: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: 'clamp(16px, 4vw, 20px) clamp(16px, 4vw, 24px) clamp(40px, 8vw, 60px)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
    gap: 'clamp(28px, 5vw, 60px)',
    alignItems: 'start'
  },

  /* LEFT PANEL */
  leftPanel: {
    paddingTop: 'clamp(0px, 2vw, 20px)'
  },
  heroBadge: {
    display: 'inline-block',
    background: '#fff',
    color: '#1b5e20',
    padding: '7px clamp(14px, 3vw, 18px)',
    borderRadius: 30,
    fontSize: 'clamp(11px, 3vw, 13px)',
    fontWeight: 700,
    marginBottom: 'clamp(14px, 3vw, 20px)',
    border: '1px solid rgba(46,125,50,0.2)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
  },
  heroTitle: {
    fontSize: 'clamp(24px, 6vw, 44px)',
    fontWeight: 900,
    color: '#1b5e20',
    lineHeight: 1.2,
    margin: '0 0 18px',
    letterSpacing: -0.5
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSub: {
    fontSize: 'clamp(13px, 3.5vw, 17px)',
    color: '#444',
    lineHeight: 1.7,
    margin: '0 0 28px'
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 28
  },
  benefitRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 'clamp(13px, 3.3vw, 15px)',
    color: '#333'
  },
  benefitIcon: {
    fontSize: 'clamp(15px, 4vw, 18px)',
    flexShrink: 0
  },
  benefitText: {
    fontWeight: 500
  },
  testimonialBox: {
    background: '#fff',
    padding: 'clamp(16px, 4vw, 20px)',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    borderLeft: '4px solid #2e7d32'
  },
  testiText: {
    fontSize: 'clamp(12px, 3.3vw, 14px)',
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 1.6,
    margin: '0 0 14px'
  },
  testiAuthor: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  testiAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  testiName: {
    fontSize: 'clamp(13px, 3.3vw, 14px)',
    fontWeight: 800,
    color: '#1b5e20'
  },
  testiMeta: {
    fontSize: 'clamp(10px, 2.8vw, 12px)',
    color: '#888',
    marginTop: 2
  },

  /* FORM PANEL */
  formPanel: {},
  formCard: {
    background: '#fff',
    padding: 'clamp(20px, 5vw, 32px)',
    borderRadius: 24,
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.04)'
  },

  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 'clamp(20px, 4vw, 28px)'
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6
  },
  progressActive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6
  },
  progressNum: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#2e7d32',
    color: '#fff',
    fontSize: 15,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(46,125,50,0.3)'
  },
  progressNumGray: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#e0e0e0',
    color: '#888',
    fontSize: 15,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressLabel: {
    fontSize: 'clamp(10px, 2.8vw, 12px)',
    color: '#2e7d32',
    fontWeight: 700
  },
  progressLabelGray: {
    fontSize: 'clamp(10px, 2.8vw, 12px)',
    color: '#aaa',
    fontWeight: 600
  },
  progressLine: {
    flex: 1,
    height: 3,
    background: '#2e7d32',
    borderRadius: 2
  },
  progressLineGray: {
    flex: 1,
    height: 3,
    background: '#e0e0e0',
    borderRadius: 2
  },

  formTitle: {
    margin: '0 0 6px',
    fontSize: 'clamp(20px, 5vw, 24px)',
    fontWeight: 900,
    color: '#1b5e20'
  },
  formSub: {
    margin: '0 0 20px',
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    color: '#666'
  },

  label: {
    fontSize: 'clamp(12px, 3.2vw, 13px)',
    color: '#555',
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 6,
    display: 'block'
  },

  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(6px, 2vw, 10px)',
    marginBottom: 8
  },
  roleCard: {
    position: 'relative',
    padding: 'clamp(10px, 3vw, 14px) 6px',
    borderRadius: 14,
    border: '2px solid #e0e0e0',
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    transition: 'all 0.15s',
    minHeight: 'clamp(70px, 18vw, 85px)'
  },
  roleIcon: {
    fontSize: 'clamp(22px, 6vw, 28px)',
    lineHeight: 1
  },
  roleCardTitle: {
    fontSize: 'clamp(11px, 3vw, 14px)',
    fontWeight: 800,
    color: '#333',
    lineHeight: 1.1
  },
  roleCheck: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: '50%',
    color: '#fff',
    fontSize: 13,
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },

  input: {
    padding: '12px 14px',
    borderRadius: 12,
    border: '2px solid #e0e0e0',
    fontSize: 16,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    marginBottom: 6,
    background: '#fff',
    color: '#1a1a1a',
    WebkitAppearance: 'none',
    appearance: 'none'
  },
  select: {
    padding: '12px 14px',
    borderRadius: 12,
    border: '2px solid #e0e0e0',
    fontSize: 16,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    marginBottom: 6,
    background: '#fff',
    color: '#1a1a1a',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none'
  },
  row: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap'
  },

  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '18px 0 4px'
  },
  dividerText: {
    fontSize: 'clamp(12px, 3.2vw, 13px)',
    color: '#888',
    fontWeight: 700
  },

  submitBtn: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff',
    fontSize: 'clamp(14px, 3.8vw, 16px)',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 16,
    boxShadow: '0 8px 24px rgba(46,125,50,0.3)',
    minHeight: 50
  },

  terms: {
    fontSize: 'clamp(10px, 2.7vw, 11px)',
    color: '#999',
    textAlign: 'center',
    margin: '14px 0 0',
    lineHeight: 1.6
  },
  termsLink: {
    color: '#2e7d32',
    fontWeight: 700,
    cursor: 'pointer'
  },

  otpInfo: {
    textAlign: 'center',
    margin: '16px 0'
  },
  otpPhone: {
    display: 'inline-block',
    background: '#f1f8e9',
    padding: '14px 24px',
    borderRadius: 16
  },
  otpPhoneNum: {
    fontSize: 'clamp(13px, 3.5vw, 15px)',
    fontWeight: 800,
    color: '#1b5e20',
    marginTop: 4
  },

  devOtpBox: {
    background: '#fff8e1',
    border: '2px dashed #f57c00',
    borderRadius: 12,
    padding: 14,
    textAlign: 'center',
    marginBottom: 12
  },
  devOtpLabel: {
    fontSize: 'clamp(11px, 3vw, 12px)',
    color: '#e65100',
    fontWeight: 700,
    marginBottom: 6
  },
  devOtpValue: {
    fontSize: 'clamp(24px, 7vw, 32px)',
    fontWeight: 900,
    color: '#e65100',
    letterSpacing: 8,
    fontFamily: 'monospace',
    marginBottom: 10
  },
  devOtpBtn: {
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    background: '#f57c00',
    color: '#fff',
    fontSize: 'clamp(12px, 3.2vw, 13px)',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    minHeight: 40
  },

  otpActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 8
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#2e7d32',
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: 4
  },

  bottomLink: {
    textAlign: 'center',
    fontSize: 'clamp(12px, 3.3vw, 14px)',
    color: '#666',
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid #f0f0f0'
  },
  bottomLinkAnchor: {
    color: '#2e7d32',
    fontWeight: 800,
    textDecoration: 'none',
    marginLeft: 4
  }
};