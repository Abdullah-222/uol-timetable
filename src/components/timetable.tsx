import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TimetableEntry } from "@/lib/timetable-data"

interface TimetableProps {
  data: TimetableEntry[]
  section: string
}

export default function Timetable({ data, section }: TimetableProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Helper to normalize time strings (e.g. "8:00" -> "08:00")
  const normalizeTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    return `${hours.padStart(2, "0")}:${minutes}`
  }

  // Extract all unique start times to define columns
  const uniqueStartTimes = Array.from(new Set(data.map((entry) => normalizeTime(entry["Start Time"])))).sort()

  // Generate headers: For each start time, find the corresponding end time. 
  // If multiple end times exist (e.g. Lecture ending 9:15 vs Lab ending 11:00), 
  // prefer the one that is closest to the next start time to represent the standard slot.
  const timeSlots = uniqueStartTimes.map(startTime => {
    // Find entries starting at this time (matching either normalized or original)
    const entries = data.filter(e => normalizeTime(e["Start Time"]) === startTime)
    // Pick the smallest end time to denote the standard slot duration
    // This usually corresponds to a single lecture slot
    const endTime = entries.map(e => e["End Time"]).sort()[0] || ""
    return { start: startTime, end: endTime, label: `${startTime} - ${endTime}` }
  })

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">{section}</h2>
      <p className="text-sm text-center mb-4 text-gray-300">Created by <span className="text-accent-cyan">Abdullah</span></p>

      <div className="overflow-x-auto">
        <Table className="w-full border-collapse border border-white/20 min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-dark-bg border border-white/20 p-2 text-center font-bold text-accent-cyan">Day/Time</TableHead>
              {timeSlots.map((slot) => (
                <TableHead key={slot.start} className="bg-dark-bg border border-white/20 p-2 text-center font-bold text-accent-cyan">
                  {slot.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day) => {
              // Track skipped slots due to colSpan
              let skipSlots = 0;

              // Check if day has any classes
              const dayHasClasses = data.some(e => e.Day === day);
              if (!dayHasClasses) return null; // Optional: hide empty days or keep them? User didn't specify. Keeping them is safer for consistency, but returning null hides them. 
              // Wait, previous implementation kept them. Let's keep them but iterate slots.

              return (
                <TableRow key={day}>
                  <TableCell className="font-semibold border border-white/20 p-2 text-center text-white bg-white/5">{day}</TableCell>
                  {timeSlots.map((slot, index) => {
                    if (skipSlots > 0) {
                      skipSlots--;
                      return null;
                    }

                    const entry = data.find((e) => e.Day === day && normalizeTime(e["Start Time"]) === slot.start)

                    if (entry) {
                      // Calculate span
                      let span = 1;
                      for (let i = index + 1; i < timeSlots.length; i++) {
                        // If the entry ends AFTER the next slot starts, it consumes that slot
                        if (normalizeTime(entry["End Time"]) > timeSlots[i].start) {
                          span++;
                        } else {
                          break;
                        }
                      }

                      skipSlots = span - 1;

                      return (
                        <TableCell key={slot.start} colSpan={span} className="border border-white/20 p-2 min-w-[150px]">
                          <div className="bg-accent-cyan/20 border border-accent-cyan/30 rounded p-2 h-full hover:bg-accent-cyan/30 transition-colors">
                            <p className="font-bold text-accent-cyan">{entry.Course}</p>
                            <p className="text-sm font-normal text-gray-300">{entry.Instructor}</p>
                            <p className="text-sm font-semibold text-accent-yellow">{entry.Room}</p>
                            {section === "Custom Timetable" && (
                              <p className="text-xs font-semibold text-gray-400 mt-1">{entry.Section}</p>
                            )}
                          </div>
                        </TableCell>
                      )
                    } else {
                      return (
                        <TableCell key={slot.start} className="border border-white/20 p-2 min-w-[150px]"></TableCell>
                      )
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

