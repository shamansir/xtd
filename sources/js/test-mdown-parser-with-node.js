var fs = require('fs');
var PEG = require('pegjs');

require('./parser-defs');

var parser = PEG.buildParser(
                    fs.readFileSync('../peg/markdown.pegjs', 'utf-8'));
var testFile = fs.readFileSync('~/home/shamansir/Worktable/peg-markdown-highlight/testfiles/bom.md', 'utf-8');

var result = parser.parse(testFile);
console.log(result);

