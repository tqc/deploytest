//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT = 5000;

function handleRequest(request, response) {
    response.end('It Works with server updated a third time!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
