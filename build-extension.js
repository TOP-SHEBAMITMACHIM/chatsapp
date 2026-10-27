// בונה את גרסת התוסף של ChatsApp מתוך הסקריפט (chatsapp.user.js), כך ששתי הגרסאות תמיד זהות.
// הרצה: node build-extension.js   →  תיקייה chatsapp-extension/ (לטעינה ב-Chrome)
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SRC = path.join(__dirname, 'chatsapp.user.js');
const OUT = path.join(__dirname, 'chatsapp-extension');

const src = fs.readFileSync(SRC, 'utf8');
const meta = (key) => (src.match(new RegExp('//\\s*@' + key + '\\s+(.+)')) || [])[1].trim();
const version = meta('version');

fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });

// ---- סקריפט התוכן: הסקריפט עצמו (הוא לא תלוי ב-API של Tampermonkey) ----
fs.writeFileSync(path.join(OUT, 'content.js'),
  '// ChatsApp ' + version + ' - נבנה אוטומטית מ-chatsapp.user.js (לא לערוך כאן)\n' + src);

// ---- manifest ----
const manifest = {
  manifest_version: 3,
  name: "ChatsApp – וואטסאפ לגוגל צ'אט",
  short_name: 'ChatsApp',
  version,
  version_name: 'v' + version.replace(/\.0$/, ''),   // 1.0.0 → v1.0
  description: meta('description'),
  minimum_chrome_version: '111',                      // world: MAIN
  icons: { 16: 'icons/icon16.png', 32: 'icons/icon32.png', 48: 'icons/icon48.png', 128: 'icons/icon128.png' },
  content_scripts: [{
    matches: ['https://chat.google.com/*', 'https://mail.google.com/chat/*'],
    js: ['content.js'],
    run_at: 'document_idle',
    // בתוך Gmail הצ'אט נטען ב-iframe של chat.google.com, וכרום מריץ סקריפט תוכן רק בדף הראשי אם לא מבקשים
    // אחרת (Tampermonkey רץ גם ב-iframes, ולכן שם זה עבד)
    all_frames: true,
    // רץ בתוך הדף עצמו (כמו הסקריפט עם @grant none), כך שפקודות האבחון (waDebug וכו') זמינות בקונסול
    world: 'MAIN',
  }],
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// ---- אייקונים: עיגול ירוק עם בועת צ'אט לבנה ו-VV, מצוירים כאן ישירות ל-PNG (בלי ספריות) ----
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function png(size, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}
// מרחק נקודה מקטע (לציור הוי וי כקווים עבים)
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function inTri(px, py, ax, ay, bx, by, cx, cy) {
  const s = (x1, y1, x2, y2, x3, y3) => (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
  const d1 = s(px, py, ax, ay, bx, by), d2 = s(px, py, bx, by, cx, cy), d3 = s(px, py, cx, cy, ax, ay);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}
// הצבע בנקודה (קואורדינטות 0..1)
function shade(x, y) {
  const GREEN = [37, 211, 102], WHITE = [255, 255, 255], TEAL = [0, 128, 105];
  if (Math.hypot(x - 0.5, y - 0.5) > 0.48) return null;                       // מחוץ לעיגול: שקוף
  const inBubble = Math.hypot(x - 0.52, y - 0.47) < 0.28                        // גוף הבועה
    || inTri(x, y, 0.30, 0.60, 0.44, 0.72, 0.22, 0.80);                          // הזנב
  if (!inBubble) return GREEN;
  const w = 0.035;                                                               // עובי הוי וי
  const tick = segDist(x, y, 0.36, 0.48, 0.44, 0.56) < w || segDist(x, y, 0.44, 0.56, 0.58, 0.39) < w
    || segDist(x, y, 0.52, 0.53, 0.55, 0.56) < w || segDist(x, y, 0.55, 0.56, 0.69, 0.39) < w;
  return tick ? TEAL : WHITE;
}
function drawIcon(size) {
  const S = 4, buf = Buffer.alloc(size * size * 4);                            // 4x4 דגימות לפיקסל = קצוות חלקים
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
      const c = shade((x + (sx + 0.5) / S) / size, (y + (sy + 0.5) / S) / size);
      if (c) { r += c[0]; g += c[1]; b += c[2]; a++; }
    }
    const i = (y * size + x) * 4;
    if (a) { buf[i] = r / a; buf[i + 1] = g / a; buf[i + 2] = b / a; buf[i + 3] = Math.round(255 * a / (S * S)); }
  }
  return png(size, buf);
}
for (const s of [16, 32, 48, 128]) fs.writeFileSync(path.join(OUT, 'icons', 'icon' + s + '.png'), drawIcon(s));

// ---- ZIP להפצה ----
// נבנה כאן ולא ב-Compress-Archive של PowerShell: שם הנתיבים בתוך ה-ZIP נכתבים עם \ (לא תקני), וכל הקבצים
// בתוך תיקייה נוספת - אחרי חילוץ בוחרים את התיקייה החיצונית וכרום אומר שאין manifest. כאן manifest.json
// נמצא ישר בשורש ה-ZIP, והנתיבים עם /.
function zip(files) {
  const local = [], central = [];
  let offset = 0;
  const dosTime = 0, dosDate = (2026 - 1980) << 9 | 1 << 5 | 1;
  for (const [name, data] of files) {
    const nameBuf = Buffer.from(name, 'utf8'), comp = zlib.deflateRawSync(data), crc = crc32(data);
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8);
    h.writeUInt16LE(dosTime, 10); h.writeUInt16LE(dosDate, 12); h.writeUInt32LE(crc, 14);
    h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(nameBuf.length, 26); h.writeUInt16LE(0, 28);
    local.push(h, nameBuf, comp);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10);
    c.writeUInt16LE(dosTime, 12); c.writeUInt16LE(dosDate, 14); c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20);
    c.writeUInt32LE(data.length, 24); c.writeUInt16LE(nameBuf.length, 28); c.writeUInt32LE(offset, 42);
    central.push(c, nameBuf);
    offset += 30 + nameBuf.length + comp.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, cd, end]);
}
const zipFiles = ['manifest.json', 'content.js', 'icons/icon16.png', 'icons/icon32.png', 'icons/icon48.png', 'icons/icon128.png']
  .map((f) => [f, fs.readFileSync(path.join(OUT, ...f.split('/')))]);
const ZIP = path.join(__dirname, 'chatsapp-extension-v' + version + '.zip');
fs.writeFileSync(ZIP, zip(zipFiles));

console.log('ChatsApp ' + version + ' → ' + OUT + '\n                → ' + ZIP);
