import Navbar from "./../../Navbar";
import Footer from "./../../Footer/Footer";

const rdu_data = [
  {
    id: 1,
    name: "ร้อยละการใช้ยาปฏิชีวนะในโรคติดเชื้อที่ระบบการหายใจช่วงบนและหลอดลมอักเสบเฉียบพลันในผู้ป่วยนอก ระดับโรงพยาบาล (RI)",
    subdatas: [],
    link: "/rdu/s_rdu6",
  },
  {
    id: 2,
    name: "ร้อยละการใช้ยาปฏิชีวนะในโรคอุจจาระร่วงเฉียบพลันในผู้ป่วยนอก ระดับโรงพยาบาล (AD)",
    subdatas: [],
    link: "/rdu/s_rdu7",
  },
  {
    id: 3,
    name: "ร้อยละการใช้ยาปฏิชีวนะในบาดแผลสดจากอุบัติเหตุ ระดับโรงพยาบาล (FTW)",
    subdatas: [],
    link: "/rdu/s_rdu8",
  },
  {
    id: 4,
    name: "ร้อยละการใช้ยาปฏิชีวนะในหญิงคลอดปกติครบกำหนดทางช่องคลอด ระดับโรงพยาบาล (APL)",
    subdatas: [],
    link: "/rdu/s_rdu9",
  },
  {
    id: 5,
    name: "ร้อยละของผู้ป่วยความดันสูง (Essential hypertension) ที่ใช้ RAS blockade (ACEI/ ARB/ Renin inhibitor) 2 ชนิดร่วมกันในการรักษาภาวะความดันเลือดสูง",
    subdatas: [],
    link: "/rdu/s_rdu10",
  },
  {
    id: 6,
    name: "ร้อยละของผู้ป่วยนอกโรคเบาหวานที่ใช้ยา metformin เป็นยาชนิดเดียวหรือร่วมกับยาอื่นเพื่อควบคุมระดับน้ำตาล โดยไม่มีข้อห้ามใช้",
    subdatas: [],
    link: "/rdu/s_rdu12",
  },
  {
    id: 7,
    name: "ร้อยละของผู้ป่วยที่มีการใช้ยากลุ่ม NSAIDs ซ้ำซ้อน",
    subdatas: [],
    link: "/rdu/s_rdu13",
  },
  {
    id: 8,
    name: "ร้อยละของผู้ป่วยนอกโรคไตเรื้อรังระดับ 3 ขึ้นไปที่ได้รับยา NSAIDs",
    subdatas: [],
    link: "/rdu/s_rdu14",
  },
  {
    id: 9,
    name: "ร้อยละของผู้ป่วยนอกโรคหืดที่ได้รับยา inhaled corticosteroid",
    subdatas: [
      {
        id: "9.1",
        name: "ร้อยละของผู้ป่วยนอกโรคหืดที่ได้รับยา inhaled corticosteroid (PDx)",
        link: "/rdu/s_rdu15",
      },
      {
        id: "9.2",
        name: "ร้อยละของผู้ป่วยนอกโรคหืดที่ได้รับยา inhaled corticosteroid (All Dxtype)",
        link: "/rdu/s_rdu22",
      },
    ],
  },
  {
    id: 10,
    name: "ร้อยละผู้ป่วยนอกสูงอายุที่ใช้ยากลุ่ม long-acting benzodiazepine ได้แก่ chlordiazepoxide, diazepam, dipotassium chlorazepate",
    subdatas: [],
    link: "/rdu/s_rdu16",
  },
  {
    id: 11,
    name: "จำนวนสตรีตั้งครรภ์ที่ได้รับยาที่ห้ามใช้ ได้แก่ยา Warfarin หรือ Statins หรือ Ergots เมื่อรู้ว่าตั้งครรภ์แล้ว",
    subdatas: [],
    link: "/rdu/s_rdu17",
  },
  {
    id: 12,
    name: "ร้อยละครั้งบริการ (visit) ผู้ป่วยเด็ก ที่ได้รับการวินิจฉัยเป็นโรคติดเชื้อของทางเดินหายใจ และได้รับยาต้านฮิสตามีนชนิด non-sedating",
    subdatas: [],
    link: "/rdu/s_rdu18",
  },
  {
    id: 13,
    name: "ร้อยละของโรงพยาบาล ส่งเสริมการใช้ยาอย่างสมเหตุผล",
    subdatas: [],
    link: "/rdu/s_rdu21",
  },
  {
    id: 14,
    name: "ร้อยละการใช้ยาปฏิชีวนะในโรคติดเชื้อที่ระบบการหายใจช่วงบนและหลอดลมอักเสบเฉียบพลันในผู้ป่วยนอก ระดับ รพ.สต.(RI - PCU)",
    subdatas: [],
    link: "/rdu/s_rdu19",
  },
  {
    id: 15,
    name: "ร้อยละการใช้ยาปฏิชีวนะในโรคอุจจาระร่วงเฉียบพลันในผู้ป่วยนอก ระดับ รพ.สต. (AD - PCU)",
    subdatas: [],
    link: "/rdu/s_rdu20",
  },
  {
    id: 16,
    name: "ร้อยละของรพ.สต.ที่มีอัตราการใช้ยาปฏิชีวนะในโรค Respiratory Infection และ Acute Diarrhea <= ร้อยละ20 ทั้ง 2 โรค (RUA PCU)",
    subdatas: [],
    link: "/rdu/s_rdu_pcu",
  },
  {
    id: 17,
    name: "ค่า Defined Daily Dose (DDD) ของยาปฏิชีวนะชนิดรับประทานต่อ 1000 OP Visit แยกตามชื่อสามัญทางยา (Generic name)",
    subdatas: [],
    link: "/rdu/s_ddd1",
  },
  {
    id: 18,
    name: "ค่า Defined Daily Dose (DDD) ของยาปฏิชีวนะชนิดรับประทานต่อ 1000 OP Visit แยกตามกลุ่มยา (Class)",
    subdatas: [],
    link: "/rdu/s_ddd2",
  },
  {
    id: 19,
    name: "ค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดรับประทานทุกรายการต่อ 1000 OP Visit",
    subdatas: [],
    link: "/rdu/s_ddd3",
  },
  {
    id: 20,
    name: "ค่า Defined Daily Dose (DDD) ของยาปฏิชีวนะชนิดฉีดที่ใช้ในผู้ป่วยที่รับไว้รักษาในโรงพยาบาล (Admit) ต่อ 100 วันนอน แยกตามชื่อสามัญทางยา (Generic name)",
    subdatas: [],
    link: "/rdu/s_ddd4",
  },
  {
    id: 21,
    name: "ค่า Defined Daily Dose (DDD) ของยาปฏิชีวนะชนิดฉีดที่ใช้ในผู้ป่วยที่รับไว้รักษาในโรงพยาบาล (Admit) ต่อ 100 วันนอน แยกตามกลุ่มยา (Class)",
    subdatas: [],
    link: "/rdu/s_ddd5",
  },
  {
    id: 22,
    name: "ค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดฉีดทุกรายการที่ใช้ในผู้ป่วยที่รับไว้รักษาในโรงพยาบาล (Admit) ต่อ 100 วันนอน",
    subdatas: [],
    link: "/rdu/s_ddd6",
  },
];

export default function RDU() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-5 py-10">
        {/* ส่วนของ Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-green-300"
              >
                หน้าแรก
              </a>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="/service_plan"
                  className="text-sm font-medium text-gray-700 hover:text-green-300"
                >
                  ข้อมูลตอบสนอง Service Plan
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-500">
                  ข้อมูลเพื่อตอบสนอง Service Plan สาขา RDU
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* ส่วนของตาราง */}
        <div className="w-full overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-green-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  ชื่อรายงาน
                </th>
              </tr>
            </thead>
            <tbody>
              {rdu_data.length > 0 ? (
                rdu_data.map((data, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      {/* main data */}
                      <div>
                        <div className="badge badge-sm badge-accent">{data.id}</div>{" "}
                        <a href={data.link} className="hover:text-green-300">
                          {data.name}
                        </a>
                      </div>

                      {/* subdatas แยกบรรทัด */}
                      {data.subdatas &&
                        data.subdatas.map((subdata, subIndex) => (
                          <div
                            key={`${data.id}-${subIndex}`}
                            className="mt-1 pl-4 flex items-center space-x-2"
                          >
                            <div className="badge badge-sm badge-success">{subdata.id}</div>
                            <a href={subdata.link} className="hover:text-green-300">
                              {subdata.name}
                            </a>
                          </div>
                        ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center">
                    ไม่พบข้อมูลที่ตรงกับการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
