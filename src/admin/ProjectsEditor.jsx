import { Field, ImageField, ListText, SaveBar, paragraphs, useSection } from './ui';
import { projects as base } from '../content/projects';

export default function ProjectsEditor() {
  const s = useSection('projects');
  const blank = (p) => ({ status: p.status, badge: '', tagline: '', body: [], image: '' });
  const set = (slug, patch) => s.setItems((all) => ({ ...all, [slug]: { ...(all[slug] || blank(base.find((p) => p.slug === slug))), ...patch } }));
  return (
    <>
      <h1>Projects</h1>
      <p className="muted">Change the label people see (for example <em>Few units available</em>), the short description and the main photo of each project.</p>
      {base.map((p) => {
        const x = s.items[p.slug] || { status: p.status, badge: '', tagline: '', body: [], image: '' };
        return (
          <section key={p.slug} className="panel adm-item">
            <header><h2>{p.name}</h2></header>
            <div className="adm-grid">
              <ImageField value={x.image} onChange={(image) => set(p.slug, { image })} label="Main photo" hint="Shown on the project page and project cards." />
              <div className="form">
                <div className="row2">
                  <Field label="Status"><select value={x.status} onChange={(e) => set(p.slug, { status: e.target.value })}><option value="selling">Now selling</option><option value="soon">Coming soon</option><option value="sold">Sold out</option></select></Field>
                  <Field label="Label on the project card" hint="For example: Few units available. Leave empty to use the status."><input maxLength={40} value={x.badge} onChange={(e) => set(p.slug, { badge: e.target.value })} /></Field>
                </div>
                <Field label="Short description under the name"><textarea rows={2} maxLength={300} value={x.tagline} onChange={(e) => set(p.slug, { tagline: e.target.value })} /></Field>
                <Field label="Main text" hint="Leave a blank line between paragraphs."><ListText rows={8} value={x.body} onChange={(body) => set(p.slug, { body })} {...paragraphs} /></Field>
              </div>
            </div>
          </section>
        );
      })}
      <SaveBar s={s} />
    </>
  );
}
