const fs = require('fs');
const { mwn } = require('mwn');
const { commonsBot, thwsBot } = require("../../core/bot");

const input = JSON.parse(fs.readFileSync("./input/gazette.json"));

let counter = 0;
const max = input.length - 1;
mwn.log(`[I] There are ${max - counter + 1} upload and index creation operations to do`);

const mainClock = setInterval(function () {
    if (counter >= max) {
        mwn.log("[I] Terminating process");
        clearInterval(mainClock);
    }

    main(counter);
    counter++;
}, 6_000);

async function main(x) {
    mwn.log(`[I] ${x + 1} : uploading "${input[x].fileName}" to commons`);
    await commonsBot.uploadFromUrl(input[x].link, input[x].fileName, input[x].commons).then(function(resolve) {
        if (resolve.result === 'Success') mwn.log(`[S] ${x + 1} : Uploaded!`);
        else console.log(resolve);
    }).catch(function(error) {
        mwn.log(`[E] ${x + 1} : ${error}`);
    });

    mwn.log(`[I] ${x + 1} : Creating index page for "${input[x].fileName}"`);
    await thwsBot.save(`ดัชนี:${input[x].fileName}`, input[x].index, `สร้าง[[ดัชนี:${input[x].fileName}]] (Task N)`, { watchlist: 'unwatch' }).then(function(resolve) {
        if (resolve.result === 'Success') mwn.log(`[S] ${x + 1} : Index created!`);
        else console.log(resolve);
    }).catch(function(error) {
        mwn.log(`[E] ${x + 1} : ${error}`);
    });
}
