/**
 * premium.js — gate for the Master's Vault one-time purchase.
 *
 * During development / before RevenueCat is wired:
 *   localStorage.setItem('vault_unlocked', 'true')  → simulate purchase
 *   localStorage.removeItem('vault_unlocked')        → simulate free tier
 *
 * Once RevenueCat is integrated this file becomes the single place to swap
 * in the real entitlement check.
 */

const STORAGE_KEY = 'vault_unlocked';

/**
 * Returns true if the user has purchased the Master's Vault.
 */
export function isPremium() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

/**
 * Unlocks premium (called after a successful RevenueCat purchase).
 */
export function unlockPremium() {
  localStorage.setItem(STORAGE_KEY, 'true');
}

/**
 * Revokes premium (for testing or refund handling).
 */
export function revokePremium() {
  localStorage.removeItem(STORAGE_KEY);
}
