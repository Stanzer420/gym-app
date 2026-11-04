# Gain

A personal installable web app (PWA) for logging gym sets, PRs and food.

This repository contains **app code only**. No personal data lives here.
On first start the app asks for a GitHub fine-grained token for a separate
private data repository, downloads the seed data and photos from it, and
stores everything locally in IndexedDB. Backups are written back to that
private repository.

- `index.html` – the whole app
- `sw.js` – service worker for offline use (bump `VERSION` on each deploy)
- `vendor/zxing/` – [zxing-wasm](https://github.com/Sec-ant/zxing-wasm) 3.1.6 reader build, MIT licence, bundled for offline barcode scanning
- Product data: [Open Food Facts](https://world.openfoodfacts.org), ODbL
