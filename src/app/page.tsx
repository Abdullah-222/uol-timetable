import TimetableGenerator from "@/components/timetable-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold  mb-4 text-center">
          UOL Timetable <span className="text-blue-600 underline">Generator</span>
        </h1>
        <p className="text-lg text-gray-600 text-center m-4">
          Create your personalized timetable effortlessly with our easy-to-use generator.
        </p>
        <p className="text-lg text-gray-600 text-center m-4">
          ---- UPDATED TILL NOW ----
        </p>
        <p className="text-lg text-gray-600 text-center mb-5">
          This is for <span className="text-blue-500 underline">4th sem</span> now. More Coming Soon :)
          
        </p>
         <TimetableGenerator /> 
         
      </div>
    </main>
  )
}  

