(() => {
  const humanize = (key) => String(key).replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
  const clone = value => JSON.parse(JSON.stringify(value));
  const blankLike = value => {
    if (Array.isArray(value)) return value.map(blankLike);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blankLike(v)]));
    if (typeof value === 'number') return 0;
    if (typeof value === 'boolean') return false;
    return '';
  };
  const emptyItem = (section, label) => {
    const key = String(label).toLowerCase();
    if (key === 'projects') return {id:'', title:'', short:'', tags:[], live:'', github:'', screenshots:[], features:[], challenges:[], explanation:''};
    if (key === 'skills') return {cat:'', icon:'code-2', items:[]};
    if (key === 'stats') return {label:'', value:0};
    if (key === 'journey') return {period:'', title:'', text:''};
    if (key === 'services') return ['', '', ''];
    if (key === 'items') return ['', 0];
    return '';
  };
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const toValue = (raw, old) => {
    if (typeof old === 'number') return raw.trim() === '' ? 0 : Number(raw);
    if (typeof old === 'boolean') return raw === 'true';
    if (old === null) return raw === '' ? null : raw;
    return raw;
  };

  document.querySelectorAll('.content-only-form').forEach(form => {
    const section = form.dataset.section;
    const dataNode = document.getElementById(section);
    const root = document.getElementById(`editor-${section}`);
    if (!dataNode || !root) return;
    let data;
    try { data = JSON.parse(dataNode.textContent); } catch { root.textContent = 'Unable to load this content section.'; return; }

    const fieldControl = (value, label, onChange) => {
      const wrap = make('label', 'visual-field');
      wrap.append(make('span', 'visual-field-label', humanize(label)));
      let input;
      if (typeof value === 'boolean') {
        input = make('select', 'visual-input');
        [['true', 'Yes'], ['false', 'No']].forEach(([v, t]) => { const opt = make('option', '', t); opt.value = v; input.append(opt); });
        input.value = String(value);
      } else if ((typeof value === 'string' && (value.length > 90 || value.includes('\n'))) || label === 'explanation' || label === 'intro') {
        input = make('textarea', 'visual-input visual-textarea'); input.rows = 3; input.value = value ?? '';
      } else {
        input = make('input', 'visual-input');
        input.type = typeof value === 'number' ? 'number' : 'text';
        input.value = value ?? '';
        if (typeof value === 'number') input.step = 'any';
      }
      input.addEventListener('input', () => onChange(toValue(input.value, value)));
      input.addEventListener('change', () => onChange(toValue(input.value, value)));
      wrap.append(input);
      return wrap;
    };

    const isSkillTool = v => section === 'skills' && Array.isArray(v) && v.length === 2 && typeof v[0] === 'string' && typeof v[1] === 'number';
    const render = (value, label, setter, depth = 0) => {
      if (isSkillTool(value)) {            // one tool: name + percentage slider
        const row = make('div', 'skill-row');
        const name = make('input', 'visual-input'); name.type = 'text'; name.placeholder = 'Tool name'; name.value = value[0];
        const range = make('input', 'skill-range'); range.type = 'range'; range.min = 0; range.max = 100; range.value = value[1];
        const num = make('input', 'visual-input skill-num'); num.type = 'number'; num.min = 0; num.max = 100; num.value = value[1];
        const pct = make('span', 'skill-pct', '%');
        const setLevel = raw => { const n = Math.max(0, Math.min(100, Number(raw) || 0)); value[1] = n; range.value = n; num.value = n; setter(value); };
        name.addEventListener('input', () => { value[0] = name.value; setter(value); });
        range.addEventListener('input', () => setLevel(range.value));
        num.addEventListener('input', () => setLevel(num.value));
        row.append(name, range, num, pct); return row;
      }
      if (Array.isArray(value)) {
        const group = make('div', `visual-group ${depth === 0 ? 'visual-root-group' : ''}`);
        const head = make('div', 'visual-group-head');
        head.append(make('strong', '', humanize(label)));
        const add = make('button', 'mini-action', section === 'skills' && label === 'items' ? '+ Add tool' : '+ Add item'); add.type = 'button';
        add.addEventListener('click', () => {
          const sample = value.length ? value[value.length - 1] : emptyItem(section, label);
          const fresh = blankLike(sample); if (isSkillTool(fresh)) fresh[1] = 50;
          value.push(fresh); setter(value); redraw();
        });
        head.append(add); group.append(head);
        value.forEach((item, index) => {
          const itemCard = make('div', 'visual-item');
          const itemHead = make('div', 'visual-item-head');
          itemHead.append(make('span', 'visual-item-number', `${section === 'skills' && label === 'items' ? 'Tool' : humanize(label)} ${index + 1}`));
          const remove = make('button', 'mini-action danger-action', 'Remove'); remove.type = 'button';
          remove.addEventListener('click', () => { value.splice(index, 1); setter(value); redraw(); });
          itemHead.append(remove); itemCard.append(itemHead);
          itemCard.append(render(item, `Item ${index + 1}`, next => { value[index] = next; setter(value); }, depth + 1));
          group.append(itemCard);
        });
        return group;
      }
      if (value && typeof value === 'object') {
        const group = make('div', `visual-object ${depth ? '' : 'visual-root-object'}`);
        Object.entries(value).forEach(([key, child]) => {
          group.append(render(child, key, next => { value[key] = next; setter(value); }, depth + 1));
        });
        return group;
      }
      return fieldControl(value, label, setter);
    };

    const redraw = () => {
      root.replaceChildren(render(data, section, next => { data = next; }));
    };
    redraw();
    form.addEventListener('submit', event => {
      const payload = form.querySelector('.content-payload');
      try { payload.value = JSON.stringify(data); }
      catch { event.preventDefault(); alert('Please check the content fields and try again.'); }
    });
  });
})();
