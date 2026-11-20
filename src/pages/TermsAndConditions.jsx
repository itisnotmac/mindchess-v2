import { useRoomBackground } from '../hooks/useRoomBackground';

const EFFECTIVE_DATE = 'November 20, 2025';
const CONTACT_EMAIL = 'mindchessgame@gmail.com';
const APP_NAME = 'Mind Chess';
const APP_ID = 'io.mindchess.app';
const WEBSITE = 'mindchess.study';

export default function TermsAndConditions() {
  useRoomBackground('room-hall-of-records');

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Terms &amp; Conditions</h1>
          <p className="text-white/60 text-sm">Effective: {EFFECTIVE_DATE}</p>
        </div>

        {/* Content card */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 space-y-6 text-white/85 text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using {APP_NAME} ({APP_ID}), you agree to be bound by
              these Terms &amp; Conditions. If you do not agree with any part of these terms, please
              do not use the app.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. Use of the App</h2>
            <p className="mb-2">
              {APP_NAME} is a chess learning and training application intended for personal,
              non-commercial use. You agree to use the app only for lawful purposes and in
              accordance with these Terms.
            </p>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-white/75">
              <li>Reverse-engineer, decompile, or disassemble the app</li>
              <li>Attempt to extract or misuse any proprietary content</li>
              <li>Use the app in any way that could damage or impair its functionality</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. Premium Features &amp; In-App Purchases</h2>
            <p className="mb-2">
              {APP_NAME} offers optional premium features available through a one-time in-app
              purchase. All purchases are processed securely through Google Play.
            </p>
            <p className="mb-2">
              <strong className="text-white">All sales are final.</strong> Due to the digital nature
              of the content, we do not offer refunds for completed purchases except where required
              by applicable law.
            </p>
            <p>
              If you experience a technical issue with a purchase, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-300 underline">
                {CONTACT_EMAIL}
              </a>{' '}
              and we will work to resolve it.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. Intellectual Property</h2>
            <p className="mb-2">
              All content within {APP_NAME} — including but not limited to chess puzzles, lessons,
              graphics, icons, and app design — is owned by or licensed to the developer and is
              protected by copyright and intellectual property law.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable license to use the app for
              personal purposes. No content may be reproduced, distributed, or used commercially
              without prior written permission.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">5. Disclaimer of Warranties</h2>
            <p>
              {APP_NAME} is provided "as is" and "as available" without warranties of any kind,
              either express or implied. We do not warrant that the app will be uninterrupted,
              error-free, or free of viruses or other harmful components. Your use of the app is
              at your sole risk.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, the developer of {APP_NAME} shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages
              arising from your use of or inability to use the app, even if we have been advised
              of the possibility of such damages.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">7. Children</h2>
            <p>
              {APP_NAME} is suitable for users of all ages. We do not knowingly collect personal
              information from anyone. All user data is stored locally on your device. See our{' '}
              <a href="/privacy" className="text-amber-300 underline">Privacy Policy</a> for
              more information.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">8. Third-Party Services</h2>
            <p>
              {APP_NAME} is distributed through Google Play. Your use of Google Play is subject to
              Google's own Terms of Service and Privacy Policy. We are not responsible for the
              practices of any third-party platforms.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">9. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the United
              States. Any disputes arising from these Terms or your use of {APP_NAME} shall be
              resolved in the appropriate courts of jurisdiction.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">10. Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions from time to time. We will notify users
              of significant changes by updating the effective date at the top of this page.
              Continued use of the app after changes are posted constitutes your acceptance of
              the revised terms.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-white font-semibold text-base mb-2">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms &amp; Conditions, please contact us at:
            </p>
            <div className="mt-2 p-3 bg-white/10 rounded-lg">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-300 underline">
                {CONTACT_EMAIL}
              </a>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-white/20 text-center text-white/40 text-xs">
            {APP_NAME} · {WEBSITE} · {APP_ID}
          </div>

        </div>
      </div>
    </div>
  );
}
