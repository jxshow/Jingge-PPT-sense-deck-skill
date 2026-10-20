export function installEditMode({
  root = document,
  storageKey = `${location.pathname}:jingge-ppt-edits`,
  editableSelector = "[data-editable], h1, h2, h3, p, li, .kicker, .lead, .notes",
  layoutSelector = "[data-layout], .slide, .glass-panel, .bento-card, .metric-card"
} = {}) {
  const state = {
    enabled: false,
    selected: null,
    edits: loadEdits(storageKey)
  };

  assignEditIds(root, editableSelector, layoutSelector);
  applyEdits(root, state.edits);
  const toolbar = createToolbar();
  document.body.append(toolbar);

  document.addEventListener("keydown", (event) => {
    if ((event.target instanceof HTMLElement) && event.target.isContentEditable) return;
    if (event.key.toLowerCase() === "e") toggleEditMode();
  });

  root.addEventListener("click", (event) => {
    if (!state.enabled) return;
    const target = event.target.closest(layoutSelector);
    if (!target) return;
    selectElement(target);
    event.stopPropagation();
  }, true);

  root.addEventListener("input", (event) => {
    if (!state.enabled) return;
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.isContentEditable) return;
    const id = ensureEditId(target);
    state.edits.text[id] = target.innerHTML;
    saveEdits(storageKey, state.edits);
  });

  function toggleEditMode(force) {
    state.enabled = typeof force === "boolean" ? force : !state.enabled;
    document.documentElement.classList.toggle("jingge-editing", state.enabled);
    toolbar.hidden = !state.enabled;
    root.querySelectorAll(editableSelector).forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.closest(".controls, .speaker-panel, .jingge-edit-toolbar")) return;
      node.dataset.editable = node.dataset.editable || "text";
      node.contentEditable = String(state.enabled);
      if (state.enabled) ensureEditId(node);
    });
  }

  function selectElement(element) {
    state.selected?.classList.remove("jingge-edit-selected");
    state.selected = element;
    element.classList.add("jingge-edit-selected");
    toolbar.querySelector("[data-selected]").textContent = element.dataset.role || element.dataset.layout || element.className || element.tagName.toLowerCase();
  }

  function nudgeSelected(dx, dy) {
    if (!state.selected) return;
    const element = state.selected;
    const id = ensureEditId(element);
    const style = getComputedStyle(element);
    const x = Number.parseFloat(element.style.getPropertyValue("--edit-x") || style.getPropertyValue("--edit-x") || "0") + dx;
    const y = Number.parseFloat(element.style.getPropertyValue("--edit-y") || style.getPropertyValue("--edit-y") || "0") + dy;
    element.style.setProperty("--edit-x", `${x}px`);
    element.style.setProperty("--edit-y", `${y}px`);
    element.style.transform = `translate(${x}px, ${y}px)`;
    state.edits.layout[id] = { ...(state.edits.layout[id] || {}), x, y };
    saveEdits(storageKey, state.edits);
  }

  function exportEdits() {
    const blob = new Blob([JSON.stringify(state.edits, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jingge-ppt-edits.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetEdits() {
    localStorage.removeItem(storageKey);
    location.reload();
  }

  function createToolbar() {
    const bar = document.createElement("aside");
    bar.className = "jingge-edit-toolbar";
    bar.hidden = true;
    bar.innerHTML = `
      <strong>EDIT</strong>
      <span data-selected>select a block</span>
      <button type="button" data-action="up">↑</button>
      <button type="button" data-action="down">↓</button>
      <button type="button" data-action="left">←</button>
      <button type="button" data-action="right">→</button>
      <button type="button" data-action="export">JSON</button>
      <button type="button" data-action="reset">Reset</button>
    `;
    bar.addEventListener("click", (event) => {
      const action = event.target?.dataset?.action;
      if (action === "up") nudgeSelected(0, -4);
      if (action === "down") nudgeSelected(0, 4);
      if (action === "left") nudgeSelected(-4, 0);
      if (action === "right") nudgeSelected(4, 0);
      if (action === "export") exportEdits();
      if (action === "reset") resetEdits();
    });
    const style = document.createElement("style");
    style.textContent = `
      .jingge-edit-toolbar{position:fixed;left:18px;top:18px;z-index:9999;display:flex;gap:8px;align-items:center;padding:10px 12px;border:1px solid rgba(255,255,255,.24);border-radius:16px;background:rgba(8,10,16,.72);color:#fff;font:12px system-ui,sans-serif;backdrop-filter:blur(18px);box-shadow:0 18px 50px rgba(0,0,0,.28)}
      .jingge-edit-toolbar[hidden]{display:none}
      .jingge-edit-toolbar button{border:0;border-radius:10px;padding:6px 9px;color:#fff;background:rgba(255,255,255,.13);cursor:pointer}
      .jingge-editing [contenteditable="true"]{outline:1px dashed rgba(112,220,255,.62);outline-offset:3px}
      .jingge-edit-selected{outline:2px solid rgba(255,115,215,.82)!important;outline-offset:5px}
    `;
    bar.append(style);
    return bar;
  }

  return { toggleEditMode, exportEdits, resetEdits };
}

function ensureEditId(element) {
  if (!element.dataset.editId) {
    const slide = element.closest(".slide, section");
    const slideIndex = slide ? Array.from(slide.parentElement.children).indexOf(slide) : 0;
    const siblings = Array.from((slide || document).querySelectorAll("[data-editable], h1, h2, h3, p, li, .kicker, .lead, .notes, [data-layout], .glass-panel, .bento-card, .metric-card"));
    element.dataset.editId = `s${slideIndex}-${siblings.indexOf(element)}-${element.tagName.toLowerCase()}`;
  }
  return element.dataset.editId;
}

function assignEditIds(root, editableSelector, layoutSelector) {
  root.querySelectorAll(`${editableSelector}, ${layoutSelector}`).forEach((element) => {
    if (element instanceof HTMLElement) ensureEditId(element);
  });
}

function loadEdits(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || { text: {}, layout: {} };
  } catch {
    return { text: {}, layout: {} };
  }
}

function saveEdits(storageKey, edits) {
  localStorage.setItem(storageKey, JSON.stringify(edits));
}

function applyEdits(root, edits) {
  root.querySelectorAll("[data-edit-id]").forEach((element) => {
    const id = element.dataset.editId;
    if (edits.text?.[id]) element.innerHTML = edits.text[id];
    const layout = edits.layout?.[id];
    if (layout) {
      element.style.setProperty("--edit-x", `${layout.x || 0}px`);
      element.style.setProperty("--edit-y", `${layout.y || 0}px`);
      element.style.transform = `translate(${layout.x || 0}px, ${layout.y || 0}px)`;
    }
  });
}
