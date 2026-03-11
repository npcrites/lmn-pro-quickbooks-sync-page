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

document.addEventListener('click', function(e) {
  const chip = e.target.closest('.filter-chip');
  const item = e.target.closest('.filter-dropdown-item');

  if (item && activeChip) {
    const val = item.dataset.value;
    activeChip.dataset.value = val;
    const chevron = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="2,3 5,7 8,3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    activeChip.querySelector('.filter-chip-value').innerHTML = val + ' ' + chevron;
    closeDropdown();
    return;
  }

  if (chip) {
    if (activeChip === chip) { closeDropdown(); return; }
    openDropdown(chip);
    return;
  }

  closeDropdown();
});
