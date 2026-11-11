import { useState } from 'react';
import { submitInquiry } from '../lib/api';
import { t } from '../lib/text';

const slots = Array.from({ length: 16 }, (_, i) => { const m = 9 * 60 + i * 30; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${m % 60 ? '30' : '00'}`; });

export default function InquiryForm({ listing, heading, viewing = false, defaultMessage = '' }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', message: listing ? t('form.prefill', { title: listing.title }) : defaultMessage, website: '', date: '', time: '' });
  const [status, setStatus] = useState({ state: 'idle', error: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    if (f.website) return setStatus({ state: 'done', error: '' }); // honeypot: bots fill hidden fields
    if (!f.phone.trim() && !f.email.trim()) return setStatus({ state: 'idle', error: t('form.err.contact') });
    setStatus({ state: 'sending', error: '' });
    try {
      const visit = f.date ? `\n\nPreferred viewing: ${f.date}${f.time ? ` at ${f.time}` : ''}.` : '';
      await submitInquiry({ ...f, message: f.message + visit, listing_id: listing?.id });
      setStatus({ state: 'done', error: '' });
    } catch {
      setStatus({ state: 'idle', error: t('form.err.fail') });
    }
  }

  if (status.state === 'done') return <div className="panel"><h3>{t('form.done.t')}</h3><p className="muted">{t('form.done.d')}</p></div>;

  return (
    <form className="panel form" onSubmit={onSubmit}>
      <h3>{heading || t('form.heading.listing')}</h3>
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
      <button className="btn btn-primary" disabled={status.state === 'sending'}>{status.state === 'sending' ? t('form.sending') : t('form.send')}</button>
    </form>
  );
}
