// src/api.js
export async function apiGet(path) {
  // บังคับให้ path มีสแลชเดียวหน้าสุด แล้วต่อกับ /api
  const clean = String(path || '').replace(/^\/+/, '');
  const url = `/api/${clean}`;           // -> /api/configs/3001
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const clean = String(path || '').replace(/^\/+/, '');
  const url = `/api/${clean}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body ?? {})
  });
  if (!res.ok) throw new Error(`POST ${url} -> ${res.status}`);
  return res.json();
}
