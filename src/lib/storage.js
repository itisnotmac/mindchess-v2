/**
 * storage.js — localStorage utility replacing all Base44 entity reads/writes.
 * All user progress lives on-device. No server, no login required.
 */

const KEYS = {
  profile: 'mc_profile',
  unlocked: 'mc_unlocked',
};

// All localStorage keys the app touches — used by deleteAllData()
export const ALL_APP_KEYS = [
  'mc_profile',
  'mc_unlocked',
  'mc_tts',
  'mc_voice',
  'mc_sound',
  'mc_theme',
  'mc_colorblind',
  'vault_unlocked',
];

export const DEFAULT_PROFILE = {
  xp: 0,
  puzzlesSolved: 0,
  lessonsCompleted: [],
};

export const storage = {
  get(key) {
    try {
      const val = localStorage.getItem(KEYS[key]);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  set(key, val) {
    try {
      localStorage.setItem(KEYS[key], JSON.stringify(val));
    } catch {
      // Storage full or unavailable — silent fail
    }
  },

  getProfile() {
    return this.get('profile') ?? { ...DEFAULT_PROFILE };
  },

  saveProfile(profile) {
    this.set('profile', profile);
  },

  isUnlocked() {
    return this.get('unlocked') === true;
  },

  setUnlocked(val = true) {
    this.set('unlocked', val);
  },

  clear() {
    Object.values(KEYS).forEach((k) => {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    });
  },

  /**
   * Wipes every piece of app data from this device.
   * Called from the account deletion / data deletion flow.
   * When Firebase is added, this is also where the server-side
   * delete call will go (delete Firestore doc + Auth account).
   */
  deleteAllData() {
    ALL_APP_KEYS.forEach((k) => {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    });
  },
};
