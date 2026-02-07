import TimetableGenerator from "@/components/timetable-generator"

export default function GeneratorPage() {
    return (
        <main className="min-h-screen bg-dark-bg px-4 pb-4 pt-28 sm:px-8 sm:pb-8 sm:pt-32 text-white">
            <div className="w-full">
                <TimetableGenerator />
            </div>
        </main>
    )
}
