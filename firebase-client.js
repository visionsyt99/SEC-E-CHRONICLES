/* The E Chronicles — Firebase client
 * Firebase Authentication + Cloud Firestore (official compat SDK).
 * Public pages can read siteData; writes require an email listed in config/admins.
 */
(function () {
  'use strict';

  const config = {
    apiKey: "AIzaSyAAwZxBaDCiFNt3R_JsBrpgtielcW34hmY",
    authDomain: "sec-e-chronicles.firebaseapp.com",
    projectId: "sec-e-chronicles",
    storageBucket: "sec-e-chronicles.firebasestorage.app",
    messagingSenderId: "508879828299",
    appId: "1:508879828299:web:975ac704588d065c5824ce"
  };

  if (!window.firebase || !firebase.auth || !firebase.firestore) {
    throw new Error('Firebase App, Auth, and Firestore SDKs must load before firebase-client.js.');
  }

  if (!firebase.apps.length) firebase.initializeApp(config);

  const auth = firebase.auth();
  const db = firebase.firestore();
  const COLLECTION = 'siteData';
  const ADMIN_DOC = db.collection('config').doc('admins');
  const KNOWN_KEYS = [
    'notices', 'resources', 'events', 'achievements', 'memories', 'birthdays',
    'schedule', 'hiddenDays', 'countdown', 'driveScriptUrl', 'driveFolder',
    'memberPhotos', 'gallery'
  ];

  let cache = null;
  let seeded = false;
  let unsubscribe = null;

  async function localFallback() {
    try {
      const response = await fetch('data/ec-data.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Bundled data returned ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('[EC Firebase] Bundled fallback unavailable:', error);
      return {};
    }
  }

  function docsToData(snapshot) {
    const data = {};
    snapshot.forEach(doc => {
      const record = doc.data() || {};
      data[doc.id] = Object.prototype.hasOwnProperty.call(record, 'value') ? record.value : null;
    });
    return data;
  }

  async function isAdmin(user = auth.currentUser) {
    if (!user || !user.email) return false;
    try {
      const snap = await ADMIN_DOC.get();
      if (!snap.exists) return false;
      const emails = snap.data().emails;
      return Array.isArray(emails) && emails.some(email =>
        String(email).trim().toLowerCase() === user.email.trim().toLowerCase()
      );
    } catch (error) {
      console.error('[EC Firebase] Admin verification failed:', error);
      return false;
    }
  }

  async function loadSiteData(force = false) {
    if (cache && !force) return cache;
    const fallback = await localFallback();
    try {
      const snapshot = await db.collection(COLLECTION).get();
      const remote = docsToData(snapshot);
      seeded = !snapshot.empty;
      cache = { ...fallback, ...remote };
    } catch (error) {
      console.error('[EC Firebase] Firestore read failed; using bundled data:', error);
      cache = fallback;
      throwIfNoFallback(error, fallback);
    }
    return cache;
  }

  function throwIfNoFallback(error, fallback) {
    if (!fallback || !Object.keys(fallback).length) throw error;
  }

  function subscribe(callback, onError) {
    if (unsubscribe) unsubscribe();
    unsubscribe = db.collection(COLLECTION).onSnapshot(snapshot => {
      const remote = docsToData(snapshot);
      seeded = !snapshot.empty;
      localFallback().then(fallback => {
        cache = { ...fallback, ...remote };
        window.dispatchEvent(new CustomEvent('ec-data-updated', { detail: { data: cache } }));
        if (typeof callback === 'function') callback(cache);
      });
    }, error => {
      console.error('[EC Firebase] Realtime listener failed:', error);
      window.dispatchEvent(new CustomEvent('ec-data-error', { detail: { error } }));
      if (typeof onError === 'function') onError(error);
    });
    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribe = null;
    };
  }

  async function saveField(key, value) {
    if (!KNOWN_KEYS.includes(key)) throw new Error(`Unknown data field: ${key}`);
    const user = auth.currentUser;
    if (!user) throw new Error('Sign in with your admin account first.');
    if (!(await isAdmin(user))) throw new Error('This account is not authorized as a site admin.');
    await db.collection(COLLECTION).doc(key).set({
      value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    cache = { ...(cache || {}), [key]: value };
    seeded = true;
    window.dispatchEvent(new CustomEvent('ec-data-updated', { detail: { data: cache } }));
    return true;
  }

  async function seed(data) {
    const snapshot = await db.collection(COLLECTION).limit(1).get();
    if (!snapshot.empty) {
      seeded = true;
      return false;
    }
    for (const key of KNOWN_KEYS) {
      if (data[key] !== undefined) await saveField(key, data[key]);
    }
    cache = { ...data };
    seeded = true;
    return true;
  }

  async function checkConnection() {
    const snapshot = await db.collection(COLLECTION).limit(1).get();
    return { projectId: config.projectId, database: '(default)', siteDataHasDocuments: !snapshot.empty };
  }

  async function signIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  async function signOut() { return auth.signOut(); }
  function currentUser() { return auth.currentUser; }
  function onAuthStateChanged(callback) { return auth.onAuthStateChanged(callback); }
  function isSeeded() { return seeded; }

  window.ECFirebase = {
    config, auth, db, KNOWN_KEYS, loadSiteData, subscribe, saveField, seed,
    signIn, signOut, currentUser, onAuthStateChanged, isAdmin, isSeeded, checkConnection
  };
})();
