/**
 * PlayConsoleRef — internal reference page for Play Console declarations.
 * Route: /dev/play-console-ref
 * NOT linked from any user-facing nav. For Mac's eyes only during submission.
 */

const APP = {
  name: 'Mind Chess',
  packageId: 'io.mindchess.app',
  website: 'mindchess.study',
  email: 'mindchessgame@gmail.com',
  privacyUrl: 'https://mindchess.study/privacy',
  termsUrl: 'https://mindchess.study/terms',
};

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white border-b border-white/20 pb-2 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value, url, note }) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-white/8 last:border-0">
      <span className="text-white/45 text-sm w-44 shrink-0">{label}</span>
      <span className="text-white text-sm flex-1">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-amber-300 underline break-all">
            {value || url}
          </a>
        ) : (
          <span className="break-all">{value}</span>
        )}
        {note && <span className="block text-white/40 text-xs mt-0.5">{note}</span>}
      </span>
    </div>
  );
}

function Badge({ children, color = 'green' }) {
  const colors = {
    green: 'bg-green-500/20 text-green-300 border-green-500/40',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    red: 'bg-red-500/20 text-red-300 border-red-500/40',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

export default function PlayConsoleRef() {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 pb-24 text-white">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">Play Console Reference</h1>
            <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs px-2 py-0.5 rounded-md font-medium">DEV ONLY</span>
          </div>
          <p className="text-white/40 text-sm">
            All the URLs, answers, and copy you need when filling out Play Console declarations.
            Not linked anywhere in the app.
          </p>
        </div>

        {/* ── App Identity ────────────────────────────────────────────── */}
        <Section title="App Identity">
          <Row label="App name" value={APP.name} />
          <Row label="Package ID" value={APP.packageId} />
          <Row label="Website" value={APP.website} url={`https://${APP.website}`} />
          <Row label="Support email" value={APP.email} url={`mailto:${APP.email}`} />
          <Row label="Privacy Policy URL" url={APP.privacyUrl} note="Must be live before submission" />
          <Row label="Terms & Conditions URL" url={APP.termsUrl} note="Must be live before submission" />
          <Row label="Data deletion URL" url={`${APP.privacyUrl}#data-deletion`}
            note="Google requires a data deletion link. Points to the Data Deletion section of the Privacy Policy. Can also just be the full /privacy URL." />
        </Section>

        {/* ── Data Safety Section ──────────────────────────────────────── */}
        <Section title="Data Safety Declarations">
          <p className="text-white/50 text-xs mb-4">
            Play Console → App content → Data safety. Answer each question exactly as shown.
          </p>

          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-1">Does your app collect or share any of the required user data types?</p>
              <Badge color="yellow">Select: No data collected</Badge>
              <p className="text-white/40 text-xs mt-1">All data lives on-device only (localStorage). Nothing is sent to a server.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-1">Is all of the user data collected by your app encrypted in transit?</p>
              <Badge color="green">Yes</Badge>
              <p className="text-white/40 text-xs mt-1">No data is transmitted, so this is N/A — but answer Yes if forced to choose.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-1">Do you provide a way for users to request that their data is deleted?</p>
              <Badge color="green">Yes</Badge>
              <p className="text-white/40 text-xs mt-1">
                Settings → Delete My Data / Delete Account. Link to: {APP.privacyUrl}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-1">⚠️ After Firebase is added</p>
              <p className="text-white/40 text-xs">
                Once Firebase Auth + Firestore are live, return here and update Data Safety:
                you'll need to declare Account Info (name/email), App Activity (app interactions),
                and App info and performance (crash logs if using Crashlytics).
                Update the Privacy Policy at the same time.
              </p>
            </div>
          </div>
        </Section>

        {/* ── App Content ─────────────────────────────────────────────── */}
        <Section title="App Content Declarations">
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-2">Target age group</p>
              <Badge color="green">Ages 13 and up</Badge>
              <p className="text-white/40 text-xs mt-1">Or select "Everyone" — no adult content, no violence, no ads.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-2">Content rating questionnaire answers</p>
              <div className="space-y-1 text-xs text-white/60">
                <p>• Violence: <span className="text-white">No</span></p>
                <p>• Sexual content: <span className="text-white">No</span></p>
                <p>• Profanity: <span className="text-white">No</span></p>
                <p>• Controlled substances: <span className="text-white">No</span></p>
                <p>• User-generated content: <span className="text-white">No</span></p>
                <p>• Gambling / simulated gambling: <span className="text-white">No</span></p>
                <p>• Social features (chat, friend list): <span className="text-white">No</span></p>
                <p>• Shares location: <span className="text-white">No</span></p>
                <p>• Ads: <span className="text-white">No (not yet — update when you add AdMob)</span></p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-1">In-app purchases</p>
              <Badge color="green">Yes — declare this</Badge>
              <p className="text-white/40 text-xs mt-1">
                One-time premium unlock via Google Play billing. No subscriptions, no consumables.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Permissions ─────────────────────────────────────────────── */}
        <Section title="Permissions Used">
          <div className="bg-white/5 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">INTERNET</span>
              <Badge color="green">Required</Badge>
            </div>
            <p className="text-white/40">Capacitor needs this. The app itself is fully offline — no data is sent.</p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-white/40">
                No camera, microphone, location, contacts, storage, or notifications permissions are used.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Store Listing Copy ───────────────────────────────────────── */}
        <Section title="Store Listing Copy">
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/45 text-xs mb-2">Short description (80 chars max)</p>
              <p className="text-white text-sm font-mono bg-black/30 rounded p-2">
                Train your chess mind with puzzles, openings, and endgame lessons.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/45 text-xs mb-2">Full description</p>
              <p className="text-white text-sm bg-black/30 rounded p-3 leading-relaxed whitespace-pre-line">
{`Mind Chess is a chess training app built for players who want to improve — not just play.

🧩 TACTICS PUZZLES
Sharpen your pattern recognition with curated puzzles. The trainer walks you through multi-move combinations, plays opponent responses automatically, and tracks your solving streak.

📖 OPENINGS LIBRARY
Study the openings that matter. Learn key ideas, common traps, and move-by-move theory for the most popular chess openings.

♟ ENDGAME LAB
Master the fundamentals that decide close games — king and pawn endings, rook endings, and essential theoretical positions.

🎓 LEARNING PATH
Structured lessons for every level, from chess basics to advanced strategy. Work through the curriculum at your own pace.

📊 PLAY VS AI
Practice against a chess engine at adjustable difficulty. Build confidence before you play competitively.

🔓 MIND CHESS PREMIUM
Unlock the full content library with a one-time purchase — no subscription, ever.

All progress is saved locally on your device. No account required.`}
              </p>
            </div>
          </div>
        </Section>

        {/* ── Checklist ───────────────────────────────────────────────── */}
        <Section title="Pre-Launch Checklist">
          <div className="space-y-2 text-sm">
            {[
              { done: true,  text: 'Privacy Policy live at mindchess.study/privacy' },
              { done: true,  text: 'Terms & Conditions live at mindchess.study/terms' },
              { done: true,  text: 'Data deletion option in-app (Settings page)' },
              { done: false, text: 'Firebase hosting live (mindchess.study)' },
              { done: false, text: 'App icon (512×512 PNG, no alpha)' },
              { done: false, text: 'Feature graphic (1024×500 PNG)' },
              { done: false, text: 'Screenshots — phone (min 2, max 8)' },
              { done: false, text: 'Screenshots — 7-inch tablet (optional but recommended)' },
              { done: false, text: 'Remove Base44 favicon from index.html' },
              { done: false, text: 'Remove 7-tap crown dev unlock from Upgrade.jsx' },
              { done: false, text: 'Firebase Auth + Firestore wired in' },
              { done: false, text: 'RevenueCat / Google Play billing wired in' },
              { done: false, text: 'Update Data Safety after Firebase is live' },
            ].map(({ done, text }, i) => (
              <div key={i} className={`flex items-start gap-3 py-1.5 ${done ? 'opacity-50' : ''}`}>
                <span className={`mt-0.5 text-base ${done ? 'text-green-400' : 'text-white/25'}`}>
                  {done ? '✓' : '○'}
                </span>
                <span className={done ? 'line-through text-white/50' : 'text-white'}>{text}</span>
              </div>
            ))}
          </div>
        </Section>

        <p className="text-center text-white/20 text-xs pb-4">
          /dev/play-console-ref · {APP.packageId}
        </p>

      </div>
    </div>
  );
}
