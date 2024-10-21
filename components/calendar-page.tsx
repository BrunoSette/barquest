'use client'

import { useState, useRef } from 'react'
import { getUser } from "@/lib/db/queries"
import { redirect } from "next/navigation"
import Head from "next/head"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { addDays, differenceInDays, format, isBefore } from 'date-fns'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const barristerTopics = [
  "Civil Litigation",
  "Criminal Litigation",
  "Professional Ethics",
  "Evidence",
  "Advocacy",
]

const solicitorTopics = [
  "Business Law and Practice",
  "Property Law and Practice",
  "Litigation",
  "Professional Conduct and Regulation",
  "Wills and Administration of Estates",
]

const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
]

export function CalendarPageComponent({ user }: { user: any }) {
  const [studyDays, setStudyDays] = useState(daysOfWeek.map(day => day.id))
  const [hoursPerDay, setHoursPerDay] = useState(
    Object.fromEntries(daysOfWeek.map(day => [day.id, 4]))
  )
  const [barristerExamDate, setBarristerExamDate] = useState('')
  const [solicitorExamDate, setSolicitorExamDate] = useState('')
  const [events, setEvents] = useState([])
  const [calendarView, setCalendarView] = useState('dayGridMonth')
  const calendarRef = useRef(null)

  if (!user) {
    console.log("No user found, redirecting to login")
    redirect("/sign-in")
  }

  const generateSchedule = () => {
    if (!barristerExamDate && !solicitorExamDate) return

    const today = new Date()
    const barristerExam = barristerExamDate ? new Date(barristerExamDate) : null
    const solicitorExam = solicitorExamDate ? new Date(solicitorExamDate) : null

    let endDate = barristerExam && solicitorExam
      ? (isBefore(barristerExam, solicitorExam) ? solicitorExam : barristerExam)
      : (barristerExam || solicitorExam)

    if (!endDate) return

    const daysUntilEnd = differenceInDays(endDate, today)
    
    let totalStudyHours = 0
    for (let i = 0; i < daysUntilEnd; i++) {
      const dayOfWeek = format(addDays(today, i), 'EEEE').toLowerCase()
      if (studyDays.includes(dayOfWeek)) {
        totalStudyHours += hoursPerDay[dayOfWeek]
      }
    }

    const topics = [...(barristerExam ? barristerTopics : []), ...(solicitorExam ? solicitorTopics : [])]
    const hoursPerTopic = Math.floor(totalStudyHours / topics.length)

    let currentDate = today
    const newEvents = []

    topics.forEach((topic) => {
      let topicHours = hoursPerTopic
      while (topicHours > 0 && currentDate < endDate) {
        const dayOfWeek = format(currentDate, 'EEEE').toLowerCase()
        if (studyDays.includes(dayOfWeek)) {
          const studyHours = Math.min(topicHours, hoursPerDay[dayOfWeek])
          const examType = barristerTopics.includes(topic) ? 'Barrister' : 'Solicitor'
          newEvents.push({
            title: `${examType}: ${topic}`,
            start: currentDate,
            end: new Date(currentDate.getTime() + studyHours * 60 * 60 * 1000),
            color: examType === 'Barrister' ? '#3788d8' : '#38b000',
          })
          topicHours -= studyHours
        }
        currentDate = addDays(currentDate, 1)
      }
    })

    setEvents(newEvents)
  }

  const handleDayToggle = (day: string) => {
    setStudyDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleHoursChange = (day: string, hours: number) => {
    setHoursPerDay(prev => ({ ...prev, [day]: hours }))
  }

  const handlePrint = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.render()
      window.print()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Study Calendar - BarQuest</title>
        <meta name="description" content="Create and manage your exam dates for Barrister and Solicitor tests" />
      </Head>
      <h1 className="text-2xl font-bold mb-6">Study Calendar</h1>
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={(e) => { e.preventDefault(); generateSchedule(); }} className="space-y-4">
            <div>
              <Label>Study Days</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={studyDays.includes(day.id)}
                      onCheckedChange={() => handleDayToggle(day.id)}
                    />
                    <Label htmlFor={day.id}>{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Study Hours per Day</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Label htmlFor={`hours-${day.id}`} className="w-20">{day.label}</Label>
                    <Input
                      id={`hours-${day.id}`}
                      type="number"
                      value={hoursPerDay[day.id]}
                      onChange={(e) => handleHoursChange(day.id, Number(e.target.value))}
                      min="0"
                      max="24"
                      className="w-20"
                    />
                  </div>
                ))}
              </div>
            </div>
            <Tabs defaultValue="barrister">
              <TabsList>
                <TabsTrigger value="barrister">Barrister Exam</TabsTrigger>
                <TabsTrigger value="solicitor">Solicitor Exam</TabsTrigger>
              </TabsList>
              <TabsContent value="barrister">
                <div>
                  <Label htmlFor="barristerExamDate">Barrister Exam Date</Label>
                  <Input
                    id="barristerExamDate"
                    type="date"
                    value={barristerExamDate}
                    onChange={(e) => setBarristerExamDate(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="solicitor">
                <div>
                  <Label htmlFor="solicitorExamDate">Solicitor Exam Date</Label>
                  <Input
                    id="solicitorExamDate"
                    type="date"
                    value={solicitorExamDate}
                    onChange={(e) => setSolicitorExamDate(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <Button type="submit">Generate Schedule</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mb-4 flex justify-between items-center">
        <Select value={calendarView} onValueChange={setCalendarView}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dayGridMonth">Month</SelectItem>
            <SelectItem value="timeGridWeek">Week</SelectItem>
            <SelectItem value="timeGridDay">Day</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handlePrint}>Print Calendar</Button>
      </div>
      <div className="calendar-container mb-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          height="auto"
        />
      </div>
    </div>
  )
}