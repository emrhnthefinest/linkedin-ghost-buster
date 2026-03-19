// LinkedIn Ghost Buster - v1.0.2
// Topluluk gücüyle hayalet ilanları tespit et.

const GHOST_DB_URL = "https://ghostbuster.2007emrhn.workers.dev";
const API_KEY = atob("RW1yaG5fR2hvc3RfQnVzdGVyXzIwMjZfU2VjdXJl");

let currentId = null;

function findJobId() {
  const url = window.location.href;
  const viewMatch = url.match(/\/jobs\/view\/(\d+)/);
  if (viewMatch) return viewMatch[1];
  const paramMatch = url.match(/currentJobId=(\d+)/);
  if (paramMatch) return paramMatch[1];
  return null;
}

function injectBadge(count, reason) {
  const old = document.getElementById('gb-badge');
  if (old) old.remove();

  let color = '#C62828', bg = '#FFEBEE', emoji = '🚫';
  if (reason.includes('Eski'))  { color = '#E65100'; bg = '#FFF3E0'; emoji = '📅'; }
  if (reason.includes('Cevap')) { color = '#F57F17'; bg = '#FFFDE7'; emoji = '🔇'; }

  const selectors = [
    '.job-details-jobs-unified-top-card__container--two-pane',
    '.jobs-unified-top-card__content--two-pane',
    '.jobs-details__main-content',
    '.jobs-details-top-card__content-container',
    '[class*="job-details-jobs-unified-top-card"]',
    'main',
  ];

  let target = null;
  for (const sel of selectors) {
    target = document.querySelector(sel);
    if (target) break;
  }
  if (!target) target = document.body;

  const badge = document.createElement('div');
  badge.id = 'gb-badge';
  badge.style.cssText = [
    'all:initial!important',
    'display:flex!important',
    'align-items:center!important',
    'gap:10px!important',
    `background:${bg}!important`,
    `border:1.5px solid ${color}!important`,
    `color:${color}!important`,
    'padding:12px 16px!important',
    'border-radius:10px!important',
    'margin:0 0 14px 0!important',
    'font-size:13px!important',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important',
    'font-weight:600!important',
    'box-shadow:0 2px 8px rgba(0,0,0,0.08)!important',
    'box-sizing:border-box!important',
    'width:100%!important',
    'z-index:9999!important',
  ].join(';');

  badge.innerHTML = `
    <span style="font-size:20px;flex-shrink:0;">${emoji}</span>
    <span style="all:initial;font-family:-apple-system,sans-serif;font-size:13px;font-weight:600;color:${color};">
      Bu ilan topluluk tarafından <strong>${count} kez</strong> raporlandı!
      <span style="font-weight:400;opacity:0.8;"> · ${reason}</span>
    </span>
    <button onclick="this.parentElement.remove()" style="all:initial;margin-left:auto;cursor:pointer;font-size:18px;color:${color};opacity:0.5;flex-shrink:0;" title="Kapat">✕</button>
  `;

  target.prepend(badge);
}

async function checkStatus(jobId) {
  try {
    const res = await fetch(`${GHOST_DB_URL}/check/${jobId}`, {
      headers: { 'X-API-KEY': API_KEY }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.reported) {
      const reason = data.reasons?.length > 0 ? data.reasons[0] : 'Bilinmiyor';
      setTimeout(() => injectBadge(data.count, reason), 600);
    }
  } catch (e) {
    // Sessizce başarısız ol
  }
}

async function sendReport(reason) {
  if (!currentId) return;
  const dropdown = document.getElementById('gb-dropdown');
  try {
    const res = await fetch(`${GHOST_DB_URL}/report`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify({ jobId: currentId, reason })
    });

    if (res.status === 429) {
      alert('🚫 Bu ilanı zaten raporladın.\n\nAynı ilana sadece 1 kez rapor gönderebilirsin.');
      if (dropdown) dropdown.style.display = 'none';
      return;
    }
    if (res.ok) {
      alert(`✅ Raporun kaydedildi!\n\nSebep: "${reason}"\nTeşekkürler, topluluğa katkın için!`);
      if (dropdown) dropdown.style.display = 'none';
      checkStatus(currentId);
    } else {
      alert('⚠️ Bir hata oluştu. Lütfen tekrar dene.');
    }
  } catch (e) {
    alert('⚠️ Sunucuya ulaşılamıyor. İnternet bağlantını kontrol et.');
  }
}

function injectInterface() {
  if (document.getElementById('gb-fixed-wrapper')) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes gb-fade-in {
      from { opacity:0; transform:translateY(-8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .gb-opt {
      width:100%!important; text-align:left!important; background:none!important;
      border:none!important; padding:11px 14px!important; font-size:13px!important;
      color:#444!important; cursor:pointer!important; border-radius:8px!important;
      font-weight:500!important; transition:all 0.15s!important; display:block!important;
      font-family:-apple-system,sans-serif!important;
    }
    .gb-opt:hover { background:#FFF0F0!important; color:#E53935!important; padding-left:18px!important; }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.id = 'gb-fixed-wrapper';
  wrapper.style.cssText = 'position:fixed!important;bottom:24px!important;right:24px!important;z-index:2147483647!important;';

  wrapper.innerHTML = `
    <div id="gb-dropdown" style="display:none;position:absolute;bottom:58px;right:0;background:white!important;border-radius:14px!important;width:230px!important;box-shadow:0 8px 30px rgba(0,0,0,0.18)!important;border:1px solid #F0F0F0!important;padding:8px!important;animation:gb-fade-in 0.2s ease;">
      <div style="padding:10px 12px 8px;font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #F5F5F5;margin-bottom:4px;">Neden raporluyorsun?</div>
      <button class="gb-opt" data-r="Hayalet İlan">🚫 Hayalet İlan</button>
      <button class="gb-opt" data-r="Eski İlan">📅 Eski İlan</button>
      <button class="gb-opt" data-r="Cevap Yok">🔇 Cevap Yok</button>
      <button class="gb-opt" data-r="Sahte Şirket">⚠️ Sahte Şirket</button>
    </div>
    <button id="gb-main-btn" title="İlanı raporla" style="background:#E53935!important;color:white!important;border:none!important;padding:12px 20px!important;border-radius:50px!important;font-weight:700!important;cursor:pointer!important;box-shadow:0 4px 16px rgba(229,57,53,0.45)!important;display:flex!important;align-items:center!important;gap:8px!important;font-size:13px!important;font-family:-apple-system,sans-serif!important;transition:transform 0.2s!important;">
      <span style="font-size:16px;">👻</span> Raporla
    </button>
  `;

  const mainBtn = wrapper.querySelector('#gb-main-btn');
  const dropdown = wrapper.querySelector('#gb-dropdown');

  mainBtn.addEventListener('mouseenter', () => { mainBtn.style.transform = 'translateY(-2px)'; });
  mainBtn.addEventListener('mouseleave', () => { mainBtn.style.transform = ''; });
  mainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });
  dropdown.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => { if (dropdown) dropdown.style.display = 'none'; });

  wrapper.querySelectorAll('.gb-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      sendReport(opt.getAttribute('data-r'));
    });
  });

  document.body.appendChild(wrapper);
}

function handleJobChange(id) {
  currentId = id;
  const oldBadge = document.getElementById('gb-badge');
  if (oldBadge) oldBadge.remove();
  injectInterface();
  const wrapper = document.getElementById('gb-fixed-wrapper');
  if (wrapper) wrapper.style.display = 'block';
  checkStatus(id);
}

// LinkedIn SPA navigasyonunu izle
new MutationObserver(() => {
  const id = findJobId();
  if (!id) {
    const w = document.getElementById('gb-fixed-wrapper');
    if (w) w.style.display = 'none';
    return;
  }
  if (id !== currentId) handleJobChange(id);
}).observe(document.body, { childList: true, subtree: true });

// Fallback: setInterval
setInterval(() => {
  const id = findJobId();
  if (id && id !== currentId) handleJobChange(id);
}, 1500);

// İlk yükleme
const _initId = findJobId();
if (_initId) handleJobChange(_initId);
