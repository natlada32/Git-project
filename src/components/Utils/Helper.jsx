
export const HospCode = [
  {
    hospcode: "10986",
    name: "10986:โรงพยาบาลปทุมราชวงศา"
  },
  {
    hospcode: "13891",
    name: "13891:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านแสนสุข"
  },
  {
    hospcode: "04134",
    name: "04134:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านวินัยดี"
  },
  {
    hospcode: "04133",
    name: "04133:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านนาป่าแซง"
  },
  {
    hospcode: "04132",
    name: "04132:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านโนนงาม"
  },
  {
    hospcode: "04131",
    name: "04131:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านตาดใหญ่"
  },
  {
    hospcode: "04130",
    name: "04130:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านนาผาง"
  },
  {
    hospcode: "04129",
    name: "04129:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านลือ"
  },
  {
    hospcode: "04127",
    name: "04127:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านคำโพน"
  },
  {
    hospcode: "04126",
    name: "04126:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านสามแยก"
  },
  {
    hospcode: "04125",
    name: "04125:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านหนองไฮน้อย"
  },
  {
    hospcode: "04124",
    name: "04124:โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านหนองข่า"
  },
];

export const allowedHospCode = [
    '10986', '13891', '04134', '04133', '04132', '04131',
    '04130', '04129', '04127', '04126', '04125', '04124'
];

export const financialYears = ['2568', '2567', '2566', '2565'];

// ฟังก์ชันหาชื่อโรงพยาบาลจาก hospcode
export function getHospName(hospcode) {
  const hosp = HospCode.find(h => h.hospcode === hospcode);
  return hosp ? hosp.name : hospcode; // คืนค่าเฉพาะชื่อ
}
// ฟังก์ชันหาหมายเลขรหัสจากชื่อโรงพยาบาล
export function getHospCodeByName(name) {
  const hosp = HospCode.find(h => h.name.includes(name));
  return hosp ? hosp.hospcode : null; // ถ้าไม่เจอให้คืน null
}
export const months = [
  { key: "10", label: "ต.ค." },
  { key: "11", label: "พ.ย." },
  { key: "12", label: "ธ.ค." },
  { key: "1", label: "ม.ค." },
  { key: "2", label: "ก.พ." },
  { key: "3", label: "มี.ค." },
  { key: "4", label: "เม.ย." },
  { key: "5", label: "พ.ค." },
  { key: "6", label: "มิ.ย." },
  { key: "7", label: "ก.ค." },
  { key: "8", label: "ส.ค." },
  { key: "9", label: "ก.ย." }
];

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0.00";
  const n = Number(num);
  // ถ้าเป็นจำนวนเต็ม  แสดงแบบไม่มีทศนิยม
  if (Number.isInteger(n)) {
    return n.toLocaleString("th-TH");
  }
  // ถ้าไม่ใช่จำนวนเต็ม  แสดงทศนิยม 2 ตำแหน่ง
  return Number(num).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ฟังก์ชันสร้าง thead อัตโนมัติ
export function renderTableHeader(headers) {
  // แถวแรก
  const firstRow = headers.map((h, idx) => {
    if (typeof h === "string") {
      return (
        <th key={idx} rowSpan="2" className="border px-4 py-2 bg-green-200 text-center">
          {h}
        </th>
      );
    }
    return (
      <th key={idx} colSpan={h.children.length} className="border px-4 py-2 bg-green-200 text-center">
        {h.title}
      </th>
    );
  });

  // แถวที่สอง
  const secondRow = headers
    .filter(h => typeof h !== "string")
    .flatMap((h, idx) =>
      h.children.map((child, childIdx) => (
        <th key={`${idx}-${childIdx}`} className="border px-4 py-2 bg-green-100 text-center">
          {child}
        </th>
      ))
    );

  return (
    <thead className="text-xs text-gray-700 uppercase bg-green-200">
      <tr>{firstRow}</tr>
      <tr>{secondRow}</tr>
    </thead>
  );
}

export default { HospCode, allowedHospCode, financialYears, getHospName, getHospCodeByName, renderTableHeader, months, formatNumber };