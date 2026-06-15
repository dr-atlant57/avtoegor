const fs = require('fs');
const path = require('path');

// Загрузка сырых матриц графа знаний
const vehicles = require('./data/vehicles.json');
const kb = require('./data/knowledge-base.json');

// Константы путей
const DIST_DIR = __dirname;
const CARS_DIR = path.join(DIST_DIR, 'cars');

if (!fs.existsSync(CARS_DIR)) fs.mkdirSync(CARS_DIR, { recursive: true });

// Вспомогательные функции очистки путей
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// ==========================================
// ШАБЛОН 1: МУЛЬТИПАСПОРТ СУЩНОСТИ (car.html-конфиг)
// ==========================================
const renderVehiclePage = (car) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Used ${car.year} ${car.brand} ${car.model} For Sale | Golden Valley</title>
  <meta name="description" content="${car.storytelling.substring(0, 155)}">
  <link rel="canonical" href="https://yishu.business/cars/${car.id}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&display=swap" rel="stylesheet">

  <!-- СВЯЗАННЫЙ ГРАФ ЗНАНИЙ ДЛЯ ИИ-АГЕНТОВ (SCHEMA.ORG ENTITY GRAPH) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutomotiveBusiness",
        "@id": "https://yishu.business/#dealer",
        "name": "YISHU Luxury Infrastructure",
        "telephone": "+16125550199",
        "priceRange": "$$$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Golden Valley",
          "addressRegion": "MN",
          "postalCode": "55427",
          "addressCountry": "US"
        }
      },
      {
        "@type": "Vehicle",
        "@id": "https://yishu.business/cars/${car.id}.html#vehicle",
        "name": "${car.year} ${car.brand} ${car.model}",
        "brand": {
          "@type": "Brand",
          "name": "${car.brand}"
        },
        "model": "${car.model}",
        "modelYear": ${car.year},
        "vehicleIdentificationNumber": "${car.vin}",
        "mileageFromOdometer": {
          "@type": "QuantitativeValue",
          "value": ${car.mileage},
          "unitCode": "SMI"
        },
        "bodyType": "${car.body_type}",
        "color": "${car.color_ext}",
        "offers": {
          "@type": "Offer",
          "price": "${car.price}",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "offeredBy": { "@id": "https://yishu.business/#dealer" }
        }
      }
    ]
  }
  </script>

  <style>
    :root { --bg:#050505; --surf:#0f0f11; --border:#1f1f24; --text:#f3f4f6; --muted:#888893; --accent:#00a86b; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; padding-bottom: 6rem; }
    header { border-bottom: 1px solid var(--border); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.3rem; font-weight: 900; text-transform: uppercase; color: #fff; text-decoration: none; }
    .logo span { color: var(--accent); }
    .back { color: var(--muted); text-decoration: none; font-size: 0.9rem; }
    
    .container { max-width: 1400px; margin: 3rem auto; padding: 0 2rem; display: grid; grid-template-columns: 1fr 460px; gap: 4rem; }
    .hero-image { width: 100%; aspect-ratio: 16/9; background: #111; border-radius: 24px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 2.5rem; }
    .hero-image img { width: 100%; height: 100%; object-fit: cover; }
    
    h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; letter-spacing: -0.04em; margin-bottom: 0.5rem; }
    .storytelling { font-size: 1.15rem; color: var(--text); font-weight: 300; line-height: 1.7; margin: 2rem 0; padding-left: 1.5rem; border-left: 2px solid var(--accent); }
    
    .matrix { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 3rem; }
    .matrix-item { background: var(--surf); border: 1px solid var(--border); padding: 1.25rem; border-radius: 12px; }
    .matrix-item span { display: block; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .matrix-item strong { font-size: 1.1rem; color: #fff; }

    /* TRUST LAYER COMPONENT */
    .trust-shield { background: linear-gradient(135deg, #0f0f11 0%, #07140f 100%); border: 1px solid rgba(0,168,107,0.2); padding: 2rem; border-radius: 20px; margin-bottom: 3rem; }
    .trust-shield h3 { font-size: 1.2rem; margin-bottom: 1rem; color: #fff; }
    .trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .trust-indicator { font-size: 0.9rem; color: var(--text); }
    .trust-indicator span { color: var(--accent); font-weight: bold; }

    /* CONVERSION ENGINE */
    .sidebar { position: sticky; top: 40px; height: fit-content; background: var(--surf); border: 1px solid var(--border); padding: 2.5rem; border-radius: 24px; }
    .price { font-size: 2.8rem; font-weight: 900; color: #fff; margin-bottom: 2rem; letter-spacing: -0.04em; }
    
    .action-group { display: flex; flex-direction: column; gap: 1rem; }
    .btn { padding: 1.1rem; border-radius: 12px; font-weight: 700; text-align: center; text-decoration: none; font-size: 0.95rem; cursor: pointer; transition: all 0.2s ease; border: none; }
    .btn-main { background: var(--accent); color: #fff; }
    .btn-main:hover { background: #0fd68a; }
    .btn-sec { background: transparent; border: 1px solid var(--border); color: #fff; }
    .btn-sec:hover { border-color: #fff; }
    
    .calc-box { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .calc-title { font-size: 0.9rem; color: var(--muted); text-transform: uppercase; margin-bottom: 1rem; }
    .calc-value { font-size: 1.3rem; font-weight: 800; color: #4ade80; }

    @media (max-width: 1024px) { .container { grid-template-columns: 1fr; gap: 2rem; } .sidebar { position: relative; top:0; } }
    @media (max-width: 768px) {
      .mobile-sticky { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(5,5,5,0.9); backdrop-filter: blur(10px); padding: 1rem; border-top: 1px solid var(--border); z-index: 1000; display: flex; gap: 1rem; }
      .mobile-sticky .btn { flex: 1; padding: 0.9rem; font-size: 0.9rem; }
      .container { padding: 0 1rem; }
    }
    @media (min-width: 769px) { .mobile-sticky { display: none; } }
  </style>
</head>
<body>
  <header>
    <a href="../index.html" class="logo">YISHU<span>.</span></a>
    <a href="../index.html" class="back">&larr; Inventory Map</a>
  </header>

  <main class="container">
    <div>
      <div class="hero-image">
        <img src="${car.images[0]}" alt="${car.brand} ${car.model}">
      </div>
      <h1>${car.year} ${car.brand} ${car.model}</h1>
      <p style="color:var(--muted)">Digital Asset Architecture Identity Passport</p>

      <p class="storytelling">${car.storytelling}</p>

      <div class="matrix">
        <div class="matrix-item"><span>Engine Powertrain</span><strong>${car.engine}</strong></div>
        <div class="matrix-item"><span>Transmission</span><strong>${car.transmission}</strong></div>
        <div class="matrix-item"><span>Drivetrain System</span><strong>${car.drivetrain}</strong></div>
        <div class="matrix-item"><span>Odometer Telemetry</span><strong>${car.mileage.toLocaleString()} miles</strong></div>
        <div class="matrix-item"><span>Chassis Identification (VIN)</span><strong style="font-family:monospace; font-size:0.9rem;">${car.vin}</strong></div>
        <div class="matrix-item"><span>Bespoke Interior</span><strong>${car.color_int}</strong></div>
      </div>

      <!-- TRUST LAYER -->
      <div class="trust-shield">
        <h3>Asset Integrity Profile</h3>
        <div class="trust-grid">
          <div class="trust-indicator">Status: <span>${car.trust.inspection_status}</span></div>
          <div class="trust-indicator">Dealer Rating: <span>${car.trust.dealer_rating}</span></div>
          <div class="trust-indicator">Warranty: <span style="color:#fff; font-weight:400;">${car.trust.warranty}</span></div>
          <div class="trust-indicator">History Log: <a href="${car.trust.carfax_link}" target="_blank" style="color:var(--accent)">Verify Carfax Report &rarr;</a></div>
        </div>
      </div>
    </div>

    <!-- CONVERSION ENGINE SIDEBAR -->
    <div class="sidebar">
      <div class="price">$${car.price.toLocaleString()}</div>
      <div class="action-group">
        <button class="btn btn-main" onclick="alert('Securing connection with Luxury Concierge...')">Reserve Asset</button>
        <a href="https://wa.me/16125550199" target="_blank" class="btn btn-sec">WhatsApp Concierge</a>
        <button class="btn btn-sec" onclick="alert('Trade-In Evaluation module initialized.')">Appraise Trade-In</button>
      </div>

      <div class="calc-box">
        <div class="calc-title">Estimated Tier-1 Financing</div>
        <div class="calc-value">$${Math.round((car.price * 0.8) / 60 * 1.05)}<span style="font-size:0.8rem; color:var(--muted); font-weight:400;"> / month</span></div>
        <p style="font-size:0.75rem; color:var(--muted); margin-top:0.5rem;">Based on 20% down, 60-month orchestration at prime rates.</p>
      </div>
    </div>
  </main>

  <div class="mobile-sticky">
    <button class="btn btn-main" onclick="alert('Securing Concierge Link...')">Reserve</button>
    <a href="tel:+16125550199" class="btn btn-sec">Call Specialist</a>
  </div>
</body>
</html>`;


// ==========================================
// ШАБЛОН 2: PROGRAMMATIC LANDING PAGES (/porsche, /luxury-suv, etc.)
// ==========================================
const renderHubPage = (title, description, filteredCars) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | YISHU Luxury Asset Infrastructure</title>
  <meta name="description" content="${description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&display=swap" rel="stylesheet">
  <style>
    :root { --bg:#050505; --surf:#0f0f11; --border:#1f1f24; --text:#f3f4f6; --muted:#888893; --accent:#00a86b; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    header { border-bottom: 1px solid var(--border); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.3rem; font-weight: 900; text-transform: uppercase; color: #fff; text-decoration: none; }
    .logo span { color: var(--accent); }
    .main-hub { max-width: 1400px; margin: 4rem auto; padding: 0 2rem; }
    h1 { font-size: 3rem; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1rem; }
    .subtitle { color: var(--muted); font-size: 1.2rem; font-weight: 300; margin-bottom: 3rem; max-width: 700px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 2.5rem; }
    .card { background: var(--surf); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .card:hover { transform: translateY(-6px); border-color: #33333c; }
    .img-wrap { width: 100%; aspect-ratio: 16/10; background: #111; }
    .img-wrap img { width: 100%; height: 100%; object-fit: cover; }
    .body { padding: 1.75rem; display: flex; flex-direction: column; flex-grow: 1; }
    .card-title { font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; }
    .price { font-size: 1.5rem; font-weight: 900; color: #fff; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); }
  </style>
</head>
<body>
  <header>
    <a href="index.html" class="logo">YISHU<span>.</span></a>
  </header>
  <main class="main-hub">
    <h1>${title}</h1>
    <p class="subtitle">${description}</p>
    <div class="grid">
      ${filteredCars.map(car => `
        <a href="cars/${car.id}.html" class="card">
          <div class="img-wrap"><img src="${car.images[0]}" alt="${car.brand} ${car.model}"></div>
          <div class="body">
            <h2 class="card-title">${car.brand} ${car.model} (${car.year})</h2>
            <p style="color:var(--muted); font-size:0.9rem; margin-bottom:1rem;">${car.engine} • ${car.mileage.toLocaleString()} mi</p>
            <div class="price">$${car.price.toLocaleString()}</div>
          </div>
        </a>
      `).join('')}
    </div>
  </main>
</body>
</html>`;

// ==========================================
// ЯДРО СБОРКИ (PROGRAMMATIC COMPILING ENGINE)
// ==========================================

// 1. Создание индивидуальных паспортов сущностей (Entity Passports)
vehicles.forEach(car => {
  fs.writeFileSync(path.join(CARS_DIR, `${car.id}.html`), renderVehiclePage(car));
  console.log(`[Entity Processed]: /cars/${car.id}.html`);
});

// 2. Генерация Programmatic SEO страниц брендов (/porsche.html, /bmw.html, etc.)
const brands = [...new Set(vehicles.map(c => c.brand))];
brands.forEach(brand => {
  const brandCars = vehicles.filter(c => c.brand === brand);
  const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  fs.writeFileSync(
    path.join(DIST_DIR, `${slug}.html`),
    renderHubPage(`Premium ${brand} Inventory`, `Explore certified pre-owned high-performance ${brand} architecture assets in premier condition.`, brandCars)
  );
  console.log(`[Programmatic Brand Created]: /${slug}.html`);
});

// 3. Генерация Программных категориальных страниц бюджетов (/cars-under-100k.html)
const budgets = [100000, 150000];
budgets.forEach(budget => {
  const targetCars = vehicles.filter(c => c.price < budget);
  fs.writeFileSync(
    path.join(DIST_DIR, `cars-under-${budget / 1000}k.html`),
    renderHubPage(`Luxury Vehicles Under $${budget.toLocaleString()}`, `Curated premium options matching high-value target constraints below $${budget.toLocaleString()}.`, targetCars)
  );
  console.log(`[Programmatic Budget Created]: /cars-under-${budget / 1000}k.html`);
});

// 4. Генерация Программных страниц по типу кузова (/luxury-suv.html)
const bodyTypes = [...new Set(vehicles.map(c => c.body_type))];
bodyTypes.forEach(type => {
  const typeCars = vehicles.filter(c => c.body_type === type);
  const slug = slugify(type);
  fs.writeFileSync(
    path.join(DIST_DIR, `${slug}.html`),
    renderHubPage(`Premium Certified ${type} Portfolio`, `High-capacity luxury architectures optimized for performance and lifestyle integration.`, typeCars)
  );
  console.log(`[Programmatic Segment Created]: /${slug}.html`);
});

// 5. Компиляция главной страницы как корневого хаба связей всего графа
const indexHtml = renderHubPage(
  "YISHU Luxury Asset Infrastructure",
  "The premier AI-First node for high-performance and executive vehicle acquisition. Curated hardware, verified provenance.",
  vehicles
);
fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml);
console.log(`[Root Knowledge Node Compiled]: /index.html`);
