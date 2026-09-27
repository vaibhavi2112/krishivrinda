import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Landing() {
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    farmers: 0,
    dealers: 0,
    workers: 0,
    crops: 0
  });

  // Screen size detect
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

          {!isMobile && (
            <nav style={s.headerNav}>
              <span style={s.navLink} onClick={() => scrollTo('features')}>
                वैशिष्ट्ये
              </span>
              <span style={s.navLink} onClick={() => scrollTo('how')}>
                कसे चाले
              </span>
              <span style={s.navLink} onClick={() => scrollTo('why')}>
                विशेष का
              </span>
              <span style={s.navLink} onClick={() => scrollTo('reviews')}>
                अभिप्राय
              </span>
            </nav>
          )}

          <div style={s.headerActions}>
            <button style={s.loginBtn} onClick={() => nav('/login')}>
              लॉगिन
            </button>
            <button style={s.signupBtn} onClick={() => nav('/register')}>
              🚀 सुरू
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
            <div
              style={{
                ...s.floatCard,
                top: isMobile ? 10 : 20,
                left: isMobile ? 0 : -30
              }}
            >
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
                  <span style={{ fontSize: 20 }}>🌾</span>
                  <span style={s.phoneTitle}>कृषीवृंदा</span>
                  <span style={{ fontSize: 14 }}>🔔</span>
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
                      <div style={{ fontSize: 11, fontWeight: 700 }}>कांदा</div>
                      <div style={{ fontSize: 9, color: '#888' }}>50 क्विंटल</div>
                    </div>
                  </div>
                  <div style={s.phoneCrop}>
                    <span>🍅</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700 }}>टोमॅटो</div>
                      <div style={{ fontSize: 9, color: '#888' }}>30 क्विंटल</div>
                    </div>
                  </div>
                  <div style={s.phoneBtn}>+ पीक पोस्ट करा</div>
                </div>
              </div>
            </div>

            <div
              style={{
                ...s.floatCard,
                bottom: isMobile ? 20 : 40,
                right: isMobile ? 0 : -20
              }}
            >
              <div style={{ ...s.floatCardIcon, background: '#1565c0' }}>💬</div>
              <div>
                <div style={s.floatCardTitle}>WhatsApp</div>
                <div style={s.floatCardSub}>थेट बोला</div>
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

        <div style={{ textAlign: 'center', marginTop: 'clamp(30px, 6vw, 40px)' }}>
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
          <WhyCard
            icon="🗣️"
            title="100% मराठीत"
            desc="तुमच्या भाषेत, तुमच्या शब्दांत"
            color="#2e7d32"
          />
          <WhyCard
            icon="🎤"
            title="आवाज शोध"
            desc="बोलून शोधा — टाइप नको"
            color="#1565c0"
          />
          <WhyCard
            icon="📞"
            title="थेट संपर्क"
            desc="WhatsApp + कॉल एका क्लिकवर"
            color="#25D366"
          />
          <WhyCard
            icon="💰"
            title="ताजे मंडी भाव"
            desc="Agmarknet कडून रोज अपडेट"
            color="#f57c00"
          />
          <WhyCard
            icon="⭐"
            title="रेटिंग सिस्टम"
            desc="विश्वासार्ह कामगार शोधा"
            color="#ffc107"
          />
          <WhyCard
            icon="🔒"
            title="सुरक्षित"
            desc="OTP-आधारित लॉगिन"
            color="#9c27b0"
          />
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
              <span style={{ fontSize: 28 }}>🌾</span>
              <div>
                <div style={s.footerLogoText}>कृषीवृंदा</div>
                <div style={s.footerLogoSub}>KRISHIVRINDA</div>
              </div>
            </div>
            <p style={s.footerTagline}>
              महाराष्ट्राचे शेतकरी, व्यापारी आणि कामगार<br />
              यांना एकत्र आणणारे डिजिटल व्यासपीठ
            </p>
          </div>

          <div style={s.footerLinks}>
            <div style={s.footerCol}>
              <h4 style={s.footerColTitle}>व्यासपीठ</h4>
              <p style={s.footerLink} onClick={() => nav('/login')}>
                लॉगिन
              </p>
              <p style={s.footerLink} onClick={() => nav('/register')}>
                नोंदणी
              </p>
            </div>
            <div style={s.footerCol}>
              <h4 style={s.footerColTitle}>भूमिके</h4>
              <p style={s.footerLink} onClick={() => nav('/register')}>
                शेतकरी
              </p>
              <p style={s.footerLink} onClick={() => nav('/register')}>
                व्यापारी
              </p>
              <p style={s.footerLink} onClick={() => nav('/register')}>
                कामगार
              </p>
            </div>
            <div style={s.footerCol}>
              <h4 style={s.footerColTitle}>मदत</h4>
              <p style={s.footerLink}>संपर्क</p>
              <p style={s.footerLink}>FAQ</p>
            </div>
          </div>
        </div>

        <div style={s.footerBottom}>
          <div style={s.footerBottomInner}>
            <span>© 2026 कृषीवृंदा • सर्व हक्क राखीव</span>
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
          <span style={{ fontSize: 30 }}>{icon}</span>
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
          <div style={s.testiMeta}>
            {role} • {place}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ STYLES ============ */

const s = {
  app: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: '#fff',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    margin: 0,
    overflowX: 'hidden'
  },

  /* ============ HEADER ============ */
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'transparent',
    zIndex: 100,
    padding: '12px clamp(12px, 3vw, 20px)',
    paddingTop: 'calc(12px + env(safe-area-inset-top))',
    transition: 'all 0.3s'
  },
  headerScrolled: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255,255,255,0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: 100,
    padding: '10px clamp(12px, 3vw, 20px)',
    paddingTop: 'calc(10px + env(safe-area-inset-top))',
    boxShadow: '0 2px 24px rgba(0,0,0,0.06)',
    transition: 'all 0.3s'
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'clamp(8px, 2vw, 20px)'
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    minWidth: 0,
    flexShrink: 0
  },
  logoBadge: {
    width: 'clamp(36px, 9vw, 42px)',
    height: 'clamp(36px, 9vw, 42px)',
    borderRadius: 11,
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(18px, 5vw, 22px)',
    boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
    flexShrink: 0
  },
  logoText: {
    fontSize: 'clamp(15px, 4vw, 18px)',
    fontWeight: 900,
    color: '#1b5e20',
    lineHeight: 1
  },
  logoSub: {
    fontSize: 'clamp(8px, 2vw, 9px)',
    color: '#888',
    letterSpacing: 1.2,
    fontWeight: 700,
    marginTop: 2
  },

  headerNav: {
    display: 'flex',
    gap: 'clamp(16px, 3vw, 28px)'
  },
  navLink: {
    fontSize: 14,
    color: '#333',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '6px 0',
    transition: 'color 0.15s',
    whiteSpace: 'nowrap'
  },

  headerActions: {
    display: 'flex',
    gap: 'clamp(6px, 2vw, 10px)',
    flexShrink: 0
  },
  loginBtn: {
    padding: '8px clamp(12px, 3vw, 18px)',
    borderRadius: 10,
    border: '2px solid #2e7d32',
    background: 'transparent',
    color: '#2e7d32',
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    minHeight: 40,
    whiteSpace: 'nowrap'
  },
  signupBtn: {
    padding: '8px clamp(12px, 3vw, 20px)',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff',
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(46,125,50,0.25)',
    minHeight: 40,
    whiteSpace: 'nowrap'
  },

  /* ============ HERO ============ */
  hero: {
    position: 'relative',
    minHeight: '100vh',
    minHeight: '100dvh',
    background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 50%, #c8e6c9 100%)',
    padding: 'clamp(90px, 15vw, 120px) clamp(16px, 4vw, 20px) clamp(40px, 8vw, 60px)',
    paddingTop: 'calc(clamp(90px, 15vw, 120px) + env(safe-area-inset-top))',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  },
  heroGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle, rgba(46,125,50,0.08) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
    WebkitMaskImage:
      'radial-gradient(circle at 50% 50%, black, transparent 80%)'
  },
  heroInner: {
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
    gap: 'clamp(30px, 6vw, 60px)',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2
  },
  heroLeft: {
    minWidth: 0
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    color: '#1b5e20',
    padding: '8px clamp(14px, 3vw, 18px)',
    borderRadius: 30,
    fontSize: 'clamp(11px, 3vw, 13px)',
    fontWeight: 700,
    marginBottom: 'clamp(16px, 3vw, 24px)',
    border: '1px solid rgba(46,125,50,0.2)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    maxWidth: '100%'
  },
  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#2e7d32',
    boxShadow: '0 0 0 4px rgba(46,125,50,0.2)',
    flexShrink: 0
  },
  heroTitle: {
    fontSize: 'clamp(28px, 7.5vw, 54px)',
    fontWeight: 900,
    color: '#1b5e20',
    lineHeight: 1.15,
    margin: '0 0 20px',
    letterSpacing: -1
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSub: {
    fontSize: 'clamp(14px, 3.8vw, 18px)',
    color: '#444',
    lineHeight: 1.7,
    margin: '0 0 clamp(24px, 5vw, 32px)',
    maxWidth: 500
  },
  heroBtns: {
    display: 'flex',
    gap: 'clamp(10px, 2vw, 14px)',
    flexWrap: 'wrap',
    marginBottom: 'clamp(24px, 5vw, 32px)'
  },
  primaryBtn: {
    padding: 'clamp(14px, 3vw, 16px) clamp(20px, 4vw, 32px)',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff',
    fontSize: 'clamp(14px, 3.6vw, 16px)',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: '0 10px 30px rgba(46,125,50,0.35)',
    minHeight: 48,
    flex: '1 1 auto'
  },
  secondaryBtn: {
    padding: 'clamp(14px, 3vw, 16px) clamp(18px, 3.5vw, 28px)',
    borderRadius: 12,
    border: '2px solid #2e7d32',
    background: '#fff',
    color: '#2e7d32',
    fontSize: 'clamp(14px, 3.6vw, 16px)',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    flex: '1 1 auto'
  },
  btnArrow: {
    fontSize: 'clamp(16px, 4vw, 18px)'
  },

  trustRow: {
    display: 'flex',
    gap: 'clamp(12px, 3vw, 20px)',
    flexWrap: 'wrap'
  },
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 'clamp(11px, 3vw, 13px)',
    color: '#555',
    fontWeight: 600
  },
  trustIcon: {
    fontSize: 'clamp(14px, 3.5vw, 16px)'
  },

  /* ============ HERO RIGHT — Mockup ============ */
  heroRight: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'clamp(380px, 90vw, 500px)',
    padding: '20px 0'
  },
  phone: {
    width: 'clamp(200px, 55vw, 260px)',
    height: 'clamp(390px, 105vw, 500px)',
    background: '#1b5e20',
    borderRadius: 'clamp(28px, 7vw, 38px)',
    padding: 7,
    boxShadow:
      '0 30px 60px rgba(0,0,0,0.25), 0 0 0 6px rgba(46,125,50,0.1)',
    position: 'relative',
    margin: '0 auto'
  },
  phoneNotch: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'clamp(70px, 20vw, 90px)',
    height: 18,
    background: '#1b5e20',
    borderRadius: 12,
    zIndex: 5
  },
  phoneScreen: {
    width: '100%',
    height: '100%',
    background: '#f4f6f8',
    borderRadius: 'clamp(22px, 6vw, 30px)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  phoneHeader: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff',
    padding: 'clamp(30px, 8vw, 38px) 12px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  phoneTitle: {
    flex: 1,
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    fontWeight: 800
  },
  phoneContent: {
    padding: 'clamp(8px, 2vw, 10px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(6px, 1.5vw, 8px)'
  },
  phoneStat: {
    background: '#fff',
    borderRadius: 9,
    padding: 'clamp(8px, 2vw, 10px)',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  phoneStatNum: {
    fontSize: 'clamp(16px, 4.5vw, 20px)',
    fontWeight: 900,
    color: '#2e7d32'
  },
  phoneStatLabel: {
    fontSize: 'clamp(9px, 2.3vw, 10px)',
    color: '#888',
    marginTop: 2
  },
  phoneCrop: {
    background: '#fff',
    borderRadius: 9,
    padding: 'clamp(8px, 2vw, 10px)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  phoneBtn: {
    background: '#2e7d32',
    color: '#fff',
    padding: 'clamp(8px, 2vw, 10px)',
    borderRadius: 9,
    textAlign: 'center',
    fontSize: 'clamp(10px, 2.8vw, 12px)',
    fontWeight: 700,
    marginTop: 2
  },

  floatCard: {
    position: 'absolute',
    background: '#fff',
    borderRadius: 12,
    padding: 'clamp(8px, 2vw, 10px)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
    animation: 'float 3s ease-in-out infinite',
    zIndex: 10,
    maxWidth: 'clamp(140px, 40vw, 180px)'
  },
  floatCardIcon: {
    width: 'clamp(32px, 8vw, 38px)',
    height: 'clamp(32px, 8vw, 38px)',
    borderRadius: 10,
    background: '#2e7d32',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(16px, 4.5vw, 20px)',
    fontWeight: 900,
    flexShrink: 0
  },
  floatCardTitle: {
    fontSize: 'clamp(10px, 2.7vw, 12px)',
    fontWeight: 800,
    color: '#1b5e20',
    lineHeight: 1.2
  },
  floatCardSub: {
    fontSize: 'clamp(9px, 2.3vw, 10px)',
    color: '#666',
    marginTop: 2
  },

  /* ============ STATS BAR ============ */
  statsBar: {
    background: '#1b5e20',
    padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 20px)'
  },
  statsBarInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'clamp(8px, 2vw, 20px)',
    alignItems: 'center'
  },
  statItem: {
    textAlign: 'center',
    minWidth: 0
  },
  statNum: {
    fontSize: 'clamp(20px, 5.5vw, 32px)',
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1
  },
  statLabel: {
    fontSize: 'clamp(10px, 2.7vw, 12px)',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 'clamp(4px, 1.5vw, 8px)',
    fontWeight: 600
  },
  statDivider: {
    display: 'none'
  },

  /* ============ SECTIONS ============ */
  section: {
    padding: 'clamp(50px, 10vw, 100px) clamp(16px, 4vw, 20px)'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 'clamp(30px, 6vw, 60px)'
  },
  sectionBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
    color: '#2e7d32',
    padding: '6px clamp(14px, 3vw, 20px)',
    borderRadius: 30,
    fontSize: 'clamp(10px, 2.7vw, 12px)',
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 'clamp(12px, 3vw, 20px)'
  },
  sectionTitle: {
    fontSize: 'clamp(22px, 6vw, 38px)',
    fontWeight: 900,
    color: '#1b5e20',
    margin: '0 0 12px',
    letterSpacing: -0.5,
    lineHeight: 1.2
  },
  titleAccent: {
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  sectionSub: {
    fontSize: 'clamp(13px, 3.5vw, 16px)',
    color: '#666',
    margin: 0,
    lineHeight: 1.6
  },

  /* ============ ROLE CARDS ============ */
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: 'clamp(16px, 3vw, 24px)',
    maxWidth: 1200,
    margin: '0 auto'
  },
  roleCard: {
    padding: 'clamp(20px, 4vw, 32px)',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
  },
  roleIconWrap: {
    marginBottom: 'clamp(12px, 3vw, 20px)'
  },
  roleIconBg: {
    width: 'clamp(52px, 13vw, 68px)',
    height: 'clamp(52px, 13vw, 68px)',
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
  },
  roleTitle: {
    fontSize: 'clamp(20px, 5vw, 28px)',
    fontWeight: 900,
    margin: '0 0 6px'
  },
  roleSubtitle: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: 600,
    margin: '0 0 18px',
    opacity: 0.8
  },
  roleList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  roleItem: {
    fontSize: 'clamp(13px, 3.2vw, 15px)',
    color: '#333',
    padding: '7px 0',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    lineHeight: 1.4
  },

  /* ============ STEPS ============ */
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: 'clamp(16px, 3vw, 24px)',
    maxWidth: 1000,
    margin: '0 auto'
  },
  stepCard: {
    background: '#fff',
    padding: 'clamp(20px, 4vw, 32px)',
    borderRadius: 20,
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    marginTop: 20
  },
  stepNum: {
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 40,
    height: 40,
    borderRadius: '50%',
    color: '#fff',
    fontSize: 18,
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    border: '4px solid #fff'
  },
  stepIcon: {
    fontSize: 'clamp(42px, 10vw, 56px)',
    margin: '12px 0 16px'
  },
  stepTitle: {
    fontSize: 'clamp(16px, 4vw, 20px)',
    fontWeight: 800,
    color: '#1b5e20',
    margin: '0 0 10px'
  },
  stepDesc: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    color: '#666',
    margin: 0,
    lineHeight: 1.6
  },

  /* ============ WHY CARDS ============ */
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: 'clamp(14px, 3vw, 20px)',
    maxWidth: 1100,
    margin: '0 auto'
  },
  whyCard: {
    background: '#fff',
    padding: 'clamp(18px, 4vw, 26px)',
    borderRadius: 18,
    border: '1px solid #f0f0f0',
    textAlign: 'center'
  },
  whyIconWrap: {
    width: 'clamp(58px, 14vw, 72px)',
    height: 'clamp(58px, 14vw, 72px)',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px'
  },
  whyIcon: {
    fontSize: 'clamp(28px, 7vw, 36px)'
  },
  whyTitle: {
    fontSize: 'clamp(14px, 3.8vw, 17px)',
    fontWeight: 800,
    color: '#1b5e20',
    margin: '0 0 6px'
  },
  whyDesc: {
    fontSize: 'clamp(11px, 3vw, 13px)',
    color: '#666',
    margin: 0,
    lineHeight: 1.6
  },

  /* ============ TESTIMONIALS ============ */
  testiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: 'clamp(14px, 3vw, 20px)',
    maxWidth: 1100,
    margin: '0 auto'
  },
  testiCard: {
    background: '#fff',
    padding: 'clamp(20px, 4vw, 28px)',
    borderRadius: 18,
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
  },
  testiStars: {
    color: '#ffc107',
    fontSize: 16,
    marginBottom: 12,
    letterSpacing: 2
  },
  testiText: {
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    color: '#333',
    lineHeight: 1.7,
    margin: '0 0 18px',
    fontStyle: 'italic'
  },
  testiAuthor: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  testiAvatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    color: '#fff',
    fontSize: 17,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  testiName: {
    fontSize: 'clamp(13px, 3.3vw, 15px)',
    fontWeight: 800,
    color: '#1b5e20'
  },
  testiMeta: {
    fontSize: 'clamp(10px, 2.7vw, 12px)',
    color: '#888',
    marginTop: 2
  },

  /* ============ CTA ============ */
  ctaSection: {
    padding: 'clamp(50px, 10vw, 100px) clamp(16px, 4vw, 20px)',
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
    position: 'relative',
    overflow: 'hidden'
  },
  ctaCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)'
  },
  ctaCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)'
  },
  ctaBox: {
    maxWidth: 700,
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2
  },
  ctaEmoji: {
    fontSize: 'clamp(48px, 12vw, 72px)',
    marginBottom: 16
  },
  ctaTitle: {
    fontSize: 'clamp(24px, 6vw, 48px)',
    fontWeight: 900,
    color: '#fff',
    margin: '0 0 16px',
    letterSpacing: -0.5,
    lineHeight: 1.2
  },
  ctaSub: {
    fontSize: 'clamp(13px, 3.5vw, 17px)',
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 28px',
    lineHeight: 1.6
  },
  ctaBtn: {
    padding: 'clamp(16px, 3.5vw, 20px) clamp(24px, 5vw, 44px)',
    borderRadius: 14,
    border: 'none',
    background: '#fff',
    color: '#1b5e20',
    fontSize: 'clamp(14px, 3.8vw, 18px)',
    fontWeight: 900,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    fontFamily: 'inherit',
    minHeight: 54
  },

  /* ============ FOOTER ============ */
  footer: {
    background: '#0d3d14',
    color: '#fff',
    padding: 'clamp(40px, 8vw, 70px) clamp(16px, 4vw, 20px) 0'
  },
  footerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: 'clamp(30px, 6vw, 60px)',
    paddingBottom: 40
  },
  footerBrand: {},
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14
  },
  footerLogoText: {
    fontSize: 'clamp(18px, 4.5vw, 22px)',
    fontWeight: 900
  },
  footerLogoSub: {
    fontSize: 'clamp(9px, 2.3vw, 10px)',
    letterSpacing: 1.3,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 700,
    marginTop: 2
  },
  footerTagline: {
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7,
    marginBottom: 16
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: 'clamp(20px, 4vw, 30px)'
  },
  footerCol: {},
  footerColTitle: {
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    fontWeight: 800,
    marginBottom: 14,
    color: '#fff',
    letterSpacing: 0.5
  },
  footerLink: {
    fontSize: 'clamp(11px, 3vw, 13px)',
    color: 'rgba(255,255,255,0.65)',
    margin: '10px 0',
    cursor: 'pointer'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '20px clamp(16px, 4vw, 20px)',
    paddingBottom: 'calc(20px + env(safe-area-inset-bottom))'
  },
  footerBottomInner: {
    maxWidth: 1200,
    margin: '0 auto',
    textAlign: 'center',
    fontSize: 'clamp(10px, 2.7vw, 13px)',
    color: 'rgba(255,255,255,0.5)'
  }
};