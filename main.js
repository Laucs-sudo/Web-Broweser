let allSites = [];

async function loadSearches() {
  try {
    const response = await fetch("searches.txt");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    allSites = text
      .split("\n")
      .map(site => site.trim())
      .filter(site => site);
    // console.log("Loaded sites:", allSites); // For debugging
    updateResultsList(""); // start with empty query = no results shown
  } catch (error) {
    console.error("Error loading searches.txt:", error);
    const resultsBox = document.getElementById("resultsBox");
    resultsBox.innerHTML = `<div style="padding: 10px; text-align: center; color: #aaa;">Error loading search data.</div>`;
    resultsBox.classList.add("visible"); // Show the error message
  }
}

function updateResultsList(query) {
  const resultsBox = document.getElementById("resultsBox");
  resultsBox.innerHTML = ""; // Clear previous results

  if (!query) {
    resultsBox.classList.remove("visible");
    return;
  }

  const filteredSites = allSites.filter(site =>
    site.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredSites.length === 0) {
    // Optionally, show a "no results" message
    // resultsBox.innerHTML = `<div style="padding: 10px; text-align: center; color: #aaa;">No sites found for "${query}"</div>`;
    // resultsBox.classList.add("visible");
    resultsBox.classList.remove("visible"); // Or just hide if no results
    return;
  }

  filteredSites.forEach(site => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.tabIndex = 0; // Make it focusable
    item.setAttribute("role", "option");
    item.setAttribute("aria-label", `Search for ${site}`);

    const faviconBox = document.createElement("div");
    faviconBox.className = "favicon-box";

    const favicon = document.createElement("img");
    // Use a reliable favicon service or a more robust fetching strategy if direct .ico fails often
    favicon.src = `https://www.google.com/s2/favicons?domain=${site}.com&sz=32`; // Using Google's favicon service for better reliability
    favicon.alt = ``; // Decorative, site name is next to it
    
    favicon.onerror = () => {
      // Fallback: try to construct a simple initial display if favicon fails
      const initial = document.createElement('span');
      initial.textContent = site.charAt(0).toUpperCase();
      initial.style.fontFamily = "'Playfair Display', serif";
      initial.style.fontSize = '16px';
      initial.style.color = '#06c2e7';
      faviconBox.innerHTML = ''; // Clear the broken img
      faviconBox.style.display = 'flex';
      faviconBox.style.alignItems = 'center';
      faviconBox.style.justifyContent = 'center';
      faviconBox.appendChild(initial);
    };


    const siteName = document.createElement("span");
    siteName.className = "site-name";
    siteName.textContent = site;

    faviconBox.appendChild(favicon);
    item.appendChild(faviconBox);
    item.appendChild(siteName);
    resultsBox.appendChild(item);

    item.addEventListener("click", () => {
      try {
        navigator.clipboard.writeText(site).then(() => {
          // Optional: provide feedback that text was copied
          // console.log(`${site} copied to clipboard`);
          // Change background temporarily to indicate success
          const originalBg = item.style.backgroundColor;
          item.style.backgroundColor = "rgba(6, 194, 231, 0.3)"; // Lighter cyan flash
          setTimeout(() => {
            item.style.backgroundColor = originalBg; // Revert to original or hover state
          }, 600);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      } catch (e) {
          console.error("Clipboard API not available.", e);
      }
    });

    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Prevent space from scrolling page
        item.click();
      }
    });
  });

  resultsBox.classList.add("visible");
}

function addParallaxEffect() {
  document.addEventListener('mousemove', (e) => {
    const title = document.querySelector('.title');
    const searchWrapper = document.querySelector('.search-wrapper');
    
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    title.style.transform = `
      translate(
        ${mouseX * 20}px,
        ${mouseY * 20}px
      )
    `;
    
    searchWrapper.style.transform = `
      translate(
        ${mouseX * 10}px,
        ${mouseY * 10}px
      )
    `;
  });
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", e => {
    const query = e.target.value.trim();
    updateResultsList(query);
  });
} else {
  console.error("Search input not found");
}

document.addEventListener("DOMContentLoaded", () => {
  loadSearches();
  addParallaxEffect();
  
  // Add subtle entrance animation
  setTimeout(() => {
    document.querySelector('.title').style.opacity = '1';
    document.querySelector('.search-section').style.opacity = '1';
    document.querySelector('.title').style.transform = 'translateY(0)';
    document.querySelector('.search-section').style.transform = 'translateY(0)';
  }, 100);
});
