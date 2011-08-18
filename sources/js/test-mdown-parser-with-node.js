var fs = require('fs');
var PEG = require('pegjs');

require('./parser-defs');

var parser = PEG.buildParser(
                  fs.readFileSync('/home/shamansir/Workspace/xtd/sources/peg/markdown.pegjs', 'utf-8'));
var testContent = fs.readFileSync('/home/shamansir/Worktable/peg-markdown-highlight/testfiles/bom.md', 'utf-8');

var result = parser.parse(testContent);
console.log(result);

