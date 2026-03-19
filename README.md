<div align="center">

# 👻 LinkedIn Ghost Buster

**Topluluk gücüyle LinkedIn'deki sahte ve hayalet iş ilanlarını tespit et.**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://github.com/2007emrhn/linkedin-ghost-buster)
[![Version](https://img.shields.io/badge/version-1.0.2-red?style=flat-square)](https://github.com/2007emrhn/linkedin-ghost-buster/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Backend-Cloudflare_Workers-F6821F?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)

<br>

> **Varolmayan işlere başvurarak zamanını boşa harcama.**
> Ghost Buster, iş ilanlarını açtığında otomatik olarak topluluk veritabanını kontrol eder ve raporlanmış ilanları anında işaretler.

</div>

---

## ✨ Özellikler

- 🚩 **Anlık Uyarı** — Raporlanmış bir ilana girdiğinde kırmızı banner otomatik çıkar
- 👥 **Topluluk Sistemi** — Minimum 3 rapor olmadan uyarı gösterilmez, tek kişi sistemi manipüle edemez
- 🔒 **Ban Riski Sıfır** — Scraping yok, profil verisi yok, LinkedIn TOS'unu ihlal eden hiçbir şey yok
- 📊 **Canlı İstatistik** — Kaç ilan raporlandı, topluluk ne kadar aktif
- 🆓 **Tamamen Ücretsiz** — Reklam yok, ücret yok, hesap açma yok

---

## 🚀 Kurulum

### Yöntem 1: Manuel Kurulum (Şu An)

1. Bu repoyu indir → **Code → Download ZIP**
2. ZIP'i bir klasöre çıkar
3. Chrome'da `chrome://extensions` adresine git
4. Sağ üstten **Geliştirici modu**nu aç
5. **Paketlenmemiş öğe yükle** → klasörü seç
6. LinkedIn'de bir iş ilanı aç → sağ altta 👻 butonu görünüyorsa hazırsın!

### Yöntem 2: Chrome Web Store *(Yakında)*

Chrome Web Store'da yayına alınma sürecinde.

---

## ⚠️ Neden Diğer Eklentilerden Farklı?

Piyasadaki çoğu LinkedIn eklentisi **scraping** yapıyor:
- LinkedIn'in HTML yapısını kazıyor
- Profil verilerini çekiyor
- Kullanıcı adına işlem yapıyor
- LinkedIn bunu tespit ediyor → **hesap ban**

**Ghost Buster bunların hiçbirini yapmıyor.**

Sadece URL'den iş ilanı ID'sini okuyor. Profil verisine dokunmuyor. Bu yüzden ban riski sıfır.

---

## 🛠️ Teknik Detaylar

### Mimari

```
Chrome Extension (content.js)
        │
        ▼
URL'den Job ID okunur
        │
        ▼
Cloudflare Workers API
        │
        ▼
KV Storage (rapor veritabanı)
```

### Stack

| Katman | Teknoloji |
|--------|-----------|
| Extension | Chrome Manifest V3 |
| Backend | Cloudflare Workers |
| Veritabanı | Cloudflare KV |
| Rate Limiting | SHA-256 IP Hash |
| SPA Desteği | MutationObserver + setInterval fallback |

### API Endpointleri

```
GET  /check/:jobId   → İlan rapor durumunu sorgular
POST /report         → Yeni rapor gönderir
GET  /stats          → Global istatistikleri döner
```

---

## 📁 Dosya Yapısı

```
linkedin-ghost-buster/
├── manifest.json       # Chrome Extension config
├── content.js          # Ana eklenti kodu (LinkedIn'e inject edilir)
├── content.css         # Uyarı banner stilleri
├── popup.html          # Popup arayüzü
├── popup.js            # Popup mantığı
├── style.css           # Genel stiller
├── privacy.html        # Gizlilik politikası
├── icon16.png          # Extension ikonları
├── icon48.png
├── icon128.png
└── index.html          # GitHub Pages tanıtım sitesi
```

---

## 🔒 Gizlilik

- ✅ Kişisel bilgi toplanmıyor
- ✅ Profil verisi okunmuyor
- ✅ Sadece iş ilanı ID'si işleniyor
- ✅ Rate limit için IP SHA-256 ile hash'leniyor (ham IP saklanmıyor)
- ✅ Rapor verileri 90 gün sonra otomatik siliniyor

[Gizlilik Politikası →](privacy.html)

---

## 🤝 Katkı Sağla

1. Fork'la
2. Branch oluştur (`git checkout -b feature/yeni-ozellik`)
3. Commit at (`git commit -m 'feat: yeni özellik'`)
4. Push'la (`git push origin feature/yeni-ozellik`)
5. Pull Request aç

### Yapılacaklar

- [ ] Chrome Web Store yayını
- [ ] Firefox desteği
- [ ] İngilizce arayüz seçeneği
- [ ] İlan geçmişi görüntüleme
- [ ] Bildirim sistemi

---

## 📄 Lisans

MIT © 2026 [Emirhan](https://github.com/2007emrhn) — Emrhn Medya

---

<div align="center">

**LinkedIn Corporation ile herhangi bir bağlantısı bulunmamaktadır.**

⭐ Beğendiysen yıldız vermeyi unutma!

[🌐 Tanıtım Sitesi](https://2007emrhn.github.io/linkedin-ghost-buster) · [GitHub](https://github.com/2007emrhn)

</div>
