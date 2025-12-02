import React from 'react'

export default function TourGuideNotFoundScreen({ navigate }) {
  return (
     <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Guide Not Found</h2>
            <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-[#C7A15C] text-black font-bold rounded-full">Go Home</button>
        </div>
  )
}
