var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

var spawn = require('child_process').spawn;

var bin = "phantomjs";
//googlelinks.js is the example given at http://casperjs.org/#quickstart
var args = ['TEFetcher.js'];
var cspr;// = spawn(bin, args);

setInterval(function() {
	var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear() + " @ "   + currentdate.getHours() + ":"   + currentdate.getMinutes() + ":"   + currentdate.getSeconds();
	console.log(datetime+" Connecting to TEData..");
  cspr = spawn(bin, args);
  cspr.stdout.on('data', function (data) {
    var buff = new Buffer(data);
    console.log("foo: " + buff.toString('utf8'));
});

cspr.stderr.on('data', function (data) {
    data += '';
    console.log(data.replace("\n", "\nstderr: "));
});

cspr.on('exit', function (code) {
    console.log('child process exited with code ' + code);
   // process.exit(code);
});
}, 900000);

server.listen(8000);