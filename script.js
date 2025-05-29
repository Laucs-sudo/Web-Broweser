let allSites = [];

async function loadSearches() {
  try {
    const response = await fetch("searches.txt");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    allSites = text
      .split("\n")
      .map(site => site.trim())
      .filter(site => site);
    updateResultsList(""); // Start hidden
  } catch (error) {
    console.error("Error loading searches.txt:", error);
    const resultsBox = document.getElementById("resultsBox");
    if (resultsBox) {
      resultsBox.innerHTML = `<div style="padding: 10px; text-align: center; color: #aaa;">Error loading search data.</div>`;
      resultsBox.classList.add("visible");
    }
  }
}

function updateResultsList(query) {
  const resultsBox = document.getElementById("resultsBox");
  if (!resultsBox) return;
  resultsBox.innerHTML = "";

  if (!query) {
    resultsBox.classList.remove("visible");
    return;
  }

  const filteredSites = allSites.filter(site =>
    site.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredSites.length === 0) {
    resultsBox.classList.remove("visible");
    return;
  }

  filteredSites.forEach(site => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.tabIndex = 0;
    item.setAttribute("role", "option");
    item.setAttribute("aria-label", `Search for ${site}`);

    const faviconBox = document.createElement("div");
    faviconBox.className = "favicon-box";

    const favicon = document.createElement("img");
    // Use Google's favicon service, but don't force ".com"
    favicon.src = `https://www.google.com/s2/favicons?domain=${site}&sz=32`;
    favicon.alt = "";

    favicon.onerror = () => {
      const initial = document.createElement('span');
      initial.textContent = site.charAt(0).toUpperCase();
      initial.style.fontFamily = "'Roboto', sans-serif"; // Changed to Roboto
      initial.style.fontSize = '16px';
      initial.style.color = '#3A00E5'; // Changed to MD3 primary color
      faviconBox.innerHTML = '';
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

    // Add ripple effect listener
    item.addEventListener("click", applyRippleEffect);

    item.addEventListener("click", ()_copy => { // Renamed to avoid conflict with applyRippleEffect
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(site).then(() => {
          // Visual feedback for copy can be enhanced or removed if ripple is enough
          // For now, let's keep a subtle one, but not the background color change
          // which might conflict with ripple.
          // Consider a small toast/notification if more feedback is needed.
        }).catch(err => {
          console.error('Clipboard write failed: ', err);
        });
      } else {
        // Consider a more MD-style notification/toast here if possible
        alert('Clipboard API is not supported in your browser.');
      }
    });

    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  resultsBox.classList.add("visible");
}

function addParallaxEffect() {
  const title = document.querySelector('.title');
  const searchWrapper = document.querySelector('.search-wrapper');
  if (!title || !searchWrapper) return;
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    title.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    searchWrapper.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadSearches();
  addParallaxEffect();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const query = e.target.value.trim();
      updateResultsList(query);
    });
  } else {
    console.error("Search input not found");
  }

  // Entrance animation
  setTimeout(() => {
    const title = document.querySelector('.title');
    const searchSection = document.querySelector('.search-section');
    if (title) {
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }
    if (searchSection) {
      searchSection.style.opacity = '1';
      searchSection.style.transform = 'translateY(0)';
    }
  }, 100);
});

function applyRippleEffect(event) {
  const item = event.currentTarget;

  // Create ripple element
  const ripple = document.createElement("span");
  const diameter = Math.max(item.clientWidth, item.clientHeight);
  const radius = diameter / 2;

  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - item.getBoundingClientRect().left - radius}px`;
  ripple.style.top = `${event.clientY - item.getBoundingClientRect().top - radius}px`;
  ripple.classList.add("ripple-effect"); // Add class for styling via CSS

  // Ensure ripple is removed after animation
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });

  item.appendChild(ripple);
}
