const fs = require('fs');

const input = JSON.parse(fs.readFileSync("./input/gazette.json"));

let mainArray = [];

/* ===== this is for year 2557-2565 (~around June 2561, link format updates) ===== */
for (let k in input) {
    // throw error
    if (!input[k].book || !input[k].chapter || !input[k].pageStart || !input[k].pageEnd 
    || !input[k].signDate || !input[k].signMonth || !input[k].signYear 
    || !input[k].pubDate || !input[k].pubMonth || !input[k].pubYear
    || !input[k].titleTH || !input[k].titleEN || !input[k].subtitleTH || !input[k].subtitleEN
    || !input[k].authorTH || !input[k].authorEN || !input[k].isAuthorPortal) {
        console.error("งาน \"" + input[k].titleTH + "\" มีบางช่องที่ไม่มีข้อมูล");
        throw '';
    }
    if (parseInt(input[k].pageStart) > parseInt(input[k].pageEnd)) {
        console.error("งาน \"" + input[k].titleTH + "\" มีเลขหน้าเริ่มสูงกว่าหน้าจบ");
        throw '';
    }

    // parse chapter info
    const chapter = {
        number: input[k].chapter.match(/(\d{1,}) (.)/)[1],
        type: input[k].chapter.match(/(\d{1,}) (.)/)[2],
        special: (() => { if (input[k].chapter.match(/^พิเศษ/) !== null) { return true; } else { return false; } })()
    };

    // construct file URL
    let fileUrl = "http://www.ratchakitcha.soc.go.th/DATA/PDF/" + String(input[k].pubYear) + "/";
    if (parseInt(input[k].pubYear) > 2561 || (parseInt(input[k].pubYear) === 2561 && parseInt(convertMonth(input[k].pubMonth, "nameTH", "num")) >= 10)) {
        // from October 2561 onwards
        if (chapter.special === true) {
            fileUrl += "E/";
        } else {
            switch (chapter.type) {
                case "ก":
                    fileUrl += "A/";
                    break;
                case "ข":
                    fileUrl += "B/";
                    break;
                case "ค":
                    fileUrl += "C/";
                    break;
                case "ง":
                    fileUrl += "D/";
                    break;
            }
        }

        fileUrl += String(chapter.number).padStart(3, "0") + "/";

        fileUrl += "T_" + String(input[k].pageStart).padStart("4", "0") + ".PDF";
    } else if (parseInt(input[k].pubYear) === 2561 && parseInt(convertMonth(input[k].pubMonth, "nameTH", "num")) > 6) {
        // after June 2561, before October 2561
        if (chapter.special === true) {
            fileUrl += "E/";
        } else {
            switch (chapter.type) {
                case "ก":
                    fileUrl += "A/";
                    break;
                case "ข":
                    fileUrl += "B/";
                    break;
                case "ค":
                    fileUrl += "C/";
                    break;
                case "ง":
                    fileUrl += "D/";
                    break;
            }
        }

        fileUrl += String(chapter.number).padStart(3, "0") + "/";

        fileUrl += "T" + String(input[k].pageStart) + ".PDF";
    } else {
        // before June 2561
        if (chapter.special === true) {
            fileUrl += "E/";
        } else {
            switch (chapter.type) {
                case "ก":
                    fileUrl += "A/";
                    break;
                case "ข":
                    fileUrl += "B/";
                    break;
                case "ค":
                    fileUrl += "C/";
                    break;
                case "ง":
                    fileUrl += "D/";
                    break;
            }
        }

        fileUrl += String(chapter.number).padStart(3, "0") + "/";

        fileUrl += String(input[k].pageStart) + ".PDF";
    }

    // Author info creation
    let commonsAuthor;
    let indexAuthor;

    if (input[k].isAuthorPortal === true) {
        commonsAuthor = `{{en|1=${input[k].authorEN}}}\n{{th|1=${input[k].authorTH}}}`;
        indexAuthor = `{{ลสย|${input[k].authorTH}}}`;
    } else {
        commonsAuthor = `{{Creator:${input[k].authorEN}}}`;
        indexAuthor = `{{ลผส|${input[k].authorTH}}}`;
    }

    // build gazette info (only book, chapter and page)
    // เล่ม $1, ตอน$2, หน้า $3
    let gazettePageInfo = `เล่ม ${input[k].book}, ตอน`;

    if (chapter.special) gazettePageInfo += `พิเศษ ${chapter.number} ${chapter.type}, หน้า `;
    else gazettePageInfo += ` ${chapter.number} ${chapter.type}, หน้า `;

    if (input[k].pageStart !== input[k].pageEnd) {
        gazettePageInfo += `${input[k].pageStart}–${input[k].pageEnd}`;
    } else gazettePageInfo += `${input[k].pageStart}`;

    // construct commons description
    let commonsText = `=={{int:filedesc}}==
{{Book
| Author = ${commonsAuthor}
| Translator =
| Editor =
| Illustrator =
| Title = {{en|1=${input[k].titleEN}, dated ${input[k].signDate} ${convertMonth(input[k].signMonth, "nameTH", "nameEN")} ${input[k].signYear} BE (${input[k].signYear - 543} CE)}}
{{th|1=${convertThaiNumber(input[k].titleTH + " ลงวันที่ " + input[k].signDate + " " + input[k].signMonth + " " + input[k].signYear)}}}
| Subtitle = {{en|1=${input[k].subtitleEN}}}
{{th|1=${input[k].subtitleTH}}}
| Series title =
| Volume =
| Edition =
| Publisher = {{en|1=Cabinet Secretariat}}
{{th|1=สำนักเลขาธิการคณะรัฐมนตรี}}
| Printer =
| Publication date = ${input[k].pubYear - 543}-${convertMonth(input[k].pubMonth, "nameTH", "num").padStart(2, "0")}-${input[k].pubDate}
| City = Bangkok
| Language = th
| Description =
| Source = {{th|1="[${fileUrl} ${convertThaiNumber(input[k].titleTH + " " + input[k].subtitleTH + " ลงวันที่ " + input[k].signDate + " " + input[k].signMonth + " " + input[k].signYear)}]". (${convertThaiNumber(input[k].pubYear)}, ${convertThaiNumber(input[k].pubDate)} ${input[k].pubMonth}). ''ราชกิจจานุเบกษา''. ${convertThaiNumber(gazettePageInfo).replace(", หน้า", ". หน้า")}.}}
| Permission =
| Image =
| Image page =
| Pageoverview =
| Wikisource = s:th:${input[k].titleTH}
| Homecat =
| Other_versions =
| ISBN =
| LCCN =
| OCLC =
| References =
| Linkback =
| Wikidata =
}}

=={{int:license-header}}==
{{PD-TH-exempt}}

[[Category:${input[k].pubYear - 543} books PDF files]]
[[Category:${input[k].pubYear - 543} books from Thailand]]
[[Category:Thai government PDF files]]
[[Category:PDF files in Thai]]
[[Category:Works published in the Royal Thai Government Gazette]]
`;

    // (additional categories go here)
    commonsText += "[[Category:Orders of the National Council for Peace and Order]]\n";

    // construct wikisource header
    let indexHeader = "";
    if (chapter.special === true) {
        indexHeader = `{{หรก|6|น={{{pagenum}}}|ล=${convertThaiNumber(input[k].book)}|ต=${convertThaiNumber(chapter.number)} ${chapter.type}|ว=${convertThaiNumber(input[k].pubDate)} ${input[k].pubMonth} ${convertThaiNumber(input[k].pubYear)}}}`;
    } else {
        indexHeader = `{{หรก|4|น={{{pagenum}}}|ล=${convertThaiNumber(input[k].book)}|ต=${convertThaiNumber(chapter.number)} ${chapter.type}|ว=${convertThaiNumber(input[k].pubDate)} ${input[k].pubMonth} ${convertThaiNumber(input[k].pubYear)}}}`;
    }

    // construct pagelist
    // <pagelist
    // 1 = ๑๑
    // 2 = ๑๒
    // />

    const pageDelta = (input[k].pageEnd - input[k].pageStart) + 1;
    const pagelist = "<pagelist\n1 = " + input[k].pageStart + "\n1to" + pageDelta + " = thai\n" + (pageDelta + 1) + "to999 = -\n/>";

    // construct wikisource index text
    let indexText = `{{:MediaWiki:Proofreadpage_index_template
|ประเภท=วารสาร
|ชื่อ=[[${input[k].titleTH}]] ${input[k].subtitleTH} ลงวันที่ ${input[k].signDate} ${convertMonth(input[k].signMonth, "num", "nameTH")} ${input[k].signYear}
|ภาษา=th
|เล่ม=
|ผู้สร้างสรรค์=${indexAuthor}
|ผู้แปล=
|บรรณาธิการ=
|ผู้วาดภาพประกอบ=
|สถานศึกษา=
|ผู้เผยแพร่={{ลสย|สำนักเลขาธิการคณะรัฐมนตรี}}
|สถานที่=กรุงเทพฯ
|ปี=${input[k].pubYear}
|รหัส=
|ISBN=
|OCLC=
|LCCN=
|BNF_ARK=
|ARC=
|จากวารสาร=ราชกิจจานุเบกษา, ${gazettePageInfo}, ${input[k].pubDate} ${input[k].pubMonth} ${input[k].pubYear}
|ที่มา=pdf
|ภาพ=1
|ความคืบหน้า=C
|การผสานหน้า=no
|หน้า=${pagelist}
|จำนวน=
|หมายเหตุ=
|Width=
|Css=
|Header=${indexHeader}
|Footer=
}}
`;

    // (additional categories go here)
    indexText += "[[หมวดหมู่:ดัชนีคำสั่ง]]\n";

    // record to output
    const regexFileName = input[k].titleTH.match(/ที่ (\d{1,})\/(25(?:57|58|59|60|61|62|63|64))/);
    const regexFileSpecific = input[k].titleTH.match(/เฉพาะ/);
    let fileName = "";
    if (regexFileName[2] === "2557") fileName = `คำสั่ง คสช ${convertThaiNumber(input[k].signYear)}-${convertThaiNumber(regexFileName[1].padStart(3, "0"))}`;
    else fileName = `คำสั่ง คสช ${convertThaiNumber(input[k].signYear)}-${convertThaiNumber(regexFileName[1].padStart(2, "0"))}`;
    if (regexFileSpecific) fileName += "-เฉพาะ";
    fileName += ".pdf";
    
    const output = {
        fileName,
        link: fileUrl,
        commons: commonsText,
        index: indexText
    };

    mainArray.push(output);
}

fs.writeFileSync("./output/gazette.json", JSON.stringify(mainArray));

/* ===== helper functions ===== */
function convertThaiNumber(text) {
    text = text.replace(/1/ig, "๑").replace(/2/ig, "๒").replace(/3/ig, "๓").replace(/4/ig, "๔").replace(/5/ig, "๕")
        .replace(/6/ig, "๖").replace(/7/ig, "๗").replace(/8/ig, "๘").replace(/9/ig, "๙").replace(/0/ig, "๐");

    return text;
}

function convertMonth(text, fromType, toType) {
    const monthNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    const monthNumTH = ["๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙", "๑๐", "๑๑", "๑๒"];
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNameTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    let search = [];
    let replace = [];
    switch (fromType) {
        case "num":
            search = monthNum;
            break;
        case "numTH":
            search = monthNumTH;
            break;
        case "nameEN":
            search = monthName;
            break;
        case "nameTH":
            search = monthNameTH;
            break;
    }

    switch (toType) {
        case "num":
            replace = monthNum;
            break;
        case "numTH":
            replace = monthNumTH;
            break;
        case "nameEN":
            replace = monthName;
            break;
        case "nameTH":
            replace = monthNameTH;
            break;
    }

    text = String(text);

    for (let i = 0; i <= 11; i++) {
        text = text.replace(search[i], replace[i]);
    }

    return text;
}
