import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPublicListings } from '../lib/api';
import { toGhs } from '../lib/format';
import { cities, propertyTypes } from '../config';
import { t } from '../lib/text';
import ListingCard from '../components/ListingCard';

export default function Properties() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => { getPublicListings().then(setAll).catch(() => setError(true)); }, []);

  const g = (k) => params.get(k) || '';
  const set = (k) => (e) => {
    const next = new URLSearchParams(params);
    e.target.value ? next.set(k, e.target.value) : next.delete(k);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    if (!all) return [];
    const q = g('q').toLowerCase();
    const list = all.filter((l) =>
      (!q || `${l.title} ${l.location} ${l.city}`.toLowerCase().includes(q)) &&
      (!g('city') || l.city === g('city')) &&
      (!g('type') || l.property_type === g('type')) &&
      (!g('listing_type') || l.listing_type === g('listing_type')) &&
      (!g('bedrooms') || l.bedrooms === Number(g('bedrooms'))) &&
      (!g('beds') || (l.bedrooms ?? 0) >= Number(g('beds'))) &&
      (!g('max') || toGhs(l) <= Number(g('max')))
    );
    const s = g('sort');
    return list.sort((a, b) => s === 'low' ? toGhs(a) - toGhs(b) : s === 'high' ? toGhs(b) - toGhs(a) : new Date(b.created_at) - new Date(a.created_at));
  }, [all, params]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container section">
      <h1>{g('bedrooms') ? `${g('bedrooms')} bedroom homes` : t('props.title')}</h1>
      <div className="filters panel">
        <label className="field">{t('props.search')}<input type="search" placeholder={t('props.searchPh')} value={g('q')} onChange={set('q')} /></label>
        <label className="field">{t('props.city')}<select value={g('city')} onChange={set('city')}><option value="">{t('props.all')}</option>{cities.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="field">{t('props.for')}<select value={g('listing_type')} onChange={set('listing_type')}><option value="">{t('props.saleRent')}</option><option value="sale">{t('props.sale')}</option><option value="rent">{t('props.rentOpt')}</option></select></label>
        <label className="field">{t('props.type')}<select value={g('type')} onChange={set('type')}><option value="">{t('props.allTypes')}</option>{Object.keys(propertyTypes).map((k) => <option key={k} value={k}>{t(`type.${k}`)}</option>)}</select></label>
        <label className="field">{t('props.beds')}<select value={g('beds')} onChange={set('beds')}><option value="">{t('props.any')}</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}</select></label>
        <label className="field">{t('props.max')}<input type="number" min="0" step="50000" value={g('max')} onChange={set('max')} /></label>
        <label className="field">{t('props.sort')}<select value={g('sort')} onChange={set('sort')}><option value="">{t('props.newest')}</option><option value="low">{t('props.low')}</option><option value="high">{t('props.high')}</option></select></label>
      </div>

      {error ? <p className="error">{t('props.error')}</p> : all === null ? <p className="muted">{t('loading')}</p> : (
        <>
          <p className="muted count" aria-live="polite">{t('props.found', { n: results.length })}</p>
          {results.length === 0 ? <div className="panel"><h3>{t('props.none.t')}</h3><p className="muted">{t('props.none.d')}</p><button className="btn btn-ghost" onClick={() => setParams({})}>{t('props.clear')}</button></div>
            : <div className="grid">{results.map((l) => <ListingCard key={l.id} listing={l} />)}</div>}
        </>
      )}
    </div>
  );
}
