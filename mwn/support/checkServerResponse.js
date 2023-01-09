const http = require("http");
const https = require("https");
const fs = require('fs');

const checker = JSON.parse(fs.readFileSync("./output/gazette.json"));

for (let x in checker) {
    if (checker[x].link.indexOf("https") !== -1) {
        https.get(checker[x].link, (res) => {
            fs.appendFileSync("./output/checkLink.txt", `[${res.statusCode}] ${checker[x].fileName}\n`);
        });
    } else {
        http.get(checker[x].link, (res) => {
            fs.appendFileSync("./output/checkLink.txt", `[${res.statusCode}] ${checker[x].fileName}\n`);
        });
    }
}