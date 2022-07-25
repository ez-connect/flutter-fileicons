// Generate Dart source from CSS
// https://www.npmjs.com/package/svgtofont

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

const kRegexSCSS = /-(.*):before { content: "\\(.*)"; }/g;

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: ./node css-to-dart.js <input-css> <output-icon-data-dart>');
  process.exit(1);
}

const cssFilePath = args[0];
const dartFilePath = args[1];

const stream = fs.createWriteStream(dartFilePath)

// Data
stream.write('// ignore_for_file: constant_identifier_names\n\n');
stream.write("import 'package:flutter/widgets.dart';\n\n");

stream.write('/// A description of an icon fulfilled by a font glyph.\n');
stream.write('class FileIconsData extends IconData {\n');
stream.write('  const FileIconsData(int code)\n');
stream.write('      : super(\n');
stream.write('          code,\n');
stream.write("          fontFamily: 'FileIcons',\n");
stream.write("          fontPackage: 'file-icons',\n");
stream.write('        );\n');
stream.write('}\n\n');

stream.write('/// Use with the Icon class to show specific icons.\n');
stream.write('class FileIcons {\n');

/// Parse
console.log('Parsing:', cssFilePath);
const data = fs.readFileSync(cssFilePath, { encoding: 'utf8' });
const mapping = {};
let counter = 0;
const matches = data.matchAll(kRegexSCSS);

for (const match of matches) {
  if (match.length !== 3) {
    throw new Error('Invalid match');
  }
  let name = match[1].replace(/-/g, '_').toLowerCase();
  const code = match[2];

  stream.write(`  /// ${name}\n`); // origin name
  mapping[name] = `0x${code}`;

  // If the name is a Dart keyword, sufix it with `_icon`
  if (kDartKeywords.includes(name)) {
    name = `${name}_icon`;
  }

  // Specific names
  if (name.startsWith('1') || name.startsWith('3') || name.startsWith('4')) {
    name = `i${name}`;
  }

  if (name.includes('.')) {
    name = name.replaceAll('.', '_');
  }

  if (name.includes('\+')) {
    name = name.replaceAll('\+', '_plus');
  }

  if (name.includes('#')) {
    name = name.replaceAll('#', '_sharp');
  }

  stream.write(`static const ${name} = FileIconsData(0x${code});\n\n`);

  counter++;
}

stream.write('}\n');

// Mapping
stream.write('\n');
stream.write('const FileIconsMapping = ');
stream.write(JSON.stringify(mapping, null, 2));
stream.write(';\n');

stream.end();

console.log('Write source to:', dartFilePath);
console.log('Total:', counter);
