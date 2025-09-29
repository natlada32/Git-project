// 13. ร้อยละของโรงพยาบาล ส่งเสริมการใช้ยาอย่างสมเหตุผล
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from './../../Navbar'
import Footer from './../../Footer/Footer';
import exportFilteredTableToExcel from '../../Utils/Export_to_excel';
import Helper from '../../Utils/Helper';

const headers = [
  "หน่วยบริการ",
  {
    title: "จำนวนโรงพยาบาลในสังกัด สป.สธ.",
    children: ["ทั้งหมด(B)", "ผ่านน้อยกว่า 6 ข้อ", "ร้อยละ", "ผ่าน 6-9 ข้อ", "ร้อยละ", "ผ่าน 10-12 ข้อ(A)", "ร้อยละ"]
  },
  {
    title: "จำนวนโรงพยาบาลผ่านเกณฑ์จำแนกตามข้อมูล(ข้อที่)",
    children: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  },
  
];

export default function S_rdu21() {
  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search , setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2568'); // สร้าง state ใหม่สำหรับปีที่เลือก
  // State สำหรับเก็บข้อมูลและตัวเลือกของแผนภูมิ
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: { id: 'basic-bar' },
    xaxis: { categories: [] },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        }
      }
    },
    plotOptions: { bar: { distributed: true } },
    dataLabels: { 
      enabled: true,
      formatter: function (val) {
        return val.toFixed(2);
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2);
        }
      },
      x: {
        formatter: function (val) {
          return val; // แสดงชื่อโรงพยาบาลเต็ม ๆ ใน tooltip
        }
      }
    },
    theme: {
      mode: 'light', 
      palette: 'palette3', 
      monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
      },
    },
    legend: {
      show: false,
    }
  });
    
  const excelData = filteredData.map(item => {
    const row = {
      "หน่วยบริการ": `${item.hospcode}:${item.hospname}`,
      "จำนวนโรงพยาบาลในสังกัด สป.สธ.": {
        "ทั้งหมด(B)": item.target,
        "ผ่านน้อยกว่า 6 ข้อ": item.r_red,
        "ร้อยละ(น้อยกว่า 6 ข้อ)": (item.target > 0 ? (item.r_red/item.target) * 100 : 0),
        "ผ่าน 6-9 ข้อ": item.r_yellow,
        "ร้อยละ(6-9 ข้อ)": (item.target > 0 ? (item.r_yellow/item.target) * 100 : 0),
        "ผ่าน 10-12 ข้อ(A)": item.result,
        "ร้อยละ(10-12 ข้อ)": (item.target > 0 ? (item.result/item.target) * 100 : 0)
      },
      "จำนวนโรงพยาบาลผ่านเกณฑ์จำแนกตามข้อมูล(ข้อที่)": {
        "1": item.pass1,
        "2": item.pass2,
        "3": item.pass3,
        "4": item.pass4,
        "5": item.pass5,
        "6": item.pass6,
        "7": item.pass7,
        "8": item.pass8,
        "9": item.pass9,
        "10": item.pass10,
        "11": item.pass11,
        "12": item.pass12
      }
    };

    return row;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = 'https://opendata.moph.go.th/api/report_data';
        const response = await fetch(API_URL, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableName: 's_rdu21',
            year: selectedYear,
            province: '37',
            type: 'json',
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();
        const filteredItems = apiData.filter(item => item.hospcode ==="10986");

        // เพิ่มชื่อหน่วยงานลงในข้อมูลที่กรองแล้ว
        const dataWithNames = filteredItems.map(item => {
            const hospital = Helper.HospCode.find(hosp => hosp.hospcode === item.hospcode);
            return {
                ...item,
                hospname: hospital ? hospital.name.split(':')[1] : ''
            };
        });
        setData(dataWithNames);

        const seriesData = [
          {
            name: "ร้อยละ",
            data: dataWithNames.map(item => 
              item.target > 0 ? parseFloat((item.result / item.target) * 100) : 0
            )
          }
        ];
        setChartSeries(seriesData);
        setChartOptions(prev => ({
          ...prev,
          chart: {
            ...prev.chart,
            animations: { enabled: false },
            toolbar: { show: false }
          },
          xaxis: {
            ...prev.xaxis,
            categories: dataWithNames.map(item => item.hospname),
            labels: {
              rotate: -45, //หมุน label กันทับ
              formatter: function (val) {
                if (val.length > 15) {
                  return val.substring(0, 15) + '...'; // ถ้าชื่อยาว ตัดให้สั้น
                }
                return val;
              }
            },
          }
        }));        
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);
  
  useEffect(() => {
    const result = datas.filter((data) => {
      if (search === "") return true;
      if (data.hospcode.toLowerCase().includes(search.toLowerCase())) return true;
      if (data.hospname.toLowerCase().includes(search.toLowerCase())) return true;
      return false;
    });
    setFilteredData(result);
  }, [search, datas]);
  
   if (loading) return <div className='flex justify-center items-center h-screen'><span className="loading loading-spinner text-accent"></span></div>;
    if (error) return <div className='flex justify-center items-center h-screen'>
        <div role="alert" className="alert alert-error alert-outline">
        <span>Error! เกิดข้อผิดพลาดในการโหลดข้อมูล</span>
        </div>
    </div>;
  
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
              <li>
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
                    href="/rdu_service_plan"
                    className="text-sm font-medium text-gray-700 hover:text-green-300"
                  >
                    ข้อมูลเพื่อตอบสนอง Service Plan สาขา RDU
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
                    13. ร้อยละของโรงพยาบาล ส่งเสริมการใช้ยาอย่างสมเหตุผล
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* ส่วนของแผนภูมิ */}
          <div className="my-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              ร้อยละของโรงพยาบาล ส่งเสริมการใช้ยาอย่างสมเหตุผล ปีงบประมาณ {selectedYear}
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner text-accent"></span>
              </div>
            ) : (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="350"
                width="100%"
              />
            )}
          </div>

          <div className="flex justify-end p-2">
            {/* ปุ่ม dropdown เลือกปีงบประมาณ */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline btn-accent mr-2">
                ปีงบประมาณ {selectedYear} ▼
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {Helper.financialYears.map((year) => (
                  <li key={year}>
                    <button
                      className="w-full text-left"
                      onClick={() => setSelectedYear(year)}
                    >
                      ปีงบประมาณ {year}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <label className="input mr-2">
              <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="ค้นหา"
              />
            </label>
            <button
              onClick={() =>
                exportFilteredTableToExcel(excelData, "export_data", headers)
              }
              className="btn btn-outline btn-accent"
            >
              ดาวน์โหลดข้อมูล
            </button>
          </div>

          {/* ส่วนของตาราง */}
          <div className="w-full overflow-x-auto shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">
              ร้อยละของโรงพยาบาล ส่งเสริมการใช้ยาอย่างสมเหตุผล
            </h2>
            <table className="min-w-full table-auto text-sm text-left text-gray-500">
              {Helper.renderTableHeader(headers)}

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-200"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        {data.hospcode}:{data.hospname}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.target}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.r_red}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.target >
                        0
                          ? (
                              (data.r_red /
                                data.target) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.r_yellow}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.target >
                        0
                          ? (
                              (data.r_yellow /
                                data.target) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.result}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.target >
                        0
                          ? (
                              (data.result /
                                data.target) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass1}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.pass2}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass3}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass4}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.pass5}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass6}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass7}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.pass8}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.pass9}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass10}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass11}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.pass12}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="20" className="px-6 py-4 text-center">
                      ไม่พบข้อมูลที่ตรงกับการค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              1. ร้อยละการใช้ยาปฏิชีวนะในโรคติดเชื้อที่ระบบการหายใจช่วงบนและหลอดลมอักเสบเฉียบพลันในผู้ป่วยนอก ระดับโรงพยาบาล (RI)
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              2. ร้อยละการใช้ยาปฏิชีวนะในโรคอุจจาระร่วงเฉียบพลันในผู้ป่วยนอก ระดับโรงพยาบาล (AD)
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              3. ร้อยละการใช้ยาปฏิชีวนะในบาดแผลสดจากอุบัติเหตุ ระดับโรงพยาบาล (FTW)
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              4. ร้อยละการใช้ยาปฏิชีวนะในหญิงคลอดปกติครบกำหนดทางช่องคลอด ระดับโรงพยาบาล (APL)
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              5. ร้อยละของผู้ป่วยความดันสูง (Essential hypertension) ที่ใช้ RAS blockade (ACEI/ ARB/ Renin inhibitor) 2 ชนิดร่วมกันในการรักษาภาวะความดันเลือดสูง
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              6. ร้อยละของผู้ป่วยนอกโรคเบาหวานที่ใช้ยา metformin เป็นยาชนิดเดียวหรือร่วมกับยาอื่นเพื่อควบคุมระดับน้ำตาล โดยไม่มีข้อห้ามใช้
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              7. ร้อยละของผู้ป่วยที่มีการใช้ยากลุ่ม NSAIDs ซ้ำซ้อน
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              8. ร้อยละของผู้ป่วยนอกโรคไตเรื้อรังระดับ 3 ขึ้นไปที่ได้รับยา NSAIDs
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              9. ร้อยละของผู้ป่วยนอกโรคหืดที่ได้รับยา inhaled corticosteroid
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              10. ร้อยละผู้ป่วยนอกสูงอายุที่ใช้ยากลุ่ม long-acting benzodiazepine ได้แก่ chlordiazepoxide, diazepam, dipotassium chlorazepate
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              11. จำนวนสตรีตั้งครรภ์ที่ได้รับยาที่ห้ามใช้ ได้แก่ยา Warfarin หรือ Statins หรือ Ergots เมื่อรู้ว่าตั้งครรภ์แล้ว
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              12. ร้อยละครั้งบริการ (visit) ผู้ป่วยเด็ก ที่ได้รับการวินิจฉัยเป็นโรคติดเชื้อของทางเดินหายใจ และได้รับยาต้านฮิสตามีนชนิด non-sedating
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }