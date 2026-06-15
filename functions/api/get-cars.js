export async function onRequest(context) {
  // В реальном проекте читаешь из переменной окружения или KV
  // Пока возвращаем статический cars.json
  const response = await fetch('https://raw.githubusercontent.com/ТВОЙ_АККАУНТ/abccars-system/main/cars.json');
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
