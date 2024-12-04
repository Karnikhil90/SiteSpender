let activeTabId = null;
let timerInterval = null;
let timeSpentOnTab = 0; // Time in seconds
const timeData = {}; // Will store the time data per website

// Track time when a tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab activated:", activeInfo); // Debugging

  if (activeTabId !== null) {
    clearInterval(timerInterval);
    saveTime(activeTabId); // Save previous tab's time
  }

  activeTabId = activeInfo.tabId;
  timeSpentOnTab = 0;
  console.log("Started tracking for tab:", activeTabId);

  // Start time tracking for this tab every 0.5 seconds
  timerInterval = setInterval(() => {
    timeSpentOnTab++;
    console.log(`Time spent on tab ${activeTabId}: ${timeSpentOnTab} seconds`); // Debugging
  }, 500);
});

// Save time data to storage when tab is closed or switched
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTabId) {
    console.log("Tab closed or switched:", tabId); // Debugging
    clearInterval(timerInterval);
    saveTime(tabId);
  }
});

// Function to save time data
function saveTime(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    const url = tab.url || "Unknown";
    const dateKey = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    console.log(`Saving time for ${url} on ${dateKey}`);

    if (!timeData[dateKey]) {
      timeData[dateKey] = [];
    }

    timeData[dateKey].push({ website: url, timeSpent: timeSpentOnTab });

    chrome.storage.local.set({ timeData }, () => {
      console.log(`Saved data for ${url}: ${timeSpentOnTab} seconds`); // Debugging
    });
  });
}

// Initialize the time data when the extension starts
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("timeData", (data) => {
    if (data.timeData) {
      console.log("Loaded saved time data:", data.timeData); // Debugging
      Object.assign(timeData, data.timeData);
    }
  });
});
