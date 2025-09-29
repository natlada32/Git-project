// 5. ร้อยละของผู้ป่วยความดันสูง (Essential hypertension) ที่ใช้ RAS blockade (ACEI/ ARB/ Renin inhibitor) 2 ชนิดร่วมกันในการรักษาภาวะความดันเลือดสูง
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from './../../Navbar'
import Footer from './../../Footer/Footer';
import exportFilteredTableToExcel from '../../Utils/Export_to_excel';
import Helper from '../../Utils/Helper';

const headers = [
  "หน่วยบริการ",
  {
    title: "รวมทั้งปีงบประมาณ",
    children: ["B", "A", "ร้อยละ"]
  },
  {
    title: "ไตรมาส 1",
    children: ["B", "A", "ร้อยละ"]
  },
  {
    title: "ไตรมาส 2",
    children: ["B", "A", "ร้อยละ"]
  },
  {
    title: "ไตรมาส 3",
    children: ["B", "A", "ร้อยละ"]
  },
  {
    title: "ไตรมาส 4",
    children: ["B", "A", "ร้อยละ"]
  }
];

export default function S_rdu10() {
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
    
  const excelData = filteredData.map(item => ({
     "หน่วยบริการ": `${item.hospcode}:${item.hospname}`,
        "รวมทั้งปีงบประมาณ": {
            "B": Helper.formatNumber((item.t10 + item.t11 + item.t12 + item.t01 + item.t02 + item.t03 + item.t04 + item.t05 + item.t06 + item.t07 + item.t08 + item.t09)),
            "A": Helper.formatNumber((item.r10 + item.r11 + item.r12 + item.r01 + item.r02 + item.r03 + item.r04 + item.r05 + item.r06 + item.r07 + item.r08 + item.r09)),
            "ร้อยละ": (item.t10 + item.t11 + item.t12 + item.t01 + item.t02 + item.t03 + item.t04 + item.t05 + item.t06 + item.t07 + item.t08 + item.t09) > 0 ? (((item.r10 + item.r11 + item.r12 + item.r01 + item.r02 + item.r03 + item.r04 + item.r05 + item.r06 + item.r07 + item.r08 + item.r09) / (item.t10 + item.t11 + item.t12 + item.t01 + item.t02 + item.t03 + item.t04 + item.t05 + item.t06 + item.t07 + item.t08 + item.t09)) * 100).toFixed(2) : "0"
        },
        "ไตรมาส 1": {
            "B": Helper.formatNumber((item.t10 + item.t11 + item.t12)),
            "A": Helper.formatNumber((item.r10 + item.r11 + item.r12)),
            "ร้อยละ": (item.t10 + item.t11 + item.t12) > 0 ? (((item.r10 + item.r11 + item.r12) / (item.t10 + item.t11 + item.t12)) * 100).toFixed(2) : "0"
        },
        "ไตรมาส 2": {
            "B": Helper.formatNumber((item.t01 + item.t02 + item.t03)),
            "A": Helper.formatNumber((item.r01 + item.r02 + item.r03)),
            "ร้อยละ": (item.t01 + item.t02 + item.t03) > 0 ? (((item.r01 + item.r02 + item.r03) / (item.t01 + item.t02 + item.t03)) * 100).toFixed(2) : "0"
        },
        "ไตรมาส 3": {
            "B": Helper.formatNumber((item.t04 + item.t05 + item.t06)),
            "A": Helper.formatNumber((item.r04 + item.r05 + item.r06)),
            "ร้อยละ": (item.t04 + item.t05 + item.t06) > 0 ? (((item.r04 + item.r05 + item.r06) / (item.t04 + item.t05 + item.t06)) * 100).toFixed(2) : "0"
        },
        "ไตรมาส 4": {
            "B": Helper.formatNumber((item.t07 + item.t08 + item.t09)),
            "A": Helper.formatNumber((item.r07 + item.r08 + item.r09)),
            "ร้อยละ": (item.t07 + item.t08 + item.t09) > 0 ? (((item.r07 + item.r08 + item.r09) / (item.t07 + item.t08 + item.t09)) * 100).toFixed(2) : "0"
        }
    }));


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
            tableName: 's_rdu10',
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
              (item.t10 + item.t11 + item.t12 + item.t01 + item.t02 + item.t03 + item.t04 + item.t05 + item.t06 + item.t07 + item.t08 + item.t09) > 0 ? parseFloat(item.r10 + item.r11 + item.r12 + item.r01 + item.r02 + item.r03 + item.r04 + item.r05 + item.r06 + item.r07 + item.r08 + item.r09) / (item.t10 + item.t11 + item.t12 + item.t01 + item.t02 + item.t03 + item.t04 + item.t05 + item.t06 + item.t07 + item.t08 + item.t09) * 100 : 0
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
                    5. ร้อยละของผู้ป่วยความดันสูง (Essential hypertension)
                    ที่ใช้ RAS blockade (ACEI/ ARB/ Renin inhibitor) 2
                    ชนิดร่วมกันในการรักษาภาวะความดันเลือดสูง
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* ส่วนของแผนภูมิ */}
          <div className="my-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              กราฟแสดงร้อยละของผู้ป่วยความดันสูง (Essential hypertension) ที่ใช้
              RAS blockade (ACEI/ ARB/ Renin inhibitor) 2
              ชนิดร่วมกันในการรักษาภาวะความดันเลือดสูง ปีงบประมาณ {selectedYear}
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
              ร้อยละของผู้ป่วยความดันสูง (Essential hypertension) ที่ใช้ RAS
              blockade (ACEI/ ARB/ Renin inhibitor) 2
              ชนิดร่วมกันในการรักษาภาวะความดันเลือดสูง
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
                        {Helper.formatNumber(
                          data.t10 +
                          data.t11 +
                          data.t12 +
                          data.t01 +
                          data.t02 +
                          data.t03 +
                          data.t04 +
                          data.t05 +
                          data.t06 +
                          data.t07 +
                          data.t08 +
                          data.t09)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.r10 +
                          data.r11 +
                          data.r12 +
                          data.r01 +
                          data.r02 +
                          data.r03 +
                          data.r04 +
                          data.r05 +
                          data.r06 +
                          data.r07 +
                          data.r08 +
                          data.r09)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.t10 +
                          data.t11 +
                          data.t12 +
                          data.t01 +
                          data.t02 +
                          data.t03 +
                          data.t04 +
                          data.t05 +
                          data.t06 +
                          data.t07 +
                          data.t08 +
                          data.t09 >
                        0
                          ? (
                              ((data.r10 +
                                data.r11 +
                                data.r12 +
                                data.r01 +
                                data.r02 +
                                data.r03 +
                                data.r04 +
                                data.r05 +
                                data.r06 +
                                data.r07 +
                                data.r08 +
                                data.r09) /
                                (data.t10 +
                                  data.t11 +
                                  data.t12 +
                                  data.t01 +
                                  data.t02 +
                                  data.t03 +
                                  data.t04 +
                                  data.t05 +
                                  data.t06 +
                                  data.t07 +
                                  data.t08 +
                                  data.t09)) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.t10 + data.t11 + data.t12)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.r10 + data.r11 + data.r12)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.t10 + data.t11 + data.t12 > 0
                          ? (
                              ((data.r10 + data.r11 + data.r12) /
                                (data.t10 + data.t11 + data.t12)) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.t01 + data.t02 + data.t03)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.r01 + data.r02 + data.r03)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.t01 + data.t02 + data.t03 > 0
                          ? (
                              ((data.r01 + data.r02 + data.r03) /
                                (data.t01 + data.t02 + data.t03)) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.t04 + data.t05 + data.t06)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.r04 + data.r05 + data.r06)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.t04 + data.t05 + data.t06 > 0
                          ? (
                              ((data.r04 + data.r05 + data.r06) /
                                (data.t04 + data.t05 + data.t06)) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.t07 + data.t08 + data.t09)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Helper.formatNumber(data.r07 + data.r08 + data.r09)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.t07 + data.t08 + data.t09 > 0
                          ? (
                              ((data.r07 + data.r08 + data.r09) /
                                (data.t07 + data.t08 + data.t09)) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="px-6 py-4 text-center">
                      ไม่พบข้อมูลที่ตรงกับการค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              B หมายถึง จำนวน visit ผู้ป่วยโรคความดันเลือดสูง (Essential
              hypertension) ที่ได้รับยาลดความดันเลือดกลุ่ม RAS blockage
              อย่างน้อย 1 ชนิด
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              A หมายถึง จำนวน visit ผู้ป่วยโรคความดันเลือดสูง (Essential
              hypertension) ที่ได้รับการสั่งใช้ยากลุ่ม RAS blockage
              มากกว่าหรือเท่ากับ 2 ชนิด
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }