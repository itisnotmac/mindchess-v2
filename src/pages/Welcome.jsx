import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { validateUsername, isUsernameTaken } from '@/lib/AuthContext';
import { Brain, Swords, BookOpen, Crown, Star, ChevronRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';

const SLIDES = [
  {
    bg: 'room-throne',
    icon: <Brain className="w-16 h-16 text-primary drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 12px #00bcd4)' }} />,
    title: 'Welcome to mindChess',
    subtitle: 'Chess that makes you smarter',
    body: 'Train your mind, sharpen your game, and climb from Pawn to Mind Chess Master — one move at a time.',
  },
  {
    bg: 'room-war-room',
    icon: <Swords className="w-16 h-16 text-primary drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 12px #00bcd4)' }} />,
    title: 'Tactical Training',
    subtitle: 'Find in Tactics',
    body: 'Solve daily puzzles, earn XP, and build the pattern recognition that separates good players from great ones.',
    highlight: '→ Tap Tactics to get started',
  },
  {
    bg: 'room-game-hall',
    icon: <Crown className="w-16 h-16 text-primary drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 12px #00bcd4)' }} />,
    title: 'Play vs AI',
    subtitle: '5 difficulty levels',
    body: 'From Yellow Belt (friendly) to Final Boss (brutal). Higher difficulties unlock as you level up — no shortcuts.',
    highlight: '→ Tap Play to face the AI',
  },
  {
    bg: 'room-library',
    icon: <Brain className="w-16 h-16 text-yellow-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 12px #FFB300)' }} />,
    title: 'The AI Chess Coach',
    subtitle: 'Premium feature',
    body: '"The Chess God" gives you real-time analysis, explains your mistakes, and coaches your improvement. This is the feature serious players come back for.',
    highlight: '★ Unlocks with Premium',
    isPremiumCallout: true,
  },
  {
    bg: 'room-hall-of-records',
    icon: <Star className="w-16 h-16 text-primary drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 12px #00bcd4)' }} />,
    title: 'Track Your Growth',
    subtitle: 'Find in Profile',
    body: 'Every puzzle solved and game played earns XP. Watch your level climb from Pawn all the way to Mind Chess Master.',
    highlight: '→ Tap Profile to see your stats',
  },
];

export default function Welcome() {
  const [step, setStep] = useState(0); // 0–4 = tour, 5 = sign-up
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const isLastSlide = step === SLIDES.length - 1;
  const isAuthStep = step === SLIDES.length;

  function next() {
    if (isLastSlide) setStep(SLIDES.length);
    else setStep(s => s + 1);
  }

  function prev() {
    if (step > 0) setStep(s => s - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Validate display name before hitting network
      const nameErr = validateUsername(displayName);
      if (nameErr) {
        setDisplayNameError(nameErr);
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const taken = await isUsernameTaken(displayName);
        if (taken) {
          setDisplayNameError('That display name is already taken.');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  function friendlyError(code) {
    switch (code) {
      case 'auth/email-already-in-use': return 'That email is already registered. Try signing in instead.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return 'Email or password is incorrect.';
      case 'username/taken': return 'That display name is already taken.';
      default: return 'Something went wrong. Please try again.';
    }
  }

  // ── Auth step ──────────────────────────────────────────────────
  if (isAuthStep) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-6"
        style={{
          backgroundImage: "url('/room-throne.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/icon-512.png" alt="mindChess" className="w-20 h-20 mx-auto rounded-2xl mb-4 shadow-lg" style={{ boxShadow: '0 0 24px #00bcd480' }} />
            <h1 className="text-3xl font-bold text-white">mindChess</h1>
            <p className="text-muted-foreground mt-1">{isSignUp ? 'Create your account to begin' : 'Welcome back'}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={e => { setDisplayName(e.target.value); setDisplayNameError(''); }}
                  onBlur={() => {
                    if (displayName) setDisplayNameError(validateUsername(displayName) || '');
                  }}
                  required
                  maxLength={24}
                  autoComplete="nickname"
                  className={`w-full px-4 py-3 rounded-lg bg-black/60 border text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition ${
                    displayNameError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {displayNameError && (
                  <p className="text-xs text-red-400 mt-1 pl-1">{displayNameError}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1 pl-1">
                  2–24 characters · letters, numbers, spaces, hyphens, underscores
                </p>
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-black/60 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(v => !v); setError(''); setDisplayNameError(''); }}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>

          {/* Back to tour */}
          <button
            onClick={() => setStep(SLIDES.length - 1)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white mx-auto mt-4 transition"
          >
            <ChevronLeft className="w-3 h-3" /> Back to tour
          </button>
        </div>
      </div>
    );
  }

  // ── Tour slides ────────────────────────────────────────────────
  const slide = SLIDES[step];

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        backgroundImage: `url('/${slide.bg}.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/65" />

      {/* Skip */}
      <div className="relative z-10 flex justify-end p-4">
        <button
          onClick={() => setStep(SLIDES.length)}
          className="text-sm text-muted-foreground hover:text-white transition px-3 py-1"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-6">{slide.icon}</div>

        <h2 className="text-3xl font-bold text-white mb-2">{slide.title}</h2>
        <p className="text-primary font-medium mb-4">{slide.subtitle}</p>
        <p className="text-gray-300 text-base leading-relaxed max-w-xs">{slide.body}</p>

        {slide.highlight && (
          <div className={`mt-5 px-4 py-2 rounded-full text-sm font-semibold ${
            slide.isPremiumCallout
              ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
              : 'bg-primary/20 text-primary border border-primary/40'
          }`}>
            {slide.highlight}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="relative z-10 pb-10 px-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all ${
                i === step ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={prev}
              className="flex-none px-5 py-3 rounded-xl border border-border text-white hover:bg-white/10 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition"
          >
            {isLastSlide ? "Let's go" : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
