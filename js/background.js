let filteredCounts = {}
let isEnabled = true

chrome.storage.local.get(['extension-enabled'], (result) => {
  isEnabled = result['extension-enabled'] !== false
})

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'tweet-filtered') {
    const tabId = sender.tab.id
    filteredCounts[tabId] = (filteredCounts[tabId] || 0) + 1
    
    updateBadge(tabId, filteredCounts[tabId])
    incrementTotalCount()
  } else if (message.type === 'total-counter-reset') {
    filteredCounts = {}
  } else if (message.type === 'toggle-extension') {
    isEnabled = message.enabled
    updateAllBadges()
  }
})

function incrementTotalCount() {
  chrome.storage.local.get(['count-total-filtered'], (result) => {
    const newCount = (result['count-total-filtered'] || 0) + 1
    chrome.storage.local.set({ 'count-total-filtered': newCount })
  })
}

chrome.tabs.onRemoved.addListener((tabId) => {
  delete filteredCounts[tabId]
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    filteredCounts[tabId] = 0
    updateBadge(tabId, 0)
  }
})

function updateBadge(tabId, count) {
  if (!chrome.action) {
    return
  }
  
  let badgeText = ''
  if (!isEnabled) {
    badgeText = 'OFF'
  } else if (count > 0) {
    badgeText = count.toString()
  }
  
  try {
    chrome.action.setBadgeText({
      text: badgeText,
      tabId: tabId
    })
    
    chrome.action.setBadgeBackgroundColor({
      color: '#000',
      tabId: tabId
    })
  } catch (error) {
    console.error('[degrok] error updating badge', error)
  }
}

function updateAllBadges() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const count = filteredCounts[tab.id] || 0
      updateBadge(tab.id, count)
    })
  })
}

