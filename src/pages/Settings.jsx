import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomBackground } from '../hooks/useRoomBackground';
import { useSettings } from '../lib/SettingsContext';
import { storage } from '../lib/storage';
import { Volume2, VolumeX, Sun, Moon, Contrast, Eye, Trash2, AlertTriangle } from 'lucide-react';

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
  const navigate = useNavigate();

  const {
    soundEnabled, setSoundEnabled,
    ttsEnabled, setTtsEnabled,
    theme, setTheme,
    colorblindMode, setColorblindMode,
  } = useSettings();

  // Deletion confirm states
  const [confirmData, setConfirmData] = useState(false);
  const [confirmAccount, setConfirmAccount] = useState(false);

  function handleDeleteData() {
    storage.deleteAllData();
    setConfirmData(false);
    // Navigate home so the app resets visually
    navigate('/');
  }

  function handleDeleteAccount() {
    // Phase 1 (pre-Firebase): wipe local data and show done state.
    // Phase 2 (post-Firebase): also call Firebase Auth deleteUser()
    // and Firestore deleteDoc() here before navigating.
    storage.deleteAllData();
    setConfirmAccount(false);
    navigate('/');
  }

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

        {/* ── Data & Account ────────────────────────────────────────────── */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-5">
          <SectionLabel>Data &amp; Account</SectionLabel>

          {/* Delete local data */}
          <div className="mb-4">
            <SettingRow
              label="Delete My Data"
              description="Wipes all progress, XP, and settings from this device. Cannot be undone."
            >
              {!confirmData ? (
                <button
                  onClick={() => setConfirmData(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/40 text-red-400 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmData(false)}
                    className="px-3 py-2 rounded-xl border border-white/20 text-white/50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteData}
                    className="px-3 py-2 rounded-xl border border-red-500 bg-red-500/20 text-red-300 text-sm font-semibold"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </SettingRow>
          </div>

          {/* Delete account */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle size={15} className="text-orange-400 mt-0.5 shrink-0" />
              <p className="text-white/50 text-xs leading-relaxed">
                Account deletion permanently removes your profile and all data.
                Once Firebase accounts are enabled, this will also delete your
                server-side account.
              </p>
            </div>
            {!confirmAccount ? (
              <button
                onClick={() => setConfirmAccount(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-600/50 text-red-400 text-sm font-medium bg-red-600/10 hover:bg-red-600/20 transition-all"
              >
                <Trash2 size={15} /> Delete Account
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-center text-red-400 text-xs font-semibold">
                  This cannot be undone. Are you sure?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmAccount(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2.5 rounded-xl border border-red-600 bg-red-600/20 text-red-300 text-sm font-semibold"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            )}
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
