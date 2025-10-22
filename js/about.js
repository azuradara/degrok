function updateTotalFilteredCount() {
  chrome.storage.local.get(['count-total-filtered'], (result) => {
    const count = result['count-total-filtered'] || 0
    document.getElementById('count-total-filtered').textContent = count
  })
}

document.getElementById('button-reset').addEventListener('click', () => {
  if (confirm('Reset counter? This cannot be undone.')) {
    chrome.storage.local.set({ 'count-total-filtered': 0 }, () => {
      updateTotalFilteredCount()
      chrome.runtime.sendMessage({ type: 'total-counter-reset' })
    })
  }
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes['count-total-filtered']) {
    updateTotalFilteredCount()
  }
})

updateTotalFilteredCount()

