// Emails the office whenever someone sends an inquiry. Triggered by a Supabase Database Webhook.
// Secrets needed: RESEND_API_KEY, FROM_EMAIL, NOTIFY_EMAIL, WEBHOOK_SECRET (see README).

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { record: q } = await req.json();
  if (!q) return new Response('No record', { status: 400 });

  const html = `
    <h2>New website inquiry</h2>
    <p><strong>${esc(q.name)}</strong></p>
    <p>Phone: ${esc(q.phone) || 'not given'}<br>Email: ${esc(q.email) || 'not given'}</p>
    <p style="white-space:pre-line">${esc(q.message)}</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('FROM_EMAIL'),
      to: [Deno.env.get('NOTIFY_EMAIL')],
      reply_to: q.email || undefined,
      subject: `New inquiry from ${String(q.name).slice(0, 60)}`,
      html,
    }),
  });
  return new Response(res.ok ? 'sent' : await res.text(), { status: res.ok ? 200 : 502 });
});
