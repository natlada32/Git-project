import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from '../Navbar';
import exportFilteredTableToExcel from '../Utils/Export_to_excel';
import Footer from '../Footer/Footer';
import Helper from '../Utils/Helper';

const headers = [
        "หน่วยบริการ",
        "คน(B)",
        "ครั้ง(A)",        
        "อัตราส่วน",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย."
];
export default function S_opd_all() {
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
        "คน(B)": Helper.formatNumber(item.target),
        "ครั้ง(A)": Helper.formatNumber(item.result),        
        "อัตราส่วน": (item.target > 0 ? (item.result / item.target).toFixed(2) : "0"),
        "ต.ค.": Helper.formatNumber(item.result10),
        "พ.ย.": Helper.formatNumber(item.result11),
        "ธ.ค.": Helper.formatNumber(item.result12),
        "ม.ค.": Helper.formatNumber(item.result01),
        "ก.พ.": Helper.formatNumber(item.result02),
        "มี.ค.": Helper.formatNumber(item.result03),
        "เม.ย.": Helper.formatNumber(item.result04),
        "พ.ค.": Helper.formatNumber(item.result05),
        "มิ.ย.": Helper.formatNumber(item.result06),
        "ก.ค.": Helper.formatNumber(item.result07),
        "ส.ค.": Helper.formatNumber(item.result08),
        "ก.ย.": Helper.formatNumber(item.result09),
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ตั้งค่า loading เป็น true ทุกครั้งที่มีการเรียก API
        const API_URL = 'https://opendata.moph.go.th/api/report_data';
        const response = await fetch(API_URL, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tableName: 's_opd_all',
            year: selectedYear, // ใช้ state ของปีที่เลือก
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
            name: "อัตราส่วน",
            data: dataWithNames.map(item => parseFloat(item.result / item.target))
          }
        ];
        setChartSeries(seriesData);
        setChartOptions(prev => ({
          ...prev,
          chart: {
            ...prev.chart,
            animations: { enabled: false }
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
  }, [selectedYear]); // เพิ่ม selectedYear ใน dependency array เพื่อให้ useEffect ทำงานเมื่อค่านี้เปลี่ยน

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
                  href="/health_services"
                  className="text-sm font-medium text-gray-700 hover:text-green-300"
                >
                  การใช้บริการสาธารณสุข
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
                  อัตราการใช้บริการผู้ป่วยนอก ทุกสิทธิ (ครั้งต่อคนต่อปี)
                  รายเดือน
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* ส่วนของแผนภูมิ */}
        <div className="my-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">กราฟแสดงอัตราการใช้บริการผู้ป่วยนอก ประจำปีงบประมาณ {selectedYear}</h2>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <span className="loading loading-spinner text-accent"></span>
            </div>
          ) : (
            <Chart options={chartOptions} series={chartSeries} type="bar" height="350" width="100%" />
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
          <h2 className="text-lg font-semibold text-gray-600 mb-4">อัตราการใช้บริการผู้ป่วยนอก ทุกสิทธิ (ครั้งต่อคนต่อปี) รายเดือน</h2>
          <table className="min-w-full table-auto text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-green-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  หน่วยบริการ
                </th>
                <th scope="col" className="px-6 py-3 text-center">คน(B)</th>
                <th scope="col" className="px-6 py-3 text-center">ครั้ง(A)</th>
                <th scope="col" className="px-6 py-3 text-center">อัตราส่วน</th>
                <th scope="col" className="px-6 py-3 text-center">
                  ต.ค.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  พ.ย.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  ธ.ค.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  ม.ค.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  ก.พ.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  มี.ค.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  เม.ย.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  พ.ค.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  มิ.ย.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  ก.ค.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  ส.ค.
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  ก.ย.
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((data, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      {data.hospcode}:{data.hospname}
                    </td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.target)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result)}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      {(data.result / data.target).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result10)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result11)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result12)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result01)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result02)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result03)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result04)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result05)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result06)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result07)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result08)}</td>
                    <td className="px-6 py-4 text-right">{Helper.formatNumber(data.result09)}</td>
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
              B หมายถึง จำนวนการใช้บริการผู้ป่วยนอก ทุกสิทธิ (คน)
            </div>
            <div className="p-2 text-xs text-left font-semibold text-green-600">
              A หมายถึง จำนวนการใช้บริการผู้ป่วยนอก ทุกสิทธิ (ครั้ง)
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
