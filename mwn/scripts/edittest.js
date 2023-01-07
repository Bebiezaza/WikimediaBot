const { thwsBot } = require("../core/bot");

(async () => {
    const response = await thwsBot.read('ข้อกำหนดออกตามความในมาตรา 9ฯ (ฉบับที่ 13) ลงวันที่ 31 กรกฎาคม 2563');
    console.log(response.pageid);
    const response2 = await thwsBot.read('คำสั่งคณะรักษาความสงบแห่งชาติ ที่ 5/2557');
    console.log(response2.pageid);
    const response3 = await thwsBot.read('คำสั่งกองทัพบก (เฉพาะ) ที่ 81/2557');
    console.log(response3.pageid);
    const response4 = await thwsBot.read('คำสั่งกองอำนวยการรักษาความสงบเรียบร้อย ที่ 15/2557');
    console.log(response4.pageid);
})();