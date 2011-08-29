var fs = require('fs');
var PEG = require('pegjs');

require('./parser-defs');

try {
    var parser = PEG.buildParser(
                  fs.readFileSync('../peg/markdown.pegjs', 'utf-8'));
    var testContent = fs.readFileSync('../peg/mdown-test/testfiles/bom.md', 'utf-8');

   /* var parser = PEG.buildParser(
      'start = ruleOne' + '\n\n' +
      'ruleOne = a:ruleTwo { console.log("a => " + a); return a; }' + '\n\n' +
      'ruleTwo = z:"a" (( b:("b" { return "x" }) "c" { return b + "y" } )' +
                       '( "d" { return "w" } )*' +
                       '( ("e") { return "m" } )*' +
                      ')+' +
                       '{ return "z ~~ " + z; }' );
   var result = parser.parse("abcdddeee"); */
   var result = parser.parse(testContent);
   console.log(result);
   console.log('=====');
} catch(e) {
   console.log(e);
}

