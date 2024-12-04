console.log("Content script running on:", window.location.href); // Debugging

// Send the time spent on the current website to the background script every 0.5 seconds
let timeSpentOnPage = 0;

const timeInterval = setInterval(() => {
  timeSpentOnPage++;
  console.log(`Time spent on this page: ${timeSpentOnPage} seconds`); // Debugging
}, 500);

// Communicate with the background script to store the time spent
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "stopTracking") {
    clearInterval(timeInterval);
    sendResponse({ timeSpent: timeSpentOnPage });
  }
});
