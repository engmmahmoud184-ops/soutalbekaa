// انسخ إعدادات تطبيق الويب من Firebase Console وضعها هنا.
// سيعمل الموقع ببيانات تجريبية تلقائياً إلى أن يتم إدخال القيم الحقيقية.
export const firebaseConfig = {
  apiKey: "AIzaSyA85EkH87Fu8MwuqlSZoyq-vlLI4jmJg08",
  authDomain: "soutalbekaa.firebaseapp.com",
  projectId: "soutalbekaa",
  storageBucket: "soutalbekaa.firebasestorage.app",
  messagingSenderId: "1096442938869",
  appId: "1:1096442938869:web:101158744bd1f5238d4cbc"
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(value => value.includes("YOUR_"));
