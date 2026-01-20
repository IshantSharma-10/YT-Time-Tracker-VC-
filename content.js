console.log("YouTube Tracker: Content Script Loaded");

// Internal State
let sessionTime = 0;
let lastVideoUrl = location.href;
let lastTitle = document.title;
let timer = null;

// Helper: Check if current URL is a video/short
function isVideoOrShort(url) {
    return url.includes('/watch?v=') || url.includes('/shorts/');
}

// Data Persistence Helper
function saveData(updates) {
    chrome.storage.local.set(updates);
}

// History Helper
function addToHistory(title, url, time) {
    if (time < 5 || !title || !url) return;

    console.log("Saving History:", title, time);
    chrome.storage.local.get(['videoHistory'], (result) => {
        let history = result.videoHistory || [];
        history.unshift({
            title: title,
            url: url,
            time: time,
            timestamp: Date.now()
        });
        if (history.length > 50) history.pop();
        saveData({ videoHistory: history });
    });
}

// Counter Helper
function updateCounter(type) {
    chrome.storage.local.get([type], (result) => {
        saveData({ [type]: (result[type] || 0) + 1 });
    });
}

// MAIN LOOP (Runs every 1s)
function tick() {
    // 1. ZOMBIE CHECK (Stop if extension reloaded/disabled)
    if (!chrome.runtime?.id) {
        clearInterval(timer);
        return;
    }

    const currentUrl = location.href;
    const currentTitle = document.title.replace(' - YouTube', '');

    // 2. NAVIGATION CHECK
    if (currentUrl !== lastVideoUrl) {
        console.log("Navigation Detected:", currentUrl);

        // A. Save PREVIOUS session
        if (isVideoOrShort(lastVideoUrl)) {
            addToHistory(lastTitle, lastVideoUrl, sessionTime);
        }

        // B. Reset Session
        sessionTime = 0;
        lastVideoUrl = currentUrl;

        // C. Update Counters (if entering new video)
        if (currentUrl.includes('/watch?v=')) updateCounter('videosWatched');
        else if (currentUrl.includes('/shorts/')) updateCounter('shortsWatched');

        // Force UI reset immediately
        saveData({
            currentSessionTime: 0,
            currentVideoTitle: currentTitle,
            currentVideoUrl: currentUrl
        });
    }

    // 3. TRACKING CHECK
    // Only track if tab is visible and on a video page
    if (document.visibilityState === 'visible' && isVideoOrShort(currentUrl)) {
        const video = document.querySelector('video');
        if (video && !video.paused) {

            // Increment local timer
            sessionTime++;

            // Update local title (in case it loaded late)
            if (currentTitle && currentTitle !== "YouTube") {
                lastTitle = currentTitle;
            }

            // Sync to global storage
            chrome.storage.local.get(['totalTime'], (res) => {
                saveData({
                    totalTime: (res.totalTime || 0) + 1,
                    currentSessionTime: sessionTime, // Write our local authoritative time
                    currentVideoTitle: lastTitle,
                    currentVideoUrl: currentUrl
                });
            });
        }
    }
}

// Start Engine
if (timer) clearInterval(timer);
timer = setInterval(tick, 1000);

// Initialize Counters on Load if starting on a video,
// BUT be careful not to double count if reloaded mid-video.
// Ideally background script handles injection safely.
// We'll leave the loop to handle "entering" new videos reliably.
