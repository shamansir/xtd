var fs = require('fs');
var PEG = require('pegjs');

var pegPath = process.cwd() + '/../peg';

try {
    var parser = PEG.buildParser(
                  fs.readFileSync(pegPath + '/markdown.pegjs', 'utf-8'));
    var testContent = fs.readFileSync(pegPath + '/mdown-test/complex-lists.md', 'utf-8');

    var result = parser.parse(testContent);
    console.log('=====');
    console.log('result:', result.toString());
} catch(e) {
    console.log('error',e);
    throw e;
}

