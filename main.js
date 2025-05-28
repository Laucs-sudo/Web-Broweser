let allSites = [];
let filteredSites = [];

async function loadSearches() {
  try {
    const response = await fetch("searches.txt");
    const text = await response.text();
    allSites = text
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);
    filteredSites = [...allSites];
    updateResultsList();
  } catch (error) {
    console.error("Error loading searches.txt", error);
    document.getElementById("resultsList").innerHTML =
      '<li style="padding: 1rem; text-align: center; color: #999;">Failed to load entries.</li>';
  }
}

function updateResultsList() {
  const list = document.getElementById("resultsList");
  list.innerHTML = "";

  if (filteredSites.length === 0) {
    list.innerHTML = '<li style="padding: 1rem; text-align: center; color: #999;">No matches found.</li>';
    return;
  }

  filteredSites.forEach(site => {
    const li = document.createElement("li");

    const faviconBox = document.createElement("div");
    faviconBox.className = "favicon-box";

    const favicon = document.createElement("img");
    favicon.src = `https://${site}.com/favicon.ico`;
    favicon.alt = `${site} favicon`;
    favicon.onerror = () => (favicon.style.visibility = 'hidden');

    faviconBox.appendChild(favicon);

    const textSpan = document.createElement("span");
    textSpan.className = "site-name";
    textSpan.textContent = site;

    li.appendChild(faviconBox);
    li.appendChild(textSpan);
    list.appendChild(li);
  });
}

document.getElementById("searchInput").addEventListener("input", e => {
  const val = e.target.value.trim().toLowerCase();
  filteredSites = allSites.filter(site => site.toLowerCase().includes(val));
  updateResultsList();
});

document.addEventListener("DOMContentLoaded", loadSearches);
