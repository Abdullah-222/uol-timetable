import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TimetableEntry } from "@/lib/timetable-data"

interface TimetableProps {
  data: TimetableEntry[]
  section: string
}

export default function Timetable({ data, section }: TimetableProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const timeSlots = Array.from(new Set(data.map((entry) => `${entry["Start Time"]} - ${entry["End Time"]}`))).sort(
    (a, b) => a.localeCompare(b),
  )

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-4">{section}</h2>
      <p className="text-sm text-center mb-4">Created by <span className="text-blue-500">Abdullah</span></p>

      <div className="overflow-x-auto">
        <Table className="w-full border-collapse border border-black min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100 border border-gray-500 p-2 text-center font-bold">Day/Time</TableHead>
              {timeSlots.map((slot) => (
                <TableHead key={slot} className="bg-gray-200 border border-gray-500 p-2 text-center font-bold">
                  {slot}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day}>
                <TableCell className="font-semibold border border-gray-500 p-2 text-center">{day}</TableCell>
                {timeSlots.map((slot) => {
                  const entry = data.find((e) => e.Day === day && `${e["Start Time"]} - ${e["End Time"]}` === slot)
                  return (
                    <TableCell key={slot} className="border border-gray-500 p-2 min-w-[150px]">
                      {entry && (
                        <div className="bg-blue-100 rounded p-2 h-full">
                          <p className="font-bold">{entry.Course}</p>
                          <p className="text-sm font-normal">{entry.Instructor}</p>
                          <p className="text-sm font-semibold text-indigo-600">{entry.Room}</p>
                          {section === "Custom Timetable" && (
                            <p className="text-xs font-semibold text-grey-600 mt-1">{entry.Section}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

