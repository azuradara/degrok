// ==UserScript==
// @name         DeGrok - Filter @grok mentions on Twitter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filters out @grok tweets and replies on Twitter/X
// @author       You
// @include      https://x.com/*
// @include      https://twitter.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

;(function () {
  'use strict'

  const GROK_PATTERNS = [/@grok\b/i, /\bgrok\b/i, /@xai/i]

  function processTweets() {
    const tweetSelectors = ['[data-testid="tweet"]', '[data-testid="tweetText"]', 'article[data-testid="tweet"]', 'div[data-testid="tweet"]']

    tweetSelectors.forEach((selector) => {
      const tweets = document.querySelectorAll(selector)
      tweets.forEach((tweet) => {
        const tweetElement = tweet.closest('article') || tweet.closest('[data-testid="tweet"]') || tweet

        if (!tweetElement || tweetElement.dataset.degrokChecked) {
          return
        }

        const textContent = tweetElement.textContent || ''

        if (GROK_PATTERNS.some((pattern) => pattern.test(textContent))) {
          if (tweetElement && !tweetElement.dataset.degrokHidden) {
            tweetElement.style.display = 'none'
            tweetElement.dataset.degrokHidden = 'true'
          }
        }

        tweetElement.dataset.degrokChecked = 'true'
      })
    })
  }

  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldProcess = true
        }
      })

      if (shouldProcess) {
        setTimeout(processTweets, 100)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return observer
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          processTweets()
          setupObserver()
        }, 1000)
      })
    } else {
      setTimeout(() => {
        processTweets()
        setupObserver()
      }, 1000)
    }

    setInterval(processTweets, 3000)
  }

  init()
})()
