import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Landing() {
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    farmers: 0,
    dealers: 0,
    workers: 0,
    crops: 0
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const animate = (key, target, delay = 0) => {
      setTimeout(() => {
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }, 25);
      }, delay);
    };

    animate('farmers', 12500, 300);
    animate('dealers', 3200, 500);
    animate('workers', 8400, 700);
    animate('crops', 42, 900);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={s.app}>
      {/* ==================== HEADER ==================== */}
      <header style={scrolled ? s.headerScrolled : s.header}>
        <div style={s.headerInner}>
          <div style={s.logoWrap} onClick={() => nav('/')}>
            <div style={s.logoBadge}>🌾</div>
            <div>
              <div style={s.logoText}>कृषीवृंदा</div>
              <div style={s.logoSub}>KRISHIVRINDA</div>
            </div>
          </div>

          <nav style={s.headerNav}>
            <span style={s.navLink} onClick={() => scrollTo('features')}>वैशिष्ट्ये</span>
            <span style={s.navLink} onClick={() => scrollTo('how')}>कसे चाले</span>
            <span style={s.navLink} onClick={() => scrollTo('why')}>विशेष का</span>
            <span style={s.navLink} onClick={() => scrollTo('reviews')}>अभिप्राय</span>
          </nav>

          <div style={s.headerActions}>
            <button style={s.loginBtn} onClick={() => nav('/login')}>
              लॉगिन
            </button>
            <button style={s.signupBtn} onClick={() => nav('/register')}>
              🚀 सुरू करा
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section style={s.hero}>
        <div style={s.heroGrid} />

        <div style={s.heroInner}>
          {/* Left — Content */}
          <div style={s.heroLeft}>
            <div style={s.heroBadge}>
              <span style={s.heroBadgeDot} />
              🇮🇳 महाराष्ट्रातील #1 कृषी व्यासपीठ
            </div>

            <h1 style={s.heroTitle}>
              शेतकरी, व्यापारी आणि<br />
              कामगार <span style={s.heroAccent}>एकत्र</span>
            </h1>

            <p style={s.heroSub}>
              पिकांची विक्री, व्यापार आणि काम — सर्व एका मराठी ॲपमध्ये.
              मध्यस्थ नाही, थेट संपर्क, जास्त नफा.
            </p>

            <div style={s.heroBtns}>
              <button style={s.primaryBtn} onClick={() => nav('/register')}>
                🚀 मोफत सुरू करा
                <span style={s.btnArrow}>→</span>
              </button>
              <button style={s.secondaryBtn} onClick={() => scrollTo('how')}>
                ▶ कसे चाले
              </button>
            </div>

            <div style={s.trustRow}>
              <div style={s.trustBadge}>
                <span style={s.trustIcon}>✅</span>
                <span>100% मोफत</span>
              </div>
              <div style={s.trustBadge}>
                <span style={s.trustIcon}>🔒</span>
                <span>सुरक्षित OTP</span>
              </div>
              <div style={s.trustBadge}>
                <span style={s.trustIcon}>🗣️</span>
                <span>मराठीत</span>
              </div>
            </div>
          </div>

          {/* Right — Mockup */}
          <div style={s.heroRight}>
            <div style={{ ...s.floatCard, top: 20, left: -30 }}>
              <div style={s.floatCardIcon}>🌾</div>
              <div>
                <div style={s.floatCardTitle}>कांदा पोस्ट</div>
                <div style={s.floatCardSub}>₹1,500 / क्विंटल</div>
              </div>
            </div>

            <div style={s.phone}>
              <div style={s.phoneNotch} />
              <div style={s.phoneScreen}>
                <div style={s.phoneHeader}>
                  <span style={{ fontSize: 22 }}>🌾</span>
                  <span style={s.phoneTitle}>कृषीवृंदा</span>
                  <span style={{ fontSize: 16 }}>🔔</span>
                </div>
                <div style={s.phoneContent}>
                  <div style={s.phoneStat}>
                    <div style={s.phoneStatNum}>₹1,500</div>
                    <div style={s.phoneStatLabel}>कांदा भाव</div>
                  </div>
                  <div style={s.phoneStat}>
                    <div style={{ ...s.phoneStatNum, color: '#1565c0' }}>12</div>
                    <div style={s.phoneStatLabel}>व्यापारी इच्छुक</div>
                  </div>
                  <div style={s.phoneCrop}>
                    <span>🧅</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>कांदा</div>
                      <div style={{ fontSize: 10, color: '#888' }}>50 क्विंटल</div>
                    </div>
                  </div>
                  <div style={s.phoneCrop}>
                    <span>🍅</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>टोमॅटो</div>
                      <div style={{ fontSize: 10, color: '#888' }}>30 क्विंटल</div>
                    </div>
                  </div>
                  <div style={s.phoneBtn}>+ पीक पोस्ट करा</div>
                </div>
              </div>
            </div>

            <div style={{ ...s.floatCard, bottom: 40, right: -20 }}>
              <div style={{ ...s.floatCardIcon, background: '#1565c0' }}>💬</div>
              <div>
                <div style={s.floatCardTitle}>WhatsApp संपर्क</div>
                <div style={s.floatCardSub}>थेट बोला</div>
              </div>
            </div>

            <div style={{ ...s.floatCard, bottom: 200, left: -50 }}>
              <div style={{ ...s.floatCardIcon, background: '#e65100' }}>⭐</div>
              <div>
                <div style={s.floatCardTitle}>4.9 रेटिंग</div>
                <div style={s.floatCardSub}>12,500+ वापरकर्ते</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section style={s.statsBar}>
        <div style={s.statsBarInner}>
          <div style={s.statItem}>
            <div style={s.statNum}>{stats.farmers.toLocaleString('mr-IN')}+</div>
            <div style={s.statLabel}>शेतकरी</div>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <div style={s.statNum}>{stats.dealers.toLocaleString('mr-IN')}+</div>
            <div style={s.statLabel}>व्यापारी</div>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <div style={s.statNum}>{stats.workers.toLocaleString('mr-IN')}+</div>
            <div style={s.statLabel}>कामगार</div>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <div style={s.statNum}>{stats.crops}+</div>
            <div style={s.statLabel}>पिके</div>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <div style={s.statNum}>305</div>
            <div style={s.statLabel}>मंडी</div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES / ROLES ==================== */}
      <section id="features" style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>वैशिष्ट्ये</div>
          <h2 style={s.sectionTitle}>
            एक व्यासपीठ, <span style={s.titleAccent}>तीन भूमिका</span>
          </h2>
          <p style={s.sectionSub}>
            तुम्ही शेतकरी आहात, व्यापारी आहात की कामगार —<br />
            कृषीवृंदा तुमच्यासाठी बनवले आहे
          </p>
        </div>

        <div style={s.roleGrid}>
          <RoleCard
            icon="🌾"
            title="शेतकरी"
            subtitle="पिके विका, जास्त नफा मिळवा"
            color="#2e7d32"
            bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
            features={[
              'पिके फोटोसह पोस्ट करा',
              'मंडीचे ताजे भाव पहा',
              'नफा कॅल्क्युलेटर वापरा',
              'कामगारांना नोकरी द्या',
              'व्यापाऱ्यांशी थेट बोला'
            ]}
          />
          <RoleCard
            icon="🛒"
            title="व्यापारी"
            subtitle="ताजे माल, योग्य भाव"
            color="#1565c0"
            bg="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
            features={[
              'शेतकऱ्यांची पिके शोधा',
              'कार्टमध्ये टाका, थेट बोला',
              'जिल्ह्यानुसार filter',
              'मंडी भाव तपासा',
              'विश्वासार्ह कामगार शोधा'
            ]}
          />
          <RoleCard
            icon="👷"
            title="कामगार"
            subtitle="काम शोधा, पैसे कमवा"
            color="#e65100"
            bg="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"
            features={[
              'जवळच्या नोकऱ्या शोधा',
              'एका क्लिकवर अर्ज करा',
              'तुमचा अर्ज तयार करा',
              'मजुरीचा योग्य दर पहा',
              'रेटिंग मिळवा, विश्वास वाढवा'
            ]}
          />
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how" style={{ ...s.section, background: '#f8f9fa' }}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>कसे चाले</div>
          <h2 style={s.sectionTitle}>
            3 सोप्या पायऱ्यांत <span style={s.titleAccent}>सुरू करा</span>
          </h2>
        </div>

        <div style={s.stepsGrid}>
          <StepCard
            num="1"
            icon="📝"
            title="नोंदणी करा"
            desc="OTP ने मोफत खाते तयार करा — 3 मिनिटांत"
            color="#2e7d32"
          />
          <StepCard
            num="2"
            icon="🎯"
            title="भूमिका निवडा"
            desc="शेतकरी, व्यापारी की कामगार — तुम्ही कोण आहात?"
            color="#1565c0"
          />
          <StepCard
            num="3"
            icon="🚀"
            title="काम सुरू"
            desc="पिके पोस्ट करा, नोकऱ्या शोधा, व्यापार करा"
            color="#e65100"
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button style={s.primaryBtn} onClick={() => nav('/register')}>
            🚀 आता सुरू करा
            <span style={s.btnArrow}>→</span>
          </button>
        </div>
      </section>

      {/* ==================== WHY US ==================== */}
      <section id="why" style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>विशेष का?</div>
          <h2 style={s.sectionTitle}>
            कृषीवृंदा <span style={s.titleAccent}>का निवडावे?</span>
          </h2>
        </div>

        <div style={s.whyGrid}>
          <WhyCard icon="🗣️" title="100% मराठीत" desc="तुमच्या भाषेत, तुमच्या शब्दांत" color="#2e7d32" />
          <WhyCard icon="🎤" title="आवाज शोध" desc="बोलून शोधा — टाइप नको" color="#1565c0" />
          <WhyCard icon="📞" title="थेट संपर्क" desc="WhatsApp + कॉल एका क्लिकवर" color="#25D366" />
          <WhyCard icon="💰" title="ताजे मंडी भाव" desc="Agmarknet कडून रोज अपडेट" color="#f57c00" />
          <WhyCard icon="⭐" title="रेटिंग सिस्टम" desc="विश्वासार्ह कामगार शोधा" color="#ffc107" />
          <WhyCard icon="🔒" title="सुरक्षित" desc="OTP-आधारित लॉगिन" color="#9c27b0" />
          <WhyCard icon="📊" title="नफा कॅल्क्युलेटर" desc="वाहतूक खर्च वजा करून नफा" color="#00897b" />
          <WhyCard icon="📱" title="मोबाइल-फ्रेंडली" desc="कोणत्याही फोनवर चालते" color="#e91e63" />
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section id="reviews" style={{ ...s.section, background: '#f8f9fa' }}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>अभिप्राय</div>
          <h2 style={s.sectionTitle}>
            वापरकर्ते <span style={s.titleAccent}>काय म्हणतात</span>
          </h2>
        </div>

        <div style={s.testiGrid}>
          <TestiCard
            name="राम पाटील"
            place="नाशिक"
            role="🌾 शेतकरी"
            text="पहिल्यांदाच माझा कांदा थेट व्यापाऱ्याला विकला. मध्यस्थ नाही, जास्त नफा मिळाला!"
          />
          <TestiCard
            name="सुनील शेट्टी"
            place="पुणे"
            role="🛒 व्यापारी"
            text="शेतकऱ्यांशी थेट बोलून खरेदी करतो. ताजे माल आणि चांगला भाव मिळतो."
          />
          <TestiCard
            name="महादेव कुंभार"
            place="सांगली"
            role="👷 कामगार"
            text="जवळच्या नोकऱ्या शोधणे सोपे झाले. WhatsApp वर थेट बोलतो, काम मिळते."
          />
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section style={s.ctaSection}>
        <div style={s.ctaCircle1} />
        <div style={s.ctaCircle2} />

        <div style={s.ctaBox}>
          <div style={s.ctaEmoji}>🌾</div>
          <h2 style={s.ctaTitle}>आजच सुरुवात करा!</h2>
          <p style={s.ctaSub}>
            मोफत registration • मराठीत संपूर्ण ॲप • 3 मिनिटांत तयार
          </p>
          <button style={s.ctaBtn} onClick={() => nav('/register')}>
            🚀 मोफत खाते तयार करा
            <span style={s.btnArrow}>→</span>
          </button>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerBrand}>
            <div style={s.footerLogo}>
              <span style={{ fontSize: 32 }}>🌾</span>
              <div>
                <div style={s.footerLogoText}>कृषीवृंदा</div>
                <div style={s.footerLogoSub}>KRISHIVRINDA</div>
              </div>
            </div>
            <p style={s.footerTagline}>
              महाराष्ट्राचे शेतकरी, व्यापारी आणि कामगार<br />
              यांना एकत्र आणणारे डिजिटल व्यासपीठ
            </p>
            <div style={s.footerSocial}>
              <span style={s.socialBtn}>📘</span>
              <span style={s.socialBtn}>📷</span>
              <span style={s.socialBtn}>🐦</span>
              <span style={s.socialBtn}>💬</span>
            </div>
          </div>

          <div style={s.footerLinks}>
            <div style={s.footerCol}>
              <h4 style={s.footerColTitle}>व्यासपीठ</h4>
              <p style={s.footerLink} onClick={() => nav('/login')}>लॉगिन</p>
              <p style={s.footerLink} onClick={() => nav('/register')}>नोंदणी</p>
              <p style={s.footerLink} onClick={() => scrollTo('features')}>वैशिष्ट्ये</p>
              <p style={s.footerLink} onClick={() => scrollTo('how')}>कसे चाले</p>
            </div>
            <div style={s.footerCol}>
              <h4 style={s.footerColTitle}>भूमिके</h4>
              <p style={s.footerLink} onClick={() => nav('/register')}>शेतकरी</p>
              <p style={s.footerLink} onClick={() => nav('/register')}>व्यापारी</p>
              <p style={s.footerLink} onClick={() => nav('/register')}>कामगार</p>
            </div>
            <div style={s.footerCol}>
              <h4 style={s.footerColTitle}>मदत</h4>
              <p style={s.footerLink}>संपर्क</p>
              <p style={s.footerLink}>FAQ</p>
              <p style={s.footerLink}>गोपनीयता</p>
              <p style={s.footerLink}>अटी व शर्ती</p>
            </div>
          </div>
        </div>

        <div style={s.footerBottom}>
          <div style={s.footerBottomInner}>
            <span>© 2026 कृषीवृंदा • सर्व हक्क राखीव</span>
            <span>🇮🇳 महाराष्ट्रात बनवलेले, महाराष्ट्रासाठी</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============ COMPONENTS ============ */

function RoleCard({ icon, title, subtitle, color, bg, features }) {
  return (
    <div style={{ ...s.roleCard, background: bg, borderTop: `5px solid ${color}` }}>
      <div style={s.roleIconWrap}>
        <div style={{ ...s.roleIconBg, background: color }}>
          <span style={{ fontSize: 34 }}>{icon}</span>
        </div>
      </div>
      <h3 style={{ ...s.roleTitle, color }}>{title}</h3>
      <p style={{ ...s.roleSubtitle, color }}>{subtitle}</p>
      <ul style={s.roleList}>
        {features.map((f, i) => (
          <li key={i} style={s.roleItem}>
            <span style={{ color, fontWeight: 900 }}>✓</span> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ num, icon, title, desc, color }) {
  return (
    <div style={s.stepCard}>
      <div style={{ ...s.stepNum, background: color }}>{num}</div>
      <div style={s.stepIcon}>{icon}</div>
      <h3 style={s.stepTitle}>{title}</h3>
      <p style={s.stepDesc}>{desc}</p>
    </div>
  );
}

function WhyCard({ icon, title, desc, color }) {
  return (
    <div style={s.whyCard}>
      <div style={{ ...s.whyIconWrap, background: `${color}15` }}>
        <span style={s.whyIcon}>{icon}</span>
      </div>
      <h3 style={s.whyTitle}>{title}</h3>
      <p style={s.whyDesc}>{desc}</p>
    </div>
  );
}

function TestiCard({ name, place, role, text }) {
  return (
    <div style={s.testiCard}>
      <div style={s.testiStars}>★★★★★</div>
      <p style={s.testiText}>"{text}"</p>
      <div style={s.testiAuthor}>
        <div style={s.testiAvatar}>{name.charAt(0)}</div>
        <div>
          <div style={s.testiName}>{name}</div>
          <div style={s.testiMeta}>{role} • {place}</div>
        </div>
      </div>
    </div>
  );
}

/* ============ STYLES ============ */

const s = {
  app: {
    minHeight: '100vh',
    background: '#fff',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    margin: 0,
    overflowX: 'hidden'
  },

  /* Header */
  header: {
    position: 'fixed', top: 0, left: 0, right: 0,
    background: 'transparent', zIndex: 100,
    padding: '16px 20px', transition: 'all 0.3s'
  },
  headerScrolled: {
    position: 'fixed', top: 0, left: 0, right: 0,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    zIndex: 100, padding: '12px 20px',
    boxShadow: '0 2px 24px rgba(0,0,0,0.06)',
    transition: 'all 0.3s'
  },
  headerInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: 20
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoBadge: {
    width: 44, height: 44, borderRadius: 12,
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22,
    boxShadow: '0 4px 12px rgba(46,125,50,0.3)'
  },
  logoText: { fontSize: 20, fontWeight: 900, color: '#1b5e20', lineHeight: 1 },
  logoSub: { fontSize: 9, color: '#888', letterSpacing: 1.5, fontWeight: 700 },

  headerNav: { display: 'flex', gap: 28 },
  navLink: {
    fontSize: 14, color: '#333', fontWeight: 600,
    cursor: 'pointer', padding: '6px 0',
    transition: 'color 0.15s'
  },

  headerActions: { display: 'flex', gap: 10 },
  loginBtn: {
    padding: '10px 18px', borderRadius: 10,
    border: '2px solid #2e7d32', background: 'transparent',
    color: '#2e7d32', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit'
  },
  signupBtn: {
    padding: '10px 20px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(46,125,50,0.25)'
  },

  /* Hero */
  hero: {
    position: 'relative',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 50%, #c8e6c9 100%)',
    padding: '120px 20px 80px',
    overflow: 'hidden',
    display: 'flex', alignItems: 'center'
  },
  heroGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(46,125,50,0.08) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
    WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
  },
  heroInner: {
    maxWidth: 1200, margin: '0 auto', width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 60, alignItems: 'center',
    position: 'relative', zIndex: 2
  },
  heroLeft: {},
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#fff', color: '#1b5e20',
    padding: '8px 18px', borderRadius: 30,
    fontSize: 13, fontWeight: 700,
    marginBottom: 24,
    border: '1px solid rgba(46,125,50,0.2)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
  },
  heroBadgeDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#2e7d32',
    boxShadow: '0 0 0 4px rgba(46,125,50,0.2)'
  },
  heroTitle: {
    fontSize: 54, fontWeight: 900,
    color: '#1b5e20', lineHeight: 1.1,
    margin: '0 0 20px',
    letterSpacing: -1.5
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSub: {
    fontSize: 18, color: '#444',
    lineHeight: 1.7, margin: '0 0 32px',
    maxWidth: 500
  },
  heroBtns: {
    display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32
  },
  primaryBtn: {
    padding: '16px 32px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff', fontSize: 16, fontWeight: 800,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 10,
    boxShadow: '0 10px 30px rgba(46,125,50,0.35)',
    transition: 'transform 0.15s'
  },
  secondaryBtn: {
    padding: '16px 28px', borderRadius: 12,
    border: '2px solid #2e7d32', background: '#fff',
    color: '#2e7d32', fontSize: 16, fontWeight: 800,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 8
  },
  btnArrow: { fontSize: 18 },

  trustRow: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  trustBadge: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, color: '#555', fontWeight: 600
  },
  trustIcon: { fontSize: 16 },

  /* Hero Right — Mockup */
  heroRight: {
    position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: 500
  },
  phone: {
    width: 280, height: 540,
    background: '#1b5e20',
    borderRadius: 40,
    padding: 8,
    boxShadow: '0 30px 60px rgba(0,0,0,0.25), 0 0 0 8px rgba(46,125,50,0.1)',
    position: 'relative'
  },
  phoneNotch: {
    position: 'absolute', top: 12, left: '50%',
    transform: 'translateX(-50%)',
    width: 100, height: 22,
    background: '#1b5e20',
    borderRadius: 12, zIndex: 5
  },
  phoneScreen: {
    width: '100%', height: '100%',
    background: '#f4f6f8',
    borderRadius: 32,
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column'
  },
  phoneHeader: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff', padding: '40px 16px 16px',
    display: 'flex', alignItems: 'center', gap: 10
  },
  phoneTitle: { flex: 1, fontSize: 15, fontWeight: 800 },
  phoneContent: { padding: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  phoneStat: {
    background: '#fff', borderRadius: 10, padding: 10,
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  phoneStatNum: { fontSize: 20, fontWeight: 900, color: '#2e7d32' },
  phoneStatLabel: { fontSize: 10, color: '#888', marginTop: 2 },
  phoneCrop: {
    background: '#fff', borderRadius: 10, padding: 10,
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  phoneBtn: {
    background: '#2e7d32', color: '#fff',
    padding: 10, borderRadius: 10,
    textAlign: 'center', fontSize: 12, fontWeight: 700,
    marginTop: 4
  },

  floatCard: {
    position: 'absolute',
    background: '#fff', borderRadius: 14, padding: 12,
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
    animation: 'float 3s ease-in-out infinite',
    zIndex: 10
  },
  floatCardIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: '#2e7d32', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, fontWeight: 900
  },
  floatCardTitle: { fontSize: 12, fontWeight: 800, color: '#1b5e20' },
  floatCardSub: { fontSize: 10, color: '#666', marginTop: 2 },

  /* Stats bar */
  statsBar: {
    background: '#1b5e20',
    padding: '40px 20px'
  },
  statsBarInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', justifyContent: 'space-around',
    alignItems: 'center', flexWrap: 'wrap', gap: 20
  },
  statItem: { textAlign: 'center', minWidth: 100 },
  statNum: {
    fontSize: 36, fontWeight: 900, color: '#fff',
    lineHeight: 1
  },
  statLabel: {
    fontSize: 13, color: 'rgba(255,255,255,0.8)',
    marginTop: 8, fontWeight: 600
  },
  statDivider: {
    width: 1, height: 50, background: 'rgba(255,255,255,0.15)'
  },

  /* Sections */
  section: { padding: '100px 20px' },
  sectionHeader: { textAlign: 'center', marginBottom: 60 },
  sectionBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
    color: '#2e7d32',
    padding: '8px 20px', borderRadius: 30,
    fontSize: 12, fontWeight: 800,
    letterSpacing: 1, textTransform: 'uppercase',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 44, fontWeight: 900, color: '#1b5e20',
    margin: '0 0 16px', letterSpacing: -1
  },
  titleAccent: {
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  sectionSub: { fontSize: 16, color: '#666', margin: 0, lineHeight: 1.6 },

  /* Role cards */
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24, maxWidth: 1200, margin: '0 auto'
  },
  roleCard: {
    padding: 32, borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s'
  },
  roleIconWrap: { marginBottom: 20 },
  roleIconBg: {
    width: 68, height: 68, borderRadius: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
  },
  roleTitle: { fontSize: 28, fontWeight: 900, margin: '0 0 6px' },
  roleSubtitle: { fontSize: 14, fontWeight: 600, margin: '0 0 22px', opacity: 0.8 },
  roleList: { listStyle: 'none', padding: 0, margin: 0 },
  roleItem: {
    fontSize: 15, color: '#333',
    padding: '9px 0', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 10
  },

  /* Steps */
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24, maxWidth: 1000, margin: '0 auto'
  },
  stepCard: {
    background: '#fff', padding: 32, borderRadius: 20,
    textAlign: 'center', position: 'relative',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    marginTop: 20
  },
  stepNum: {
    position: 'absolute', top: -22, left: '50%',
    transform: 'translateX(-50%)',
    width: 44, height: 44, borderRadius: '50%',
    color: '#fff',
    fontSize: 20, fontWeight: 900,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    border: '4px solid #fff'
  },
  stepIcon: { fontSize: 56, margin: '12px 0 16px' },
  stepTitle: { fontSize: 20, fontWeight: 800, color: '#1b5e20', margin: '0 0 10px' },
  stepDesc: { fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 },

  /* Why cards */
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20, maxWidth: 1100, margin: '0 auto'
  },
  whyCard: {
    background: '#fff', padding: 26, borderRadius: 18,
    border: '1px solid #f0f0f0',
    textAlign: 'center',
    transition: 'all 0.2s'
  },
  whyIconWrap: {
    width: 72, height: 72, borderRadius: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 18px'
  },
  whyIcon: { fontSize: 36 },
  whyTitle: { fontSize: 17, fontWeight: 800, color: '#1b5e20', margin: '0 0 8px' },
  whyDesc: { fontSize: 13, color: '#666', margin: 0, lineHeight: 1.6 },

  /* Testimonials */
  testiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20, maxWidth: 1100, margin: '0 auto'
  },
  testiCard: {
    background: '#fff', padding: 28, borderRadius: 18,
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    position: 'relative'
  },
  testiStars: {
    color: '#ffc107', fontSize: 18, marginBottom: 14, letterSpacing: 2
  },
  testiText: {
    fontSize: 14, color: '#333', lineHeight: 1.7,
    margin: '0 0 20px', fontStyle: 'italic'
  },
  testiAuthor: { display: 'flex', gap: 12, alignItems: 'center' },
  testiAvatar: {
    width: 46, height: 46, borderRadius: '50%',
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    color: '#fff', fontSize: 18, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  testiName: { fontSize: 15, fontWeight: 800, color: '#1b5e20' },
  testiMeta: { fontSize: 12, color: '#888', marginTop: 2 },

  /* CTA */
  ctaSection: {
    padding: '100px 20px',
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
    position: 'relative', overflow: 'hidden'
  },
  ctaCircle1: {
    position: 'absolute', top: -100, right: -100,
    width: 400, height: 400, borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)'
  },
  ctaCircle2: {
    position: 'absolute', bottom: -150, left: -100,
    width: 500, height: 500, borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)'
  },
  ctaBox: {
    maxWidth: 700, margin: '0 auto',
    textAlign: 'center', position: 'relative', zIndex: 2
  },
  ctaEmoji: { fontSize: 72, marginBottom: 16 },
  ctaTitle: {
    fontSize: 48, fontWeight: 900, color: '#fff',
    margin: '0 0 16px', letterSpacing: -1
  },
  ctaSub: { fontSize: 17, color: 'rgba(255,255,255,0.9)', margin: '0 0 36px' },
  ctaBtn: {
    padding: '20px 44px', borderRadius: 14, border: 'none',
    background: '#fff', color: '#1b5e20',
    fontSize: 18, fontWeight: 900, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 10,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    fontFamily: 'inherit'
  },

  /* Footer */
  footer: {
    background: '#0d3d14', color: '#fff',
    padding: '70px 20px 0'
  },
  footerInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.5fr 2fr',
    gap: 60, paddingBottom: 50
  },
  footerBrand: {},
  footerLogo: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 16
  },
  footerLogoText: { fontSize: 22, fontWeight: 900 },
  footerLogoSub: { fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.6)', fontWeight: 700 },
  footerTagline: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7, marginBottom: 20
  },
  footerSocial: { display: 'flex', gap: 10 },
  socialBtn: {
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, cursor: 'pointer'
  },

  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', gap: 30
  },
  footerCol: {},
  footerColTitle: {
    fontSize: 14, fontWeight: 800,
    marginBottom: 16, color: '#fff',
    letterSpacing: 0.5
  },
  footerLink: {
    fontSize: 13, color: 'rgba(255,255,255,0.65)',
    margin: '10px 0', cursor: 'pointer'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '20px 20px 20px'
  },
  footerBottomInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 10,
    fontSize: 13, color: 'rgba(255,255,255,0.5)'
  }
};