// ChatsApp – החלון הקופץ של התוסף: מתג מצב כהה/בהיר וקרדיט.
// המצב נשמר ב-chrome.storage, ו-bridge.js מעביר אותו לכל לשוניות הצ'אט הפתוחות (וכפתור הירח בדף מעדכן חזרה).
'use strict';
const box = document.getElementById('dark');
document.getElementById('ver').textContent = 'v' + chrome.runtime.getManifest().version;
chrome.storage.local.get('dark', (r) => { box.checked = !!r.dark; });
chrome.storage.onChanged.addListener((ch, area) => { if (area === 'local' && ch.dark) box.checked = !!ch.dark.newValue; });
box.addEventListener('change', () => chrome.storage.local.set({ dark: box.checked }));

// גרסה חדשה (background.js בודק בגיטהאב ושומר כאן). בכל פתיחה מבקשים בדיקה טרייה
const upd = document.getElementById('update');
function showUpdate(u) {
  upd.classList.toggle('show', !!u);
  if (!u) return;
  document.getElementById('update-title').textContent = 'יצאה גרסה ' + u.version;
  upd.href = u.url;
}
chrome.storage.local.get('update', (r) => showUpdate(r.update));
chrome.storage.onChanged.addListener((ch, area) => { if (area === 'local' && ch.update) showUpdate(ch.update.newValue); });
chrome.runtime.sendMessage('check-update').catch(() => {});
