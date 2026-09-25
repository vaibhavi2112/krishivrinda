// ============================================
// Jarvis Commands — Smart matching सह
// ============================================

export const COMMANDS = [
  // ==========================================
  // 🏠 Navigation
  // ==========================================
  {
    id: 'go_home',
    patterns: ['घर', 'होम', 'मुख्य', 'डॅशबोर्ड', 'dashboard', 'home', 'मेनू', 'घरी'],
    reply: 'घर उघडत आहे.',
    roles: ['farmer', 'dealer', 'worker'],
    action: ({ goTo }) => goTo('home')
  },
  {
    id: 'go_notif',
    patterns: ['बातमी', 'नोटिफिकेशन', 'सूचना', 'notification', 'संदेश', 'मेसेज', 'काय नवीन'],
    reply: 'तुमच्या बातम्या उघडत आहे.',
    roles: ['farmer', 'dealer', 'worker'],
    action: ({ goTo }) => goTo('notif')
  },
  {
    id: 'go_profile',
    patterns: ['प्रोफाइल', 'माझी माहिती', 'मी', 'profile', 'me', 'खाते', 'माझे खाते'],
    reply: 'तुमची माहिती उघडत आहे.',
    roles: ['farmer', 'dealer', 'worker'],
    action: ({ goTo }) => goTo('me')
  },

  // ==========================================
  // 🌾 शेतकरी — पिके
  // ==========================================
  {
    id: 'go_crops',
    patterns: ['पिके', 'माझी पिके', 'crops', 'my crops', 'पिकं', 'माझं पीक'],
    reply: 'तुमची पिके उघडत आहे.',
    roles: ['farmer'],
    action: ({ goTo }) => goTo('crops')
  },
  {
    id: 'post_crop',
    patterns: [
      'नवीन पीक', 'पीक पोस्ट', 'पीक विकायचे', 'पिकं टाका',
      'add crop', 'post crop', 'पीक नोंदवा', 'विक्री करा',
      'पीक विका', 'नवीन पीक टाक', 'पीक जोडा'
    ],
    reply: 'नवीन पीक पोस्ट करण्यासाठी फॉर्म उघडत आहे.',
    roles: ['farmer'],
    action: ({ goTo, custom }) => {
      goTo('crops');
      setTimeout(() => custom?.openCropForm?.(), 600);
    }
  },
  {
    id: 'crop_count',
    patterns: ['किती पिके', 'पिकांची संख्या', 'किती पीक आहे', 'how many crops'],
    reply: 'आकडेवारी पहा.',
    roles: ['farmer'],
    action: ({ goTo }) => goTo('crops')
  },

  // ==========================================
  // 💰 बाजार भाव
  // ==========================================
  {
    id: 'go_market',
    patterns: [
      'बाजार', 'मंडी भाव', 'बाजार भाव', 'market', 'price',
      'भाव', 'मंडी', 'दर', 'बाजारपेठ', 'किंमत', 'बाजारात काय चाललंय'
    ],
    reply: 'बाजार भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo }) => goTo('market')
  },

  // Specific crops
  {
    id: 'price_onion',
    patterns: ['कांदा भाव', 'कांद्याचा भाव', 'onion price', 'कांदा दर', 'कांद्याचे भाव'],
    reply: 'कांद्याचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Onion'), 700);
    }
  },
  {
    id: 'price_tomato',
    patterns: ['टोमॅटो भाव', 'टोमॅटोचा भाव', 'tomato price', 'टोमॅटो दर'],
    reply: 'टोमॅटोचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Tomato'), 700);
    }
  },
  {
    id: 'price_wheat',
    patterns: ['गहू भाव', 'गव्हाचा भाव', 'wheat price', 'गहू दर'],
    reply: 'गव्हाचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Wheat'), 700);
    }
  },
  {
    id: 'price_cotton',
    patterns: ['कापूस भाव', 'कापसाचा भाव', 'cotton price'],
    reply: 'कापसाचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Cotton'), 700);
    }
  },
  {
    id: 'price_grapes',
    patterns: ['द्राक्षे भाव', 'द्राक्ष भाव', 'grapes price', 'द्राक्षांचा भाव'],
    reply: 'द्राक्षांचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Grapes'), 700);
    }
  },
  {
    id: 'price_pomegranate',
    patterns: ['डाळिंब भाव', 'डाळिंबाचा भाव', 'pomegranate price'],
    reply: 'डाळिंबाचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Pomegranate'), 700);
    }
  },
  {
    id: 'price_soybean',
    patterns: ['सोयाबीन भाव', 'soybean price'],
    reply: 'सोयाबीनचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Soybean'), 700);
    }
  },
  {
    id: 'price_sugarcane',
    patterns: ['ऊस भाव', 'ऊसाचा भाव', 'sugarcane price'],
    reply: 'ऊसाचे मंडी भाव उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('market');
      setTimeout(() => custom?.setCrop && custom.setCrop('Sugarcane'), 700);
    }
  },

  // ==========================================
  // 👷 कामगार
  // ==========================================
  {
    id: 'go_jobs',
    patterns: ['कामगार', 'मजूर', 'नोकरी', 'jobs', 'workers', 'काम', 'कामगार विभाग'],
    reply: 'कामगार विभाग उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo }) => goTo('jobs')
  },
  {
    id: 'post_job',
    patterns: [
      'मजूर हवा', 'कामगार हवा', 'नोकरी पोस्ट', 'काम द्या',
      'post job', 'hire worker', 'मजूर शोध', 'मजूर पाहिजे',
      'कामगार पाहिजे', 'नोकरी टाका'
    ],
    reply: 'नवीन नोकरी पोस्ट करण्यासाठी फॉर्म उघडत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo, custom }) => {
      goTo('jobs');
      setTimeout(() => custom?.openJobForm?.(), 600);
    }
  },
  {
    id: 'find_workers',
    patterns: [
      'कामगार शोध', 'मजूर शोध', 'मजूर हवा', 'find worker',
      'कामगार हवे', 'worker शोध', 'मजूर दाखव', 'कामगार दाखव'
    ],
    reply: 'जवळचे कामगार शोधत आहे.',
    roles: ['farmer', 'dealer'],
    action: ({ goTo }) => goTo('findworkers')
  },

  // ==========================================
  // 🛒 व्यापारी
  // ==========================================
  {
    id: 'browse_crops',
    patterns: [
      'पिके शोध', 'शेतकरी पिके', 'खरेदी', 'browse', 'buy crop',
      'पिके पहा', 'माल शोध', 'शेतकरी शोध', 'पिके दाखव'
    ],
    reply: 'शेतकऱ्यांची पिके शोधत आहे.',
    roles: ['dealer'],
    action: ({ goTo }) => goTo('browse')
  },
  {
    id: 'go_cart',
    patterns: ['कार्ट', 'माझे कार्ट', 'cart', 'my cart', 'टोपली', 'कार्ट पहा'],
    reply: 'तुमचे कार्ट उघडत आहे.',
    roles: ['dealer'],
    action: ({ goTo }) => goTo('cart')
  },

  // ==========================================
  // 👷 कामगार (Worker Dashboard)
  // ==========================================
  {
    id: 'browse_jobs',
    patterns: [
      'नोकऱ्या शोध', 'काम शोध', 'find job', 'browse jobs',
      'नोकरी शोध', 'काम हवे', 'रोजगार', 'नोकऱ्या दाखव', 'काम दाखव'
    ],
    reply: 'जवळच्या नोकऱ्या शोधत आहे.',
    roles: ['worker'],
    action: ({ goTo }) => goTo('browse')
  },
  {
    id: 'my_applications',
    patterns: [
      'माझे अर्ज', 'अर्ज', 'applications', 'my applications',
      'अर्ज पहा', 'माझे काम', 'अर्ज दाखव'
    ],
    reply: 'तुमचे अर्ज उघडत आहे.',
    roles: ['worker'],
    action: ({ goTo }) => goTo('applications')
  },
  {
    id: 'my_worker_profile',
    patterns: [
      'माझा अर्ज तयार', 'माझा अर्ज', 'worker profile', 'resume',
      'प्रोफाइल तयार', 'कौशल्य', 'काम मिळवा', 'अर्ज तयार'
    ],
    reply: 'तुमचा अर्ज उघडत आहे.',
    roles: ['worker'],
    action: ({ goTo }) => goTo('myprofile')
  },
  {
    id: 'wages',
    patterns: [
      'मजुरी', 'मजुरी दर', 'wages', 'wage', 'रोजंदारी',
      'मजुरी किती', 'मजूरी', 'मजुरीचा दर'
    ],
    reply: 'मजुरीचे दर उघडत आहे.',
    roles: ['farmer', 'dealer', 'worker'],
    action: ({ goTo, role }) => {
      if (role === 'worker') goTo('wages');
      else goTo('jobs');
    }
  },

  // ==========================================
  // 🗣️ Greetings
  // ==========================================
  {
    id: 'greeting',
    patterns: [
      'नमस्कार', 'हॅलो', 'हाय', 'जार्विस', 'jarvis', 'hello', 'hi',
      'जय महाराष्ट्र', 'नमस्कार जार्विस', 'अरे जार्विस', 'ए जार्विस'
    ],
    reply: 'नमस्कार! मी जार्विस आहे. काय मदत करू?',
    action: () => {}
  },
  {
    id: 'good_morning',
    patterns: ['सुप्रभात', 'गुड मॉर्निंग', 'good morning', 'शुभ सकाळ'],
    reply: 'सुप्रभात! आज काय काम आहे?',
    action: () => {}
  },
  {
    id: 'good_night',
    patterns: ['शुभ रात्री', 'गुड नाईट', 'good night'],
    reply: 'शुभ रात्री! उद्या पुन्हा भेटू.',
    action: () => {}
  },
  {
    id: 'good_evening',
    patterns: ['शुभ संध्याकाळ', 'गुड ईव्हनिंग', 'good evening'],
    reply: 'शुभ संध्याकाळ! काय मदत करू?',
    action: () => {}
  },
  {
    id: 'thanks',
    patterns: ['धन्यवाद', 'थँक्स', 'thanks', 'thank you', 'आभारी', 'धन्यवाद जार्विस'],
    reply: 'तुमचे स्वागत आहे! अजून काही हवे?',
    action: () => {}
  },
  {
    id: 'how_are_you',
    patterns: ['कसे आहेस', 'कसा आहेस', 'how are you', 'ठीक आहेस', 'काय चाललंय'],
    reply: 'मी छान आहे! तुम्ही कसे आहात?',
    action: () => {}
  },

  // ==========================================
  // ❓ Help & Info
  // ==========================================
  {
    id: 'help',
    patterns: [
      'मदत', 'काय करू शकतो', 'help', 'काय करता',
      'शक्यता', 'काय शक्य', 'काय करू शकतोस', 'काय काय करता'
    ],
    reply: 'मी तुम्हाला पिके, बाजार भाव, कामगार, नोकऱ्या, प्रोफाइल — सर्व शोधू शकतो. उदा. "माझी पिके", "कांदा भाव", "कामगार शोध" असे म्हणा.',
    action: () => {}
  },
  {
    id: 'who_are_you',
    patterns: ['तू कोण', 'तुम्ही कोण', 'who are you', 'तुझे नाव', 'तुझं नाव काय'],
    reply: 'मी जार्विस — कृषीवृंदा ॲपचा आवाज सहाय्यक. मी तुमची शेतीची कामे सोपी करतो.',
    action: () => {}
  },
  {
    id: 'what_is_krishivrinda',
    patterns: [
      'कृषीवृंदा काय', 'कृषीवृंदा काय आहे', 'हे ॲप काय',
      'what is krishivrinda', 'ॲप बद्दल', 'कृषीवृंदा बद्दल'
    ],
    reply: 'कृषीवृंदा हे महाराष्ट्राचे शेतकरी, व्यापारी आणि कामगार यांना एकत्र आणणारे डिजिटल व्यासपीठ आहे.',
    action: () => {}
  },

  // ==========================================
  // 🚪 Logout
  // ==========================================
  {
    id: 'logout',
    patterns: [
      'लॉगआउट', 'बाहेर पडा', 'logout', 'sign out',
      'बंद करा', 'बाहेर', 'बाहेर काढा'
    ],
    reply: 'तुम्हाला बाहेर काढत आहे. पुन्हा भेटू!',
    roles: ['farmer', 'dealer', 'worker'],
    action: ({ custom }) => {
      setTimeout(() => {
        custom?.logout?.();
      }, 2000);
    }
  },

  // ==========================================
  // 😄 Fun
  // ==========================================
  {
    id: 'joke',
    patterns: ['विनोद', 'जोक', 'joke', 'हसव', 'विनोद सांग'],
    replies: [
      'शेतकरी: "माझा कांदा सोन्यापेक्षा महाग आहे!" व्यापारी: "मग सोनं विकत घ्या, कांदा मला द्या!" 😄',
      'शेतकरी: "माझ्या शेतात काहीच उगवत नाही." मित्र: "तू तर कांदाच लावलायस!" 😂',
      'मुलगा: "बाबा, शेती कशी करायची?" बाबा: "जसं मी करतो तसं — फोन वर बोलत बोलत!" 📱😄'
    ],
    action: () => {}
  },
  {
    id: 'motivation',
    patterns: ['प्रेरणा', 'motivation', 'motivate', 'प्रोत्साहन', 'प्रेरणा द्या'],
    replies: [
      'शेतकरी देशाचा आधारस्तंभ आहे. तुमचे कष्ट कधीच वाया जात नाहीत! 💪🌾',
      'जमीन कधीच विश्वासघात करत नाही. मेहनत करा, फळ मिळेल! 🌱',
      'शेती ही सर्वात मोठी सेवा आहे. तुम्ही करत असलेले काम देवाचे काम आहे! 🙏🌾'
    ],
    action: () => {}
  },
  {
    id: 'weather_question',
    patterns: ['हवामान', 'हवामान काय', 'weather', 'पाऊस', 'उकाळ', 'थंडी'],
    reply: 'हवामान सुविधा लवकरच येईल. सध्या मी पिके, बाजार भाव, कामगार शोधू शकतो.',
    action: () => {}
  }
];

// ============================================
// Fuzzy matching — चुकीचे शब्द पण समजणे
// ============================================
function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  const dist = levenshtein(longer, shorter);
  return (longer.length - dist) / longer.length;
}

// ============================================
// Smart Command शोधा
// ============================================
export function findCommand(text, role) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();

  // 1. Exact match प्रथम
  for (const cmd of COMMANDS) {
    if (cmd.roles && !cmd.roles.includes(role)) continue;
    for (const pattern of cmd.patterns) {
      if (lower === pattern.toLowerCase()) return cmd;
    }
  }

  // 2. Includes match (सर्वात लांब pattern आधी)
  const includesMatches = [];
  for (const cmd of COMMANDS) {
    if (cmd.roles && !cmd.roles.includes(role)) continue;
    for (const pattern of cmd.patterns) {
      const p = pattern.toLowerCase();
      if (lower.includes(p)) {
        includesMatches.push({ cmd, score: p.length });
      }
    }
  }
  if (includesMatches.length > 0) {
    includesMatches.sort((a, b) => b.score - a.score);
    return includesMatches[0].cmd;
  }

  // 3. Fuzzy match — 75% similarity
  const words = lower.split(/\s+/);
  for (const cmd of COMMANDS) {
    if (cmd.roles && !cmd.roles.includes(role)) continue;
    for (const pattern of cmd.patterns) {
      const p = pattern.toLowerCase();
      // संपूर्ण pattern साठी
      if (similarity(lower, p) > 0.75) return cmd;
      // शब्द-दर-शब्द
      for (const w of words) {
        if (w.length > 3 && similarity(w, p) > 0.8) return cmd;
      }
    }
  }

  return null;
}

// ============================================
// Proactive Suggestions
// ============================================
export function getSuggestions(role) {
  const map = {
    farmer: [
      'माझी पिके',
      'बाजार भाव',
      'कांदा भाव',
      'कामगार शोध',
      'माझी माहिती'
    ],
    dealer: [
      'पिके शोध',
      'माझे कार्ट',
      'बाजार भाव',
      'कामगार शोध',
      'टोमॅटो भाव'
    ],
    worker: [
      'नोकऱ्या शोध',
      'माझे अर्ज',
      'मजुरी दर',
      'माझा अर्ज',
      'माझी माहिती'
    ]
  };
  return map[role] || map.farmer;
}

// Random reply मिळवा (जर array असेल)
export function getReply(cmd) {
  if (!cmd) return '';
  if (Array.isArray(cmd.replies)) {
    return cmd.replies[Math.floor(Math.random() * cmd.replies.length)];
  }
  return cmd.reply || '';
}