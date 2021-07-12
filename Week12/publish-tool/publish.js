let http = require("http");
let fs = require("fs");
let archiver = require("archiver");
let child_process = require("child_process");
let querystring = require("querystring");

// child_process.exec("Start-Process -FilePath https://github.com/login/oauth/authorize?client_id=Iv1.1a725d6f2f368ed2")
child_process.exec('start "" "https://github.com/login/oauth/authorize?client_id=Iv1.1a725d6f2f368ed2"')

http.createServer(function (req, res) {
    // req.on
    let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1]);
    console.log(query)
    publish(query.token, function (info) {
        res.end(info);
    })
}).listen(8083);

function publish(token, callback) {
    let request = http.request({
        hostname: "127.0.0.1",
        port: 8082,
        method: "POST",
        path: `/publish?token=${token}`,
        headers: {
            'Content-Type': 'application/octet-stream',
            // 'Content-Length': stats.size
        }
    }, response => {
        let body = "";
        response.on("data", chunk => {
            body += (chunk.toString());
        })
        response.on('end', chunk => {
            callback(body);
        })
    })

    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.directory('./sample/', false);
    archive.finalize()
    archive.pipe(request);

}
