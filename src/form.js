// src/form.js
import { apiPost } from './api.js';

export async function submitStatus(droneId, data) {
  return apiPost(`status/${droneId}`, data);
}


import {
    API_BASE, jpost, getCfg,
    attachRipples, toast, fmtLocal
} from './main.js';

attachRipples(); // ใส่เอฟเฟกต์ ripple ให้ปุ่มในหน้านี้

const f = document.getElementById('f');
const msg = document.getElementById('msg');
const btn = f.querySelector('button[type="submit"]');
const inputC = f.querySelector('input[name="celsius"]');

// ===== 1) ถ้ายังไม่มี Config ให้พากลับไปโหลดก่อน =====
(function ensureConfig() {
    const cfg = getCfg();
    const ok = cfg && cfg.drone_id && cfg.drone_name && cfg.country;
    if (!ok) {
        msg.className = 'notice';
        msg.textContent = 'ยังไม่มี Config ใน session — กำลังพาไปโหลดก่อน…';
        btn.disabled = true;
        setTimeout(() => (location.href = './index.html'), 800);
    }
})();

// ===== 2) helper ตรวจค่าที่กรอก =====
function parseCelsius(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
}
function validateCelsius(n) {
    // ปรับช่วงตามโจทย์/ความเหมาะสมของอุปกรณ์
    return n >= -50 && n <= 120;
}

// ช่วย UX: validate แบบ realtime
inputC?.addEventListener('input', () => {
    const n = parseCelsius(inputC.value);
    if (!Number.isFinite(n)) {
        inputC.setCustomValidity('กรุณากรอกเป็นตัวเลข');
    } else if (!validateCelsius(n)) {
        inputC.setCustomValidity('ช่วงที่รับได้คือ -50 ถึง 120 °C');
    } else {
        inputC.setCustomValidity('');
    }
});

// ===== 3) submit =====
f.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cfg = getCfg();
    const n = parseCelsius(new FormData(f).get('celsius'));

    // ตรวจความถูกต้อง
    if (!Number.isFinite(n)) {
        msg.className = 'notice error';
        msg.textContent = 'Save failed:\nกรุณากรอกอุณหภูมิเป็นตัวเลข';
        toast('ใส่ค่าเป็นตัวเลขก่อนนะ', 'error');
        inputC.focus();
        return;
    }
    if (!validateCelsius(n)) {
        msg.className = 'notice error';
        msg.textContent = 'Save failed:\nช่วงที่รับได้คือ -50 ถึง 120 °C';
        toast('อุณหภูมิอยู่นอกช่วงที่รับได้', 'error');
        inputC.focus();
        return;
    }

    // กันกดรัว + แจ้งสถานะ
    btn.disabled = true;
    msg.className = 'notice';
    msg.textContent = 'Saving…';

    try {
        // ส่งเฉพาะ 4 ฟิลด์ตามสเปก
        const created = await jpost(`${API_BASE}/logs`, {
            drone_id: cfg.drone_id,
            drone_name: cfg.drone_name,
            country: cfg.country,
            celsius: n
        });

        msg.className = 'notice success';
        msg.textContent = `Saved ✓  at ${fmtLocal(created.created)}`;
        toast('บันทึกสำเร็จ ✓');
        f.reset();
        inputC.focus();
    } catch (err) {
        msg.className = 'notice error';
        msg.textContent = `Save failed:\n${err?.message || err}`;
        toast('บันทึกไม่สำเร็จ', 'error');
    } finally {
        btn.disabled = false;
    }
});

