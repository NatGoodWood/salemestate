import { company, tel } from '../config';
import { t } from '../lib/text';
import InquiryForm from '../components/InquiryForm';

export default function Contact() {
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;
  return (
    <div className="container section">
      <h1>{t('nav.contact')}</h1>
      <div className="split-contact">
        <div>
          <p className="lead dark">{t('contact.lead')}</p>
          <p><strong>{t('contact.office')}</strong><br />{company.address}<br />{company.poBox}<br /><a href={map} target="_blank" rel="noopener noreferrer">Get directions</a></p>
          <p><strong>{t('contact.hours')}</strong><br />{company.hours}</p>
          <p><strong>{t('contact.phone')}</strong><br /><a href={`tel:${tel(company.phone)}`}>{company.phone}</a> (WhatsApp)<br /><a href={`tel:${tel(company.phoneAlt)}`}>{company.phoneAlt}</a><br />Office: <a href={`tel:${tel(company.office)}`}>{company.office}</a></p>
          <p><strong>{t('contact.email')}</strong><br /><a href={`mailto:${company.email}`}>{company.email}</a></p>
          <a className="btn btn-gold" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer">{t('detail.whatsapp')}</a>
        </div>
        <InquiryForm heading={t('form.heading.message')} />
      </div>
    </div>
  );
}
