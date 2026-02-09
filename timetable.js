const fs = require("fs");
const data = require("./public/timetable.json");

const bannedOS = ["Naveed Ahmad", "Fatima Ahmad"];

const dayIndex = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
};

function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function overlap(a, b) {
  if (a.Day !== b.Day) return false;
  return (
    toMin(a["Start Time"]) < toMin(b["End Time"]) &&
    toMin(b["Start Time"]) < toMin(a["End Time"])
  );
}

function noClash(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (overlap(arr[i], arr[j])) return false;
  return true;
}

function consecutive(arr) {
  const d = [...new Set(arr.map(x => dayIndex[x.Day]))].sort();
  return d.length === 4 && d[3] - d[0] === 3;
}

function oneLateDayOnly(slots) {
  const dayMax = {};

  for (const s of slots) {
    const d = s.Day;
    const end = toMin(s["End Time"]);
    dayMax[d] = Math.max(dayMax[d] || 0, end);
  }

  let lateDays = 0;

  for (const d in dayMax) {
    if (dayMax[d] > toMin("15:15")) lateDays++;
    if (dayMax[d] > toMin("16:45")) return false;
  }

  return lateDays <= 1;
}

function lab(section, key) {
  return data.find(
    x =>
      x.Section === section &&
      x.Course.toLowerCase().includes(key) &&
      x.Course.includes("Lab")
  );
}

function score(tt) {
  let end = Math.max(...tt.map(x => toMin(x["End Time"])));
  return end + tt.length * 10;
}

const CN = data.filter(x => x.Course === "CN" || x.Course === "Computer Networks");
const OS = data.filter(x => x.Course === "OS" || x.Course === "Operating Systems");
const WEB = data.filter(x => x.Course === "Web");
const SPM = data.filter(x => x.Course === "SPM");

function generate(useWeb=true) {
  let res = [];

  for (const cn of CN)
  for (const os of OS) {

    if (bannedOS.includes(os.Instructor)) continue;
    if (cn.Section !== os.Section) continue;

    let base = [cn, os];

    const cnLab = lab(cn.Section,"cn");
    const osLab = lab(os.Section,"os");

    if (cnLab) base.push(cnLab);
    if (osLab) base.push(osLab);

    if (useWeb) {
      for (const w of WEB.filter(x=>x.Section===cn.Section)) {
        let pack=[...base,w];
        const wLab=lab(w.Section,"web");
        if(wLab) pack.push(wLab);

        if(oneLateDayOnly(pack)&&noClash(pack)&&consecutive(pack))
          res.push(pack);
      }
    } else {
      for (const s of SPM.filter(x=>x.Section===cn.Section)) {
        let pack=[...base,s];

        if(oneLateDayOnly(pack)&&noClash(pack)&&consecutive(pack))
          res.push(pack);
      }
    }
  }

  return res;
}

let webResults = generate(true);
let final = webResults.length ? webResults : generate(false);

if (!final.length) {
  console.log("❌ No valid timetable found even with one late day.");
  process.exit(0);
}

final.sort((a,b)=>score(a)-score(b));

fs.writeFileSync(
  "BEST_TIMETABLE.json",
  JSON.stringify(final[0], null, 2)
);

console.log("✅ BEST timetable generated → BEST_TIMETABLE.json");
