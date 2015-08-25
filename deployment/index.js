#!/usr/local/bin/node

"use strict";

console.log(process.env.LIFECYCLE_EVENT);
var child = require("child_process");

function getPid(port) {
    console.log("getting pid for port " + port);
    let ns = child.execSync("netstat -lnp", {encoding: "utf-8", timeout: 500});
    var lines = ns.split("\n");
    for (let i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.indexOf(":" + port) < 0) continue;
        var m = line.match(/(\d+)\/node/);
        if (m) return m[1];
    }
}

if (process.env.LIFECYCLE_EVENT == "ApplicationStop") {
    var pid = getPid(5000);
    if (pid) {
        console.log("process " + pid + "is listening on port " + 5000);
        child.execSync("kill", [pid]);
    }
}
else if (process.env.LIFECYCLE_EVENT == "AfterInstall") {
    // write nginx config

    var fs = require("fs");

    var conf = fs.readFileSync(__dirname + "/nginx-app.conf", "utf-8");

    var confpath = "/etc/nginx/conf.d/deploytest.conf";

    fs.writeFileSync(confpath, conf);

    // start node server
   
    child.exec("/usr/local/bin/node /apps/deploytest/server.js > /dev/null 2> /dev/null < /dev/null &", {});

    // restart nginx
    child.spawn("/etc/init.d/nginx", ["reload"], {});

}
