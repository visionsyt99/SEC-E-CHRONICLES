const firebaseConfig = {
  apiKey: "AIzaSyD1xxmJivDtrfR9cuVs0QOaujMd0OViFjo",
  authDomain: "e-chronicles.firebaseapp.com",
  projectId: "e-chronicles",
  storageBucket: "e-chronicles.firebasestorage.app",
  messagingSenderId: "486633435395",
  appId: "1:486633435395:web:f40211b7d6966c7cfdb936"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const KEYS_TO_SYNC = [
  "ec_achievements","ec_birthdays","ec_countdown","ec_drive_folder",
  "ec_drive_script_url","ec_events","ec_gallery","ec_hidden_days",
  "ec_member_photos","ec_memories","ec_notices","ec_resources",
  "ec_schedule","ec_schedule_admin"
];

const _set = localStorage.setItem.bind(localStorage);

async function pushKeyToFirebase(key, value) {
  try {
    await db.collection("site-data").doc("main").set({ [key]: value }, { merge: true });
    console.log(`[Bridge] ✅ Saved "${key}" to Firebase`);
  } catch(e) {
    console.warn(`[Bridge] ❌ Failed to save "${key}":`, e);
  }
}

async function pullFromFirebase() {
  try {
    const snap = await db.collection("site-data").doc("main").get();
    if (snap.exists) {
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
  } catch(e) {
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
