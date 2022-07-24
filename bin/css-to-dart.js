// Generate from CSS from IcoMoon
// https://icomoon.io/app/

const fs = require('fs');

const kDartKeywords = [
  'abstract', 'else', 'import', 'super', 'as', 'enum', 'in', 'switch',
  'assert', 'export', 'interface', 'sync', 'async', 'extends', 'is',
  'this', 'await', 'extension', 'library', 'throw', 'break', 'external',
  'mixin', 'true', 'case', 'factory', 'new', 'try', 'class', 'final',
  'catch', 'false', 'null', 'typedef', 'on', 'var', 'const', 'finally',
  'operator', 'void', 'continue', 'for', 'part', 'while', 'covariant',
  'Function', 'rethrow', 'with', 'default', 'get', 'return', 'yield',
  'deferred', 'hide', 'set', 'do', 'if', 'show', 'dynamic', 'implements', 
  'static',
];

const kRegexSCSS = /.icon-(.*):before {\n.*: "\\(.*)";\n}/g;

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: ./node css-to-dart.js <input-css> <output-dart>');
  process.exit(1);
}

const cssFilePath = args[0];
const dartFilePath = args[1];

const buf = [];
buf.push('// ignore_for_file: constant_identifier_names\n');
buf.push("import 'package:flutter/widgets.dart';\n");

buf.push('/// A description of an icon fulfilled by a font glyph.');
buf.push('class FileIconsData extends IconData {');
buf.push('  const FileIconsData(int code)');
buf.push('      : super(');
buf.push('          code,');
buf.push("          fontFamily: 'FileIcons',");
buf.push("          fontPackage: 'file-icons',");
buf.push('        );');
buf.push('}\n');

buf.push('/// Use with the Icon class to show specific icons.');
buf.push('class FileIcons {');

/// Parse
console.log('Parsing:', cssFilePath);
const data = fs.readFileSync(cssFilePath, { encoding: 'utf8' });
let counter = 0;
const matches = data.matchAll(kRegexSCSS);

for (const match of matches) {
  if (match.length !== 3) {
    throw new Error('Invalid match');
  }
  let name = match[1].replace(/-/g, '_').toLowerCase();
  const code = match[2];

  // If the name is a Dart keyword, sufix it with `_icon`
  console.log('Checking:', name);
  if (kDartKeywords.includes(name)) {
    name = `${name}_icon`;
  }

  // Specific names
  if (name.startsWith('_')) {
    name = 'underscore_';
  }

  buf.push(`  /// ${name}`);
  buf.push(`  static const IconData ${name} = FileIconsData(0x${code});\n`);

  counter++;
}

buf.push('}\n');

// Write
fs.writeFileSync(dartFilePath, buf.join('\n'));
console.log('Write source to:', dartFilePath);
console.log('Total:', counter);
