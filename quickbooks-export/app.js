/**
 * Tab switching — mirrors p-tabView behavior
 */
function switchTab(tabId) {
  // Deactivate all panels and nav items
  document.querySelectorAll('.p-tabview-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.p-tabview-nav-item').forEach(i => i.classList.remove('active'));

  // Activate selected
  document.getElementById('pane-' + tabId).classList.add('active');
  document.getElementById('tab-' + tabId + '-item').classList.add('active');
}

/**
 * Custom radio button interaction
 */
document.addEventListener('click', function(e) {
  const label = e.target.closest('.p-radiobutton-label');
  if (!label) return;

  const name = label.querySelector('input[type="radio"]').name;

  // Deselect all in the same group
  document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
    const box = input.closest('.p-radiobutton-label').querySelector('.p-radiobutton-box');
    box.classList.remove('checked');
  });

  // Select clicked
  label.querySelector('.p-radiobutton-box').classList.add('checked');
  label.querySelector('input[type="radio"]').checked = true;
});
