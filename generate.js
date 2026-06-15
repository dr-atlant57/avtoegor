const fs = require('fs');
const path = require('path');

// Читаем список машин
const data = fs.readFileSync(path.join(__dirname, 'cars-list.txt'), 'utf8');
const cars = data.split('---').map(block => {
  const lines = block.trim().split('\n');
  const car = {};
  lines.forEach(line => {
    const [key, ...val] = line.split(':');
    if (key && val) car[key.trim()] = val.join(':').trim();
  });
  return car;
}).filter(car => car.slug);

// Шаблон канонической страницы
const template = (car) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${car.year} ${car.make} ${car.model} ${car.trim} | For Sale Golden Valley</title>
  <meta name="description" content="Pre-owned ${car.year} ${car.make} ${car.model} in ${car.color}. ${car.mileage} miles, ${car.drivetrain}. Clean title. Price: $${car.price}.">
  <link rel="canonical" href="https://yishu.business/cars/${car.slug}.html">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "name": "${car.year} ${car.make} ${car.model} ${car.trim}",
    "modelYear": ${car.year},
    "color": "${car.color}",
    "driveWheelConfiguration": "${car.drivetrain}",
    "mileageFromOdometer": { "@type": "QuantitativeValue", "value": ${car.mileage.replace(',', '')}, "unitCode": "SMI" },
    "offers": { "@type": "Offer", "price": "${car.price}", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
  }
  </script>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    :root { --bg: #0a0a0c; --text: #f3f4f6; --accent: #ff4d4d; --surface: #16161a; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: var(--bg); color: var(--text); font-family: -apple-system, sans-serif; line-height: 1.6; overflow-x: hidden; }
    .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem; }
    .badge { background: var(--accent); color: #fff; padding: 0.3rem 0.8rem; font-size: 0.8rem; font-weight: bold; border-radius: 4px; margin-bottom: 1rem; }
    h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem; }
    .trim { font-size: 1.5rem; color: #888; margin-bottom: 1.5rem; }
    .price { font-size: 2.5rem; font-weight: bold; color: #4ade80; margin-bottom: 2rem; }
    .image-container { width: 100%; max-width: 900px; aspect-ratio: 16/9; background: #111; border-radius: 12px; overflow: hidden; }
    .image-container img { width: 100%; height: 100%; object-fit: cover; }
    @supports (animation-timeline: scroll()) { .image-container img { animation: scaleImage linear both; animation-timeline: scroll(); animation-range: start 0% exit 100%; } }
    @keyframes scaleImage { to { transform: scale(1.1) translateY(20px); } }
    .specs { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
    .specs h2 { margin-bottom: 2rem; font-size: 2rem; text-align: center; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    .card { background: var(--surface); padding: 1.5rem; border-radius: 8px; border: 1px solid #222; }
    .card span { color: #666; display: block; font-size: 0.9rem; }
    .card strong { font-size: 1.2rem; color: #fff; }
    .lead-form { background: var(--surface); padding: 5rem 2rem; display: flex; justify-content: center; }
    .form-box { width: 100%; max-width: 500px; text-align: center; }
    form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
    input { background: #000; border: 1px solid #333; padding: 1rem; border-radius: 6px; color: #fff; font-size: 1rem; }
    .cf-turnstile { display: flex; justify-content: center; }
    button { background: var(--accent); color: #fff; border: none; padding: 1.2rem; border-radius: 6px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <header class="hero">
    <span class="badge">🔥 Hot Offer / ${car.drivetrain}</span>
    <h1>${car.year} ${car.make} ${car.model}</h1>
    <p class="trim">${car.trim} Trim</p>
    <div class="price">$${Number(car.price).toLocaleString()}</div>
    <div class="image-container">
      <img src="../${car.image}" alt="${car.make} ${car.model}">
    </div>
  </header>
  <main class="specs">
    <h2>Vehicle Specifications</h2>
    <div class="grid">
      <div class="card"><span>Mileage:</span> <strong>${car.mileage} miles</strong></div>
      <div class="card"><span>Drivetrain:</span> <strong>${car.drivetrain}</strong></div>
      <div class="card"><span>Engine:</span> <strong>${car.engine}</strong></div>
      <div class="card"><span>Exterior Color:</span> <strong>${car.color}</strong></div>
    </div>
  </main>
  <section class="lead-form">
    <div class="form-box">
      <h3>Schedule a Test Drive</h3>
      <form action="#" method="POST">
        <input type="text" name="name" placeholder="Your Name" required>
        <input type="tel" name="phone" placeholder="Phone Number" required>
        <div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="dark"></div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  </section>
</body>
</html>`;

// Создаем папку cars, если её нет
const carsDir = path.join(__dirname, 'cars');
if (!fs.existsSync(carsDir)) fs.mkdirSync(carsDir);

// Генерируем файлы страниц
cars.forEach(car => {
  fs.writeFileSync(path.join(carsDir, `${car.slug}.html`), template(car));
  console.log(`✅ Страница сгенерирована: cars/${car.slug}.html`);
});
