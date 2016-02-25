// TEFetcher 1.0
// By Ahmed Shehata
// Based on PhantomJS
// Usage: phantomjs TEfetcher.js <email> <password>
var page = new WebPage(),
    testindex = 0,
    loadInProgress = false;
var fs = require('fs');
var system = require('system');
var args = system.args;
page.args = args;
var htmlstring = '<!DOCTYPE html> <html><meta http-equiv="refresh" content="5" > <head> <title>TEData Usage</title> <style> html { height: 100%; width: 100%; overflow: hidden; background-color: white; } body { height: 100%; width: 100%; margin: 0; overflow: auto; font-family: -apple-system-font, sans-serif; } h1 { background-color: rgb(237, 237, 237); text-align: center; font-weight: normal; color: #333; margin: 0; padding: 12px 0 10px 0; font-size: 16px; border-bottom: 1px solid #ccc; } #app-version, #app-bundle-version { color: #777; font-size: 13px; } .button { text-align: center; margin-top: 16px; } .button p { margin: 11px 0; } button { width: 90px; margin: 3px; padding: 5px 0; font-family: -apple-system-font, sans-serif; background-color: #eee; border-radius: 2px; border: 1px solid #ccc; } button:hover { background-color: #f2f2f2; } button:active { background-color: #e8e8e8; color: black; } canvas { display: none; } </style> <meta charset="UTF-8"> </head> <body> <h1> TEData Usage <span id="app-version"></span> <span id="app-bundle-version"></span> </h1> ';

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");

};

page.storeToFile = function(text) {
    fs.write("tedata.html", htmlstring + "<center><b>" + text + "</b></center>", 'a');

};

if (args.length<3)
{

    console.log("Usage: phantomjs TEfetcher.js <email> <password>");
    phantom.exit();
}
else
{
  var steps = [
    function() {
        //Load Login Page
        page.open("https://mytedata.net");
    },
    function() {
        //Enter Credentials
        page.evaluate(function(args) {

            var arr = document.getElementsByClassName("login");
            var emailInput = document.getElementsByClassName("inputTextEmail l-full form__input");
            var pwdInput = document.getElementsByClassName("l-full form__input inputSecretPassword required");
            var signInButton = document.getElementById("viewns_Z7_IP40H880J0O700IN12LU3930O3_:form1:commandButtonSignIn");
            var i;
            console.log("Logging..");
            console.log($(".inputTextEmail"));

            $(".inputTextEmail").val(args[1]);
            $(".inputSecretPassword").val(args[2]);

            $('*[id*=commandButtonSignIn]:visible').click();
            return;



        },args);
    },
 
    function(fs, htmlstring) {
        
        console.log("Your current usage:");

        return page.evaluate(function(fs, htmlstring) {
           
            htmlstring = $("#usage .grayItem").text();
            console.log(htmlstring);
            return htmlstring;
           

        });
    }
];


interval = setInterval(function() {
    if (!loadInProgress && typeof steps[testindex] == "function") {
       // console.log("step " + (testindex + 1));

        if (testindex == 2) {
            var usage = steps[testindex](fs, htmlstring);
            if (usage!=null)
                fs.write("tedata.html", htmlstring + "<div id='usage'><center><b>" + usage + "</b></center></div><div id='bar'></div><script>document.getElementById('bar').innerHTML = '<center><progress value='+document.getElementById('usage').textContent.split('/')[0].replace('GB','')+' max='+document.getElementById('usage').textContent.split('/')[1].replace('GB','')+'></progress></center>'</script>", 'w');
        } else steps[testindex]();
        testindex++;

    }
    if (typeof steps[testindex] != "function") {
       // console.log("test complete!");
        phantom.exit();
    }
}, 50);
  
}

