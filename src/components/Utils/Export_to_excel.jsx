import * as XLSX from 'xlsx';

function flatten(obj, parentKey = '', res = {}) {
  for (let key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const newKey = parentKey ? `${parentKey}_${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flatten(obj[key], newKey, res); // ใช้ key ปัจจุบันแทนการต่อ prefix
    } else {
      res[newKey] = obj[key]; // เก็บเฉพาะชื่อ key สุดท้าย
    }
  }
  return res;
}

export default function exportFilteredTableToExcel(filteredData, filename = 'export_data', headers) {
    const fileExtension = 'xlsx';
    // สร้างวันที่ในรูปแบบ YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    // สร้างชื่อไฟล์ใหม่โดยรวมชื่อไฟล์เดิมกับวันที่
    const newFilename = `${filename}_${dateString}`;

    if (!filteredData || filteredData.length === 0) return;

    // flatten data ทุกแถว
    const flattened = filteredData.map(item => flatten(item));

    // แปลง headers ให้เป็น 2 row (แถวบน merge, แถวล่างเป็น children)
    const firstRow = [];
    const secondRow = [];
    let merges = [];
    let colIndex = 0;

    headers.forEach(h => {
        if (typeof h === "string") {
        firstRow.push(h);
        secondRow.push("");
        merges.push({
            s: { r: 0, c: colIndex },
            e: { r: 1, c: colIndex }
        });
        colIndex++;
        } else if (typeof h === "object" && h.children) {
        firstRow.push(h.title);
        for (let i = 1; i < h.children.length; i++) {
            firstRow.push("");
        }
        h.children.forEach(child => {
            secondRow.push(child);
        });
        merges.push({
            s: { r: 0, c: colIndex },
            e: { r: 0, c: colIndex + h.children.length - 1 }
        });
        colIndex += h.children.length;
        }
    });
    
    // สร้าง worksheet
    const wsData = [firstRow, secondRow, ...flattened.map(obj => Object.values(obj))];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!merges"] = merges;

    // เขียน workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${newFilename}.${fileExtension}`);
}