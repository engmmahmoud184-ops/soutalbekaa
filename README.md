# صوت البقاع

موقع أخبار عربي مبني بـ HTML وCSS وJavaScript ويدعم Firebase.

## ربط Firebase

1. أنشئ مشروعاً من Firebase Console وأضف Web App.
2. فعّل **Authentication > Email/Password** وأنشئ حساب المدير.
3. أنشئ **Cloud Firestore** وفعّل **Storage**.
4. انسخ إعدادات التطبيق إلى `firebase-config.js`.
5. استخدم مجموعة Firestore باسم `articles`.

### قواعد Firestore مقترحة

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && request.auth.uid == 'ECiZzHnenFgxDMQicR0bgFZRPw03';
    }
    match /articles/{article} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

قبل إدخال إعدادات Firebase، تعمل لوحة الإدارة في وضع تجريبي وتخزن الأخبار داخل المتصفح فقط.

تُضغط الصور تلقائيًا إلى WebP قبل رفعها. انشر محتوى `storage.rules` في تبويب Storage Rules لحصر الرفع بحساب المدير.
