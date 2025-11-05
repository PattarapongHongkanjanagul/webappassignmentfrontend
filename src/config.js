// src/config.js
import { apiGet } from './api.js';
import { attachRipples, toast, setCfg } from './main.js'; // ยังใช้ helper UI จาก main.js ได้
// ถ้า main.js ไม่มี DRONE_ID export ให้ใช้ fallback นี้แทน:
// const DRONE_ID = sessionStorage.getItem('droneId') || import.meta.env.VITE_DRONE_ID || '3001';
import { DRONE_ID } from './main.js';

// ติด ripple ให้ปุ่ม/ลิงก์ในหน้านี้
attachRipples();

// --------- DOM helpers ----------
const $ = (id) => document.getElementById(id);
const statusEl  = $('status');
const idEl      = $('v_id');
const nameEl    = $('v_name');
const lightEl   = $('v_light');
const countryEl = $('v_country');

// ลบ skeleton (ถ้ามีใน HTML จะถูกลบทิ้งตอนโหลดเสร็จ)
function clearSkeleton() {
  document.querySelectorAll('.skel').forEach(s => s.remove());
}

// แสดงค่า light เป็น badge อ่านง่าย
function renderLightBadge(on) {
  lightEl.innerHTML = on
    ? '<span class="badge">ON</span>'
    : '<span class="badge" style="background:#FFEFEF;color:#B03333">OFF</span>';
}

// ========= โหลด Config จาก API และอัปเดต UI =========
async function initConfigPage() {
  try {
    statusEl.className = 'notice';
    statusEl.textContent = 'กำลังโหลด…';

    // ✅ เรียกผ่าน vercel proxy -> ไม่มี // ซ้ำ และไม่ติด CORS
    const cfg = await apiGet(`configs/${DRONE_ID}`);

    idEl.textContent      = cfg?.drone_id  ?? '-';
    nameEl.textContent    = cfg?.drone_name ?? '-';
    renderLightBadge(!!cfg?.light);
    countryEl.textContent = cfg?.country ?? '-';

    setCfg(cfg);       // เก็บไว้ใช้หน้าอื่น (form/logs)
    clearSkeleton();

    statusEl.className = 'notice success';
    statusEl.textContent = 'Loaded ✓';
  } catch (err) {
    statusEl.className = 'notice error';
    statusEl.textContent = `Load failed:\n${err?.message || err}`;
    toast('โหลด Config ไม่สำเร็จ', 'error');
    idEl.textContent = nameEl.textContent = countryEl.textContent = '-';
    renderLightBadge(false);
  }
}

// เริ่มทำงาน
initConfigPage();
