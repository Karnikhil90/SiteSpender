// Function to update the website list in the popup
function updateWebsiteList(date) {
  const websiteList = document.getElementById("website-list");
  const noWebsitesMessage = document.getElementById("no-websites-message");

  // Clear the list and fetch data
  websiteList.innerHTML = "";
  chrome.storage.local.get("timeData", (data) => {
    const storedData = data.timeData || {};
    const currentDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    
    if (storedData[currentDate] && storedData[currentDate].length > 0) {
      noWebsitesMessage.style.display = "none"; // Hide "List is empty"
      storedData[currentDate].forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.website} - ${item.timeSpent} seconds`;
        websiteList.appendChild(listItem);
      });
    } else {
      noWebsitesMessage.style.display = "block"; // Show "List is empty"
    }
  });
}

// Initial call to populate the popup
document.getElementById("date-select").addEventListener("change", (e) => {
  updateWebsiteList(e.target.value);
});

updateWebsiteList("today"); // Default to today
