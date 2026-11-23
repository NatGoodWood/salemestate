import { Field, SaveBar, move, uid, useSection } from './ui';

export default function FaqEditor() {
  const s = useSection('faqs');
  const set = (i, patch) => s.setItems((list) => list.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const valid = (l) => (l.some((x) => !x.q.trim() || !x.a.trim()) ? 'Every question needs both a question and an answer.' : '');
  return (
    <>
      <h1>FAQ</h1>
      <p className="muted">The questions and answers shown on the FAQ page.</p>
      {s.items.map((x, i) => (
        <section key={x.id} className="panel adm-item">
          <header>
            <h2>Question {i + 1}</h2>
            <div className="adm-tools">
              <button type="button" onClick={() => s.setItems(move(s.items, i, -1))} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => s.setItems(move(s.items, i, 1))} disabled={i === s.items.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="danger" onClick={() => window.confirm('Delete this question?') && s.setItems(s.items.filter((_, k) => k !== i))}>Delete</button>
            </div>
          </header>
          <div className="form">
            <Field label="Question"><input maxLength={200} value={x.q} onChange={(e) => set(i, { q: e.target.value })} /></Field>
            <Field label="Answer"><textarea rows={3} maxLength={2000} value={x.a} onChange={(e) => set(i, { a: e.target.value })} /></Field>
          </div>
        </section>
      ))}
      <button type="button" className="btn btn-ghost" onClick={() => s.setItems([...s.items, { id: uid('faq'), q: '', a: '' }])} disabled={s.items.length >= 40}>+ Add a question</button>
      <SaveBar s={s} valid={valid} />
    </>
  );
}
