import { useRoomBackground } from '@/hooks/useRoomBackground';
import React from 'react';
import { Shield } from 'lucide-react';

const EFFECTIVE_DATE = 'November 20, 2025';
const CONTACT_EMAIL = 'mindchessgame@gmail.com';
const APP_NAME = 'Mind Chess';
const APP_ID = 'io.mindchess.app';
const WEBSITE = 'mindchess.study';

export default function PrivacyPolicy() {
  useRoomBackground('room-privacy');
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-8 h-8 text-primary teal-text-glow shrink-0" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow">Privacy Policy</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-8">Effective date: {EFFECTIVE_DATE}</p>

      <div className="space-y-8 text-foreground/90 leading-relaxed text-sm">

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">1. Overview</h2>
          <p>
            {APP_NAME} ({APP_ID}) is an offline Android chess training application. We are committed to
            protecting your privacy. This policy explains what data the app collects, where it is stored,
            and how it is used. The short version: almost no data leaves your device, and we do not sell,
            share, or monetize any personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">2. Data We Collect and Where It Lives</h2>
          <p className="mb-3">
            {APP_NAME} stores all user data locally on your device using your device's built-in storage.
            No account, login, or internet connection is required to use the app.
          </p>
          <p className="mb-2 font-medium">Data stored locally on your device includes:</p>
          <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-2">
            <li>Your chess rating (ELO), experience points (XP), and level progress</li>
            <li>Puzzles solved and tactics streak</li>
            <li>Lessons and openings marked as completed</li>
            <li>Game history (moves played against the AI)</li>
            <li>Premium unlock status</li>
            <li>App settings and preferences</li>
          </ul>
          <p className="mt-3">
            This data never leaves your device and is never transmitted to our servers or any third party.
            If you uninstall the app, all locally stored data is permanently deleted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">3. Data We Do Not Collect</h2>
          <p className="mb-2">We do not collect, store, or transmit:</p>
          <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-2">
            <li>Your name, email address, or any contact information</li>
            <li>Device identifiers, advertising IDs, or fingerprints</li>
            <li>Location data</li>
            <li>Camera, microphone, or contacts</li>
            <li>Crash reports or analytics telemetry</li>
            <li>Payment information (purchases are handled entirely by Google Play)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">4. Internet Access</h2>
          <p>
            The app requests no internet permission. All chess logic, AI, puzzles, openings, and
            coaching content runs entirely on-device. There are no outbound network calls of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">5. In-App Purchases</h2>
          <p>
            {APP_NAME} offers an optional premium unlock through Google Play's billing system. All
            payment processing is handled exclusively by Google. We never see, receive, or store your
            payment card details or billing information. Google's own privacy policy governs the
            purchase transaction.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">6. Children's Privacy</h2>
          <p>
            {APP_NAME} does not knowingly collect any personal information from children under the age
            of 13. Because all data is stored locally on the device and no personal information is
            transmitted to us, the app is suitable for use by players of all ages. Parents and guardians
            remain responsible for supervising their children's use of the app and in-app purchases.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">7. Third-Party Services</h2>
          <p>
            The app does not integrate with any third-party analytics, advertising, tracking, or social
            platforms. The only third-party involvement is Google Play for app distribution and optional
            in-app purchase processing, which is governed by Google's own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">8. Data Deletion</h2>
          <p>
            Because we do not hold any of your data on our servers, there is nothing for us to delete on
            your behalf. To remove all app data, simply uninstall {APP_NAME} from your device. All
            locally stored progress, settings, and history will be permanently erased.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">9. Changes to This Policy</h2>
          <p>
            If we update this privacy policy, we will post the revised version at{' '}
            <span className="text-primary font-medium">{WEBSITE}/privacy</span> and update the
            effective date at the top of this page. Continued use of the app after any changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-2">10. Contact Us</h2>
          <p>
            If you have any questions or concerns about this privacy policy, please contact us at{' '}
            <span className="text-primary font-medium">{CONTACT_EMAIL}</span>.
          </p>
        </section>

      </div>

      <p className="text-xs text-muted-foreground mt-10 pt-6 border-t border-border">
        {APP_NAME} · {WEBSITE} · {APP_ID}
      </p>
    </div>
  );
}
