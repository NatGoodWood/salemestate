// Talks to the admin server. The custom header proves the request comes from this website, not another site.
export async function api(path, { method = 'GET', json, form } = {}) {
  const opts = { method, credentials: 'same-origin', headers: { 'X-Requested-With': 'fetch' } };
  if (json !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(json); }
  if (form) opts.body = form;
  const r = await fetch(path, opts);
  let data = null;
  try { data = await r.json(); } catch { /* not JSON */ }
  if (!r.ok) throw Object.assign(new Error(data?.error || 'Something went wrong. Please try again.'), { status: r.status });
  return data;
}

export function uploadImage(file) {
  if (file.size > 15 * 1024 * 1024) return Promise.reject(new Error(`${file.name} is larger than 15 MB. Please choose a smaller photo.`));
  const form = new FormData();
  form.append('file', file);
  return api('/api/admin/upload', { method: 'POST', form });
}
