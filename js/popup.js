let isEnabled = true

chrome.storage.local.get(['extension-enabled'], (result) => {
  isEnabled = result['extension-enabled'] !== false
  updateToggleButton()
})

function updateToggleButton() {
  const toggleText = document.getElementById('toggleText')
  toggleText.textContent = isEnabled ? 'Disable' : 'Enable'
}

document.getElementById('toggleButton').addEventListener('click', () => {
  isEnabled = !isEnabled
  chrome.storage.local.set({ 'extension-enabled': isEnabled })
  updateToggleButton()
  
  chrome.runtime.sendMessage({ 
    type: 'toggle-extension', 
    enabled: isEnabled 
  })
})

document.getElementById('aboutButton').addEventListener('click', () => {
  chrome.runtime.openOptionsPage()
  window.close()
})

