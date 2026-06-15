export async function onRequestPost(context) {
  const { request } = context;
  const newCar = await request.json();
  // Здесь нужен код для сохранения в GitHub (через API)
  // Для простоты — сохраняем в переменную окружения или KV
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
