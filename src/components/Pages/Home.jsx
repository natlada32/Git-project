import Navbar from "../Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-transform duration-500 hover:scale-105">
          <div className="mb-6">
            <img
              src="/PR-Logo.jpg"
              alt="Health Data Logo"
              className="mx-auto h-24 w-24 sm:h-32 sm:w-32 object-contain"
              loading="lazy"
            />
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-green-800 mb-2 tracking-tight">
            HDP
          </h1>
          <h3 className="text-xl sm:text-2xl text-gray-600 font-medium">
            Health Data Patumrachwongsa
          </h3>

        </div>
      </div>
    </>
  );
}
