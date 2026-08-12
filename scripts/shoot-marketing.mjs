import { chromium } from 'playwright';

const files = [
  'gems-post-clientes-sin-control.html',
  'gems-post-crecimiento-sin-base.html',
  'gems-post-equipo-desconectado.html',
  'gems-post-todo-en-un-lugar.html',
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1080 },
  deviceScaleFactor: 2, // -> exporta a 2160x2160 real
});

for (const f of files) {
  await page.goto(`http://localhost:8899/${f}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200); // deja terminar animaciones de entrada
  const out = `marketing-screenshots/${f.replace('.html', '.png')}`;
  await page.screenshot({ path: out });
  console.log('OK ->', out);
}

await browser.close();
