// Department tabs (Women / Men) over a product grid — WAI-ARIA tabs with automatic activation.
// Without JS both panels simply show one after the other; mounting turns them into tabs.
// "View all" follows the active department.

export function mount(root) {
  const tablist = root.querySelector('[data-tablist]');
  if (!tablist) return;

  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  const viewAll = root.querySelector('[data-view-all]');

  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (viewAll) viewAll.href = tabs[index].dataset.href;
    if (focus) tabs[index].focus();
    // A panel that was hidden has no layout yet — let the scroll effects re-measure.
    document.dispatchEvent(new CustomEvent('motion:refresh'));
  }

  function onClick(event) {
    const index = tabs.indexOf(event.target.closest('[role="tab"]'));
    if (index >= 0) select(index);
  }

  // Arrow keys move between tabs; in RTL "next" is to the left.
  function onKeydown(event) {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    const rtl = getComputedStyle(root).direction === 'rtl';
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    let next;
    if (step) next = (current + step + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  }

  tablist.hidden = false;
  select(0);
  tablist.addEventListener('click', onClick);
  tablist.addEventListener('keydown', onKeydown);

  return () => {
    tablist.removeEventListener('click', onClick);
    tablist.removeEventListener('keydown', onKeydown);
  };
}
