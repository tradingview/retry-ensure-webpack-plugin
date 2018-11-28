const fs = require('fs');
const rimraf = require('rimraf');

rimraf.sync('dist');
fs.mkdirSync('dist');

let template = fs.readFileSync('build/injected-template.js', 'utf-8');
template = template.replace(/^\s*(['"]use strict['"];?\n?)/, '').trim();


let pluginCode = fs.readFileSync('build/retry-ensure-webpack-plugin.js', 'utf-8');
pluginCode = pluginCode.replace('_TEMPLATE_PLACEHOLDER', '`\n' + template.replace(/(?=\\|`|\$\{)/g) + '\n`');

fs.writeFileSync('dist/retry-ensure-webpack-plugin.js', pluginCode);

fs.copyFileSync('build/retry-ensure-webpack-plugin.d.ts', 'dist/retry-ensure-webpack-plugin.d.ts');
fs.copyFileSync('build/readme.md', 'dist/readme.md');

const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
delete pkgJson.private;
delete pkgJson.devDependencies;
delete pkgJson.scripts;
fs.writeFileSync('dist/package.json', JSON.stringify(pkgJson, null, 2));
