#!/usr/local/bin/node

console.log(process.env.LIFECYCLE_EVENT);
var child = require("child_process");

function getPid(port) {
    let ns = child.execSync("netstat", ["-lnp"], {encoding: "utf-8"});
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
        child.execSync("kill", ["pid"]);
    }
}
else if (process.env.LIFECYCLE_EVENT == "AfterInstall") {
    // write nginx config

    var fs = require("fs");

    var conf = fs.readFileSync(__dirname + "/nginx-app.conf", "utf-8");

    var confpath = "/etc/nginx/conf.d/deploytest.conf";

    fs.writeFileSync(confpath, conf);

    // start node server
    var spawn = require("child_process").spawn;
    spawn("/usr/local/bin/node", ["/apps/deploytest/server.js"], {
        detached: true
    });

    // restart nginx
    spawn("/etc/init.d/nginx", ["reload"], {});

}
