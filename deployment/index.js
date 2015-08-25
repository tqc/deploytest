#!/usr/local/bin/node

console.log(process.env.LIFECYCLE_EVENT);

if (process.env.LIFECYCLE_EVENT == "AfterInstall") {
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
