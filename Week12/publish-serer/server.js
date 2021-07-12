let fs = require('fs');
let http = require('http');
let https = require('https');
let unzipper = require('unzipper');
let querystring = require('querystring');

function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function(info) {
        response.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`)
        response.end();
    });
}

function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);

    getUser(query.token, info => {
        console.log(info)
        if (info.login === "armyja") {
            request.pipe(unzipper.Extract({ path: '../server/public/' }));
            request.on("end", function() {
                console.log("success")
                response.end("success");
            })
        } else {
            response.end("fail");
        }
    });

}

function getUser(token, callback) {
    console.log(token)
    let request = https.request(
        {
            hostname: "api.github.com",
            path: `/user`,
            port: 443,
            method: "GET",
            headers: {
                "Authorization": `token ${token}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.67",
            }
        },
        function (response) {
            let body = "";
            response.on("data", chunk => {
                body += (chunk.toString());
            })
            response.on('end', chunk => {
                callback(JSON.parse(body));
            })
        }
    );
    request.end();
}

function getToken(code, callback) {
    let request = https.request(
        {
            hostname: "github.com",
            path: `/login/oauth/access_token?code=${code}&client_id=Iv1.1a725d6f2f368ed2&client_secret=noway`,
            port: 443,
            method: "POST",
        },
        function (response) {
            let body = "";
            response.on("data", chunk => {
                body += (chunk.toString());
            })
            response.on('end', chunk => {
                callback(querystring.parse(body));
            })
            console.log(response);
        }
    );
    request.end();
}

http.createServer(function (req, res) {
    if (req.url.match(/^\/auth\?/)) {
        return auth(req, res);
    }
    if (req.url.match(/^\/publish\?/)) {
        return publish(req, res);
    }
    console.log("request");
}).listen(8082);
