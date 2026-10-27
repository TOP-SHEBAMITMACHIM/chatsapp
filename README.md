# ChatsApp – גוגל צ'אט בעיצוב וואטסאפ

הופך את [Google Chat](https://chat.google.com) למשהו שנראה ומרגיש כמו וואטסאפ. זמין כתוסף לכרום וכסקריפט ל-Tampermonkey.

*Makes Google Chat look like WhatsApp: green/white bubbles, in-bubble time and read ticks, quotes, framed images, the WhatsApp wallpaper and a voice-message speed button.*

## מה יש
- בועות: שלי בירוק, של אחרים בלבן, עם זנב
- שעה ו-VV בתוך הבועה (VV כחולים = נקרא). במרחבים אין VV
- ציטוטים (תשובה להודעה) בעיצוב של וואטסאפ
- מסגרת ירוקה/לבנה לתמונות, סטיקרים וסרטונים, עם השעה בפינה
- רקע הוואטסאפ, "לא נקראו" ו"כותב/ת..." בסגנון וואטסאפ
- כפתור מהירות ליד כל הודעה קולית: 1× / 1.25× / 1.5× / 2×

## התקנה (אחת מהשתיים, לא שתיהן)

**תוסף לכרום**
1. הורידו את `chatsapp-extension-v1.0.zip` מ-[Releases](../../releases/latest) וחלצו אותו
2. היכנסו ל-`chrome://extensions` והדליקו "מצב פיתוח" (Developer mode)
3. "טעינת פריט לא ארוז" (Load unpacked) ← בחרו את התיקייה `chatsapp-extension`

**סקריפט ל-Tampermonkey**
עם [Tampermonkey](https://www.tampermonkey.net/) מותקן, לחצו על
[chatsapp.user.js](https://raw.githubusercontent.com/TOP-SHEBAMITMACHIM/chatsapp/main/chatsapp.user.js) ואשרו את ההתקנה. הסקריפט מתעדכן לבד.

## פרטיות
הכל רץ מקומית בדפדפן ומשנה רק את התצוגה. אין שרת, אין איסוף מידע, ואין הרשאות מעבר ל-chat.google.com.

## לפתח
את הקוד עורכים רק ב-`chatsapp.user.js`. התוסף נבנה ממנו:

```
node build-extension.js
```

הפקודה מעדכנת את `chatsapp-extension/` (manifest, ‏content.js ואייקונים).

## באגים
גוגל משנים את האתר מדי פעם. אם משהו נשבר, פתחו [Issue](../../issues) עם צילום מסך. בקונסול (F12) אפשר להריץ `waDebug()` ולצרף את הפלט: הוא מכיל רק מספרים, בלי תוכן הודעות.
