(() => {
  'use strict';
  const deck = document.querySelector('.deck');
  const slides = Array.from(deck?.querySelectorAll('.slide') || []);
  if (!deck || !slides.length) return;
  const storageKey = `jingge-premium:${location.pathname}:v2`;
  const layoutStorageKey = `${storageKey}:layout`;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  let layouts = {};
  try { layouts = JSON.parse(localStorage.getItem(layoutStorageKey) || '{}'); } catch { layouts = {}; }
  if (!layouts || typeof layouts !== 'object' || Array.isArray(layouts)) layouts = {};
  let index = 0;
  let editing = false;
  let startTime = Date.now();
  let touchStart = null;
  let noticeTimer;
  const fields = [];
  slides.forEach((slide, number) => {
    if (!slide.id) slide.id = `s${String(number + 1).padStart(2, '0')}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', '幻灯片');
    slide.setAttribute('aria-label', `${number + 1} / ${slides.length}：${slide.dataset.title || ''}`);
    Array.from(slide.querySelectorAll('[data-editable]')).forEach((field, n) => {
      if (!(field instanceof HTMLElement)) return;
      const key = `${slide.id}:${field.dataset.field || n}`;
      const targets = [];
      if (field.childElementCount) {
        const walker = document.createTreeWalker(field, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
        nodes.forEach((node, part) => {
          const leaf = document.createElement('span');
          leaf.textContent = node.textContent;
          leaf.setAttribute('data-editable', '');
          node.replaceWith(leaf);
          targets.push({ field: leaf, key: `${key}:part-${part}` });
        });
        field.removeAttribute('data-editable');
      } else targets.push({ field, key });
      targets.forEach(target => {
        target.field.dataset.premiumField = target.key;
        if (typeof saved[target.key] === 'string') target.field.textContent = saved[target.key];
        fields.push(target.field);
      });
    });
  });
  const controls = document.createElement('nav');
  controls.className = 'premium-controls';
  controls.setAttribute('aria-label', '演示控制');
  controls.innerHTML = '<button type="button" data-action="prev" aria-label="上一页">←</button><output class="premium-counter" aria-live="polite"></output><button type="button" data-action="next" aria-label="下一页">→</button><button type="button" data-action="speaker" aria-pressed="false">讲者 S</button><button type="button" data-action="edit" aria-pressed="false">编辑 E</button><span class="premium-edit-actions" hidden><button type="button" data-action="layout" aria-expanded="false">版式</button><button type="button" data-action="export">导出修改</button><button type="button" data-action="reset">恢复模板</button></span>';
  document.body.append(controls);
  const layoutPanel = document.createElement('aside');
  layoutPanel.className = 'premium-layout-panel';
  layoutPanel.hidden = true;
  layoutPanel.setAttribute('aria-label', '当前页版式');
  layoutPanel.innerHTML = '<header><strong>当前页版式</strong><button type="button" data-layout-close aria-label="关闭版式面板">关闭</button></header><label>左右留白 <output data-value="padX"></output><input type="range" data-layout="padX" min="4" max="9" step=".5"></label><label>上下留白 <output data-value="padY"></output><input type="range" data-layout="padY" min="3" max="7" step=".5"></label><label>内容间距 <output data-value="gap"></output><input type="range" data-layout="gap" min="1" max="4" step=".2"></label><button type="button" data-layout-reset>恢复本页版式</button><p>仅调整当前页。加大留白后，请检查文字是否放得下。</p>';
  document.body.append(layoutPanel);
  const layoutSpec = {
    padX: { variable: '--p-pad-x', min: 4, max: 9, base: 6 },
    padY: { variable: '--p-pad-y', min: 3, max: 7, base: 4 },
    gap: { variable: '--p-gap', min: 1, max: 4, base: 2.4 }
  };
  function applyLayout(slide) {
    const settings = layouts[slide.id];
    Object.entries(layoutSpec).forEach(([name, spec]) => {
      const value = settings?.[name];
      if (typeof value === 'number' && Number.isFinite(value) && value >= spec.min && value <= spec.max) {
        slide.style.setProperty(spec.variable, `max(${value * 4}px, ${value}cqw)`);
      } else slide.style.removeProperty(spec.variable);
    });
  }
  function updateLayoutPanel() {
    Object.entries(layoutSpec).forEach(([name, spec]) => {
      const raw = layouts[slides[index].id]?.[name];
      const value = typeof raw === 'number' && raw >= spec.min && raw <= spec.max ? raw : spec.base;
      layoutPanel.querySelector(`[data-layout="${name}"]`).value = value;
      layoutPanel.querySelector(`[data-value="${name}"]`).textContent = `${value}`;
    });
  }
  function saveLayouts() {
    try { localStorage.setItem(layoutStorageKey, JSON.stringify(layouts)); } catch { tell('此浏览器无法保存，请使用“导出修改”。'); }
  }
  function showLayout(force) {
    layoutPanel.hidden = typeof force === 'boolean' ? !force : !layoutPanel.hidden;
    controls.querySelector('[data-action="layout"]').setAttribute('aria-expanded', String(!layoutPanel.hidden));
    updateLayoutPanel();
  }
  layoutPanel.addEventListener('input', event => {
    const name = event.target.dataset.layout;
    if (!layoutSpec[name]) return;
    layouts[slides[index].id] = { ...(layouts[slides[index].id] || {}), [name]: Number(event.target.value) };
    applyLayout(slides[index]);
    updateLayoutPanel();
    saveLayouts();
  });
  layoutPanel.querySelector('[data-layout-close]').addEventListener('click', () => showLayout(false));
  layoutPanel.querySelector('[data-layout-reset]').addEventListener('click', () => {
    delete layouts[slides[index].id];
    applyLayout(slides[index]);
    updateLayoutPanel();
    saveLayouts();
  });
  const panel = document.createElement('aside');
  panel.className = 'premium-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', '讲者备注');
  panel.innerHTML = '<header><time>00:00</time><button type="button" data-close aria-label="关闭讲者备注">关闭</button></header><h3>当前页</h3><h2 data-current></h2><h3>讲稿</h3><p data-notes></p><h3>下一页</h3><p data-next></p><button type="button" data-timer>重置计时</button>';
  document.body.append(panel);
  const notice = document.createElement('div');
  notice.className = 'premium-status'; notice.hidden = true; notice.setAttribute('role', 'status');
  document.body.append(notice);
  function tell(message) {
    notice.textContent = message; notice.hidden = false;
    clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { notice.hidden = true; }, 2600);
  }
  function currentTitle(slide) { return slide.querySelector('h1,h2')?.textContent || slide.dataset.title || ''; }
  function updatePresenter() {
    panel.querySelector('[data-current]').textContent = currentTitle(slides[index]);
    panel.querySelector('[data-notes]').textContent = slides[index].querySelector('.notes')?.textContent.trim() || '此页没有备注。';
    panel.querySelector('[data-next]').textContent = slides[index + 1] ? currentTitle(slides[index + 1]) : '演示结束';
  }
  function go(nextIndex, syncHash = true) {
    const previousIndex = index;
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    slides.forEach((slide, n) => {
      slide.hidden = n !== index; slide.classList.toggle('active', n === index);
      slide.setAttribute('aria-hidden', String(n !== index));
      slide.inert = n !== index;
    });
    controls.querySelector('output').textContent = `${index + 1} / ${slides.length}`;
    controls.querySelector('[data-action="prev"]').disabled = index === 0;
    controls.querySelector('[data-action="next"]').disabled = index === slides.length - 1;
    updatePresenter();
    updateLayoutPanel();
    if (syncHash) { try { history.replaceState(null, '', `#${slides[index].id}`); } catch { deck.dataset.hashNavigation = 'unavailable'; } }
    document.dispatchEvent(new CustomEvent('deck:slidechange', { detail: { index, previousIndex, currentSlide: slides[index], previousSlide: slides[previousIndex] } }));
  }
  function showSpeaker(force) {
    panel.hidden = typeof force === 'boolean' ? !force : !panel.hidden;
    controls.querySelector('[data-action="speaker"]').setAttribute('aria-pressed', String(!panel.hidden));
    updatePresenter();
  }
  function edit(force) {
    editing = typeof force === 'boolean' ? force : !editing;
    document.documentElement.classList.toggle('premium-editing', editing);
    fields.forEach(field => { field.contentEditable = editing ? 'plaintext-only' : 'false'; field.spellcheck = false; });
    controls.querySelector('[data-action="edit"]').setAttribute('aria-pressed', String(editing));
    controls.querySelector('.premium-edit-actions').hidden = !editing;
    if (!editing) showLayout(false);
    if (editing) tell('点击文字即可修改；Escape 退出编辑。');
  }
  function exportEdits() {
    const payload = { template: document.body.dataset.premiumTheme, title: document.title, fields: saved, layout: layouts };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `${payload.template}-edits.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  controls.addEventListener('click', event => {
    const action = event.target.closest('button')?.dataset.action;
    if (action === 'prev') go(index - 1);
    if (action === 'next') go(index + 1);
    if (action === 'speaker') showSpeaker();
    if (action === 'edit') edit();
    if (action === 'layout') showLayout();
    if (action === 'export') exportEdits();
    if (action === 'reset') {
      if (!confirm('清除本模板在此浏览器中的文字修改？可先导出修改。')) return;
      try { localStorage.removeItem(storageKey); localStorage.removeItem(layoutStorageKey); } catch { tell('浏览器阻止了保存，请重新打开模板。'); return; }
      location.reload();
    }
  });
  panel.querySelector('[data-close]').addEventListener('click', () => showSpeaker(false));
  panel.querySelector('[data-timer]').addEventListener('click', () => { startTime = Date.now(); });
  deck.addEventListener('input', event => {
    const field = event.target.closest('[data-premium-field]');
    if (!editing || !field) return;
    saved[field.dataset.premiumField] = field.innerText;
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { tell('此浏览器无法保存，请使用“导出修改”。'); }
    updatePresenter();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (editing) edit(false); showSpeaker(false); showLayout(false); return; }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || event.target.closest('input,textarea,select,button,a'))) return;
    if (['ArrowRight','ArrowLeft','PageDown','PageUp',' ','Home','End'].includes(event.key)) event.preventDefault();
    if (['ArrowRight','PageDown',' '].includes(event.key)) go(index + 1);
    if (['ArrowLeft','PageUp'].includes(event.key)) go(index - 1);
    if (event.key === 'Home') go(0);
    if (event.key === 'End') go(slides.length - 1);
    if (event.key.toLowerCase() === 's') showSpeaker();
    if (event.key.toLowerCase() === 'e') edit();
    if (event.key.toLowerCase() === 'r') startTime = Date.now();
  });
  deck.addEventListener('touchstart', event => {
    if (editing) return;
    const touch = event.changedTouches[0]; touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  deck.addEventListener('touchend', event => {
    if (!touchStart || editing) return;
    const touch = event.changedTouches[0]; const dx = touch.clientX - touchStart.x; const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  function fromHash() { const found = slides.findIndex(slide => `#${slide.id}` === location.hash); go(found < 0 ? 0 : found, false); }
  window.addEventListener('hashchange', fromHash);
  setInterval(() => {
    if (panel.hidden) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    panel.querySelector('time').textContent = `${String(Math.floor(elapsed / 60)).padStart(2,'0')}:${String(elapsed % 60).padStart(2,'0')}`;
  }, 1000);
  slides.forEach(slide => {
    slide.hidden = false;
    slide.classList.add('active');
    slide.style.setProperty('--p-slide-display', getComputedStyle(slide).display);
    applyLayout(slide);
  });
  fromHash();
})();
