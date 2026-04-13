/**
 * Generate sitemap.xml dynamically
 * Run: node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const baseUrl = 'https://sumakgourmet.co';
const today = new Date().toISOString().split('T')[0];

// Product slugs (sync with catalog.service.ts)
const productSlugs = [
  'kuntur-dorado',
  'sol-caribeno',
  'zipa-real',
  'magia-colombiana',
  'mama-killa',
  'raiz-de-fuego',
  'viejo-amigo',
  'zipa-supremo',
  'ritual-de-agave',
  'killa-sagrada',
  'kuntur-andino',
  'pasion-andina',
  'selva-nocturna',
  'parche-fino'
];

const urls = [
  // Main pages
  { loc: '/', lastmod: today, changefreq: 'weekly', priority: 1.0 },
  { loc: '/catalog', lastmod: today, changefreq: 'daily', priority: 0.9 },
  
  // Product pages
  ...productSlugs.map(slug => ({
    loc: `/ritual/${slug}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.9
  })),
  
  // Corporate & Services
  { loc: '/regalos-corporativos', lastmod: today, changefreq: 'weekly', priority: 0.9 },
  { loc: '/experiencias', lastmod: today, changefreq: 'weekly', priority: 0.8 },
  { loc: '/cotizacion-corporativa', lastmod: today, changefreq: 'monthly', priority: 0.8 },
  
  // Info pages
  { loc: '/about', lastmod: today, changefreq: 'monthly', priority: 0.7 },
  { loc: '/contact', lastmod: today, changefreq: 'monthly', priority: 0.7 },
  { loc: '/faq', lastmod: today, changefreq: 'monthly', priority: 0.6 },
  { loc: '/politica-tratamiento-datos', lastmod: today, changefreq: 'yearly', priority: 0.3 }
];

const urlsXML = urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;

const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log('✅ Sitemap generated successfully!');
console.log(`📍 Location: ${outputPath}`);
console.log(`📊 Total URLs: ${urls.length}`);
console.log(`📅 Last modified: ${today}`);
