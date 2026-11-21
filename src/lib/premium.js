/**
 * premium.js — Master's Vault purchase gate via RevenueCat.
 *
 * Dev testing (browser console):
 *   localStorage.setItem('vault_unlocked', 'true')   → simulate purchased
 *   localStorage.removeItem('vault_unlocked')         → simulate free tier
 */

import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

const RC_API_KEY = 'goog_gReKIlHmqrMrQcGNqOdXhXeQCco';
const ENTITLEMENT_ID = 'premium';
const STORAGE_KEY = 'vault_unlocked';

let _configured = false;

/**
 * Call once at app startup (inside AuthProvider after user is known).
 * Safe to call multiple times — no-ops after first call.
 */
export async function configureRevenueCat(userId) {
  if (!Capacitor.isNativePlatform()) return; // skip in browser dev
  if (_configured) return;
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
    await Purchases.configure({ apiKey: RC_API_KEY });
    if (userId) {
      await Purchases.logIn({ appUserID: userId });
    }
    _configured = true;
    // Sync entitlement to localStorage so isPremium() works synchronously
    await syncPremiumStatus();
  } catch (err) {
    console.warn('[RC] configure error:', err);
  }
}

/**
 * Fetches current entitlement from RevenueCat and syncs to localStorage.
 */
export async function syncPremiumStatus() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const active = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (active) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('[RC] syncPremiumStatus error:', err);
  }
}

/**
 * Launches the Google Play purchase sheet for Master's Vault.
 * Returns true if purchase succeeded, false if cancelled/failed.
 */
export async function purchasePremium() {
  if (!Capacitor.isNativePlatform()) {
    // Dev fallback — unlock directly in browser
    unlockPremium();
    return true;
  }
  try {
    const { offerings } = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.[0];
    if (!pkg) throw new Error('No package found');

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    const active = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (active) {
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  } catch (err) {
    if (err?.userCancelled) return false;
    console.warn('[RC] purchase error:', err);
    throw err;
  }
}

/**
 * Restores previous purchases (required by Play Store policy).
 * Returns true if premium was restored.
 */
export async function restorePurchases() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const active = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (active) {
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    localStorage.removeItem(STORAGE_KEY);
    return false;
  } catch (err) {
    console.warn('[RC] restore error:', err);
    return false;
  }
}

/** Synchronous check — reads from localStorage (synced at startup). */
export function isPremium() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

/** Direct unlock — used internally after successful purchase. */
export function unlockPremium() {
  localStorage.setItem(STORAGE_KEY, 'true');
}

/** Revoke — for testing or refund handling. */
export function revokePremium() {
  localStorage.removeItem(STORAGE_KEY);
}
