chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['videosWatched', 'shortsWatched', 'totalTimeRequest', 'totalTime'], (result) => {
    if (result.videosWatched === undefined) {
      chrome.storage.local.set({ videosWatched: 0 });
    }
    if (result.shortsWatched === undefined) {
      chrome.storage.local.set({ shortsWatched: 0 });
    }
    // We'll store total time in seconds
    if (result.totalTime === undefined) {
      chrome.storage.local.set({ totalTime: 0 });
    }
  });

  // Auto-inject content script into open YouTube tabs so users don't have to reload
  chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
    for (const tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }).catch((err) => console.log("Injection failed: ", err));
    }
  });
});
