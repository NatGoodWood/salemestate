import { Link } from 'react-router-dom';
import { faqs } from '../content/faq';
import { t } from '../lib/text';

export default function FAQ() {
  return (
    <div className="container narrow-lg section">
      <h1>{t('nav.faq')}</h1>
      <div className="faq">
        {faqs.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
      <p>Still have a question? <Link to="/contact">{t('nav.contact')}</Link></p>
    </div>
  );
}
