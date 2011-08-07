var LANG = 'en';

var assert = require('assert');
var todo = require('./todo-builder');
var parser = require('./parser-'+LANG);

parser.init({ strip_time: true });

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

assert.notEqual(parser.parse('make cubert pay').code(),
                parser.parse('buy some cogs').code());

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
             todo.text('time machine will return').tomorrow().add(todo.HOUR, 12).add(todo.MNT, 55).build().code());
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
assert.equal(parser.parse('meeting 15 jan').code(),
             todo.text('meeting').date(15, todo.JAN).build().code());
assert.equal(parser.parse('meeting at 12').code(),
             todo.text('meeting').time(12).build().code());
assert.equal(parser.parse('meeting at 5am').code(),
             todo.text('meeting').time(5).build().code());
assert.equal(parser.parse('meeting @ 5am').code(),
             todo.text('meeting').time(5).build().code());
assert.equal(parser.parse('meeting @5pm').code(),
             todo.text('meeting').time(17).build().code());
assert.equal(parser.parse('meeting thursday').code(),
             todo.text('meeting').cur(todo.WEEKDAY, todo.THU).build().code());
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
assert.equal(parser.parse('7 september 1812 Borodino').code(),
             todo.text('Borodino').date(7, todo.SEP, 1812).build().code());
assert.equal(parser.parse('ATD first code 03-08-11').code(),
             todo.text('ATD first code').date(3, todo.AUG, 2011).build().code());
assert.equal(parser.parse('6PM Thursday, August 4th, 2011 MeetUp 20th Floor -- 345 California Street, San Francisco').code(),
             todo.text('MeetUp 20th Floor').time(18).date(4, todo.AUG, 2011)
             location(['345-california-street', 'san-francisco']).build().code());
// describing time
assert.equal(parser.parse('friday, 18:30, iPad sale -20%').code(),
             todo.text('iPad sale -20%').cur(todo.WEEKDAY, todo.FRI).time(18, 30).build().code());
assert.equal(parser.parse('next tue ~Jenny will arrive @airport').code(),
             todo.text('~Jenny will arrive @airport').align(todo.WEEKDAY, todo.TUE).participant('Jenny').build().code());
assert.equal(parser.parse('news say a default planned #USA in two weeks').code(),
             todo.text('news say a default planned #USA').tag('USA').longs(todo.WEEK, 2).build().code());
assert.equal(parser.parse('first friday next month Day of Portality').code(),
             todo.text('Day of Portality').add(todo.MTH).date(1).align(todo.WEEKDAY, todo.FRI).build().code());
assert.equal(parser.parse('2nd wed every month Day of Loot').code(),
             todo.text('Day of Loot').every(todo.MTH).build().code());
assert.equal(parser.parse('next month 25th must finish +time-machine').code(),
             todo.text('must finish +time-machine').align(todo.DAY, 25).build().code());
assert.equal(parser.parse('meeting next thursday at 12h').code(),
             todo.text('meeting').add(todo.WEEK, 1).align(todo.WEEKDAY, todo.THU).time(12).build().code());
assert.equal(parser.parse('meeting tomorrow at 12:15').code(),
             todo.text('meeting').tomorrow().time(12, 15).build().code());
assert.equal(parser.parse('salary tomorrow at 15h').code(),
             todo.text('salary').tomorrow().time(15).build().code());
assert.equal(parser.parse('buy some tasties this evening').code(),
             todo.text('buy some tasties').time(19).build().code());
// tags
assert.equal(parser.parse('ask #fry to deliver a #cell-package').code(),
             todo.text('ask #fry to deliver a #cell-package').tag(['fry', 'cell-package']).build().code());
assert.equal(parser.parse('ask #cubert to take a #cell-package, relates to tag:my-secret ').code(),
             todo.text('ask #cubert to take a #cell-package, it relates to #my-secret').tag(['cubert', 'cell-package, my-secret']).build().code());
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
             todo.text('Continuum Problems Conference @Omega-3').date(23, todo.NOV).location('omega-3').tag('omega-3').build().code());
assert.equal(parser.parse('Continuum Problems Conference @Omega-3').code(),
             todo.text('Continuum Problems Conference @Omega-3').location('omega-3').tag('omega-3').build().code());
assert.equal(parser.parse('Meeting with ~Stevie #apple :California -- Apple Office, Cupertino, CA 95014, 1 Infinite Loop').code(),
             todo.text('Meeting with ~Stevie #apple :California').location(['apple-office', 'cupertino', 'ca-95014', '1-infinite-loop', 'california']).tag('apple').participant('stevie').build().code());
assert.equal(parser.parse('Take #spaceship from service 12h 37m or 13h15 -- Leone Ave. 32-17').code(),
             todo.text('Take #spaceship from service').time(12, 37).time(13, 15).location('leone-ave-32-17').tag('spaceship').build().code());
// participants
assert.equal(parser.parse('never tell *Leela about !my-secret, never').code(),
             todo.text('never tell ~Leela about +my-secret, never').project('my-secret').participant('Leela').tag(['leela', 'my-secret']).build().code());
assert.equal(parser.parse('never tell *Leela about !my-secret, never').code(),
             todo.text('never tell ~Leela about +my-secret, never').project('my-secret').participant('Leela').tag(['leela', 'my-secret']).build().code());
assert.equal(parser.parse('will celebrate #party at @McDonalds :: The Crashinator, Bender, Calculon, Chanukah, Johny J. Doodle').code(),
             todo.text('will celebrate party at @McDonalds').location('mcdonalds').participant(['The Crashinator', 'Bender', 'Calculon', 'Chanukah', 'Johny J. Doodle']).tag('party').build().code());
// projects
assert.equal(parser.parse('my-secret, machine: never tell #fry').code(),
             todo.text('my-secret, machine: never tell #fry').project(['my-secret', 'machine']).tag(['fry', 'my-secret']).build().code());
assert.equal(parser.parse('never tell #fry a bit of !my-secret').code(),
             todo.text('never tell #fry a bit of +my-secret').project('my-secret').tag(['fry', 'my-secret']).build().code());
assert.equal(parser.parse(' prj:my-secret never tell #fry').code(),
             todo.text('+my-secret never tell #fry').project('my-secret').tag(['fry', 'my-secret']).build().code());
assert.equal(parser.parse('never tell #Leela about +my-secret, never').code(),
             todo.text('never tell #Leela about +my-secret, never').project('my-secret').tag(['leela', 'my-secret']).build().code());
assert.equal(parser.parse('never tell #Leela about prj:my-secret, never').code(),
             todo.text('never tell #Leela about +my-secret, never').project('my-secret').tag(['leela', 'my-secret']).build().code());
assert.equal(parser.parse('new investigation planned // time, may be nobel').code(),
             todo.text('new investigation planned').project(['time', 'may-be-nobel']).tag(['time', 'may-be-nobel']).build().code());
// plus-minus
assert.equal(parser.parse('learn japanese +7h').code(),
             todo.text('learn japanese').add(todo.HOUR, 7).build().code());
assert.equal(parser.parse('zoidberg consultation +1w +1y').code(),
             todo.text('learn japanese').add(todo.WEEK, 1).add(todo.YRS, 1).build().code());
assert.equal(parser.parse('wedding day -3d every year').code(),
             todo.text('wedding day').add(todo.YRS, -3).repeats(todo.YRS).build().code());
assert.equal(parser.parse('meeting in two HOUR').code(),
             todo.text('meeting').add(todo.HOUR, 2).build().code());
assert.equal(parser.parse('meeting in two HOUR fwd').code(),
             todo.text('meeting').add(todo.HOUR, 2).build().code());
assert.equal(parser.parse('diploma must be done in 3 weeks').code(),
             todo.text('diploma must be done').add(todo.WEEK, 3).build().code());
assert.equal(parser.parse('anniversary next month').code(),
             todo.text('anniversary').add(todo.MONTH, 1).build().code());
// repeats
assert.equal(parser.parse('every 25 feb a pool party').code(),
             todo.text('a pool party').date(25, todo.FEB).repeats(todo.YRS).build().code());
assert.equal(parser.parse('evry year 25 feb a pool party').code(),
             todo.text('a pool party').date(25, todo.FEB).repeats(todo.YRS).build().code());
assert.equal(parser.parse('a salary every 12th, 23rd, 29th').code(),
             todo.text('a salary').repeats(todo.DAY, [12, 23, 29]).build().code());
assert.equal(parser.parse('check pulse every 15 minutes till evening').code(),
             todo.text('check pulse').repeat(todo.MINUTE, 15).endtime(19).build().code());
assert.equal(parser.parse('every three months a party').code(),
             todo.text('a party').repeat(todo.MONTH, 3).endtime(19).build().code());
assert.equal(parser.parse('every 2 weeks office cleaning').code(),
             todo.text('office cleaning').repeat(todo.WEEK, 2).build().code());
assert.equal(parser.parse('every 4 HOUR remember to work').code(),
             todo.text('remember to work').repeat(todo.HOUR, 4).build().code());
assert.equal(parser.parse('every 2nd 5th, 12th hour remember to work').code(),
             todo.text('remember to work').repeat(todo.HOUR, [2, 5, 12]).build().code());
assert.equal(parser.parse('send sms every 15, 23, 25h after two month').code(),
             todo.text('send sms').repeats(todo.DAY, [15, 23, 25]).repeat(todo.HOUR, 25)..add(todo.MONTH, 2).build().code());
assert.equal(parser.parse('send sms every every 25th skip two month').code(),
             todo.text('send sms').repeat(todo.DAY, 25).add(todo.MONTH, 2).build().code());
assert.equal(parser.parse('coffee every thursday, fri, mon').code(),
             todo.text('send sms').repeats(todo.WEEKDAY, [todo.THU, todo.FRI, todo.MON]).build().code());
assert.equal(parser.parse('spring is every march, april, may').code(),
             todo.text('spring is').repeats(todo.MONTH, [todo.MAR, todo.APR, todo.MAY]).build().code());
assert.equal(parser.parse('salary every month at 25, 7pm').code(),
             todo.text('sports').repeat(todo.MONTH).repeats(todo.HOUR, 19).build().code());
assert.equal(parser.parse('turkey party every last friday').code(),
             todo.text('turkey party').repeat(todo.MONTH).alignLast(todo.WEEKDAY, todo.FRI).build().code());
// longs
assert.equal(parser.parse('5 months of making a great thing').code(),
             todo.text('making a great thing').longs(todo.MONTH, 5).build().code());
assert.equal(parser.parse('festival from 12 jun to 15 aug').code(),
             todo.text('festival').startdate(12, todo.JUN).enddate(15, todo.AUG).build().code());
assert.equal(parser.parse('lunch from 12 to 15').code(),
             todo.text('lunch').starttime(12).endtime(15).build().code());
assert.equal(parser.parse('busy all day').code(),
             todo.text('busy').endtime(24).build().code());
assert.equal(parser.parse('sell googles this week').code(),
             todo.text('sell googles').end(todo.WEEK).build().code());
assert.equal(parser.parse('sell googles all month').code(),
             todo.text('sell googles').end(todo.MONTH).build().code());
assert.equal(parser.parse('machine works from 2th june').code(),
             todo.text('machine works').startdate(2, todo.JUN).longs(todo.INFINITY).build().code());
assert.equal(parser.parse('meeting from 5h to 7h').code(),
             todo.text('meeting').starttime(5).endtime(7).build().code());
assert.equal(parser.parse('sports from tuesday to friday').code(),
             todo.text('sports').roll(todo.WEEKDAY, todo.TUE).add(todo.DAY, 3).build().code());
assert.equal(parser.parse('sports from tuesday to friday').code(),
             todo.text('sports').roll(todo.WEEKDAY, todo.TUE).rollend(todo.WEEKDAY, todo.FRI).build().code());
assert.equal(parser.parse('teeth doctor every thursday till august').code(),
             todo.text('teeth doctor').repeats(todo.WEEKDAY, todo.THU).rollend(todo.MONTH, todo.AUG).build().code());
assert.equal(parser.parse('sports from may every friday').code(),
             todo.text('sports').repeats(todo.WEEKDAY, todo.FRI).roll(todo.MONTH, todo.MAY).build().code());

        // my poem is done, my painting was done in 2004
        // #1 make bed, #2 make toast, #3 go to work
        // buy food; buy milk, buy something, buy cheese

