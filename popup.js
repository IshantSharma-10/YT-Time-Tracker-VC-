function updateUI() {
    chrome.storage.local.get(['videosWatched', 'shortsWatched', 'totalTime', 'currentSessionTime', 'currentVideoTitle', 'videoHistory'], (result) => {
        document.getElementById('videoCount').textContent = result.videosWatched || 0;
        document.getElementById('shortsCount').textContent = result.shortsWatched || 0;

        const totalSeconds = result.totalTime || 0;
        document.getElementById('totalTime').textContent = formatTime(totalSeconds);

        const sessionSeconds = result.currentSessionTime || 0;
        document.getElementById('sessionTime').textContent = formatSessionTime(sessionSeconds);

        const title = result.currentVideoTitle || 'No Video Active';
        document.getElementById('sessionTitle').textContent = title;
        document.getElementById('sessionTitle').title = title; // Tooltip for full title

        renderHistory(result.videoHistory || []);
    });
}

function renderHistory(history) {
    const list = document.getElementById('historyList');
    list.innerHTML = '';

    if (history.length === 0) {
        list.innerHTML = '<div style="padding:10px; color:#666; text-align:center; font-size:11px;">No history yet</div>';
        return;
    }

    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <a href="${item.url}" target="_blank" class="history-title" title="${item.title}">${item.title}</a>
            <span class="history-time">${formatSessionTime(item.time)}</span>
        `;
        list.appendChild(div);
    });
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

function formatSessionTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

document.addEventListener('DOMContentLoaded', updateUI);

document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all stats?')) {
        chrome.storage.local.set({
            videosWatched: 0,
            shortsWatched: 0,
            totalTime: 0,
            currentSessionTime: 0,
            currentVideoTitle: '',
            currentVideoUrl: '',
            videoHistory: []
        }, () => {
            updateUI();
        });
    }
});

// Update stats every second while popup is open
setInterval(updateUI, 1000);
