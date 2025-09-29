// 16. ร้อยละของรพ.สต.ที่มีอัตราการใช้ยาปฏิชีวนะในโรค Respiratory Infection และ Acute Diarrhea <= ร้อยละ20 ทั้ง 2 โรค (RUA PCU)
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from './../../Navbar'
import Footer from './../../Footer/Footer';
import exportFilteredTableToExcel from '../../Utils/Export_to_excel';
import Helper from '../../Utils/Helper';

const headers = [
  "หน่วยบริการ",
  "จำนวน รพ.สต. B",
  {
    title: "รวมทั้งปีงบประมาณ",
    children: ["RI", "ร้อยละ", "AD", "ร้อยละ", "RI&AD", "ร้อยละ"]
  },
  {
    title: "ไตรมาส 1",
    children: ["RI", "AD", "RI&AD"]
  },
  {
    title: "ไตรมาส 2",
    children: ["RI", "AD", "RI&AD"]
  },
  {
    title: "ไตรมาส 3",
    children: ["RI", "AD", "RI&AD"]
  },
  {
    title: "ไตรมาส 4",
    children: ["RI", "AD", "RI&AD"]
  }  
];

export default function S_rdu_pcu() {
  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search , setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2568'); // สร้าง state ใหม่สำหรับปีที่เลือก
  // State สำหรับเก็บข้อมูลและตัวเลือกของแผนภูมิ
  const [chartSeries, setChartSeries] = useState([]);
  const [chartSeries1, setChartSeries1] = useState([]);
  const [chartSeries2, setChartSeries2] = useState([]);
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
      "จำนวน รพ.สต. B": item.target,
      "รวมทั้งปีงบประมาณ": {
        "RI": item.ri,
        "ร้อยละ": item.target > 0 ? (item.ri /(item.target) * 100).toFixed(2)  : "0",
        "AD": item.ad,
        "ร้อยละ AD": item.target > 0 ? (item.ad /(item.target) * 100).toFixed(2) : "0",
        "RI&AD": item.result,
        "ร้อยละ RI&AD": item.target > 0 ? ((item.result / item.target) * 100).toFixed(2) : "0"
      },
      "ไตรมาส 1": {
            "RI": item.ri_q1,
            "AD": item.ad_q1,
            "RI&AD": item.q1
      },
      "ไตรมาส 2": {
           "RI": item.ri_q2,
           "AD": item.ad_q2,
           "RI&AD": item.q2
      },
      "ไตรมาส 3": {
            "RI": item.ri_q3,
            "AD": item.ad_q3,
            "RI&AD": item.q3
        },
        "ไตรมาส 4": {
            "RI": item.ri_q4,
            "AD": item.ad_q4,
            "RI&AD": item.q4
        },
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
            tableName: 's_rdu_pcu',
            year: selectedYear,
            province: '37',
            type: 'json',
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();
        const filteredItems = apiData.filter(item => Helper.allowedHospCode.includes(item.hospcode));

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
              item.target > 0 ? (item.ri /(item.target) * 100).toFixed(2)  : 0
            )
          }
        ];
        const seriesData1 = [
          {
            name: "ร้อยละ",
            data: dataWithNames.map(item => 
              item.target > 0 ? (item.ad /(item.target) * 100).toFixed(2) : 0
            )
          }
        ];
        const seriesData2 = [
          {
            name: "ร้อยละ",
            data: dataWithNames.map(item => 
              item.target > 0 ? ((item.result / item.target) * 100).toFixed(2) : 0
            )
          }
        ];
        setChartSeries(seriesData);
        setChartSeries1(seriesData1);
        setChartSeries2(seriesData2);
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
      console.log(dataWithNames);
      
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
                    16. ร้อยละของรพ.สต.ที่มีอัตราการใช้ยาปฏิชีวนะในโรค Respiratory Infection และ Acute Diarrhea {'<'}= ร้อยละ20 ทั้ง 2 โรค (RUA PCU)
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* ส่วนของแผนภูมิ */}
          <div className="my-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              ร้อยละของรพ.สต.ที่มีอัตราการใช้ยาปฏิชีวนะในโรค Respiratory Infection และ Acute Diarrhea {'<'}= ร้อยละ20 ทั้ง 2 โรค (RUA PCU) ปีงบประมาณ {selectedYear}
            </h2>
            <div className="text-sm font-semibold text-gray-800 mb-2 text-center">
                        แผนภูมิแสดง ทางเดินหายใจ
            </div>
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
            <div className='flex flex-col md:flex-row gap-6'>
                <div className="w-full md:w-1/2">
                    <div className="text-sm font-semibold text-gray-800 mb-2 text-center">
                        แผนภูมิแสดง ทางเดินอาหาร
                    </div>
                    {loading ? (
                        <div className='flex justify-center items-center h-64'>
                            <span className="loading loading-spinner text-accent"></span>
                        </div>
                    ) : (
                        <Chart options={chartOptions} series={chartSeries1} type="bar" height="350" width="100%" />
                        )}
                </div>
                <div className="w-full md:w-1/2">
                    <div className="text-sm font-semibold text-gray-800 mb-2 text-center">
                        แผนภูมิแสดง ทั้ง 2 โรค
                    </div>
                    {loading ? (
                        <div className='flex justify-center items-center h-64'>
                            <span className="loading loading-spinner text-accent"></span>
                        </div>
                    ) : (
                        <Chart options={chartOptions} series={chartSeries2} type="bar" height="350" width="100%" />
                        )}
                </div>
            </div>
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
              ร้อยละของรพ.สต.ที่มีอัตราการใช้ยาปฏิชีวนะในโรค Respiratory Infection และ Acute Diarrhea {'<'}= ร้อยละ20 ทั้ง 2 โรค (RUA PCU)
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
                        {data.ri}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.target >
                        0
                          ? (
                              (data.ri /
                                data.target) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.ad}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {data.target >
                        0
                          ? (
                              (data.ad /
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
                              ((data.result) /
                                data.target) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.ri_q1}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.ad_q1}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.q1}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.ri_q2}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.ad_q2}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.q2}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.ri_q3}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.ad_q3}
                      </td>
                      <td className="px-6 py-4 text-right ">
                        {data.q3}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.ri_q4}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.ad_q4}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.q4}
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
              B หมายถึง จำนวน รพ.สต.และหน่วยบริการปฐมภูมิทั้งหมด
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              A หมายถึง จำนวน รพ.สต.และหน่วยบริการปฐมภูมิในเครือข่ายที่มีอัตราการใช้ยาปฏิชีวนะในโรค RI และ AD ≤ ร้อยละ 20 ทั้ง 2 โรค
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }