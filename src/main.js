// ============ ENV ============
export const API_BASE = import.meta.env.VITE_API_BASE;
export const DRONE_ID = import.meta.env.VITE_DRONE_ID;

function ensureEnv() {
  if (!API_BASE) throw new Error('VITE_API_BASE is missing');
  if (!DRONE_ID) throw new Error('VITE_DRONE_ID is missing');
}
ensureEnv();

// ============ Fetch helpers ============
export async function jget(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function jpost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ============ Session config helpers ============
export function setCfg(cfg) {
  sessionStorage.setItem('cfg', JSON.stringify(cfg));
}

export function getCfg() {
  try {
    return JSON.parse(sessionStorage.getItem('cfg') || '{}');
  } catch {
    return {};
  }
}

// ============ Micro-interactions ============
// 1) Ripple effect บนปุ่ม
export function attachRipples(root = document) {
  root.querySelectorAll('button, .btn').forEach((btn) => {
    // กันซ้ำ: เคยติดแล้วไม่ต้องติดอีก
    if (btn.__rippleBound) return;
    btn.__rippleBound = true;

    btn.addEventListener('click', (e) => {
      const r = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      r.className = 'ripple';
      r.style.width = r.style.height = size + 'px';
      r.style.left = e.clientX - rect.left - size / 2 + 'px';
      r.style.top = e.clientY - rect.top - size / 2 + 'px';

      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

// 2) Toast แจ้งเตือนสั้น ๆ
export function toast(message, type = 'info') {
  const el = document.createElement('div');
  el.textContent = message;

  el.style.cssText = `
    position: fixed; left: 50%; top: 16px; transform: translateX(-50%);
    background: #fff; color: ${type === 'error' ? '#E23C3C' : '#0B2A3A'};
    border: 1px solid ${type === 'error' ? '#F7D6D6' : '#E3EEF6'};
    box-shadow: 0 10px 30px rgba(20,94,168,.15);
    padding: 10px 14px; border-radius: 12px; font-weight: 700;
    z-index: 1000; opacity: 0; transition: opacity .18s ease, transform .18s ease;
  `;

  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(-6px)';
    setTimeout(() => el.remove(), 200);
  }, 1800);
}

// (ออปชัน) formatter เวลาให้สวยขึ้น
export const fmtLocal = (iso) => new Date(iso).toLocaleString();
