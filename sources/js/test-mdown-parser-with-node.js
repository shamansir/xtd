var fs = require('fs');
var util = require('util');
var PEG = require('pegjs');

require('./parser-defs');

try {
    var parser = PEG.buildParser(
                  fs.readFileSync('../peg/markdown.pegjs', 'utf-8'));
    var testContent = fs.readFileSync('../peg/mdown-test/testfiles/bom.md', 'utf-8');

   /*var parser = PEG.buildParser(
      'start = ruleOne' + '\n\n' +
      'ruleOne = a:ruleTwo { return a; }' + '\n\n' +
      'ruleTwo = z:"a" (( start:("b" { return 24 }) "c" { return start; } )' +
                       '( "d" )*' +
                       '( "e" { return "z" } )*' +
                      ')+' +
                       '{ return start } ');
   var result = parser.parse("abcdddeeebcddeeee"); */
   var result = parser.parse(testContent);
   console.log('=====');
   console.log('result:', util.inspect(result,false,null));
   console.log('=====');
   console.log('g_state:', util.inspect(g_state,false,null));
} catch(e) {
   console.log(e);
}

