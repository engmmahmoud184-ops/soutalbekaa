// انسخ إعدادات تطبيق الويب من Firebase Console وضعها هنا.
// سيعمل الموقع ببيانات تجريبية تلقائياً إلى أن يتم إدخال القيم الحقيقية.
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(value => value.includes("YOUR_"));
