import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Crown, Brain, Swords, Microscope, Check, RotateCcw } from 'lucide-react';
import { isPremium, purchasePremium, restorePurchases } from '@/lib/premium';

const FEATURES = [
  {
    icon: Swords,
    title: 'Top 3 AI Difficulties',
    desc: 'Getting Serious, Brick Top, and Final Boss — the AI opponents that will actually push your game.',
  },
  {
    icon: Brain,
    title: 'The Chess God — AI Coach',
    desc: 'Ask anything. Openings, endgames, strategy, game history — your personal coach is always on.',
  },
  {
    icon: Microscope,
    title: 'Game Analyzer',
    desc: 'Deep-dive into any of your saved games. Find the blunders, the missed wins, and the patterns holding you back.',
  },
];

export default function Upgrade() {
  const navigate = useNavigate();
  const [already, setAlready] = useState(isPremium());
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState('');

  async function handlePurchase() {
    setError('');
    setLoading(true);
    try {
      const success = await purchasePremium();
      if (success) {
        setAlready(true);
        navigate(-1);
      }
    } catch {
      setError('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    setError('');
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        setAlready(true);
        navigate(-1);
      } else {
        setError('No previous purchase found for this account.');
      }
    } catch {
      setError('Restore failed. Please try again.');
    } finally {
      setRestoring(false);
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      {/* Hero */}
      <div className="relative flex flex-col items-center pt-10 pb-8 px-6 text-center overflow-hidden">
        {/* Glow behind crown */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl mt-4" />
        </div>

        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/15 border border-yellow-500/40 mb-4">
          <Crown className="w-10 h-10 text-yellow-400" />
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          Master's Vault
        </h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-xs">
          One purchase. Lifetime access. Everything unlocked.
        </p>

        {/* Price badge */}
        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-5xl font-black text-yellow-400">$4.99</span>
          <span className="text-muted-foreground text-sm mb-1">one-time</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">No subscription. No recurring charges. Ever.</p>
      </div>

      {/* Feature list */}
      <div className="flex-1 px-5 pb-4 space-y-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-4 bg-black/30 border border-white/8 rounded-2xl p-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}

        {/* What's always free */}
        <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs font-semibold text-primary mb-2">Always free — no purchase needed:</p>
          <div className="space-y-1">
            {['Play vs AI — Yellow Belt & Tough Guy', 'Tactics Trainer', 'Opening Explorer', 'Endgame Lab', 'Game Library', 'Learning Path'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-8 pt-2 space-y-3">
        {already ? (
          <div className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary/10 border border-primary/30">
            <Crown className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">Master's Vault Unlocked</span>
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={loading || restoring}
            className="w-full py-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black font-black text-base tracking-wide transition-all disabled:opacity-60"
          >
            {loading ? 'Opening Store…' : 'Unlock Master\'s Vault — $4.99'}
          </button>
        )}

        {error && (
          <p className="text-center text-xs text-red-400">{error}</p>
        )}

        {!already && (
          <button
            onClick={handleRestore}
            disabled={loading || restoring}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-muted-foreground text-sm font-medium hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {restoring ? 'Restoring…' : 'Restore Purchase'}
          </button>
        )}

        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-2xl text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
        >
          Maybe later
        </button>

        <p className="text-center text-xs text-muted-foreground px-4">
          Purchase processed securely through the Google Play Store.
          Payment handled by Google — we never see your card details.
        </p>
      </div>
    </div>
  );
}
