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
    res.writeHead(200, { 'Content-type' : 'text/plain' });
    res.end(
`<html maaa=a >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>
`        
    )
}