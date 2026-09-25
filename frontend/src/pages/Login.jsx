import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('+91');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('farmer');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(''); // ⚠️ Development OTP दाखवण्यासाठी

  const sendOTP = async () => {
    if (!/^\+91[6-9]\d{9}$/.test(mobile)) {
      alert('वैध मोबाइल नंबर द्या (+91XXXXXXXXXX)');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/send-otp', { mobile });
      setStep(2);

      // ⚠️ Dev mode मध्ये OTP दाखवा
      if (data.otp) {
        setDevOtp(data.otp);
      }
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
        mobile, otp, role, name
      });
      localStorage.setItem('kv_token', data.token);
      localStorage.setItem('kv_user', JSON.stringify(data.user));
      window.location.href = `/${data.user.role}`;
    } catch (e) {
      alert(e.response?.data?.error || 'चुकीचा OTP');
    } finally {
      setLoading(false);
    }
  };

  const autoFillOTP = () => {
    setOtp(devOtp);
  };

  return (
    <div style={s.container}>
      <button style={s.homeBtn} onClick={() => nav('/')}>
        🏠 मुख्यपृष्ठ
      </button>

      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logoWrap}>
            <span style={s.logoIcon}>🌾</span>
            <div>
              <h1 style={s.logo}>कृषीवृंदा</h1>
              <p style={s.tagline}>शेतकरी • व्यापारी • कामगार</p>
            </div>
          </div>
        </div>

        {step === 1 && (
          <>
            <label style={s.label}>मोबाइल नंबर</label>
            <input
              style={s.input}
              type="tel"
              value={mobile}
              placeholder="+91XXXXXXXXXX"
              onChange={(e) => setMobile(e.target.value)}
            />

            <label style={s.label}>तुम्ही कोण आहात?</label>
            <div style={s.roleRow}>
              {[
                { v: 'farmer', icon: '🌾', title: 'शेतकरी', sub: 'पिके विका', color: '#2e7d32' },
                { v: 'dealer', icon: '🛒', title: 'व्यापारी', sub: 'पिके खरेदी करा', color: '#1565c0' },
                { v: 'worker', icon: '👷', title: 'कामगार', sub: 'काम शोधा', color: '#e65100' }
              ].map((r) => (
                <button
                  key={r.v}
                  style={
                    role === r.v
                      ? { ...s.roleBtnActive, borderColor: r.color, background: `${r.color}15` }
                      : s.roleBtn
                  }
                  onClick={() => setRole(r.v)}
                >
                  <span style={{ fontSize: 26 }}>{r.icon}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700,
                      color: role === r.v ? r.color : '#333'
                    }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {r.sub}
                    </div>
                  </div>
                  {role === r.v && (
                    <span style={{ fontSize: 18, color: r.color, fontWeight: 900 }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            <label style={s.label}>तुमचे नाव</label>
            <input
              style={s.input}
              value={name}
              placeholder="उदा. राम पाटील"
              onChange={(e) => setName(e.target.value)}
            />

            <button style={s.button} onClick={sendOTP} disabled={loading}>
              {loading ? 'पाठवत आहे...' : 'OTP पाठवा'}
            </button>

            <p style={s.signupLink}>
              नवीन आहात?{' '}
              <Link to="/register" style={s.signupAnchor}>
                खाते तयार करा →
              </Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p style={s.helper}>
              <b>{mobile}</b> वर OTP पाठवला
            </p>

            {/* ⚠️ Dev mode मध्ये OTP दाखवा */}
            {devOtp && (
              <div style={s.devOtpBox}>
                <div style={s.devOtpLabel}>🔧 Development Mode — OTP:</div>
                <div style={s.devOtpValue}>{devOtp}</div>
                <button style={s.devOtpBtn} onClick={autoFillOTP}>
                  📋 आपोआप भरा
                </button>
              </div>
            )}

            <input
              style={{ ...s.input, textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
              value={otp}
              placeholder="______"
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />

            <button style={s.button} onClick={verify} disabled={loading}>
              {loading ? 'तपासत आहे...' : 'लॉगिन करा'}
            </button>

            <div style={s.otpActions}>
              <button style={s.link} onClick={() => { setStep(1); setOtp(''); setDevOtp(''); }}>
                ← मागे जा
              </button>
              <button style={s.link} onClick={sendOTP} disabled={loading}>
                🔄 पुन्हा OTP पाठवा
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    padding: 16,
    position: 'relative'
  },
  homeBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '10px 18px',
    borderRadius: 10,
    border: '2px solid #2e7d32',
    background: '#fff',
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  card: {
    background: '#fff',
    padding: 32,
    borderRadius: 20,
    boxShadow: '0 10px 40px rgba(46,125,50,0.15)',
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  header: { textAlign: 'center', marginBottom: 16 },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  logoIcon: { fontSize: 40 },
  logo: { fontSize: 28, color: '#2e7d32', margin: 0, fontWeight: 900 },
  tagline: { color: '#888', fontSize: 13, margin: '4px 0 0' },
  label: { fontSize: 13, color: '#555', fontWeight: 600, marginTop: 8 },
  input: {
    padding: 14,
    borderRadius: 10,
    border: '2px solid #e0e0e0',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: 'inherit'
  },
  roleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 4
  },
  roleBtn: {
    padding: '14px 16px',
    borderRadius: 12,
    border: '2px solid #e0e0e0',
    background: '#fff',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: 'inherit',
    transition: 'all 0.15s'
  },
  roleBtnActive: {
    padding: '14px 16px',
    borderRadius: 12,
    border: '2px solid #2e7d32',
    background: '#e8f5e9',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 800,
    color: '#2e7d32',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(46,125,50,0.15)',
    transition: 'all 0.15s'
  },
  button: {
    padding: 14,
    borderRadius: 10,
    border: 'none',
    background: '#2e7d32',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 12,
    fontFamily: 'inherit'
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#2e7d32',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit'
  },
  helper: { color: '#555', fontSize: 14, textAlign: 'center', margin: 0 },

  // ⚠️ Dev OTP Box
  devOtpBox: {
    background: '#fff8e1',
    border: '2px dashed #f57c00',
    borderRadius: 12,
    padding: 14,
    textAlign: 'center',
    marginTop: 8
  },
  devOtpLabel: {
    fontSize: 12,
    color: '#e65100',
    fontWeight: 700,
    marginBottom: 6
  },
  devOtpValue: {
    fontSize: 32,
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
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },

  otpActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8
  },

  signupLink: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 18,
    paddingTop: 18,
    borderTop: '1px solid #f0f0f0'
  },
  signupAnchor: {
    color: '#2e7d32',
    fontWeight: 800,
    textDecoration: 'none',
    marginLeft: 4
  }
};