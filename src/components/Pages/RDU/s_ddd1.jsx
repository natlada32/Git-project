// 17. ค่า Defined Daily Dose (DDD) ของยาปฏิชีวนะชนิดรับประทานต่อ 1000 OP Visit แยกตามชื่อสามัญทางยา (Generic name)
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from './../../Navbar'
import Footer from './../../Footer/Footer';
import exportFilteredTableToExcel from '../../Utils/Export_to_excel';
import Helper from '../../Utils/Helper';

const headers = [
  "หน่วยบริการ",
  {
    title: "รวม",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "ต.ค.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "พ.ย.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "ธ.ค.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "ม.ค.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "ก.พ.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "มี.ค.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "เม.ย.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "พ.ค.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "มิ.ย.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "ก.ค.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "ส.ค.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  },
  {
    title: "ก.ย.",
    children: ["จำนวนวันนอน", "DDD รวม", "DDDต่อ100 วันนอน"]
  }
];

export default function S_ddd1() {
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
        "จำนวนวันนอน": Helper.formatNumber(item.iday),
        "DDD รวม": Helper.formatNumber(parseFloat(item.dd).toFixed(2)),
        "DDDต่อ100 วันนอน": item.iday > 0 ? Helper.formatNumber(((item.dd / item.iday) * 100).toFixed(2)) : "0.00"
      }
    };

    Helper.months.forEach(m => {
      const iday = item[`iday${m.key}`] || 0;
      const dd = item[`dd${m.key}`] || 0;
      row[m.label] = {
        "จำนวนวันนอน": Helper.formatNumber(iday),
        "DDD รวม": Helper.formatNumber(parseFloat(dd).toFixed(2)),
        "DDDต่อ100 วันนอน": iday > 0 ? Helper.formatNumber(((dd / iday) * 100).toFixed(2)) : "0.00"
      };
    });

    return row;
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = '';
        const response = await fetch(API_URL, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableName: 's_ddd1',
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
            name: "DDD ต่อ 100 วันนอน",
            data: dataWithNames.map(item => 
              item. iday > 0 ? parseFloat((item.dd / item.iday) * 100) : 0
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
                      22. ค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดฉีดทุกรายการที่ใช้ในผู้ป่วยที่รับไว้รักษาในโรงพยาบาล (Admit) ต่อ 100 วันนอน
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
    
            {/* ส่วนของแผนภูมิ */}
            <div className="my-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                    กราฟแสดงค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดฉีดทุกรายการที่ใช้ในผู้ป่วยที่รับไว้รักษาในโรงพยาบาล (Admit) ต่อ 100 วันนอน ประจำปีงบประมาณ {selectedYear}
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
              <h2 className="text-lg font-semibold text-gray-600 mb-4">ค่า Defined Daily Dose (DDD) รวมของยาปฏิชีวนะชนิดฉีดทุกรายการที่ใช้ในผู้ป่วยที่รับไว้รักษาในโรงพยาบาล (Admit) ต่อ 100 วันนอน</h2>
              <table className="min-w-full table-auto text-sm text-left text-gray-500">
                {Helper.renderTableHeader(headers)}
                <tbody>
                {filteredData.length > 0 ? (
                    filteredData.map((data, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-200">
                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                            {data.hospcode}:{data.hospname}
                        </td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(data.iday)}</td>
                        <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(data.dd).toFixed(2))}</td>
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                            {data.iday > 0 ? Helper.formatNumber(((data.dd / data.iday) * 100).toFixed(2)) : "0.00"}
                        </td>

                        {/* วน loop เดือน */}
                        {Helper.months.map((m, idx) => {
                            const iday = data[`iday${m.key}`] || 0;
                            const dd = data[`dd${m.key}`] || 0;
                            const Fragment = React.Fragment;
                            return (
                            <Fragment key={idx}>
                                <td className="px-6 py-4 text-right">{Helper.formatNumber(iday)}</td>
                                <td className="px-6 py-4 text-right">{Helper.formatNumber(parseFloat(dd).toFixed(2))}</td>
                                <td className="px-6 py-4 text-right font-bold text-green-600">
                                {iday > 0 ? Helper.formatNumber(((dd / iday) * 100).toFixed(2)) : "0.00"}
                                </td>
                            </Fragment>
                            );
                        })}
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="40" className="px-6 py-4 text-center">ไม่พบข้อมูลที่ตรงกับการค้นหา</td>
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