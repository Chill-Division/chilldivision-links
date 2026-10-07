// Linktree page: a filter box for the list, and links that follow on from the one above set in a little.
// Without JavaScript the full list shows as it always has.
(() => {
  'use strict';

  const list = document.querySelector('ul.table-view');
  if (!list) {
    return;
  }

  const cells = [...list.querySelectorAll('li.table-view-cell')];

  // A title written as " - Something" belongs to the link above it.
  cells.forEach((cell) => {
    if (/^-\s/.test(cell.textContent.trim())) {
      cell.classList.add('is-related');
    }
  });

  const tools = document.querySelector('.links-tools');
  const input = document.getElementById('links-filter');
  const count = document.getElementById('links-count');
  const empty = document.getElementById('links-empty');
  if (!tools || !input || !count || !empty) {
    return;
  }

  // Each month heading with the links under it.
  const groups = [];
  for (const item of list.children) {
    if (item.classList.contains('table-view-divider') || groups.length === 0) {
      groups.push({ divider: item.classList.contains('table-view-divider') ? item : null, cells: [] });
    }
    if (item.classList.contains('table-view-cell')) {
      groups[groups.length - 1].cells.push(item);
    }
  }

  const textOf = (cell) => {
    const link = cell.querySelector('a');
    return (cell.textContent + ' ' + (link ? link.getAttribute('href') : '')).toLowerCase();
  };
  const haystacks = new Map(cells.map((cell) => [cell, textOf(cell)]));

  const update = () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const group of groups) {
      // A word that matches the month heading ("2024", "march") brings in that whole month.
      const heading = group.divider ? group.divider.textContent.toLowerCase() : '';
      let any = false;
      for (const cell of group.cells) {
        const text = haystacks.get(cell) + ' ' + heading;
        const match = words.every((word) => text.includes(word));
        cell.hidden = !match;
        if (match) {
          any = true;
          shown += 1;
        }
      }
      if (group.divider) {
        group.divider.hidden = !any;
      }
    }
    count.textContent = words.length ? `${shown} of ${cells.length} links` : `${cells.length} links`;
    empty.hidden = shown > 0;
  };

  input.addEventListener('input', update);
  tools.hidden = false;
  update();
})();
