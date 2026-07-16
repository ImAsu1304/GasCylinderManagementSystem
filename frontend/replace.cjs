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
      if(file.endsWith('.jsx') || file.endsWith('.css')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Exclude index.css from replacements since we just completely rewrote it
  if (f.includes('index.css')) return;
  
  // Specific replacements
  let newContent = content.replace(/glass-/g, 'neo-');
  newContent = newContent.replace(/toast-glass/g, 'toast-neo');
  
  // Replace the isolated 'glass' className
  newContent = newContent.replace(/className="glass"/g, 'className="neo-card"');
  newContent = newContent.replace(/className='glass'/g, "className='neo-card'");
  newContent = newContent.replace(/className=\{(.*?)\bglass\b(.*?)\}/g, 'className={$1neo-card$2}');
  
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated: ' + f);
  }
});
