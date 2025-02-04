"use client"

import { useState, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Timetable from "./timetable"
import { timetableData, type TimetableEntry } from "@/lib/timetable-data"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function TimetableGenerator() {
  const [sections, setSections] = useState<string[]>([])
  const [selectedSection, setSelectedSection] = useState("")
  const [customTimetable, setCustomTimetable] = useState<TimetableEntry[]>([])
  const [error, setError] = useState("")
  const [selectedCustomSection, setSelectedCustomSection] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const uniqueSections = Array.from(new Set(timetableData.map((entry) => entry.Section)))
    setSections(uniqueSections)
  }, [])

  const handleAddClass = (course: string) => {
    const entriesToAdd = timetableData.filter(
      (entry) =>
        entry.Section === selectedCustomSection &&
        (entry.Course === course || (course === "DSA" && entry.Course === "DSA-LAB")),
    )

    const conflict = entriesToAdd.some((newEntry) =>
      customTimetable.some(
        (existingEntry) =>
          existingEntry.Day === newEntry.Day &&
          ((existingEntry["Start Time"] <= newEntry["Start Time"] &&
            newEntry["Start Time"] < existingEntry["End Time"]) ||
            (existingEntry["Start Time"] < newEntry["End Time"] && newEntry["End Time"] <= existingEntry["End Time"])),
      ),
    )

    if (conflict) {
      setError("Time conflict detected. This class overlaps with an existing class in your timetable.")
      return
    }

    setCustomTimetable((prev) => [...prev, ...entriesToAdd])
    setError("")
  }

  const handleRemoveClass = (course: string) => {
    setCustomTimetable((prev) =>
      prev.filter((entry) => entry.Course !== course && !(course === "DSA" && entry.Course === "DSA-LAB")),
    )
  }

  const downloadTimetable = async (format: "png" | "pdf") => {
    const timetableElement = containerRef.current
    if (!timetableElement) return

    const originalStyle = {
      overflow: timetableElement.style.overflow,
      width: timetableElement.style.width,
    }
    timetableElement.style.overflow = "visible"
    timetableElement.style.width = "fit-content"

    try {
      const canvas = await html2canvas(timetableElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: timetableElement.scrollWidth,
        windowHeight: timetableElement.scrollHeight,
      })

      if (format === "png") {
        const dataUrl = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = `timetable_${selectedSection || selectedCustomSection || "custom"}.png`
        link.click()
      } else {
        const pdf = new jsPDF("l", "mm", "a4")
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
        const finalWidth = imgWidth * ratio
        const finalHeight = imgHeight * ratio

        pdf.addImage(
          canvas,
          "PNG",
          (pageWidth - finalWidth) / 2,
          (pageHeight - finalHeight) / 2,
          finalWidth,
          finalHeight,
        )

        pdf.save(`timetable_${selectedSection || selectedCustomSection || "custom"}.pdf`)
      }
    } catch (error) {
      console.error("Error generating timetable:", error)
    } finally {
      timetableElement.style.overflow = originalStyle.overflow
      timetableElement.style.width = originalStyle.width
    }
  }

  return (
    <Tabs defaultValue="preset" className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
        <TabsTrigger
          value="preset"
          className="py-2 px-4 text-center font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Preset Timetable
        </TabsTrigger>
        <TabsTrigger
          value="custom"
          className="py-2 px-4 text-center font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Custom Timetable
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preset">
  <div className="bg-white p-6 rounded-lg shadow w-full relative">
    <Select value={selectedSection} onValueChange={setSelectedSection}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a section" />
      </SelectTrigger>
      <SelectContent className="bg-white max-h-[200px] overflow-y-auto" avoidCollisions={false}>
        {sections.map((section) => (
          <SelectItem key={section} value={section}>
            {section}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {selectedSection && (
      <>
        <div ref={containerRef} className="mt-4 overflow-x-auto">
          <div className="w-full sm:w-auto min-w-[320px]">
            <Timetable
              data={timetableData.filter((entry) => entry.Section === selectedSection)}
              section={selectedSection}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
          <Button
            onClick={() => downloadTimetable("png")}
            className="font-semibold border-2 bg-blue-500 text-white rounded-lg px-4 py-2 transition-transform hover:scale-105"
          >
            Download PNG
          </Button>
          <Button
            onClick={() => downloadTimetable("pdf")}
            className="text-black font-semibold border-2 border-black rounded-lg px-4 py-2 transition-transform hover:scale-105"
          >
            Download PDF
          </Button>
        </div>
      </>
    )}
  </div>
</TabsContent>


      <TabsContent value="custom">
        <div className="p-4 sm:p-6 rounded-lg shadow bg-white w-full relative">
          <Select value={selectedCustomSection} onValueChange={setSelectedCustomSection}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[200px] overflow-y-auto">
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Available Classes</h3>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {selectedCustomSection &&
                  Array.from(
                    new Set(
                      timetableData
                        .filter((entry) => entry.Section === selectedCustomSection)
                        .map((entry) => (entry.Course === "DSA-LAB" ? "DSA" : entry.Course)),
                    ),
                  ).map((course) => {
                    const isAdded = customTimetable.some(
                      (entry) => entry.Course === course || (course === "DSA" && entry.Course === "DSA-LAB"),
                    )
                    const courseEntries = timetableData.filter(
                      (entry) =>
                        entry.Section === selectedCustomSection &&
                        (entry.Course === course || (course === "DSA" && entry.Course === "DSA-LAB")),
                    )

                    return (
                      <div key={course} className="bg-gray-100 p-3 rounded">
                        <div className="flex items-center justify-between mb-2 flex-wrap">
                          <span className="font-semibold break-words min-w-0">{course}</span>
                          <Button
                            variant="outline"
                            onClick={() => (isAdded ? handleRemoveClass(course) : handleAddClass(course))}
                            className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white font-semibold"
                          >
                            {isAdded ? "Remove" : "Add"}
                          </Button>
                        </div>
                        <ul className="text-sm space-y-1">
                          {courseEntries.map((entry, index) => (
                            <li key={index} className="break-words">
                              {entry.Day} {entry["Start Time"]}-{entry["End Time"]} ({entry.Room})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Custom Timetable</h3>
              
              {customTimetable.length > 0 ? (
                <div ref={containerRef} className="overflow-x-auto">
                  <div className="w-full sm:w-auto min-w-[320px]">
                    <Timetable data={customTimetable} section="Custom Timetable" />
                  </div>
                </div>
              ) : (
                <p className="text-center sm:text-left">No classes added yet.</p>
              )}

              {customTimetable.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Button
                    onClick={() => downloadTimetable("png")}
                    className="text-sm sm:text-base font-semibold border-2 bg-blue-500 text-white rounded-lg px-3 py-1 sm:px-4 sm:py-2 hover:scale-105 transition"
                  >
                    Download PNG
                  </Button>
                  <Button
                    onClick={() => downloadTimetable("pdf")}
                    className="text-sm sm:text-base text-black font-semibold border-2 border-black rounded-lg px-3 py-1 sm:px-4 sm:py-2 hover:scale-105 transition"
                  >
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

