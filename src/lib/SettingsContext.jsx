import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({
  // TTS (existing)
  ttsEnabled: true,
  setTtsEnabled: () => {},
  voiceURI: null,
  setVoiceURI: () => {},
  // Sound effects
  soundEnabled: true,
  setSoundEnabled: () => {},
  // Visual theme: 'dark' | 'light' | 'high-contrast'
  theme: 'dark',
  setTheme: () => {},
  // Colorblind mode: false | 'deuteranopia' | 'protanopia' | 'tritanopia'
  colorblindMode: false,
  setColorblindMode: () => {},
});

export function SettingsProvider({ children }) {
  // ── TTS ────────────────────────────────────────────────────────────────
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    try { return localStorage.getItem('mc_tts') !== 'false'; }
    catch { return true; }
  });

  const [voiceURI, setVoiceURI] = useState(() => {
    try { return localStorage.getItem('mc_voice') || null; }
    catch { return null; }
  });

  // ── Sound effects ──────────────────────────────────────────────────────
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('mc_sound') !== 'false'; }
    catch { return true; }
  });

  // ── Theme ──────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('mc_theme') || 'dark'; }
    catch { return 'dark'; }
  });

  // ── Colorblind mode ────────────────────────────────────────────────────
  const [colorblindMode, setColorblindMode] = useState(() => {
    try { return localStorage.getItem('mc_colorblind') || false; }
    catch { return false; }
  });

  // ── Persist to localStorage ────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('mc_tts', String(ttsEnabled)); } catch {}
  }, [ttsEnabled]);

  useEffect(() => {
    try {
      if (voiceURI) localStorage.setItem('mc_voice', voiceURI);
      else localStorage.removeItem('mc_voice');
    } catch {}
  }, [voiceURI]);

  useEffect(() => {
    try { localStorage.setItem('mc_sound', String(soundEnabled)); } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    try { localStorage.setItem('mc_theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      if (colorblindMode) localStorage.setItem('mc_colorblind', colorblindMode);
      else localStorage.removeItem('mc_colorblind');
    } catch {}
  }, [colorblindMode]);

  // ── Apply theme & colorblind classes to <body> ─────────────────────────
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-high-contrast');
    if (theme === 'light') body.classList.add('theme-light');
    if (theme === 'high-contrast') body.classList.add('theme-high-contrast');
  }, [theme]);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('cb-deuteranopia', 'cb-protanopia', 'cb-tritanopia');
    if (colorblindMode) body.classList.add(`cb-${colorblindMode}`);
  }, [colorblindMode]);

  return (
    <SettingsContext.Provider value={{
      ttsEnabled, setTtsEnabled,
      voiceURI, setVoiceURI,
      soundEnabled, setSoundEnabled,
      theme, setTheme,
      colorblindMode, setColorblindMode,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
