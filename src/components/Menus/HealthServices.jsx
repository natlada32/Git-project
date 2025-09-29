import Navbar from '../Navbar';
import Footer from '../Footer/Footer';

const report = [
    {
        id: 1,
        name: 'อัตราการใช้บริการผู้ป่วยนอก ทุกสิทธิ (ครั้งต่อคนต่อปี) รายเดือน',
        link: '/opd_all',
    },
];

export default function Health_services() {

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
                <span className="text-sm font-medium text-gray-500">
                  การใช้บริการสาธารณสุข
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
              {report.length > 0 ? (
                report.map((data, index) => (
                  <tr key={index} className="bg-white border-b ">
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      <a href={data.link} className='hover:text-green-300'>{data.name}</a>
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