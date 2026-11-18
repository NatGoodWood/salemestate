import { useRef, useState } from 'react';
import { company, emailKey } from '../config';
import { t } from '../lib/text';
import { Chat } from './Icons';

const slots = Array.from({ length: 16 }, (_, i) => { const m = 9 * 60 + i * 30; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${m % 60 ? '30' : '00'}`; });

export default function InquiryForm({ listing, heading, viewing = false, defaultMessage = '', bare = false }) {
  const ref = useRef(null);
  const [f, setF] = useState({ name: '', phone: '', email: '', message: listing ? t('form.prefill', { title: listing.title }) : defaultMessage, website: '', date: '', time: '' });
  const [status, setStatus] = useState({ state: 'idle', error: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const visit = f.date ? `Preferred viewing: ${f.date}${f.time ? ` at ${f.time}` : ''}` : '';
  const summary = () => {
    const lines = [`Name: ${f.name.trim()}`];
    if (f.phone.trim()) lines.push(`Phone: ${f.phone.trim()}`);
    if (f.email.trim()) lines.push(`Email: ${f.email.trim()}`);
    if (listing) lines.push(`Property: ${listing.title}`);
    if (visit) lines.push(visit);
    lines.push('', f.message.trim());
    return lines.join('\n');
  };

  // Opens WhatsApp with the message ready to send.
  function sendWhatsApp() {
    if (!ref.current.reportValidity()) return;
    const text = `Hello ${company.name},\n\n${summary()}`;
    window.open(`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    setStatus({ state: 'whatsapp', error: '' });
  }

  // Sends an email: through the email service if a key is configured, otherwise via the visitor's own email app.
  async function onSubmit(e) {
    e.preventDefault();
    if (f.website) return setStatus({ state: 'sent', error: '' }); // honeypot: bots fill hidden fields
    if (!f.phone.trim() && !f.email.trim()) return setStatus({ state: 'idle', error: t('form.err.contact') });
    const subject = `${listing ? `Enquiry: ${listing.title}` : 'Website enquiry'} from ${f.name.trim()}`;
    if (!emailKey) {
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary())}`;
      return setStatus({ state: 'mailto', error: '' });
    }
    setStatus({ state: 'sending', error: '' });
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: emailKey, subject, from_name: `${company.name} website`, name: f.name.trim(), email: f.email.trim() || undefined, phone: f.phone.trim(), message: summary(), botcheck: '' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error('rejected');
      setStatus({ state: 'sent', error: '' });
    } catch {
      setStatus({ state: 'idle', error: t('form.err.fail') });
    }
  }

  if (status.state === 'sent') return <div className={bare ? '' : 'panel'}><h3>{t('form.done.t')}</h3><p className="muted">{t('form.done.d')}</p></div>;
  if (status.state === 'mailto') return <div className={bare ? '' : 'panel'}><h3>Your email is ready</h3><p className="muted">Your email app should now be open with your message. Press send there to reach us. If nothing opened, write to <a href={`mailto:${company.email}`}>{company.email}</a>.</p></div>;
  if (status.state === 'whatsapp') return <div className={bare ? '' : 'panel'}><h3>Continue on WhatsApp</h3><p className="muted">WhatsApp should now be open with your message. Press send there to reach us. If it did not open, message us on {company.phone}.</p><button className="btn btn-ghost" onClick={() => setStatus({ state: 'idle', error: '' })}>Back to the form</button></div>;

  return (
    <form ref={ref} className={`form${bare ? '' : ' panel'}`} onSubmit={onSubmit}>
      {!bare && <h3>{heading || t('form.heading.listing')}</h3>}
      <label className="field">{t('form.name')}<input required minLength={2} maxLength={100} value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <div className="row2">
        <label className="field">{t('form.phone')}<input type="tel" maxLength={30} value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
        <label className="field">{t('form.email')}<input type="email" maxLength={120} value={f.email} onChange={set('email')} autoComplete="email" /></label>
      </div>
      <label className="field">{t('form.message')}<textarea required minLength={5} maxLength={2000} rows={4} value={f.message} onChange={set('message')} /></label>
      {(listing || viewing) && (
        <fieldset className="viewing">
          <legend>{t('form.viewing')}</legend>
          <div className="row2">
            <label className="field">{t('form.date')}<input type="date" min={new Date().toISOString().slice(0, 10)} value={f.date} onChange={set('date')} /></label>
            <label className="field">{t('form.time')}<select value={f.time} onChange={set('time')}><option value="">{t('form.any')}</option>{slots.map((s) => <option key={s}>{s}</option>)}</select></label>
          </div>
        </fieldset>
      )}
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} name="website" />
      {status.error && <p className="error" role="alert">{status.error}</p>}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={status.state === 'sending'}>{status.state === 'sending' ? t('form.sending') : 'Send by email'}</button>
        <button type="button" className="btn btn-wa" onClick={sendWhatsApp}><Chat /> Send on WhatsApp</button>
      </div>
    </form>
  );
}
