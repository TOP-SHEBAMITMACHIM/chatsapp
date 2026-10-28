// ChatsApp – גשר בין החלון הקופץ של התוסף לבין הדף.
// content.js רץ בתוך הדף עצמו (world: MAIN) ואין לו גישה ל-chrome.storage. הגשר רץ לצידו בעולם של התוסף
// ומעביר את מצב כהה/בהיר בשני הכיוונים, דרך postMessage.
'use strict';
const post = (on) => window.postMessage({ chatsapp: 'set-dark', on: !!on }, '*');
const get = (f) => { try { chrome.storage.local.get('dark', f); } catch (e) {} };   // אחרי עדכון התוסף ההקשר הישן כבר לא תקף
const set = (on) => { try { chrome.storage.local.set({ dark: !!on }); } catch (e) {} };

get((r) => { if (typeof r.dark === 'boolean') post(r.dark); });
chrome.storage.onChanged.addListener((ch, area) => { if (area === 'local' && ch.dark) post(ch.dark.newValue); });   // המתג בחלון הקופץ
window.addEventListener('message', (e) => {
  const d = e.data;
  if (e.source !== window || !d) return;
  if (d.chatsapp === 'dark-changed') set(d.on);                       // כפתור הירח בדף
  if (d.chatsapp === 'hello') get((r) => {                             // הדף נטען אחרי הגשר
    if (typeof r.dark !== 'boolean') set(d.on);                        // עוד לא נשמר כלום - המצב של הדף קובע
    else if (r.dark !== !!d.on) post(r.dark);
  });
});
