// src/logs.js

import { apiGet, apiPost } from './api.js';

export async function loadLogs(droneId) {
  return apiGet(`logs/${droneId}`);
}

export async function addLog(droneId, payload) {
  return apiPost(`logs/${droneId}`, payload);
}


import {
    API_BASE, DRONE_ID, jget,
    attachRipples, toast, fmtLocal
} from './main.js';

attachRipples();

const tb = document.getElementById('tb');
const status = document.getElementById('status');
const pageEl = document.getElementById('page');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');

let page = 1;
let perPage = 12;

// แต่ง Celsius เป็น badge ตามช่วง
function tempBadge(n) {
    const safe = Number(n);
    if (!Number.isFinite(safe)) return `<span class="badge">${n}</span>`;
    if (safe < 0) return `<span class="badge" style="background:#EAF6FF;color:#0B2A3A"> ${safe} °C </span>`;
    if (safe < 30) return `<span class="badge" style="background:#E7F7EC;color:#146C2E"> ${safe} °C </span>`;
    if (safe < 40) return `<span class="badge" style="background:#FFF4DA;color:#7A4E00"> ${safe} °C </span>`;
    return `<span class="badge" style="background:#FFECEC;color:#B03333"> ${safe} °C </span>`;
}

function setLoading(on) {
    btnPrev.disabled = on || page === 1;
    btnNext.disabled = on;
}

function fadeIn(el) {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, fill: 'forwards' });
}

async function load() {
    try {
        setLoading(true);
        status.className = 'notice';
        status.textContent = 'Loading…';

        const url = `${API_BASE}/logs/${DRONE_ID}?page=${page}&perPage=${perPage}`;
        const rows = await jget(url);

        tb.innerHTML = '';

        if (!rows || rows.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5" style="color:#5B7485">No logs on this page.</td>`;
            tb.appendChild(tr);
            status.className = 'notice';
            status.textContent = 'No data';
            pageEl.textContent = `Page ${page}`;
            return;
        }

        rows.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${fmtLocal(r.created)}</td>
        <td>${r.country ?? '-'}</td>
        <td>${r.drone_id ?? '-'}</td>
        <td>${r.drone_name ?? '-'}</td>
        <td>${tempBadge(r.celsius)}</td>
      `;
            tb.appendChild(tr);
            fadeIn(tr);
        });

        status.className = 'notice success';
        status.textContent = `Loaded ✓ (${rows.length} rows)`;
        pageEl.textContent = `Page ${page}`;
    } catch (err) {
        status.className = 'notice error';
        status.textContent = `Load failed:\n${err?.message || err}`;
        toast('โหลดรายการไม่สำเร็จ', 'error');
    } finally {
        setLoading(false);
    }
}

btnPrev.onclick = () => {
    if (page > 1) {
        page--;
        load();
    }
};
btnNext.onclick = () => {
    page++;
    load();
};

load();

