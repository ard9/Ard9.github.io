// Client-side filtering for list pages. Markup contract:
//   chip groups:  <div data-filter="area"> <button class="chip" data-value="">All</button> <button data-value="ops">… </div>
//   items:        <li data-item data-area="ops|llm-agents" data-type="tutorial">
//   empty note:   <p data-empty hidden>
// The current selection is mirrored in the URL (?area=ops&type=note).
export function setupFilters() {
  const groups = [...document.querySelectorAll<HTMLElement>('[data-filter]')];
  const items = [...document.querySelectorAll<HTMLElement>('[data-item]')];
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  if (!groups.length) return;
  const params = new URLSearchParams(location.search);
  const state: Record<string, string> = {};

  function apply() {
    let shown = 0;
    for (const it of items) {
      const ok = Object.entries(state).every(([k, v]) => !v || (it.dataset[k] || '').split('|').includes(v));
      it.hidden = !ok; if (ok) shown++;
    }
    if (empty) empty.hidden = shown > 0;
    for (const g of groups) for (const b of g.querySelectorAll<HTMLButtonElement>('button'))
      b.setAttribute('aria-pressed', String((b.dataset.value || '') === (state[g.dataset.filter!] || '')));
    const url = new URL(location.href);
    for (const [k, v] of Object.entries(state)) v ? url.searchParams.set(k, v) : url.searchParams.delete(k);
    history.replaceState(null, '', url);
  }

  for (const g of groups) {
    const key = g.dataset.filter!;
    const valid = [...g.querySelectorAll<HTMLButtonElement>('button')].map((b) => b.dataset.value || '');
    const fromUrl = params.get(key) || '';
    state[key] = valid.includes(fromUrl) ? fromUrl : '';
    g.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      state[key] = b.dataset.value || ''; apply();
    });
  }
  apply();
}
