// Глобальная переменная для всех машин
let allCars = [];

// Загружаем список машин при старте
async function loadCars() {
  const res = await fetch('/api/get-cars');
  const data = await res.json();
  allCars = data.cars;
  renderCatalog(allCars);
}

// Отрисовка каталога
function renderCatalog(cars) {
  const grid = document.getElementById('carsGrid');
  if (!grid) return;
  
  if (!cars.length) {
    grid.innerHTML = '<div class="loading">🚫 Машин не найдено</div>';
    return;
  }
  
  grid.innerHTML = cars.map(car => `
    <div class="car-card">
      <img src="${car.photos[0] || 'https://placehold.co/600x400/333/fff?text=No+Photo'}" alt="${car.brand} ${car.model}">
      <div class="card-content">
        <h3>${car.brand} ${car.model} ${car.year}</h3>
        <p>${car.mileage.toLocaleString()} км • ${car.fuel}</p>
        <div class="price">$${car.price.toLocaleString()}</div>
        <a href="/car.html?id=${car.id}" class="btn">Подробнее →</a>
      </div>
    </div>
  `).join('');
}

// Поиск и фильтр
function filterCars() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const brand = document.getElementById('brandFilter')?.value || '';
  const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
  
  const filtered = allCars.filter(car => {
    const matchSearch = `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm);
    const matchBrand = !brand || car.brand === brand;
    const matchPrice = car.price <= maxPrice;
    return matchSearch && matchBrand && matchPrice;
  });
  renderCatalog(filtered);
}

// Загрузка страницы карточки
async function loadCarPage(carId) {
  const container = document.getElementById('carContainer');
  const res = await fetch('/api/get-cars');
  const data = await res.json();
  const car = data.cars.find(c => c.id === carId);
  
  if (!car) {
    container.innerHTML = '<p>❌ Машина не найдена</p>';
    return;
  }
  
  // Адаптивная галерея (мобила/десктоп)
  const photosHtml = car.photos.map((photo, i) => {
    const isDesktopOnly = i >= 2 ? 'desktop-only' : '';
    return `<img src="${photo}" class="${isDesktopOnly}" loading="lazy">`;
  }).join('');
  
  container.innerHTML = `
    <a href="/" class="back-link">← Назад к каталогу</a>
    <h1>${car.brand} ${car.model} ${car.year}</h1>
    <div class="price">$${car.price.toLocaleString()}</div>
    <div class="car-specs">
      <p>📏 Пробег: ${car.mileage.toLocaleString()} км</p>
      <p>⛽ Топливо: ${car.fuel}</p>
      <p>⚙ Коробка: ${car.transmission}</p>
      <p>🔧 Привод: ${car.drive}</p>
      <p>🔑 VIN: ${car.vin}</p>
    </div>
    <div class="gallery" style="display:grid; gap:12px; margin:24px 0; grid-template-columns:1fr">
      ${photosHtml}
    </div>
    <div class="buttons">
      <a href="tel:+1234567890" class="btn-call">📞 Позвонить</a>
      <a href="https://wa.me/1234567890" class="btn-wa">💬 WhatsApp</a>
    </div>
    <div class="contact-box">
      <h3>🚙 Записаться на тест-драйв</h3>
      <input type="text" placeholder="Имя" id="name">
      <input type="tel" placeholder="Телефон" id="phone">
      <button onclick="alert('Заявка отправлена!')">Отправить</button>
    </div>
    <style>
      .gallery { display: grid; gap: 12px; }
      @media (min-width: 768px) { .gallery { grid-template-columns: repeat(2,1fr); } }
      .desktop-only { display: none; }
      @media (min-width: 768px) { .desktop-only { display: block; } }
      .btn-call, .btn-wa { display: inline-block; padding: 12px 24px; border-radius: 40px; text-decoration: none; margin-right: 12px; font-weight: bold; }
      .btn-call { background: #00a86b; color: white; }
      .btn-wa { background: #25D366; color: white; }
      .contact-box { background: #f0f0f0; padding: 20px; border-radius: 24px; margin: 24px 0; }
      .contact-box input { width: 100%; padding: 12px; margin: 8px 0; border-radius: 40px; border: 1px solid #ccc; }
      .contact-box button { background: #1a1a1a; color: white; padding: 12px; border: none; border-radius: 40px; width: 100%; }
    </style>
  `;
}

// Если мы на главной странице — запускаем каталог
if (document.getElementById('carsGrid')) {
  loadCars();
  document.getElementById('searchInput')?.addEventListener('input', filterCars);
  document.getElementById('brandFilter')?.addEventListener('change', filterCars);
  document.getElementById('maxPrice')?.addEventListener('input', filterCars);
}
