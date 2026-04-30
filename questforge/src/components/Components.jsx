// Leaderboard
const LB_STATIC = [
  { name: 'Lady Seraphina', initials: 'LS', xp: 2400, level: 24 },
  { name: 'Brother Aldric', initials: 'BA', xp: 1850, level: 18 },
  { name: 'Mage Theron', initials: 'MT', xp: 1200, level: 12 },
  { name: 'Ranger Lyssa', initials: 'RL', xp: 980, level: 9 },
  { name: 'Paladin Dusk', initials: 'PD', xp: 740, level: 7 },
  { name: 'Rogue Nyx', initials: 'RN', xp: 520, level: 5 },
]

export function Leaderboard({ profile }) {
  const me = {
    name: profile?.display_name || 'Hero',
    initials: (profile?.display_name || 'H').slice(0, 2).toUpperCase(),
    xp: (profile?.xp || 0) + ((profile?.level || 1) - 1) * 100,
    level: profile?.level || 1,
    you: true,
  }
  const all = [...LB_STATIC, me].sort((a, b) => b.xp - a.xp)
  const ranks = ['🥇', '🥈', '🥉']

  return (
    <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
      <div className="board-hdr">
        <div className="board-title">{getT('hall_of_champions')}</div>
      </div>
      {all.map((p, i) => (
        <div key={p.name} className={`lb-row ${p.you ? 'you' : ''}`}>
          <div className={`lb-rank ${i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : ''}`}>
            {i < 3 ? ranks[i] : i + 1}
          </div>
          <div className="lb-av">{p.initials}</div>
          <div className="lb-name">
            {p.name}
            {p.you && <span style={{ fontSize: '.62rem', color: 'var(--gold)', fontFamily: "'Almendra', serif", marginLeft: '.3rem' }}>(you)</span>}
          </div>
          <div className="lb-xp">✦ {p.xp.toLocaleString()} XP</div>
          <div className="lb-level">Lvl {p.level}</div>
        </div>
      ))}
    </div>
  )
}

const MEDIEVAL_LEVELS = [
  { value: 0, label: 'Modern', desc: 'Clean, minimal UI' },
  { value: 25, label: 'Rustic', desc: 'Wooden tavern vibes' },
  { value: 50, label: 'Medieval', desc: 'Classic castle aesthetic' },
  { value: 75, label: 'Dark Ages', desc: 'Gritty stone and shadow' },
  { value: 100, label: 'Full Epic', desc: 'Maximum medieval immersion' },
]

// Text translation by level
const TEXT_TRANSLATIONS = {
  0: {
    brand:'QuestForge',tagline:'Productivity, simplified.',login_heading:'Sign In',enter_realm:'Log In',begin_legend:'Create Account',new_to_realm:'New here?',forge_legend:'Sign up',already_hero:'Have an account?',return_gate:'Sign in',quest_board:'Task Board',rankings:'Leaderboard',citadel:'Settings',declare_quest:'+ New Task',complete:'Done',strike:'Progress',daily_flame:'Daily Streak',days_glory:'day streak',hourglass:'Focus Timer',begin_quest:'Start Timer',abandon_quest:'Stop Timer',achievements:'Achievements',depart:'Sign Out',save_profile:'Save',perfect_day:'Perfect Day! All tasks done! +50 Bonus XP!',xp_label:'Experience',level_up_title:'Level Up!',level_up_sub:'You leveled up!',continue:'Continue',declare_new:'New Task',edit_quest:'Edit Task',difficulty_label:'Difficulty',time_label:'Est. Time (minutes)',boss_stages:'Stages (total)',cancel:'Cancel',save_changes:'Save',declare_btn:'Create',hero_profile:'Profile',hero_name:'Display Name',hero_class:'Title',realm_settings:'App Settings',thy_legend:'Your Stats',email_label:'Email',password_label:'Password',name_label:'Name',hall_of_champions:'Leaderboard',today_progress:'Today: {done} of {total} tasks',complete_all:'Complete all for +50 Bonus XP!',filter_all:'All',filter_active:'Active',filter_boss:'Boss',filter_done:'Completed',boss_ribbon:'Boss',boss_hp:'Boss HP',stages_label:'stages',min_label:'min',stat_quests:'Tasks',stat_gold:'Gold',stat_streak:'Streak',fellowship:'Friends',fellowship_lb:'Friend Rankings',find_heroes:'Find People',requests_tab:'Requests',loading_fellowship:'Loading friends...',fellowship_empty:'No friends yet. Search for people to add!',total_xp_label:'Total XP',remove_friend:'Remove',add_friends_lb:'Add friends to see rankings!',find_hero_title:'Find a Person',search_placeholder:'Search by name...',no_heroes_found:'No users found by that name',recruit_btn:'+ Add',incoming_requests:'Incoming Requests',sent_requests:'Sent Requests',seeks_fellowship:'Wants to connect',accept_btn:'Accept',no_requests:'No pending requests.',friend_id_label:'Your Friend ID',friend_id_hint:'Share this with friends so they can find you',level_label:'Level',xp_total_label:'Total XP earned',streak_longest:'Longest streak',perfect_days_label:'Perfect days',gold_collected:'Gold collected',
  },
  25: {
    brand:'Questforge',tagline:'Where work gets done.',login_heading:'Welcome Back',enter_realm:'Enter the Inn',begin_legend:'Join the Guild',new_to_realm:'New traveler?',forge_legend:'Join up',already_hero:'Know the way?',return_gate:'Sign in',quest_board:'Notice Board',rankings:'Guild Rankings',citadel:'Lodgings',declare_quest:'+ Post a Job',complete:'Done',strike:'Strike!',daily_flame:'Daily Fire',days_glory:'days going',hourglass:'Work Timer',begin_quest:'Start Working',abandon_quest:'Stop',achievements:'Badges',depart:'Leave the Inn',save_profile:'Save',perfect_day:'All jobs done! +50 Bonus XP!',xp_label:'Experience',level_up_title:'Level Up!',level_up_sub:'Your skills grow, traveler!',continue:'Onward',declare_new:'New Job',edit_quest:'Edit Job',difficulty_label:'Difficulty',time_label:'Time needed (minutes)',boss_stages:'Sessions needed',cancel:'Nevermind',save_changes:'Save it',declare_btn:'Post it',hero_profile:'Traveler Profile',hero_name:'Name',hero_class:'Trade',realm_settings:'Preferences',thy_legend:'Your Record',email_label:'Email',password_label:'Password',name_label:'Your Name',hall_of_champions:'Top Travelers',today_progress:'Today: {done} of {total} jobs posted',complete_all:'Finish all for +50 Bonus XP!',filter_all:'All',filter_active:'Active',filter_boss:'Big Job',filter_done:'Done',boss_ribbon:'Big Job',boss_hp:'Job Progress',stages_label:'sessions',min_label:'min',stat_quests:'Jobs',stat_gold:'Gold',stat_streak:'Streak',fellowship:'Guild',fellowship_lb:'Guild Rankings',find_heroes:'Find Travelers',requests_tab:'Invites',loading_fellowship:'Gathering thy guild...',fellowship_empty:'Thy guild is empty. Find some travelers!',total_xp_label:'Total XP',remove_friend:'Remove',add_friends_lb:'Add guild members to see rankings!',find_hero_title:'Find a Traveler',search_placeholder:'Search by traveler name...',no_heroes_found:'No travelers found by that name',recruit_btn:'+ Recruit',incoming_requests:'Guild Invitations',sent_requests:'Sent Invites',seeks_fellowship:'Wants to join thy guild',accept_btn:'Welcome',no_requests:'No pending guild invites.',friend_id_label:'Thy Guild ID',friend_id_hint:'Share with travelers to find thee',level_label:'Level',xp_total_label:'Total XP earned',streak_longest:'Longest streak',perfect_days_label:'Perfect days',gold_collected:'Gold collected',
  },
  50: {
    brand:'✦ Questforge ✦',tagline:'Where heroes vanquish procrastination',login_heading:'Enter the Realm',enter_realm:'⚔ Enter the Realm',begin_legend:'✦ Begin Thy Legend',new_to_realm:'New to the realm?',forge_legend:'Forge thy legend',already_hero:'Already a hero?',return_gate:'Return to the gate',quest_board:'📜 Quest Board',rankings:'⚔ Rankings',citadel:'🏰 Citadel',declare_quest:'+ Declare Quest',complete:'✓ Complete',strike:'⚔ Strike!',daily_flame:'✦ Daily Flame ✦',days_glory:'days of glory',hourglass:'⏳ Hourglass Focus',begin_quest:'⏳ Begin Thy Quest',abandon_quest:'⏹ Abandon Quest',achievements:'✦ Achievements ✦',depart:'⚔ Depart from Realm',save_profile:'Save Profile',perfect_day:'⚜ Perfect Day! All quests conquered! +50 Bonus XP! ⚜',xp_label:'✦ Experience',level_up_title:'✦ Level Up! ✦',level_up_sub:'Thy power grows, brave hero!',continue:'Continue thy legend →',declare_new:'📜 Declare a New Quest',edit_quest:'📜 Edit Quest',difficulty_label:'Difficulty',time_label:'Est. Time (minutes)',boss_stages:'Boss Stages (total)',cancel:'Cancel',save_changes:'Save Changes',declare_btn:'⚔ Declare!',hero_profile:'⚔ Hero Profile',hero_name:'Hero Name',hero_class:'Title / Class',realm_settings:'🔔 Realm Settings',thy_legend:'📊 Thy Legend',email_label:'✦ Email Scroll',password_label:'🛡 Password Ward',name_label:'⚔ Hero Name',hall_of_champions:'⚔ Hall of Champions',today_progress:'📊 Today: {done} of {total} quests complete',complete_all:'Complete all for +50 Bonus XP!',filter_all:'All Quests',filter_active:'Active',filter_boss:'⚔ Boss',filter_done:'Completed',boss_ribbon:'⚔ Boss',boss_hp:'⚔ Boss HP',stages_label:'stages',min_label:'min',stat_quests:'Quests',stat_gold:'Gold',stat_streak:'Streak',fellowship:'⚔ Fellowship',fellowship_lb:'🏆 Fellowship Rankings',find_heroes:'🔍 Find Heroes',requests_tab:'📜 Requests',loading_fellowship:'⏳ Loading thy fellowship...',fellowship_empty:'Thy fellowship is empty. Search for heroes to join thy cause!',total_xp_label:'Total XP',remove_friend:'Remove',add_friends_lb:'Add friends to see the fellowship rankings!',find_hero_title:'🔍 Find a Hero',search_placeholder:'Search by hero name...',no_heroes_found:'No heroes found by that name',recruit_btn:'+ Recruit',incoming_requests:'📜 Incoming Requests',sent_requests:'⏳ Sent Requests',seeks_fellowship:'Seeks to join thy fellowship',accept_btn:'✓ Accept',no_requests:'No pending requests.',friend_id_label:'⚔ Thy Hero ID',friend_id_hint:'Share this scroll with other heroes to find thee',level_label:'✦ Level',xp_total_label:'✦ Total XP earned',streak_longest:'✦ Longest streak',perfect_days_label:'✦ Perfect days',gold_collected:'✦ Gold collected',
  },
  75: {
    brand:'⚔ Questforge ⚔',tagline:'Where brave souls conquer their fate',login_heading:'Prove Thyself, Warrior',enter_realm:'⚔ Storm the Gates',begin_legend:'🩸 Swear Thy Oath',new_to_realm:'Hast thou not yet pledged?',forge_legend:'Take the oath',already_hero:'Already sworn in?',return_gate:'Return thee to thy post',quest_board:'📜 The War Board',rankings:'💀 Hall of Blood',citadel:'🏰 The Fortress',declare_quest:'+ Issue War Orders',complete:'⚔ Vanquished!',strike:'💀 Strike Down!',daily_flame:'🔥 The Eternal Flame',days_glory:'days of bloodshed',hourglass:'⏳ The Sand of Time',begin_quest:'⚔ March to Battle',abandon_quest:'🏳 Sound Retreat',achievements:'🛡 Battle Honours',depart:'⚔ Flee the Fortress',save_profile:'Inscribe in Stone',perfect_day:'💀 ALL FOES VANQUISHED! Glorious Victory! +50 XP!',xp_label:'⚔ Battle Experience',level_up_title:'⚔ Thy Power Grows! ⚔',level_up_sub:'Fear thy name, all who oppose thee!',continue:'March onward →',declare_new:'📜 Issue New Orders',edit_quest:'📜 Rewrite the Orders',difficulty_label:'Danger Level',time_label:'Hours of battle',boss_stages:'Assaults required',cancel:'Stand Down',save_changes:'Carve in Stone',declare_btn:'⚔ Sound the Horn!',hero_profile:"⚔ Warrior's Dossier",hero_name:'Warrior Name',hero_class:'Rank & Title',realm_settings:'🔔 Fortress Orders',thy_legend:'⚔ Thy War Record',email_label:'📜 Messenger Pigeon',password_label:'🗝 Secret Cipher',name_label:'⚔ Warrior Name',hall_of_champions:'💀 Hall of the Slain',today_progress:'⚔ Battle Report: {done} of {total} enemies slain',complete_all:'Slay them all for +50 Bonus XP!',filter_all:'All Orders',filter_active:'Active',filter_boss:'💀 Boss',filter_done:'Vanquished',boss_ribbon:'💀 Boss',boss_hp:'💀 Enemy HP',stages_label:'assaults',min_label:'min of battle',stat_quests:'Kills',stat_gold:'Plunder',stat_streak:'Campaign',fellowship:'⚔ War Party',fellowship_lb:'💀 Hall of Blood',find_heroes:'🔍 Recruit Warriors',requests_tab:'⚔ War Summons',loading_fellowship:'⏳ Mustering thy war party...',fellowship_empty:'Thy war party is empty. Recruit warriors to thy cause!',total_xp_label:'Battle XP',remove_friend:'Dismiss',add_friends_lb:'Recruit warriors to see the hall of blood!',find_hero_title:'🔍 Recruit a Warrior',search_placeholder:'Search by warrior name...',no_heroes_found:'No warriors found by that name',recruit_btn:'⚔ Conscript',incoming_requests:'⚔ War Summons Received',sent_requests:'⏳ Summons Dispatched',seeks_fellowship:'Seeks to join thy war party',accept_btn:'⚔ Accept Warrior',no_requests:'No pending war summons.',friend_id_label:'⚔ Thy Warrior Sigil',friend_id_hint:'Dispatch this sigil to recruit other warriors',level_label:'⚔ Battle Rank',xp_total_label:'⚔ Total Battle XP',streak_longest:'⚔ Longest campaign',perfect_days_label:'💀 Perfect battle days',gold_collected:'🪙 Total plunder',
  },
  100: {
    brand:'✦ Questforge ✦',tagline:'Hither come those who wouldst vanquish procrastination',login_heading:'Prithee, Identify Thyself',enter_realm:'⚔ Verily, Enter Thou the Realm',begin_legend:'✦ Let Thy Legend Begin Henceforth',new_to_realm:'Dost thou not yet dwell within our realm?',forge_legend:'Forge thine own legend',already_hero:'Art thou already a hero of renown?',return_gate:'Return thee to the gate',quest_board:'📜 The Royal Quest Board',rankings:'⚔ The Chronicles of Glory',citadel:'🏰 The Grand Citadel',declare_quest:'+ Proclaim a New Quest',complete:'✓ Thus It Is Done',strike:'⚔ Strike Thee Down!',daily_flame:'✦ The Sacred Daily Flame ✦',days_glory:'days of most glorious conquest',hourglass:'⏳ The Ancient Hourglass',begin_quest:'⏳ Commence Thy Noble Quest',abandon_quest:'⏹ Forsake Thy Quest, Coward',achievements:'✦ Scrolls of Achievement ✦',depart:'⚔ Depart Henceforth from this Realm',save_profile:'Inscribe Upon the Royal Scroll',perfect_day:'⚜ Hark! A Perfect Day of Most Glorious Conquest! +50 Bonus XP! ⚜',xp_label:'✦ Experience of the Ages',level_up_title:'✦ Hark! Thou Hast Levelled Up! ✦',level_up_sub:"Thy power groweth mightily, most brave and noble hero!",continue:'Continue thine eternal legend →',declare_new:'📜 Proclaim a Most Noble New Quest',edit_quest:'📜 Amend the Sacred Quest Scroll',difficulty_label:'The Peril of this Endeavour',time_label:'Estimated hours of toil (in minutes)',boss_stages:'Stages of the Grand Battle',cancel:'Nay, I Shall Not',save_changes:'Inscribe These Changes',declare_btn:'⚔ Proclaim it Henceforth!',hero_profile:"⚔ The Hero's Sacred Profile",hero_name:"The Hero's Most Noble Name",hero_class:'Title and Class of Distinction',realm_settings:'🔔 Decrees of the Realm',thy_legend:'📜 The Scrolls of Thy Legend',email_label:'✦ Thine Email Scroll of Correspondence',password_label:'🛡 Thy Most Secret Password Ward',name_label:'⚔ Thy Most Noble Hero Name',hall_of_champions:'⚔ The Eternal Hall of Most Glorious Champions',today_progress:'📜 Hear Ye: {done} of {total} noble quests hath been accomplished this day',complete_all:'Complete all thy quests for +50 most glorious Bonus XP!',filter_all:'All Noble Quests',filter_active:'Active Quests',filter_boss:'💀 The Boss Quest',filter_done:'Thus Accomplished',boss_ribbon:'💀 Boss',boss_hp:'⚔ The Enemy HP',stages_label:'stages of battle',min_label:'minutes of toil',stat_quests:'Quests Done',stat_gold:'Gold Hoard',stat_streak:'Day Streak',fellowship:'✦ The Sacred Fellowship ✦',fellowship_lb:'⚔ The Eternal Rankings of Glory',find_heroes:'✦ Seek Out Heroes',requests_tab:'📜 Fellowship Scrolls',loading_fellowship:'⏳ Summoning thy fellowship from the ether...',fellowship_empty:'Thy fellowship lieth empty and desolate. Venture forth and seek out other heroes!',total_xp_label:'Total XP of the Ages',remove_friend:'Banish from Fellowship',add_friends_lb:'Recruit heroes to thy fellowship to witness the eternal rankings!',find_hero_title:'✦ Seek Out a Most Noble Hero',search_placeholder:'Search by the name of thine desired hero...',no_heroes_found:'No heroes of that name dwell within this realm',recruit_btn:'✦ Invite to Fellowship',incoming_requests:'📜 Fellowship Scrolls Received',sent_requests:'⏳ Fellowship Scrolls Dispatched',seeks_fellowship:'Doth seek entry into thy most noble fellowship',accept_btn:'✦ Welcome to the Fellowship',no_requests:'No fellowship scrolls await thy attention.',friend_id_label:'✦ Thy Sacred Hero Identifier',friend_id_hint:'Shareth this most unique identifier with other heroes so they may find thee',level_label:'✦ Level of Distinction',xp_total_label:'✦ Total XP of the Ages',streak_longest:'✦ Longest streak of glory',perfect_days_label:'✦ Days of perfect conquest',gold_collected:'✦ Gold hoard accumulated',
  },
}

export function getT(key) {
  const val = parseInt(localStorage.getItem('qf_medieval') || '100')
  const level = [0, 25, 50, 75, 100].reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev)
  return TEXT_TRANSLATIONS[level]?.[key] || TEXT_TRANSLATIONS[50][key] || key
}

// Apply saved medievalness on page load
;(function initMedievalness() {
  const val = parseInt(localStorage.getItem('qf_medieval') || '100')
  const fonts = { 0:"'Inter','Segoe UI',system-ui,sans-serif", 25:"'Georgia','Palatino Linotype',serif", 50:"'Fondamento',cursive", 75:"'Almendra',serif", 100:"'Almendra Display',serif" }
  const level = [0,25,50,75,100].reduce((p,c)=>Math.abs(c-val)<Math.abs(p-val)?c:p)
  const font = fonts[level]
  document.body.style.fontFamily = font
  const root = document.documentElement
  let styleEl = document.getElementById('qf-font-style')
  if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'qf-font-style'; document.head.appendChild(styleEl) }
  styleEl.textContent = `*, .finput, .flabel, .btn-realm, .btn-can, .btn-sub, .navbtn, .brand, .board-title, .qtitle, .qdesc, .char-name, .stat-lbl, .widget-title, .scard-title, .slabel, .xp-lbl, .char-class, .ftab, .time-tag, .xp-tag { font-family: ${font} !important; }`
  if (val === 0) {
    root.style.setProperty('--parch','#ffffff'); root.style.setProperty('--parch2','#f1f5f9'); root.style.setProperty('--parch3','#e2e8f0')
    root.style.setProperty('--ink','#1e293b'); root.style.setProperty('--ink3','#475569'); document.body.style.background='#f1f5f9'
  } else if (val <= 25) {
    root.style.setProperty('--parch','#F5E8C0'); root.style.setProperty('--parch2','#E8D498'); root.style.setProperty('--parch3','#D4B870')
    root.style.setProperty('--ink','#1a0c04'); root.style.setProperty('--ink3','#4a3215'); document.body.style.background='#2a1f0e'
  } else if (val <= 75) {
    root.style.setProperty('--parch','#2E2210'); root.style.setProperty('--parch2','#241A0A'); root.style.setProperty('--parch3','#1A1208')
    root.style.setProperty('--ink','#F0D8A0'); root.style.setProperty('--ink3','#B89A52'); document.body.style.background='#0d0905'
  } else if (val === 100) {
    root.style.setProperty('--parch','#1A1005'); root.style.setProperty('--parch2','#130C03'); root.style.setProperty('--parch3','#0E0902')
    root.style.setProperty('--ink','#F7D070'); root.style.setProperty('--ink3','#C8911E'); document.body.style.background='#080603'
  }
})()

export function SettingsPage({ profile, onSave, onLogout, onQuestImport }) {
  const [name, setName] = useState_local(profile?.display_name || '')
  const [heroClass, setHeroClass] = useState_local(profile?.hero_class || 'Adventurer')
  const [toggles, setToggles] = useState_local({ anim: true, sound: true, lvlup: true, remind: true })
  const [medievalness, setMedievalness] = useState_local(() => parseInt(localStorage.getItem('qf_medieval') || '100'))

  function tog(k) { setToggles(t => ({ ...t, [k]: !t[k] })) }

  function applyMedievalness(val) {
    setMedievalness(val)
    localStorage.setItem('qf_medieval', val)
    window.dispatchEvent(new CustomEvent('medievalchange', { detail: val }))
    const root = document.documentElement

    // Font families per level — applied to ALL elements via CSS variable
    const fonts = {
      0:   "'Inter', 'Segoe UI', system-ui, sans-serif",
      25:  "'Georgia', 'Palatino Linotype', serif",
      50:  "'Fondamento', cursive",
      75:  "'Almendra', serif",
      100: "'Almendra Display', serif",
    }
    const font = fonts[val] || fonts[50]
    root.style.setProperty('--app-font', font)
    document.body.style.fontFamily = font

    // Inject a global style tag for font override
    let styleEl = document.getElementById('qf-font-style')
    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'qf-font-style'; document.head.appendChild(styleEl) }
    styleEl.textContent = `*, .finput, .flabel, .btn-realm, .btn-can, .btn-sub, .navbtn, .brand, .board-title, .qtitle, .qdesc, .char-name, .stat-lbl, .widget-title, .scard-title, .slabel, .xp-lbl, .char-class, .ftab, .time-tag, .xp-tag { font-family: ${font} !important; }`

    if (val === 0) {
      // Modern — light clean whites
      root.style.setProperty('--parch',  '#ffffff')
      root.style.setProperty('--parch2', '#f1f5f9')
      root.style.setProperty('--parch3', '#e2e8f0')
      root.style.setProperty('--gold',   '#6366f1')
      root.style.setProperty('--gold2',  '#818cf8')
      root.style.setProperty('--gold3',  '#a5b4fc')
      root.style.setProperty('--ink',    '#1e293b')
      root.style.setProperty('--ink2',   '#334155')
      root.style.setProperty('--ink3',   '#475569')
      root.style.setProperty('--purple', '#4f46e5')
      root.style.setProperty('--purple2','#6366f1')
      document.body.style.background = '#f1f5f9'
    } else if (val <= 25) {
      // Rustic — warm parchment, readable dark ink
      root.style.setProperty('--parch',  '#F5E8C0')
      root.style.setProperty('--parch2', '#E8D498')
      root.style.setProperty('--parch3', '#D4B870')
      root.style.setProperty('--gold',   '#b8860b')
      root.style.setProperty('--gold2',  '#DAA520')
      root.style.setProperty('--gold3',  '#FFD700')
      root.style.setProperty('--ink',    '#1a0c04')
      root.style.setProperty('--ink2',   '#2a1a08')
      root.style.setProperty('--ink3',   '#4a3215')
      root.style.setProperty('--purple', '#5c2d91')
      root.style.setProperty('--purple2','#7c3db1')
      document.body.style.background = '#2a1f0e'
    } else if (val <= 50) {
      // Medieval default — restore CSS defaults
      root.style.removeProperty('--parch')
      root.style.removeProperty('--parch2')
      root.style.removeProperty('--parch3')
      root.style.removeProperty('--gold')
      root.style.removeProperty('--gold2')
      root.style.removeProperty('--gold3')
      root.style.removeProperty('--ink')
      root.style.removeProperty('--ink2')
      root.style.removeProperty('--ink3')
      root.style.removeProperty('--purple')
      root.style.removeProperty('--purple2')
      document.body.style.background = ''
    } else if (val <= 75) {
      // Dark Ages — darker cards, but LIGHTER ink for contrast
      root.style.setProperty('--parch',  '#2E2210')
      root.style.setProperty('--parch2', '#241A0A')
      root.style.setProperty('--parch3', '#1A1208')
      root.style.setProperty('--gold',   '#C8911E')
      root.style.setProperty('--gold2',  '#E8B84A')
      root.style.setProperty('--gold3',  '#F7D070')
      root.style.setProperty('--ink',    '#F0D8A0')
      root.style.setProperty('--ink2',   '#D4B870')
      root.style.setProperty('--ink3',   '#B89A52')
      root.style.setProperty('--purple', '#C090FF')
      root.style.setProperty('--purple2','#A060E0')
      document.body.style.background = '#0d0905'
    } else {
      // Full Epic — near-black cards, bright golden text
      root.style.setProperty('--parch',  '#1A1005')
      root.style.setProperty('--parch2', '#130C03')
      root.style.setProperty('--parch3', '#0E0902')
      root.style.setProperty('--gold',   '#C8911E')
      root.style.setProperty('--gold2',  '#E8B84A')
      root.style.setProperty('--gold3',  '#F7D070')
      root.style.setProperty('--ink',    '#F7D070')
      root.style.setProperty('--ink2',   '#E8B84A')
      root.style.setProperty('--ink3',   '#C8911E')
      root.style.setProperty('--purple', '#C090FF')
      root.style.setProperty('--purple2','#A060E0')
      document.body.style.background = '#080603'
    }
  }

  const currentLevel = MEDIEVAL_LEVELS.reduce((prev, curr) => Math.abs(curr.value - medievalness) < Math.abs(prev.value - medievalness) ? curr : prev)

  return (
    <div className="settings-page">
      <div className="board-hdr"><div className="board-title">🏰 The Citadel</div></div>
      <div className="scard">
        <div className="scard-title">{getT('hero_profile')}</div>
        <div className="fgroup"><label className="flabel">{getT('hero_name')}</label><input className="finput" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="fgroup"><label className="flabel">{getT('hero_class')}</label><input className="finput" value={heroClass} onChange={e => setHeroClass(e.target.value)} /></div>
        <button className="btn-realm" style={{ maxWidth: 180, fontSize: '.82rem', padding: '.6rem' }} onClick={() => onSave({ display_name: name, hero_class: heroClass })}>{getT('save_profile')}</button>
      </div>

      <div className="scard" style={{ background: 'linear-gradient(155deg,#2a1e0a 0%,#1a1208 100%)', border: '2px solid var(--gold)' }}>
        <div className="scard-title" style={{ color: 'var(--gold3)' }}>⚔ Medieval-ness</div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.7rem' }}>
            <span style={{ fontSize: '.78rem', color: '#B89A52' }}>Modern</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Almendra Display', serif", fontSize: '1.1rem', color: '#F7D070', fontWeight: 700 }}>{currentLevel.label}</div>
              <div style={{ fontSize: '.7rem', color: '#B89A52', fontStyle: 'italic' }}>{currentLevel.desc}</div>
            </div>
            <span style={{ fontSize: '.78rem', color: '#B89A52' }}>Full Epic</span>
          </div>
          <input
            type="range" min="0" max="100" step="25"
            value={medievalness}
            onChange={e => applyMedievalness(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#C8911E', cursor: 'pointer', height: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.5rem' }}>
            {MEDIEVAL_LEVELS.map(l => (
              <span key={l.value} style={{
                fontSize: '.65rem',
                color: medievalness === l.value ? '#F7D070' : '#8B6518',
                fontWeight: medievalness === l.value ? 700 : 400,
                cursor: 'pointer',
                transition: 'color .2s',
              }} onClick={() => applyMedievalness(l.value)}>{l.label}</span>
            ))}
          </div>
          <div style={{ marginTop: '1rem', padding: '.6rem .8rem', background: 'rgba(200,145,30,0.12)', border: '1px solid rgba(200,145,30,0.3)', borderRadius: 2 }}>
            <div style={{ fontSize: '.72rem', color: '#B89A52', fontStyle: 'italic' }}>
              {medievalness === 0 && 'Clean modern interface — plain English, sans-serif fonts'}
              {medievalness === 25 && 'Rustic tavern style — warmer language, Georgia serif'}
              {medievalness === 50 && 'Classic medieval — Fondamento cursive, quest vocabulary'}
              {medievalness === 75 && 'Dark Ages — Almendra serif, warrior terminology, golden text on dark'}
              {medievalness === 100 && 'Full Epic — Almendra Display, Ye Olde English, bright gold on black'}
            </div>
          </div>
        </div>
      </div>

      <CalendarSyncWrapper onImport={onQuestImport} />
      <div className="scard">
        <div className="scard-title">{getT('realm_settings')}</div>
        {[['anim', 'Gold rain animations'], ['sound', 'Sound effects (coin clinks)'], ['lvlup', 'Level-up celebrations'], ['remind', 'Daily streak reminders']].map(([k, lbl]) => (
          <div className="srow" key={k}>
            <span className="slabel">{lbl}</span>
            <div className={`toggle ${toggles[k] ? 'on' : ''}`} onClick={() => tog(k)}><div className="toggle-knob" /></div>
          </div>
        ))}
      </div>
      <div className="scard">
        <div className="scard-title">{getT('thy_legend')}</div>
        <div style={{ fontFamily: "'Almendra', serif", fontSize: '.85rem', color: 'var(--ink3)', lineHeight: 1.8 }}>
          <div>{getT('level_label')}: <strong style={{ color: 'var(--gold)' }}>{profile?.level || 1}</strong></div>
          <div>{getT('xp_total_label')}: <strong style={{ color: 'var(--purple2)' }}>{((profile?.level || 1) - 1) * 100 + (profile?.xp || 0)}</strong></div>
          <div>{getT('streak_longest')}: <strong style={{ color: '#FF8C00' }}>{profile?.longest_streak || 0} days</strong></div>
          <div>{getT('perfect_days_label')}: <strong style={{ color: 'var(--gold)' }}>{profile?.perfect_days || 0}</strong></div>
          <div>{getT('gold_collected')}: <strong style={{ color: 'var(--gold2)' }}>{profile?.gold || 0}</strong></div>
        </div>
        <div style={{ marginTop: '1rem', padding: '.7rem', background: 'rgba(22,14,4,0.08)', border: '1px solid rgba(200,145,30,0.25)', borderRadius: 2 }}>
          <div style={{ fontFamily: "'Almendra', serif", fontSize: '.68rem', color: 'var(--ink3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.3rem' }}>{getT('friend_id_label')}</div>
          <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.8rem', color: 'var(--ink)', fontWeight: 700, letterSpacing: '.05em', wordBreak: 'break-all' }}>{profile?.id?.slice(0, 8).toUpperCase() || '...'}</div>
          <div style={{ fontFamily: "'Fondamento', cursive", fontStyle: 'italic', fontSize: '.72rem', color: 'var(--ink3)', marginTop: '.2rem' }}>{getT('friend_id_hint')}</div>
          <button className="btn-complete" style={{ marginTop: '.5rem', fontSize: '.65rem' }} onClick={() => { navigator.clipboard.writeText(profile?.id?.slice(0,8).toUpperCase()); alert('Copied!') }}>📋 Copy ID</button>
        </div>
      </div>
      <div className="scard">
        <div className="scard-title">🚪 Depart the Realm</div>
        <button className="btn-can" style={{ fontFamily: "'Almendra', serif", fontSize: '.82rem', padding: '.6rem 1.3rem' }} onClick={onLogout}>{getT('depart')}</button>
      </div>
    </div>
  )
}

function CalendarSyncWrapper({ onImport }) {
  const [CalendarSync, setCalendarSync] = useState_local(null)
  useState_local(() => {
    import('./CalendarSync.jsx').then(m => setCalendarSync(() => m.default))
  }, [])
  if (!CalendarSync) return null
  return <CalendarSync onImport={onImport} />
}

// Tiny local useState wrapper so we can use hooks in this file
import { useState as useState_local } from 'react'

// LevelUpOverlay
export function LevelUpOverlay({ level, onClose }) {
  return (
    <div className="lvlup-overlay">
      <div className="lvlup-box">
        <div style={{ fontSize: '2.8rem', marginBottom: '.4rem' }}>🎺</div>
        <div className="lvlup-title">{getT('level_up_title')}</div>
        <div className="lvlup-num">{level}</div>
        <div className="lvlup-sub">{getT('level_up_sub')}</div>
        <button className="btn-lvlclose" onClick={onClose}>{getT('continue')}</button>
      </div>
    </div>
  )
}

// XpPopup
export function XpPopup({ msg }) {
  return <div className="xp-popup">{msg}</div>
}

// GoldCoins — self-contained with injected keyframes, guaranteed to work
export function GoldCoins({ count }) {
  // Inject keyframes once into the document
  if (!document.getElementById('qf-coin-style')) {
    const s = document.createElement('style')
    s.id = 'qf-coin-style'
    s.textContent = `
      @keyframes qfCoinFall {
        0%   { transform: translateY(0vh);   opacity: 1;    }
        75%  { transform: translateY(80vh);  opacity: 0.6;  }
        95%  { transform: translateY(100vh); opacity: 0.25; }
        100% { transform: translateY(110vh); opacity: 0;    }
      }
      @keyframes qfCoinSpin {
        0%   { transform: rotateY(0deg);   }
        100% { transform: rotateY(360deg); }
      }
    `
    document.head.appendChild(s)
  }

  const total = Math.min(count * 2, 50)
  const coins = Array.from({ length: total }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    size: 22 + Math.random() * 14,
    fallDur: (1.4 + Math.random() * 0.8).toFixed(2),
    spinDur: (0.25 + Math.random() * 0.3).toFixed(2),
    delay: (i * 0.03).toFixed(3),
  }))

  return (
    <>
      {coins.map(c => (
        <div
          key={c.id}
          style={{
            position: 'fixed',
            left: c.left + '%',
            top: 0,
            width: c.size + 'px',
            height: c.size + 'px',
            zIndex: 1999,
            pointerEvents: 'none',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #FFE566, #E8B84A 40%, #C8911E 70%, #7A5A10)',
            border: '2px solid #7A5A10',
            boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.35), inset 2px 2px 5px rgba(255,230,100,0.6)',
            animation: `qfCoinFall ${c.fallDur}s linear ${c.delay}s 1 forwards, qfCoinSpin ${c.spinDur}s linear ${c.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </>
  )
}
