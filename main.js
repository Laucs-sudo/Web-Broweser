const input = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');
let entries = [];
let focusIdx = -1;

// Load search entries from searches.txt
fetch('searches.txt')
  .then(res => res.text())
  .then(text => {
    entries = text.split('\n').map(line => line.trim()).filter(line => line);
    updateList(entries);
  })
  .catch(err => {
    resultsList.innerHTML = '<li class="no-results">Failed to load searches.txt</li>';
  });

function cleanInput(str) {
  return str.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\.com$/, '');
}

function updateList(list) {
  resultsList.innerHTML = '';

  if (list.length === 0) {
    resultsList.innerHTML = '<li class="no-results">No matches found</li>';
    return;
  }

  list.forEach((domain, i) => {
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.dataset.idx = i;

    const favicon = document.createElement('img');
    favicon.className = 'favicon';
    favicon.src = `https://${domain}.com/favicon.ico`;
    favicon.alt = `${domain} favicon`;
    favicon.onerror = () => (favicon.style.visibility = 'hidden');

    const span = document.createElement('span');
    span.className = 'li-text';
    span.textContent = domain;

    li.appendChild(favicon);
    li.appendChild(span);

    li.onclick = () => {
      navigator.clipboard.writeText(domain);
      li.style.background = 'rgba(100,181,246,0.14)';
      setTimeout(() => (li.style.background = ''), 600);
    };

    li.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') li.click();
    };

    resultsList.appendChild(li);
  });

  focusIdx = -1;
}

input.addEventListener('input', () => {
  const val = cleanInput(input.value);
  if (!val) {
    updateList(entries);
  } else {
    const filtered = entries.filter(e => e.toLowerCase().includes(val));
    updateList(filtered);
  }
});

input.addEventListener('keydown', e => {
  const items = resultsList.querySelectorAll('li:not(.no-results)');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    focusIdx = (focusIdx + 1) % items.length;
    items[focusIdx].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    focusIdx = (focusIdx - 1 + items.length) % items.length;
    items[focusIdx].focus();
  }
});
