/**
 * Extract Critical CSS for inline in <head>
 * Run: node extract-critical-css.js
 */

const fs = require('fs');
const path = require('path');

// Critical CSS - Above the fold only
const criticalCSS = `
/* Critical CSS - Above the fold */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;font-family:Garet,system-ui,sans-serif}
body{margin:0;background:#f9fafb;color:#1c1c1c;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
h1,h2,h3,h4,h5,h6{font-family:Against,serif;color:#063a3d;font-weight:400}
.container-sumak{max-width:80rem;margin:0 auto;padding:0 1rem}
@media(min-width:768px){.container-sumak{padding:0 1.5rem}}
@media(min-width:1024px){.container-sumak{padding:0 2rem}}
`.trim();

// Generate critical.css file
const outputPath = path.join(__dirname, 'src', 'critical.css');
fs.writeFileSync(outputPath, criticalCSS, 'utf8');

console.log('✅ Critical CSS extracted!');
console.log(`📍 Location: ${outputPath}`);
console.log(`📊 Size: ${Buffer.byteLength(criticalCSS, 'utf8')} bytes`);
console.log('\n📝 Next steps:');
console.log('1. Add to index.html: <style>{{CRITICAL_CSS}}</style>');
console.log('2. Load main CSS with media="print" onload="this.media=\'all\'"');
