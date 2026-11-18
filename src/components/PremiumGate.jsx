import { useNavigate } from 'react-router-dom';
import { isPremium } from '@/lib/premium';
import { Lock } from 'lucide-react';

/**
 * PremiumGate — wraps content that requires the Master's Vault purchase.
 *
 * Usage (overlay — blurs the content and shows a lock):
 *   <PremiumGate feature="game_analyzer" lockStyle="overlay">
 *     <ExpensiveComponent />
 *   </PremiumGate>
 *
 * Usage (block — renders nothing, redirects immediately):
 *   <PremiumGate feature="xyz" lockStyle="block" />
 *
 * Props:
 *   feature    — string identifier (for future analytics)
 *   lockStyle  — "overlay" | "block" (default: "overlay")
 *   children   — content to gate
 */
export default function PremiumGate({ feature, lockStyle = 'overlay', children }) {
  const navigate = useNavigate();

  if (isPremium()) return <>{children}</>;

  if (lockStyle === 'block') {
    // Redirect on render (used in startGame() guards etc.)
    setTimeout(() => navigate('/upgrade'), 0);
    return null;
  }

  // Overlay mode: show blurred content with a centred lock badge
  return (
    <div className="relative w-full h-full">
      {/* Blurred underlying content */}
      <div className="select-none pointer-events-none" style={{ filter: 'blur(4px)', opacity: 0.4 }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
        onClick={() => navigate('/upgrade')}
      >
        <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-5 flex flex-col items-center gap-2 border border-yellow-500/40">
          <Lock className="text-yellow-400 w-8 h-8" />
          <p className="text-white font-semibold text-sm text-center">
            Master's Vault Required
          </p>
          <p className="text-yellow-300 text-xs text-center">
            Tap to unlock all premium features
          </p>
        </div>
      </div>
    </div>
  );
}
