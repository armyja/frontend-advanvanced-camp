const http = require("http");

http.createServer((request, response) => {
    let body = [];
    request.on("error", (err) => {
        console.error(err);
    }).on("data", (chunk) => {
        body.push(chunk);
    }).on("end", ()=> {
        // helloWorld(request, response);
        receivedRequest(request, response);
    });
}).listen(8080);

console.log("server started");

function helloWorld(request, response) {
    body = Buffer.concat(body).toString();
    console.log("body:", body);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(" Hello World\n");
}

function receivedRequest(req, res) {
    console.log("request received");
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    // res.writeHead(200, { 'Content-type' : 'text/html' });
    res.writeHead(200, { 'Content-type' : 'text/html; charset=utf-8' });
    res.end(
`<html maaa=a>
<head>
    <style>

#container {
    width: 500px;
    height: 300px;
    display: flex;
    background-color: rgb(255,255,255);
}

#container #myid {
    width: 200px;
    height: 100px;
    background-color: rgb(255,0,0);
}

#container .c1 {
    flex: 1;
    background-color: rgb(0,255,0);
}

body div #myid{
    width:100px;
    background-color: #ff5000;
}
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
    </div>
</body>
</html>
`        
    )
}