// src/config.js
// src/config.js
import { apiGet } from './api.js';

export async function loadConfig(droneId) {
  // ห้ามขึ้นต้น path ด้วย “/” อีก (เรา clean ให้แล้ว)
  return apiGet(`configs/${droneId}`);
}

import {
    API_BASE, DRONE_ID, jget, setCfg,
    attachRipples, toast
} from './main.js';

// ติด ripple ให้ปุ่ม/ลิงก์ในหน้านี้
attachRipples();

// ช่วยเลือก element ง่าย ๆ
const $ = (id) => document.getElementById(id);
const statusEl = $('status');
const idEl = $('v_id');
const nameEl = $('v_name');
const lightEl = $('v_light');
const countryEl = $('v_country');

// ลบ skeleton (ถ้ามีใน HTML จะถูกลบทิ้งตอนโหลดเสร็จ)
function clearSkeleton() {
    document.querySelectorAll('.skel').forEach(s => s.remove());
}

// แสดงค่า light เป็น badge อ่านง่าย
function renderLightBadge(on) {
    if (on) {
        lightEl.innerHTML = '<span class="badge">ON</span>';
    } else {
        lightEl.innerHTML = '<span class="badge" style="background:#FFEFEF;color:#B03333">OFF</span>';
    }
}

// โหลด Config จาก API และอัปเดต UI
async function loadConfig() {
    try {
        statusEl.className = 'notice';
        statusEl.textContent = 'กำลังโหลด…';

        const cfg = await jget(`${API_BASE}/configs/${DRONE_ID}`);

        // ป้องกันค่าหาย: ใส่ fallback เป็น '-' ถ้าไม่มี
        idEl.textContent = cfg?.drone_id ?? '-';
        nameEl.textContent = cfg?.drone_name ?? '-';
        renderLightBadge(!!cfg?.light);
        countryEl.textContent = cfg?.country ?? '-';

        setCfg(cfg);                // เก็บไว้ใช้ในหน้าอื่น (form/logs)
        clearSkeleton();            // ลบแถบ skeleton ถ้ามี
        statusEl.className = 'notice success';
        statusEl.textContent = 'Loaded ✓';
    } catch (err) {
        statusEl.className = 'notice error';
        statusEl.textContent = `Load failed:\n${err?.message || err}`;
        toast('โหลด Config ไม่สำเร็จ', 'error');
        // เคลียร์ค่าให้เห็นชัดว่าไม่มีข้อมูล
        idEl.textContent = nameEl.textContent = countryEl.textContent = '-';
        lightEl.innerHTML = '<span class="badge" style="background:#FFEFEF;color:#B03333">OFF</span>';
    }
}

loadConfig();

