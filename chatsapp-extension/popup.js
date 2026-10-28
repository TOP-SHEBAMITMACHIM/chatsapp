// ChatsApp – החלון הקופץ של התוסף: מתג מצב כהה/בהיר וקרדיט.
// המצב נשמר ב-chrome.storage, ו-bridge.js מעביר אותו לכל לשוניות הצ'אט הפתוחות (וכפתור הירח בדף מעדכן חזרה).
'use strict';
const box = document.getElementById('dark');
document.getElementById('ver').textContent = 'v' + chrome.runtime.getManifest().version;
chrome.storage.local.get('dark', (r) => { box.checked = !!r.dark; });
chrome.storage.onChanged.addListener((ch, area) => { if (area === 'local' && ch.dark) box.checked = !!ch.dark.newValue; });
box.addEventListener('change', () => chrome.storage.local.set({ dark: box.checked }));
