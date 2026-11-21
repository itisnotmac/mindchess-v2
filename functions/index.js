const { onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { auth } = require('firebase-functions/v2');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldPath } = require('firebase-admin/firestore');

initializeApp();

/**
 * Triggered automatically when a Firebase Auth user is deleted
 * (covers both self-deletion via deleteAccount() in the app and
 * admin-initiated deletions from the Firebase Console).
 *
 * Cleans up every Firestore document tied to that uid:
 *   - users/{uid}                        (profile doc)
 *   - usernames/{key}                    (username reservation)
 *   - userPurchases/{uid}/items/*        (purchase records subcollection)
 *   - gameHistory/* where user_id == uid (game records)
 *
 * The client-side deleteAccount() already removes users/{uid} and
 * usernames/{key} before deleting the Auth account, so those deletes
 * here are safe no-ops if they beat us to it.
 */
exports.onUserDeleted = auth.user().onDelete(async (user) => {
  const db = getFirestore();
  const uid = user.uid;
  const batch = db.batch();

  // 1. users/{uid}
  batch.delete(db.doc(`users/${uid}`));

  // 2. usernames — find by uid field (display name may already be gone,
  //    so query instead of guessing the key)
  const usernameSnap = await db.collection('usernames')
    .where('uid', '==', uid)
    .get();
  usernameSnap.forEach(doc => batch.delete(doc.ref));

  // 3. userPurchases/{uid}/items/* — subcollection
  const purchasesSnap = await db
    .collection(`userPurchases/${uid}/items`)
    .get();
  purchasesSnap.forEach(doc => batch.delete(doc.ref));

  // 4. gameHistory records owned by this user
  const historySnap = await db.collection('gameHistory')
    .where('user_id', '==', uid)
    .get();
  historySnap.forEach(doc => batch.delete(doc.ref));

  await batch.commit();

  console.log(`[onUserDeleted] Cleaned up Firestore data for uid=${uid}. ` +
    `Removed: usernames=${usernameSnap.size}, ` +
    `purchases=${purchasesSnap.size}, ` +
    `gameHistory=${historySnap.size}`);
});
