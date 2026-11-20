import { useRoomBackground } from '../hooks/useRoomBackground';
import { useSettings } from '../lib/SettingsContext';
import { Volume2, VolumeX, Sun, Moon, Contrast, Eye } from 'lucide-react';

const THEMES = [
  { value: 'dark',          label: 'Dark',          icon: Moon },
  { value: 'light',         label: 'Light',         icon: Sun },
  { value: 'high-contrast', label: 'High Contrast', icon: Contrast },
];

const COLORBLIND_MODES = [
  { value: false,           label: 'None' },
  { value: 'deuteranopia',  label: 'Deuteranopia',  desc: 'Red-green (green weak)' },
  { value: 'protanopia',    label: 'Protanopia',    desc: 'Red-green (red weak)' },
  { value: 'tritanopia',    label: 'Tritanopia',    desc: 'Blue-yellow' },
];

function SectionLabel({ children }) {
  return (
    <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3 px-1">
      {children}
    </p>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-white text-sm font-medium leading-tight">{label}</p>
        {description && (
          <p className="text-white/45 text-xs mt-0.5 leading-snug">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onToggle, iconOn: IconOn, iconOff: IconOff }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
        enabled
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          : 'bg-white/10 text-white/40 border border-white/15'
      }`}
    >
      {enabled
        ? <>{IconOn && <IconOn size={15} />} On</>
        : <>{IconOff && <IconOff size={15} />} Off</>
      }
    </button>
  );
}

export default function Settings() {
  useRoomBackground('room-settings');

  const {
    soundEnabled, setSoundEnabled,
    ttsEnabled, setTtsEnabled,
    theme, setTheme,
    colorblindMode, setColorblindMode,
  } = useSettings();

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-md mx-auto space-y-6">

        {/* ── Sound ─────────────────────────────────────────────────────── */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-5">
          <SectionLabel>Sound</SectionLabel>

          <div className="divide-y divide-white/10">
            <SettingRow
              label="Sound Effects"
              description="Move sounds, correct/wrong puzzle tones, achievements"
            >
              <Toggle
                enabled={soundEnabled}
                onToggle={() => setSoundEnabled(v => !v)}
                iconOn={Volume2}
                iconOff={VolumeX}
              />
            </SettingRow>

            <SettingRow
              label="Move Narration"
              description="Reads moves aloud (e.g. "e4", "Knight to f3")"
            >
              <Toggle
                enabled={ttsEnabled}
                onToggle={() => setTtsEnabled(v => !v)}
                iconOn={Volume2}
                iconOff={VolumeX}
              />
            </SettingRow>
          </div>
        </div>

        {/* ── Appearance ────────────────────────────────────────────────── */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-5">
          <SectionLabel>Appearance</SectionLabel>

          <p className="text-white/45 text-xs mb-3 px-1">Theme</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                  theme === value
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/5 border-white/15 text-white/50 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Colorblind ─────────────────────────────────────────────── */}
          <p className="text-white/45 text-xs mb-3 px-1 flex items-center gap-1.5">
            <Eye size={12} /> Colorblind Mode
          </p>
          <div className="space-y-2">
            {COLORBLIND_MODES.map(({ value, label, desc }) => (
              <button
                key={String(value)}
                onClick={() => setColorblindMode(value)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  colorblindMode === value
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="font-medium">{label}</span>
                {desc && <span className="text-xs text-white/35">{desc}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Version ───────────────────────────────────────────────────── */}
        <p className="text-center text-white/25 text-xs pb-2">
          Mind Chess · io.mindchess.app
        </p>

      </div>
    </div>
  );
}
