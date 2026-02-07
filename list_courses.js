const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('public/timetable.json', 'utf8'));
    const section6A = data.filter(e => e.Section === 'BSCS-6A');
    const section6C = data.filter(e => e.Section === 'BSCS-6C');
    console.log('Courses in BSCS-6A:', [...new Set(section6A.map(e => e.Course))].sort());
    console.log('Courses in BSCS-6C:', [...new Set(section6C.map(e => e.Course))].sort());
} catch (e) {
    console.error(e);
}
