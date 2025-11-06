const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../assets');
const destDir = process.env.output ? path.resolve(process.env.output) : path.resolve(__dirname, '../../wwwroot/lib/codefox');
// To set a custom output folder
// macOS/Linux:
//      output=../directory_name npm install <package-name>
// Windows PowerShell:
//      $env:output='../directory_name'; npm install <package-name>

function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // For assets/css, only copy *.min.css files inside
      if (path.relative(srcDir, srcPath) === 'css') {
        const cssFiles = fs.readdirSync(srcPath).filter(f => f.endsWith('.min.css'));

        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });

        cssFiles.forEach(file => {
          fs.copyFileSync(path.join(srcPath, file), path.join(destPath, file));
          console.log(`Copied ${file} to ${destPath}`);
        });
      } else {
        copyFiles(srcPath, destPath); // Recurse on other dirs
      }
    } else {
      // For files, skip *.html and copy everything else
      if (!entry.name.endsWith('.html')) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${entry.name} to ${destPath}`);
      }
    }
  });
}

copyFiles(srcDir, destDir);
