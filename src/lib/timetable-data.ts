import timetableDataUtils from "../../public/timetable.json"

export interface TimetableEntry {
  Section: string
  Course: string
  Day: string
  "Start Time": string
  "End Time": string
  Room: string
  Instructor: string
}

export const timetableData: TimetableEntry[] = timetableDataUtils as TimetableEntry[]
