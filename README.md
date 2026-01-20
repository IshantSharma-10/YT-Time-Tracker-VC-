# 📺 YouTube Activity Tracker

A powerful, privacy-focused Chrome Extension built with Manifest V3 that monitors your YouTube viewing habits. It provides real-time analytics on how much time you spend on the platform, distinguishing between standard videos and YouTube Shorts.

## 🚀 Features
* **Automatic Tracking:** Detects when you are watching a video or a short and starts the timer automatically.
* **Smart Counters:** Maintains separate tallies for total "Videos Watched" vs. "Shorts Watched".
* **Session Monitoring:** Shows the title and duration of the current video being watched directly in the popup.
* **Viewing History:** Keeps a local log of up to 50 recently watched videos with clickable links.
* **Auto-Resume logic:** Background service workers ensure your time is logged even if you navigate between tabs.
* **Custom Dark UI:** A red-and-black "YouTube-inspired" dashboard for a seamless user experience.

## 🛠️ Technical Implementation
* **State Management:** Uses `chrome.storage.local` to persist watch data and history across browser restarts.
* **Content Script Injection:** Automatically injects tracking logic into existing YouTube tabs upon installation.
* **Visibility API:** Smart tracking that only counts time when the tab is actually visible and the video is playing.
* **Navigation Detection:** Real-time URL monitoring to detect when a user switches from a standard video to a Short.

## 📂 Project Structure
* `manifest.json`: Configuration using the latest Manifest V3 standards.
* `content.js`: The "engine" that interacts with the YouTube video player.
* `background.js`: Service worker for installation events and script injection.
* `popup.html/js/css`: The dashboard interface and UI update logic.

## ⚙️ Installation
1.  Download or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked** and select the project folder.
5.  Open any YouTube video and start tracking!

## 🔒 Privacy
All data is stored **locally** within your browser's storage via the `chrome.storage` API. No viewing data is sent to external servers or third parties.
