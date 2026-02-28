"use client";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-white rounded-xl h-full min-h-[calc(100vh-200px)]">
      <video
        src="/videos/loading_crane.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-64 h-64 object-contain mb-0"
      />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Dashboard Under Development
      </h1>
      <p className="text-gray-500 text-center max-w-md">
        We're working hard to bring you an amazing dashboard experience. Stay
        tuned!
      </p>
    </div>
  );
}