# ChatsApp – גוגל צ'אט בעיצוב וואטסאפ

הופך את [Google Chat](https://chat.google.com) למשהו שנראה ומרגיש כמו וואטסאפ. זמין כתוסף לכרום וכסקריפט ל-Tampermonkey.

*Makes Google Chat look like WhatsApp: green/white bubbles, in-bubble time and read ticks, quotes, framed images and voice messages, and the WhatsApp wallpaper.*

## מה יש
- בועות: שלי בירוק, של אחרים בלבן, עם זנב
- שעה ו-VV בתוך הבועה (VV כחולים = נקרא). במרחבים אין VV
- מצב כהה לחלון השיחה (כפתור הירח בסרגל העליון של השיחה, ובתוסף גם מהחלון הקופץ שלו)
- פס עליון ירוק לשיחה, ירוק במקום הכחול של גוגל, תיבת כתיבה בסגנון וואטסאפ (שליחה בעיגול ירוק)
- שמות מרחבים בירוק, והצ'אט הנבחר מסומן בירוק (גם ב-Gmail)
- ציטוטים (תשובה להודעה) בעיצוב של וואטסאפ
- מסגרת ירוקה/לבנה לתמונות, סטיקרים וסרטונים, עם השעה בפינה
- הודעות קוליות בבועה ירוקה/לבנה, עם שעה ו-VV
- רקע הוואטסאפ, "לא נקראו" ו"כותב/ת..." בסגנון וואטסאפ

## התקנה (אחת מהשתיים, לא שתיהן)

**תוסף לכרום**
1. הורידו את קובץ ה-ZIP של התוסף מ-[הגרסה האחרונה](../../releases/latest) וחלצו אותו לתיקייה ("חלץ הכל")
2. היכנסו ל-`chrome://extensions` והדליקו "מצב פיתוח" (Developer mode)
3. "טעינת פריט לא ארוז" (Load unpacked) ← בחרו את התיקייה שחילצתם, זו שיש בתוכה ישר את `manifest.json`. את התיקייה לא מוחקים אחרי זה

**סקריפט ל-Tampermonkey**
עם [Tampermonkey](https://www.tampermonkey.net/) מותקן, לחצו על
[chatsapp.user.js](https://raw.githubusercontent.com/TOP-SHEBAMITMACHIM/chatsapp/main/chatsapp.user.js) ואשרו את ההתקנה. הסקריפט מתעדכן לבד.

## פרטיות
הכל רץ מקומית בדפדפן ומשנה רק את התצוגה. אין שרת, אין איסוף מידע, ואין הרשאות מעבר ל-chat.google.com ו-mail.google.com (שם רק האייקונים שבצד והצ'אט).

## לפתח
את הקוד עורכים רק ב-`chatsapp.user.js`. התוסף נבנה ממנו:

```
node build-extension.js
```

הפקודה מעדכנת את `chatsapp-extension/` (manifest, ‏content.js ואייקונים) ויוצרת את `chatsapp-extension-v<גרסה>.zip` להעלאה ל-Release.

## באגים
גוגל משנים את האתר מדי פעם. אם משהו נשבר, פתחו [Issue](../../issues) עם צילום מסך. בקונסול (F12) אפשר להריץ `waDebug()` ולצרף את הפלט: הוא מכיל רק מספרים, בלי תוכן הודעות.
