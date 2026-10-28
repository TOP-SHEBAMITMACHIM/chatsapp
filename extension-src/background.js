// ChatsApp – בדיקת עדכונים. תוסף שנטען כ"פריט לא ארוז" לא מתעדכן לבד, אז פעם בכמה שעות (ובהפעלת הדפדפן)
// בודקים בגיטהאב מה הגרסה האחרונה. אם יצאה חדשה: תג "NEW" על האייקון, הודעה בחלון הקופץ,
// והתראה של כרום (פעם אחת לכל גרסה) שלחיצה עליה פותחת את דף ההורדה.
'use strict';
const REPO = 'TOP-SHEBAMITMACHIM/chatsapp';
const PAGE = 'https://github.com/' + REPO + '/releases/latest';
const NOTE_ID = 'chatsapp-update';

// "1.10.0" חדשה מ-"1.9.2" (השוואה לפי מספרים, לא לפי טקסט)
function newer(a, b) {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  }
  return false;
}

async function check() {
  try {
    // releases/latest מתעלם מטיוטות ומגרסאות ניסיון, כך שרק גרסה שפורסמה באמת מקפיצה התראה
    const r = await fetch('https://api.github.com/repos/' + REPO + '/releases/latest', { cache: 'no-store' });
    if (!r.ok) return;
    const rel = await r.json();
    const latest = String(rel.tag_name || '').replace(/^v/i, '');
    const mine = chrome.runtime.getManifest().version;
    if (!latest || !newer(latest, mine)) {
      await chrome.action.setBadgeText({ text: '' });
      await chrome.storage.local.remove('update');
      return;
    }
    await chrome.action.setBadgeBackgroundColor({ color: '#00a884' });
    await chrome.action.setBadgeText({ text: 'NEW' });
    await chrome.storage.local.set({ update: { version: latest, url: rel.html_url || PAGE } });
    const { notified } = await chrome.storage.local.get('notified');
    if (notified !== latest) {
      chrome.notifications.create(NOTE_ID, {
        type: 'basic', iconUrl: 'icons/icon128.png',
        title: 'ChatsApp – יצאה גרסה חדשה',
        message: 'גרסה ' + latest + ' זמינה להורדה. לחצו כאן כדי לעבור לדף ההורדה.',
      });
      await chrome.storage.local.set({ notified: latest });
    }
  } catch (e) { /* בלי אינטרנט / גיטהאב לא זמין - ננסה בפעם הבאה */ }
}

const schedule = () => chrome.alarms.create('check', { delayInMinutes: 1, periodInMinutes: 360 });
chrome.runtime.onInstalled.addListener(() => { schedule(); check(); });
chrome.runtime.onStartup.addListener(() => { schedule(); check(); });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === 'check') check(); });
chrome.runtime.onMessage.addListener((m) => { if (m === 'check-update') check(); });   // פתיחת החלון הקופץ
chrome.notifications.onClicked.addListener(async (id) => {
  if (id !== NOTE_ID) return;
  const { update } = await chrome.storage.local.get('update');
  chrome.tabs.create({ url: (update && update.url) || PAGE });
  chrome.notifications.clear(id);
});
