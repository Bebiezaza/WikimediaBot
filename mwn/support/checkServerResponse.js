const http = require("http");
const fs = require('fs');

const checker = JSON.parse(fs.readFileSync("./output/gazette.json"));

for (let x in checker) {
    http.get(checker[x].link, (res) => {
        fs.appendFileSync("./output/checkLink.txt", `[${res.statusCode}] ${checker[x].fileName}\n`);
    });
}