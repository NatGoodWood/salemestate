import { Field, SaveBar, useSection } from './ui';

export default function SettingsEditor() {
  const s = useSection('settings');
  const set = (k) => (e) => { const v = e.target.value; s.setItems((all) => ({ ...all, [k]: v })); };
  const x = s.items;
  return (
    <>
      <h1>Contact details</h1>
      <p className="muted">These appear in the website header, footer, contact page and on every WhatsApp and call button.</p>
      <section className="panel form">
        <div className="row2">
          <Field label="Main phone number (also used for WhatsApp chat)"><input value={x.phone} onChange={set('phone')} /></Field>
          <Field label="Second phone number (optional)"><input value={x.phoneAlt} onChange={set('phoneAlt')} /></Field>
        </div>
        <div className="row2">
          <Field label="Office phone (optional)"><input value={x.office} onChange={set('office')} /></Field>
          <Field label="WhatsApp number" hint="International format with no + or spaces. Example: 233547595308"><input inputMode="numeric" value={x.whatsapp} onChange={set('whatsapp')} /></Field>
        </div>
        <Field label="Email address" hint="Visitors’ emails are sent here."><input type="email" value={x.email} onChange={set('email')} /></Field>
        <div className="row2">
          <Field label="Office address"><input value={x.address} onChange={set('address')} /></Field>
          <Field label="P.O. Box (optional)"><input value={x.poBox} onChange={set('poBox')} /></Field>
        </div>
        <Field label="Opening hours"><input value={x.hours} onChange={set('hours')} /></Field>
      </section>
      <SaveBar s={s} />
    </>
  );
}
