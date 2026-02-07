"use client"

import React, { useState, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Timetable from "./timetable"
import { timetableData, type TimetableEntry } from "@/lib/timetable-data"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function TimetableGenerator() {
  const [sections, setSections] = useState<string[]>([])
  const [teachers, setTeachers] = useState<string[]>([])
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [customTimetable, setCustomTimetable] = useState<TimetableEntry[]>([])
  const [error, setError] = useState("")
  const [selectedCustomSection, setSelectedCustomSection] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const teacherContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const uniqueSections = Array.from(new Set(timetableData.map((entry) => entry.Section))).sort()
    const uniqueTeachers = Array.from(new Set(timetableData.map((entry) => entry.Instructor))).sort()
    setSections(uniqueSections)
    setTeachers(uniqueTeachers)
  }, [])

  const handleAddClass = (course: string) => {
    const entriesToAdd = timetableData.filter(
      (entry) =>
        entry.Section === selectedCustomSection &&
        entry.Course === course,
    )

    let conflictingClass = null
    const conflict = entriesToAdd.some((newEntry) => {
      const existingConflict = customTimetable.find(
        (existingEntry) =>
          existingEntry.Day === newEntry.Day &&
          ((existingEntry["Start Time"] <= newEntry["Start Time"] &&
            newEntry["Start Time"] < existingEntry["End Time"]) ||
            (existingEntry["Start Time"] < newEntry["End Time"] && newEntry["End Time"] <= existingEntry["End Time"])),
      )
      if (existingConflict) {
        conflictingClass = existingConflict
        return true
      }
      return false
    })

    if (conflict && conflictingClass) {
      const conflictEntry = conflictingClass as TimetableEntry
      setError(
        `Time conflict detected. ${course} (${entriesToAdd[0].Day} ${entriesToAdd[0]["Start Time"]}) overlaps with ${conflictEntry.Course} (${conflictEntry.Day} ${conflictEntry["Start Time"]}-${conflictEntry["End Time"]}).`,
      )
      return
    }

    setCustomTimetable((prev) => [...prev, ...entriesToAdd])
    setError("")
  }

  const handleRemoveClass = (course: string) => {
    setCustomTimetable((prev) =>
      prev.filter((entry) => entry.Course !== course),
    )
  }

  const downloadTimetable = async (format: "png" | "pdf", targetRef: React.RefObject<HTMLDivElement | null> = containerRef, filenameSuffix: string = "") => {
    const timetableElement = targetRef.current
    if (!timetableElement) return

    // Create a clone to render full width off-screen
    const clone = timetableElement.cloneNode(true) as HTMLElement
    clone.style.position = "fixed"
    clone.style.top = "0" // Render in viewport but behind or removed? proper off-screen
    clone.style.left = "-10000px"
    clone.style.width = "fit-content" // Force it to fit content
    clone.style.height = "auto"
    clone.style.overflow = "visible"
    clone.style.maxWidth = "none"
    clone.classList.remove("overflow-x-auto") // Remove scroll container behavior defined in class

    // Ensure background color is applied (if it was transparent/inherited)
    clone.style.backgroundColor = "#030712" // bg-dark-bg
    clone.style.color = "white"

    document.body.appendChild(clone)

    try {
      // Small delay to allow styles to apply? usually not needed but safe.
      // await new Promise(r => setTimeout(r, 100)) 

      const canvas = await html2canvas(clone, {
        backgroundColor: "#030712",
        scale: 2, // Retain high quality
        logging: false,
        useCORS: true,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
      })

      const name = filenameSuffix || selectedSection || selectedCustomSection || "custom"

      if (format === "png") {
        const dataUrl = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = `timetable_${name}.png`
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

        pdf.save(`timetable_${name}.pdf`)
      }
    } catch (error) {
      console.error("Error generating timetable:", error)
    } finally {
      document.body.removeChild(clone)
    }
  }

  return (
    <Tabs defaultValue="preset" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 rounded-lg bg-dark-card p-1 border border-white/10 h-auto">
        <TabsTrigger
          value="preset"
          className="py-2 px-4 text-center font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-accent-cyan data-[state=active]:text-dark-bg text-gray-400"
        >
          Preset Timetable
        </TabsTrigger>
        <TabsTrigger
          value="custom"
          className="py-2 px-4 text-center font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-accent-cyan data-[state=active]:text-dark-bg text-gray-400"
        >
          Custom Timetable
        </TabsTrigger>
        <TabsTrigger
          value="teacher"
          className="py-2 px-4 text-center font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-accent-cyan data-[state=active]:text-dark-bg text-gray-400"
        >
          Teacher Schedule
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preset">
        <div className="glass-card p-6 rounded-lg w-full relative">
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-[200px] bg-dark-bg border-white/10 text-white">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent className="bg-dark-bg border-white/10 text-white max-h-[200px] overflow-y-auto">
              {sections.map((section) => (
                <SelectItem key={section} value={section} className="focus:bg-accent-cyan/20 focus:text-white cursor-pointer">
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSection && (
            <>
              <div ref={containerRef} className="mt-4 overflow-x-auto">
                <div className="w-full min-w-[320px]">
                  <Timetable
                    data={timetableData.filter((entry) => entry.Section === selectedSection)}
                    section={selectedSection}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                <Button
                  onClick={() => downloadTimetable("png")}
                  className="font-semibold border border-accent-cyan bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105"
                >
                  Download PNG
                </Button>
                <Button
                  onClick={() => downloadTimetable("pdf")}
                  className="font-semibold border border-accent-yellow bg-accent-yellow/20 text-accent-yellow hover:bg-accent-yellow hover:text-dark-bg rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105"
                >
                  Download PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="custom">
        <div className="p-4 sm:p-6 rounded-lg glass-card w-full relative">
          <Select value={selectedCustomSection} onValueChange={setSelectedCustomSection}>
            <SelectTrigger className="w-full sm:w-[250px] bg-dark-bg border-white/10 text-white">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent className="bg-dark-bg border-white/10 text-white max-h-[200px] overflow-y-auto">
              {sections.map((section) => (
                <SelectItem key={section} value={section} className="focus:bg-accent-cyan/20 focus:text-white cursor-pointer">
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && <p className="text-red-400 mt-2">{error}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Available Classes</h3>
              <div className="space-y-3 max-h-[600px] overflow-auto pr-2 custom-scrollbar">
                {selectedCustomSection &&
                  Array.from(
                    new Set(
                      timetableData
                        .filter((entry) => entry.Section === selectedCustomSection)
                        .map((entry) => entry.Course),
                    ),
                  ).map((course) => {
                    const isAdded = customTimetable.some(
                      (entry) => entry.Course === course,
                    )
                    const courseEntries = timetableData.filter(
                      (entry) =>
                        entry.Section === selectedCustomSection &&
                        entry.Course === course,
                    )

                    return (
                      <div key={course} className={`p-4 rounded-lg border transition-all duration-300 ${isAdded
                        ? "bg-accent-cyan/10 border-accent-cyan/50 shadow-[0_0_15px_rgba(0,217,255,0.1)]"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-bold text-lg ${isAdded ? "text-accent-cyan" : "text-white"}`}>
                            {course}
                          </span>
                          <Button
                            size="sm"
                            variant={isAdded ? "destructive" : "default"}
                            onClick={() => (isAdded ? handleRemoveClass(course) : handleAddClass(course))}
                            className={`h-8 px-3 font-semibold transition-all ${isAdded
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50"
                              : "bg-accent-cyan text-dark-bg hover:bg-accent-cyan/80 hover:scale-105"
                              }`}
                          >
                            {isAdded ? "Remove" : "Add"}
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {courseEntries.map((entry, index) => (
                            <div key={index} className="flex items-start text-xs sm:text-sm text-gray-300 bg-black/20 p-2 rounded">
                              <span className="font-semibold text-accent-yellow w-16 shrink-0">{entry.Day}</span>
                              <div className="flex flex-col">
                                <span>{entry["Start Time"]} - {entry["End Time"]}</span>
                                <span className="text-gray-400 text-xs">Room: {entry.Room} | {entry.Instructor}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Custom Timetable</h3>

              {customTimetable.length > 0 ? (
                <div ref={containerRef} className="overflow-x-auto">
                  <div className="w-full min-w-[320px]">
                    <Timetable data={customTimetable} section="Custom Timetable" />
                  </div>
                </div>
              ) : (
                <p className="text-center sm:text-left text-gray-400">No classes added yet.</p>
              )}

              {customTimetable.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Button
                    onClick={() => downloadTimetable("png")}
                    className="text-sm sm:text-base font-semibold border border-accent-cyan bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg rounded-lg px-3 py-1 sm:px-4 sm:py-2 transition-all duration-300 hover:scale-105"
                  >
                    Download PNG
                  </Button>
                  <Button
                    onClick={() => downloadTimetable("pdf")}
                    className="text-sm sm:text-base font-semibold border border-accent-yellow bg-accent-yellow/20 text-accent-yellow hover:bg-accent-yellow hover:text-dark-bg rounded-lg px-3 py-1 sm:px-4 sm:py-2 transition-all duration-300 hover:scale-105"
                  >
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="teacher">
        <div className="glass-card p-6 rounded-lg w-full relative">
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-[250px] bg-dark-bg border-white/10 text-white">
              <SelectValue placeholder="Select an Instructor" />
            </SelectTrigger>
            <SelectContent className="bg-dark-bg border-white/10 text-white max-h-[300px] overflow-y-auto">
              {teachers.map((teacher) => (
                <SelectItem key={teacher} value={teacher} className="focus:bg-accent-cyan/20 focus:text-white cursor-pointer">
                  {teacher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTeacher && (
            <>
              <div ref={teacherContainerRef} className="mt-8 bg-dark-bg/50 p-6 rounded-xl border border-white/10">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">
                  <span className="text-accent-cyan">{selectedTeacher}</span> Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {timetableData
                    .filter((entry) => entry.Instructor === selectedTeacher)
                    .map((entry, index) => (
                      <div key={index} className="bg-glass-gradient border border-white/10 p-5 rounded-xl hover:border-accent-cyan/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-accent-cyan transition-colors">
                            {entry.Course}
                          </h3>
                          <span className="px-3 py-1 bg-accent-yellow/20 text-accent-yellow text-xs font-bold rounded-full border border-accent-yellow/20">
                            {entry.Section}
                          </span>
                        </div>
                        <div className="space-y-2 text-gray-300 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                            <span className="font-semibold text-white">Day:</span> {entry.Day}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                            <span className="font-semibold text-white">Time:</span> {entry["Start Time"]} - {entry["End Time"]}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                            <span className="font-semibold text-white">Room:</span> {entry.Room}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {timetableData.filter((entry) => entry.Instructor === selectedTeacher).length === 0 && (
                  <p className="text-center text-gray-400">No classes found for this instructor.</p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
                <Button
                  onClick={() => downloadTimetable("png", teacherContainerRef, selectedTeacher)}
                  className="font-semibold border border-accent-cyan bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg rounded-lg px-6 py-2 transition-all duration-300 hover:scale-105"
                >
                  Download Schedule PNG
                </Button>
                <Button
                  onClick={() => downloadTimetable("pdf", teacherContainerRef, selectedTeacher)}
                  className="font-semibold border border-accent-yellow bg-accent-yellow/20 text-accent-yellow hover:bg-accent-yellow hover:text-dark-bg rounded-lg px-6 py-2 transition-all duration-300 hover:scale-105"
                >
                  Download Schedule PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
