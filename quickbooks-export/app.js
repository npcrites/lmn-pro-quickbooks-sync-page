/**
 * Seed dummy rows
 */
(function() {
  const tbody = document.querySelector('.p-datatable-tbody');
  if (!tbody) return;

  const customers = ['DeCaro', 'Sampletree Landscape', 'Green Thumb Co.', 'Rivera Properties', 'Oakwood Estates', 'Blue Ridge Turf', 'Maplewood HOA', 'Sunridge Commercial', 'Clearwater Homes', 'Pinehurst Gardens'];
  const projectSuffixes = ['Spring Install', 'Annual Maintenance', 'Lawn Renovation', 'Irrigation Repair', 'Landscape Design', 'Snow Removal', 'Tree Trimming', 'Mulch & Edging', 'Hardscape Build', 'Aeration & Seeding'];
  const statuses = ['Estimate In Progress', 'Estimate In Progress', 'Review + Approve', 'Review + Approve', 'Work In Progress', 'Sold', 'Approved', 'Estimate Lost - Price', 'Estimate Lost - No Response', 'Review + Approve'];

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function randItem(arr) { return arr[randInt(0, arr.length - 1)]; }
  function randDate() {
    const d = new Date(2025, randInt(0, 11), randInt(1, 28));
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  }

  for (let i = 0; i < 200; i++) {
    const customer = randItem(customers);
    const project = `${customer};${randInt(2020, 2025)};${randItem(projectSuffixes)}`;
    const status = randItem(statuses);
    const exported = (status === 'Sold' || status === 'Approved') ? 'Yes' : 'No';
    const estId = `EST${randInt(6100000, 9999999)}`;
    const isQueued = status === 'Review + Approve' && Math.random() < 0.15;
    const addBtn = isQueued
      ? `<button class="btn-queued">✓ Queued</button>`
      : `<button class="btn-export">↑ Export to QB</button>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${addBtn}</td>
      <td class="td-id">${estId}</td>
      <td class="td-date">${randDate()}</td>
      <td>${project}</td>
      <td>${customer}</td>
      <td>${status}</td>
      <td class="td-exported">${exported}</td>
      <td><button class="btn-edit">Edit</button></td>
    `;
    tbody.appendChild(tr);
  }
})();

/**
 * Status pill classification
 */
function classifyStatus(text) {
  const t = text.toLowerCase();
  if (t.includes('lost')) return 'lost';
  if (t.includes('sold') || t.includes('approved') || t.includes('complete') || t.includes('contract')) return 'sold';
  return 'pending';
}

document.querySelectorAll('.p-datatable tbody td:nth-child(6)').forEach(td => {
  const text = td.textContent.trim();
  if (!text) return;
  const type = classifyStatus(text);
  td.innerHTML = `<span class="status-pill status-pill--${type}">${text}</span>`;
});

/**
 * Pagination
 */
(function() {
  const tbody = document.querySelector('#estimatePaginator')
    ? document.querySelector('.p-datatable-tbody')
    : null;
  if (!tbody) return;

  const allRows = Array.from(tbody.querySelectorAll('tr'));
  const total = allRows.length;
  let pageSize = 25;
  let currentPage = 0; // 0-indexed

  const rangeEl = document.getElementById('paginatorRange');
  const pageSizeSelect = document.getElementById('pageSizeSelect');
  const btnFirst = document.getElementById('btnFirst');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnLast = document.getElementById('btnLast');

  function totalPages() { return Math.ceil(total / pageSize); }

  function render() {
    const start = currentPage * pageSize;
    const end = Math.min(start + pageSize, total);
    allRows.forEach((row, i) => {
      row.style.display = (i >= start && i < end) ? '' : 'none';
    });
    rangeEl.textContent = `${start + 1} – ${end} of ${total}`;
    btnFirst.disabled = currentPage === 0;
    btnPrev.disabled = currentPage === 0;
    btnNext.disabled = currentPage >= totalPages() - 1;
    btnLast.disabled = currentPage >= totalPages() - 1;
  }

  pageSizeSelect.addEventListener('change', function() {
    pageSize = parseInt(this.value);
    currentPage = 0;
    render();
  });
  btnFirst.addEventListener('click', function() { currentPage = 0; render(); });
  btnPrev.addEventListener('click', function() { if (currentPage > 0) { currentPage--; render(); } });
  btnNext.addEventListener('click', function() { if (currentPage < totalPages() - 1) { currentPage++; render(); } });
  btnLast.addEventListener('click', function() { currentPage = totalPages() - 1; render(); });

  render();
})();

/**
 * Tab switching — mirrors p-tabView behavior
 */
function switchTab(tabId) {
  document.querySelectorAll('.p-tabview-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.p-tabview-nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById('pane-' + tabId).classList.add('active');
  document.getElementById('tab-' + tabId + '-item').classList.add('active');
}

/**
 * Filter chip dropdowns
 */
const dropdown = document.getElementById('filterDropdown');
const dropdownList = document.getElementById('filterDropdownList');
let activeChip = null;

function openDropdown(chip) {
  const options = chip.dataset.options.split(',');
  const current = chip.dataset.value;

  dropdownList.innerHTML = options.map(opt => `
    <li class="filter-dropdown-item ${opt === current ? 'selected' : ''}" data-value="${opt}">${opt}</li>
  `).join('');

  const rect = chip.getBoundingClientRect();
  dropdown.style.top = (rect.bottom + window.scrollY + 4) + 'px';
  dropdown.style.left = (rect.left + window.scrollX) + 'px';
  dropdown.classList.add('open');
  activeChip = chip;
}

function closeDropdown() {
  dropdown.classList.remove('open');
  activeChip = null;
}

/**
 * Export to QB / Cancel Export interactions
 */
(function() {
  function updateQueueBadge(delta) {
    const badge = document.getElementById('queueBadge');
    if (!badge) return;
    const current = parseInt(badge.textContent || '0');
    const next = Math.max(0, current + delta);
    badge.textContent = next;
    badge.style.display = next > 0 ? 'inline-flex' : 'none';
    if (delta > 0) {
      badge.classList.add('badge-bump');
      badge.addEventListener('animationend', () => badge.classList.remove('badge-bump'), { once: true });
    }
  }

  // Init badge from existing queue rows on load
  const initialQueueRows = document.querySelectorAll('#pane-queue .p-datatable-tbody tr');
  if (initialQueueRows.length > 0) {
    const badge = document.getElementById('queueBadge');
    if (badge) {
      badge.textContent = initialQueueRows.length;
      badge.style.display = 'inline-flex';
    }
  }

  document.addEventListener('click', function(e) {
    // ── Export to QB ──
    const exportBtn = e.target.closest('.btn-export');
    if (exportBtn) {
      const row = exportBtn.closest('tr');
      const cells = row.querySelectorAll('td');
      const estId   = cells[1].textContent.trim();
      const date    = cells[2].textContent.trim();
      const project = cells[3].textContent.trim();
      const customer = cells[4].textContent.trim();
      const statusPill = cells[5].querySelector('.status-pill');
      const statusHTML = statusPill ? statusPill.outerHTML : cells[5].textContent.trim();

      // Animate button: flash then morph to Queued
      exportBtn.classList.add('btn-queuing');
      setTimeout(() => {
        exportBtn.classList.remove('btn-export', 'btn-queuing');
        exportBtn.classList.add('btn-queued');
        exportBtn.innerHTML = '✓ Queued';
        exportBtn.dataset.estId = estId;
      }, 200);

      // Add row to queue table
      const queueTbody = document.querySelector('#pane-queue .p-datatable-tbody');
      const tr = document.createElement('tr');
      tr.className = 'queue-row-new';
      tr.dataset.estId = estId;
      tr.innerHTML = `
        <td><button class="btn-cancel-export" data-est-id="${estId}">↩ Cancel Export</button></td>
        <td class="td-id">${estId}</td>
        <td class="td-date">${date}</td>
        <td>${project}</td>
        <td>${customer}</td>
        <td>${statusHTML}</td>
      `;
      queueTbody.insertBefore(tr, queueTbody.firstChild);
      // Remove animation class after it plays
      tr.addEventListener('animationend', () => tr.classList.remove('queue-row-new'), { once: true });

      updateQueueBadge(1);
      return;
    }

    // ── Cancel Export ──
    const cancelBtn = e.target.closest('.btn-cancel-export');
    if (cancelBtn) {
      const estId = cancelBtn.dataset.estId;
      const queueRow = cancelBtn.closest('tr');

      // Animate row out then remove
      queueRow.classList.add('queue-row-exit');
      queueRow.addEventListener('animationend', () => queueRow.remove(), { once: true });

      // Restore estimate table button
      if (estId) {
        document.querySelectorAll('#pane-search .p-datatable-tbody tr').forEach(row => {
          const idCell = row.querySelector('.td-id');
          if (idCell && idCell.textContent.trim() === estId) {
            const btn = row.querySelector('.btn-queued');
            if (btn) {
              btn.classList.remove('btn-queued');
              btn.classList.add('btn-export');
              btn.innerHTML = '↑ Export to QB';
              delete btn.dataset.estId;
            }
          }
        });
      }

      updateQueueBadge(-1);
      return;
    }
  });
})();

document.addEventListener('click', function(e) {
  const chip = e.target.closest('.filter-chip');
  const item = e.target.closest('.filter-dropdown-item');

  if (item && activeChip) {
    // Ripple from click position
    const ripple = document.createElement('span');
    ripple.className = 'filter-ripple';
    const itemRect = item.getBoundingClientRect();
    ripple.style.left = (e.clientX - itemRect.left) + 'px';
    ripple.style.top = (e.clientY - itemRect.top) + 'px';
    item.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    const val = item.dataset.value;
    activeChip.dataset.value = val;
    const chevron = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="2,3 5,7 8,3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    activeChip.querySelector('.filter-chip-value').innerHTML = val + ' ' + chevron;
    setTimeout(closeDropdown, 120);
    return;
  }

  if (chip) {
    if (activeChip === chip) { closeDropdown(); return; }
    openDropdown(chip);
    return;
  }

  closeDropdown();
});
