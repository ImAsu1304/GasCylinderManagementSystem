const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.css') && !file.includes('index.css')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Remove backdrop-filter lines completely
  content = content.replace(/.*backdrop-filter.*?;/g, '');
  
  // Replace old neo variables that don't exist anymore
  content = content.replace(/var\(--neo-blur-heavy\)/g, '0');
  content = content.replace(/var\(--neo-border\)/g, 'var(--border-color)');
  
  // Convert any rgba dark backgrounds to light neobrutalist colors
  content = content.replace(/rgba\(10, 14, 39, [0-9.]+\)/g, 'var(--bg-secondary)');
  content = content.replace(/rgba\(15, 20, 50, [0-9.]+\)/g, 'var(--bg-secondary)');
  content = content.replace(/rgba\(255, 255, 255, [0-9.]+\)/g, 'var(--bg-secondary)');
  
  // Fix shadow references
  content = content.replace(/var\(--shadow-elevated\)/g, 'var(--shadow-xl)');
  content = content.replace(/0 0 20px var\(--accent-glow\)/g, 'var(--shadow-sm)');
  
  // Make borders thick
  content = content.replace(/border-radius: var\(--radius-full\)/g, 'border-radius: var(--radius-sm); border: var(--border-width) solid var(--border-color)');
  
  fs.writeFileSync(f, content);
  console.log('Cleaned CSS: ' + f);
});
