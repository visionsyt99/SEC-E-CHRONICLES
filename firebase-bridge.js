// ============================================
// FIREBASE BRIDGE
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1xxmJivDtrfR9cuVs0QOaujMd0OViFjo",
  authDomain: "e-chronicles.firebaseapp.com",
  projectId: "e-chronicles",
  storageBucket: "e-chronicles.firebasestorage.app",
  messagingSenderId: "486633435395",
  appId: "1:486633435395:web:f40211b7d6966c7cfdb936"
};

// ✏️ LIST EVERY localStorage key your site uses
// Example: ["products", "settings", "gallery", "posts"]
const KEYS_TO_SYNC = [
  "ec_achievements",
  "ec_birthdays",
  "ec_countdown",
  "ec_drive_folder",
  "ec_drive_script_url",
  "ec_events",
  "ec_gallery",
  "ec_hidden_days",
  "ec_member_photos",
  "ec_memories",
  "ec_notices",
  "ec_resources",
  "ec_schedule",
  "ec_schedule_admin"
];

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const DOC_PATH = "site-data/main";

const _set = localStorage.setItem.bind(localStorage);
const _get = localStorage.getItem.bind(localStorage);

async function pushKeyToFirebase(key, value) {
  try {
    const [col, docId] = DOC_PATH.split("/");
    const ref = doc(db, col, docId);
    await setDoc(ref, { [key]: value }, { merge: true });
    console.log(`[Bridge] ✅ Saved "${key}" to Firebase`);
  } catch (e) {
    console.warn(`[Bridge] ❌ Failed to save "${key}":`, e);
  }
}

async function pullFromFirebase() {
  try {
    const [col, docId] = DOC_PATH.split("/");
    const snap = await getDoc(doc(db, col, docId));
    if (snap.exists()) {
      const data = snap.data();
      KEYS_TO_SYNC.forEach(key => {
        if (data[key] !== undefined) {
          _set(key, data[key]);
          console.log(`[Bridge] ⬇️ Loaded "${key}" from Firebase`);
        }
      });
    } else {
      console.log("[Bridge] No Firebase data yet — using local data");
    }
  } catch (e) {
    console.warn("[Bridge] ❌ Pull failed:", e);
  }
}

localStorage.setItem = function(key, value) {
  _set(key, value);
  if (KEYS_TO_SYNC.includes(key)) {
    pushKeyToFirebase(key, value);
  }
};

pullFromFirebase().then(() => {
  console.log("[Bridge] 🔥 Firebase sync ready");
  window.dispatchEvent(new Event("firebase-ready"));
});