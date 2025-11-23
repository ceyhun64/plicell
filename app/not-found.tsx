import Link from "next/link";


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-6 animate-fadeIn">
      <h1 className="text-7xl font-extrabold tracking-tight">404</h1>

      <p className="mt-4 text-lg text-gray-500 max-w-sm text-center">
        Aradığınız sayfa bulunamadı.
      </p>

      <Link
        href="/"
        className="mt-8 px-6 py-3 rounded-full bg-[#7B0323] text-white text-sm font-medium hover:bg-[#7B0323]/90 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Ana Sayfaya Dön
      </Link>

     
    </div>
  );
}
