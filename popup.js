// LinkedIn Ghost Buster - popup.js v1.1.7
const GHOST_DB_URL = 'https://ghostbuster.2007emrhn.workers.dev';

async function fetchGlobalStats() {
  const statusBadge = document.getElementById('analysis-mode-status');

  try {
    const response = await fetch(`${GHOST_DB_URL}/stats`);
    if (response.ok) {
      const data = await response.json();

      const countEl = document.getElementById('total-reported');
      if (countEl) countEl.textContent = data.totalReports ?? 0;

      const usersEl = document.getElementById('total-users');
      if (usersEl && data.totalUsers) usersEl.textContent = data.totalUsers;

      if (statusBadge) {
        statusBadge.textContent = '✓ Topluluk Aktif';
        statusBadge.style.cssText = 'background:#0d2818;color:#4caf50;border:1px solid #1a4a2a;';
        statusBadge.classList.remove('warning');
      }
    } else {
      throw new Error('API yanıt vermedi');
    }
  } catch (error) {
    console.error('İstatistik hatası:', error);
    if (statusBadge) {
      statusBadge.textContent = '⚠ Bağlantı Sorunu';
      statusBadge.style.cssText = 'background:#2a0000;color:#ff4444;border:1px solid #4a0000;';
    }
  }
}

document.getElementById('github-btn').addEventListener('click', () => {
  window.open('https://github.com/2007emrhn/linkedin-ghost-buster', '_blank');
});

document.getElementById('privacy-btn').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: chrome.runtime.getURL('privacy.html') });
});

// DOMContentLoaded her zaman tetiklenmeyebilir popup ortamında
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchGlobalStats);
} else {
  fetchGlobalStats();
}
