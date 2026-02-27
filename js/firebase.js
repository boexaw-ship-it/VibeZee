// =============================================
// VIBEZEE — Firebase Config (Compat Version)
// =============================================
// cart.html / login.html မှာ CDN scripts တွေ
// ထည့်ထားပြီးသောကြောင့် ဒီ file မှာ
// initializeApp တစ်ကြိမ်သာ လုပ်ပါ

const firebaseConfig = {
  apiKey:            "AIzaSyBNeNP79jp1mr894citf2V5RHN4UQCCWaU",
  authDomain:        "vibezee-845ba.firebaseapp.com",
  projectId:         "vibezee-845ba",
  storageBucket:     "vibezee-845ba.firebasestorage.app",
  messagingSenderId: "456545528983",
  appId:             "1:456545528983:web:8ace5d1c6a49acf68fcdd2"
};

// Already initialized check
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
