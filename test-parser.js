var LANG = 'en';

var assert = require('assert');
var todo = require('./todo-builder');
var parser = require('./parser-'+LANG);

parser.init({ strip_time: true });

assert.notEqual(parser.parse('make cubert pay').code(),
                parser.parse('buy some cogs').code());

// Gingerbeard: !?,"':()-/@_
//              :/&()-+
//              #;@'"?!,
// Swift: @#%&*-+=/
//        _$^"':;

// tags: #tag-1, tag:tag-2
// priority: !max, !4, !12, !-2, !!!, !!
// locations: @location-1, :location-2, loc:location-3, -- location-4, location-5<end-of-line>
// participant: ~participant-1, %participant-2, *participant-3, &participant-7, usr:participant_4, :: participant-5, participant-6<end-of-line>
// projects: +project-1, !project-2, prj:project-3, <start-of-line>project-6, project-7:, // project-4, project-5<end-of-line>
// todo: /247, /PRJ-12, /prj-12, PRJ-12, $prj-12, #247, :247, /prev, /next, lnk:247, lnk:PRJ-12
// todo content: +PRJ-12+, +247+, /cont, cnt:PRJ-12, cnt:prj-12, cnt:247
// macro: /name:param1,param2=value-2/, /name-2?param-1,param-2=value-2/

// no stuff
assert.equal(parser.parse('reduce Leela\'s salary').code(),
             todo.text('reduce Leela\'s salary').build().code());
// today
assert.equal(parser.parse('fix TV in the hall today').code(),
             todo.text('fix TV in the hall').today().build().code());
assert.equal(parser.parse('tdy: give Cubert a hug').code(),
             todo.text('give Cubert a hug').today().build().code());
assert.equal(parser.parse('Mom comes today, I suppose she\'ll make some noise').code(),
             todo.text('Mom comes, I suppose she\'ll make some noise').today().build().code());
// tomorrow
assert.equal(parser.parse('we must deliver 72 cocks to Vinci tomorrow morning').code(),
             todo.text('we must deliver 72 cocks to Vinci').tomorrow().time(9).build().code());
assert.equal(parser.parse('also, tmrw a meeting at 19h').code(),
             todo.text('also, a meeting').tomorrow().time(19).build().code());
assert.equal(parser.parse('time machine will return back +1d +12h55m').code(),
             todo.text('time machine will return').tomorrow().add(todo.HRS, 12).add(todo.MNT, 55).build().code());
// yesterday
assert.equal(parser.parse('good news, yesterday will become tomorrow').code(),
             todo.text('good news will become tomorrow').yesterday().build().code());
assert.equal(parser.parse('ytrd, 8PM, shaved my legs. just to remeber').code(),
             todo.text('shaved my legs. just to remember').yesterday().at(20).build().code());
// concrete date and/or time
assert.equal(parser.parse('Suppose, need to visit General Colin PM @23th evening').code(),
             todo.text('Suppose, need to visit General Colin PM').date(23).time(19).build().code());
assert.equal(parser.parse('Dec 25 2089 will be a last XMas').code(),
             todo.text('will be a last XMas').date(25, todo.DEC, 2089).build().code());
assert.equal(parser.parse('Einstein b-day 3-14-1879').code(),
             todo.text('Einstein b-day').date(14, todo.MAR, 1879).build().code());
assert.equal(parser.parse('19:23:10 Spunch on TV').code(),
             todo.text('Spunch on TV').time(19, 23, 10).build().code());
assert.equal(parser.parse('eggs bowled +23s approx').code(),
             todo.text('eggs bowled').now().add(todo.SEC, 23).build().code());
assert.equal(parser.parse('spring at 25 mar, great').code(),
             todo.text('spring, great').date(25, todo.MAR).build().code());
assert.equal(parser.parse('meeting at 12').code(),
             todo.text('meeting').time(12).build().code());
assert.equal(parser.parse('meeting at 5am').code(),
             todo.text('meeting').time(5).build().code());
assert.equal(parser.parse('12-18-2117 & 12-25-2125 Venus transit').code(),
             todo.text('Venus transit').date(18, todo.DEC, 2117).date(25, todo.DEC, 2125).build().code());
assert.equal(parser.parse('17h do not forget pay rent').code(),
             todo.text('do not forget pay rent').time(17).build().code());
assert.equal(parser.parse('sushi delivery ~12h17m').code(),
             todo.text('sushi delivery').time(12, 15).longs(5, todo.MIN).build().code());
assert.equal(parser.parse('sushi delivery 12h17m').code(),
             todo.text('sushi delivery').time(12, 17).build().code());
assert.equal(parser.parse('#good-news at 2am meeting room').code(),
             todo.text('#good-news meeting room').tag('good-news').time(2).build().code());
assert.equal(parser.parse('visit ~Zoidberg 13:10').code(),
             todo.text('visit ~Zoidberg').participant('Zoidberg').time(13, 10).build().code());
assert.equal(parser.parse('garlick toasts at lunch nom-nom-nom').code(),
             todo.text('garlick toasts nom-nom-no').time(17).build().code());
assert.equal(parser.parse('17 Apr 15:20 prepare two eggs, drop them on the road near @office').code(),
             todo.text('prepare two eggs, drop them on the road near @office').date(17, todo.APR).time(15, 20).location('office').build().code());
// describing time
assert.equal(parser.parse('friday, 18:30, iPad sale -20%').code(),
             todo.text('iPad sale -20%').weekday(todo.FRI).time(18, 30).build().code());
assert.equal(parser.parse('next tue ~Jenny will arrive @airport').code(),
             todo.text('~Jenny will arrive @airport').next(todo.WDY, todo.TUE).participant('Jenny').build().code());
assert.equal(parser.parse('news say a default planned #USA in two weeks').code(),
             todo.text('news say a default planned #USA').tag('USA').longs(2, todo.WKS).build().code());
// tags
assert.equal(parser.parse('ask #fry to deliver a #cell-package').code(),
             todo.text('ask #fry to deliver a #cell-package').tag(['fry', 'cell-package']).build().code());
assert.equal(parser.parse('ask #cubert to take a #cell-package, relates to tag:my-secret ').code(),
             todo.text('ask #cubert to take a #cell-package, it relates to #my-secret').tag(['fry', 'cell-package, my-secret']).build().code());
assert.equal(parser.parse('next year, maths conference').code(),
             todo.text('maths conference').date(1, 1).add(1, todo.YRS).longs(1, todo.YRS).build().code());
// priority
assert.equal(parser.parse('Keep #butterfly alive!!').code(),
             todo.text('Keep #butterfly alive!').priority(2).build().code());
assert.equal(parser.parse(' !!!!! &Spider-man should survive despite of &Octopus').code(),
             todo.text('~Spider-man should survive despite of ~Octopus').priority(5).participant(['octopus', 'spider-man']).build().code());
assert.equal(parser.parse('!2 Need some yoghurt for dinner').code(),
             todo.text('Need some yoghurt').time(13).priority(2).build().code());
assert.equal(parser.parse('Take out the garbadge !-2 evening').code(),
             todo.text('Take out the garbadge').time(19).priority(-2).build().code());
assert.equal(parser.parse('My life in danger !28').code(),
             todo.text('Mi life in danger').priority(28).build().code());
// locations
assert.equal(parser.parse('Continuum Problems Conference 23.11 @Omega-3').code(),
             todo.text('Continuum Problems Conference @Omega-3').date(23, todo.NOV).location('omega-3').tag('omega-3').build().code();
assert.equal(parser.parse('Continuum Problems Conference @Omega-3').code(),
             todo.text('Continuum Problems Conference @Omega-3').location('omega-3').tag('omega-3').build().code();
assert.equal(parser.parse('Meeting with ~Stevie #apple :California -- Apple Office, Cupertino, CA 95014, 1 Infinite Loop').code(),
             todo.text('Meeting with ~Stevie #apple :California').location(['apple-office', 'cupertino', 'ca-95014', '1-infinite-loop', 'california']).tag('apple').participant('stevie').build().code();
assert.equal(parser.parse('Take #spaceship from service 12h 37m or 13h15 -- Leone Ave. 32-17').code(),
             todo.text('Take #spaceship from service').time(12, 37).time(13, 15).location('leone-ave-32-17').tag('spaceship').build().code();
// participants
assert.equal(parser.parse('never tell *Leela about !my-secret, never').code(),
             todo.text('never tell ~Leela about +my-secret, never').project('my-secret').tag(['leela', 'my-secret']).build().code();
assert.equal(parser.parse('never tell *Leela about !my-secret, never').code(),
             todo.text('never tell ~Leela about +my-secret, never').project('my-secret').tag(['leela', 'my-secret']).build().code();
// projects
assert.equal(parser.parse('my-secret, machine: never tell #fry').code(),
             todo.text('my-secret, machine: never tell #fry').project(['my-secret', 'machine']).tag(['fry', 'my-secret']).build().code());
assert.equal(parser.parse('never tell #fry a bit of !my-secret').code(),
             todo.text('never tell #fry a bit of +my-secret').project('my-secret').tag(['fry', 'my-secret']).build().code());
assert.equal(parser.parse(' prj:my-secret never tell #fry').code(),
             todo.text('+my-secret never tell #fry').project('my-secret').tag(['fry', 'my-secret']).build().code();
assert.equal(parser.parse('never tell #Leela about +my-secret, never').code(),
             todo.text('never tell #Leela about +my-secret, never').project('my-secret').tag(['leela', 'my-secret']).build().code();
assert.equal(parser.parse('never tell #Leela about prj:my-secret, never').code(),
             todo.text('never tell #Leela about +my-secret, never').project('my-secret').tag(['leela', 'my-secret']).build().code();
assert.equal(parser.parse('new investigation planned  // time, may be nobel').code(),
             todo.text('new investigation planned').project(['time', 'may-be-nobel']).tag(['time', 'may-be-nobel']).build().code();
// run (occuring once)
// when done

