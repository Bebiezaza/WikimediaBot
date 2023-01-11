const fs = require('fs');

const input = JSON.parse(fs.readFileSync("./input/gazette.json"));

for (let x in input) {
    console.log("# [[ดัชนี:" + input[x].fileName + "]]");
}