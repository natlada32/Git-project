// 19. ค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดรับประทานทุกรายการต่อ 1000 OP Visit
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from './../../Navbar'
import Footer from './../../Footer/Footer';
import exportFilteredTableToExcel from '../../Utils/Export_to_excel';
import Helper from '../../Utils/Helper';

const headers = [
  "หน่วยบริการ",
  {
    title: "รวม",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "ต.ค.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "พ.ย.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "ธ.ค.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "ม.ค.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "ก.พ.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "มี.ค.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "เม.ย.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "พ.ค.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "มิ.ย.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "ก.ค.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "ส.ค.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  },
  {
    title: "ก.ย.",
    children: ["OP Visit", "DDD รวม", "DDDต่อ1000 OP Visit"]
  }
];

export default function S_ddd3() {
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
    let row = {
      "หน่วยบริการ": `${item.hospcode}:${item.hospname}`,
      "รวม": {
        "OP Visit": Helper.formatNumber(item.op),
        "DDD รวม": Helper.formatNumber(parseFloat(item.dd).toFixed(2)),
        "DDDต่อ1000 OP Visit": item.op > 0 ? Helper.formatNumber((parseFloat(item.dd / item.op) * 1000).toFixed(2)) : "0.00"
      }
    };

    Helper.months.forEach(m => {
      const op = item[`op${m.key}`] || 0;
      const dd = item[`dd${m.key}`] || 0;
      row[m.label] = {
        "OP Visit": Helper.formatNumber(op),
        "DDD รวม": Helper.formatNumber(parseFloat(dd).toFixed(2)),
        "DDDต่อ1000 OP Visit": op > 0 ? Helper.formatNumber((parseFloat(dd / op) * 1000).toFixed(2)) : "0.00"
      };
    });

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
            tableName: 's_ddd3',
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
            name: "DDD ต่อ 1000 OP Visit",
            data: dataWithNames.map(item => 
              item.op > 0 ? parseFloat((item.dd / item.op) * 1000) : 0
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
                      19. ค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดรับประทานทุกรายการต่อ 1000 OP Visit
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
    
            {/* ส่วนของแผนภูมิ */}
            <div className="my-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                    กราฟแสดงค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดรับประทานทุกรายการต่อ 1000 OP Visit ประจำปีงบประมาณ {selectedYear}
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
                onClick={ () => exportFilteredTableToExcel(excelData, 'export_data', headers)}
                className="btn btn-outline btn-accent"
              >
                ดาวน์โหลดข้อมูล
              </button>
            </div>
            
            {/* ส่วนของตาราง */}
            <div className="w-full overflow-x-auto shadow-md rounded-lg">
              <h2 className="text-lg font-semibold text-gray-600 mb-4">ค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดรับประทานทุกรายการต่อ 1000 OP Visit</h2>
              <table className="min-w-full table-auto text-sm text-left text-gray-500">
                {Helper.renderTableHeader(headers)}
                
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((data, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-200">
                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                          {data.hospcode}:{data.hospname}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op > 0 ? Helper.formatNumber(parseFloat((data.dd / data.op) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op10)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd10).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op10 > 0 ? Helper.formatNumber(parseFloat((data.dd10 / data.op10) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op11)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd11).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op11 > 0 ? Helper.formatNumber(parseFloat((data.dd11 / data.op11) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op12)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd12).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op12 > 0 ? Helper.formatNumber(parseFloat((data.dd12 / data.op12) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op1)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd1).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op1 > 0 ? Helper.formatNumber(parseFloat((data.dd1 / data.op1) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op2)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd2).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op2 > 0 ? Helper.formatNumber(parseFloat((data.dd2 / data.op2) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op3)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd3).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op3 > 0 ? Helper.formatNumber(parseFloat((data.dd3 / data.op3) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op4)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd4).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op4 > 0 ? Helper.formatNumber(parseFloat((data.dd4 / data.op4) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op5)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd5).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op5 > 0 ? Helper.formatNumber(parseFloat((data.dd5 / data.op5) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op6)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd6).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op6 > 0 ? Helper.formatNumber(parseFloat((data.dd6 / data.op6) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op7)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd7).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op7 > 0 ? Helper.formatNumber(parseFloat((data.dd7 / data.op7) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op8)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd8).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op8 > 0 ? Helper.formatNumber(parseFloat((data.dd8 / data.op8) * 1000).toFixed(2)) : "0.00"}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.op9)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd9).toFixed(2))}</td>                        
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          {data.op9 > 0 ? Helper.formatNumber(parseFloat((data.dd9 / data.op9) * 1000).toFixed(2)) : "0.00"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="40" className="px-6 py-4 text-center">
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