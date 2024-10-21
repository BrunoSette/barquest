"use client";

import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { addDays, differenceInDays, format, isBefore } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastProvider } from "@/components/ui/toast";
import { barristerTopics, solicitorTopics, daysOfWeek } from "./topics";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  topic: string;
  pages: number;
}

export default function CalendarPage() {
  const [studyDays, setStudyDays] = useState<string[]>([]);
  const [hoursPerDay, setHoursPerDay] = useState(
    Object.fromEntries(daysOfWeek.map((day) => [day.id, 2]))
  );
  const [barristerExamDate, setBarristerExamDate] = useState("2024-11-05");
  const [solicitorExamDate, setSolicitorExamDate] = useState("2024-11-19");
  const [events, setEvents] = useState<any[]>([]);
  const [isCalendarGenerated, setIsCalendarGenerated] = useState(false);
  const [totalStudyHours, setTotalStudyHours] = useState(0);
  const calendarRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    calculateTotalStudyHours();
  }, [studyDays, hoursPerDay, barristerExamDate, solicitorExamDate]);

  const calculateTotalStudyHours = () => {
    const today = new Date();
    const barristerExam = barristerExamDate
      ? new Date(barristerExamDate)
      : null;
    const solicitorExam = solicitorExamDate
      ? new Date(solicitorExamDate)
      : null;

    let endDate =
      barristerExam && solicitorExam
        ? isBefore(barristerExam, solicitorExam)
          ? solicitorExam
          : barristerExam
        : barristerExam || solicitorExam;

    if (!endDate) return;

    const daysUntilEnd = differenceInDays(endDate, today);

    let total = 0;
    for (let i = 0; i < daysUntilEnd; i++) {
      const dayOfWeek = format(addDays(today, i), "EEEE").toLowerCase();
      if (studyDays.includes(dayOfWeek)) {
        total += hoursPerDay[dayOfWeek];
      }
    }

    setTotalStudyHours(total);
  };

  const generateSchedule = () => {
    if (!barristerExamDate && !solicitorExamDate) {
      toast({
        title: "Error",
        description: "Please set at least one exam date.",
      });
      return;
    }

    const today = new Date();
    const barristerExam = barristerExamDate
      ? new Date(barristerExamDate)
      : null;
    const solicitorExam = solicitorExamDate
      ? new Date(solicitorExamDate)
      : null;

    let endDate =
      barristerExam && solicitorExam
        ? isBefore(barristerExam, solicitorExam)
          ? solicitorExam
          : barristerExam
        : barristerExam || solicitorExam;

    if (!endDate) return;

    const daysUntilEnd = differenceInDays(endDate, today);

    let totalStudyHours = 0;
    for (let i = 0; i < daysUntilEnd; i++) {
      const dayOfWeek = format(addDays(today, i), "EEEE").toLowerCase();
      if (studyDays.includes(dayOfWeek)) {
        totalStudyHours += hoursPerDay[dayOfWeek];
      }
    }

    const flattenTopics = (topicsObj: any): Topic[] => {
      return Object.values(topicsObj).flat() as Topic[];
    };

    const topics: Topic[] = [
      ...(barristerExam ? flattenTopics(barristerTopics) : []),
      ...(solicitorExam ? flattenTopics(solicitorTopics) : []),
    ];

    const totalPages: number = topics.reduce(
      (sum: number, topic: Topic) => sum + topic.pages,
      0
    );
    const hoursPerPage = totalStudyHours / totalPages;

    let currentDate = today;
    const newEvents: any[] = [];

    while (currentDate < endDate) {
      const dayOfWeek = format(currentDate, "EEEE").toLowerCase();
      if (studyDays.includes(dayOfWeek)) {
        const dailyHours = hoursPerDay[dayOfWeek];
        let remainingHours = dailyHours;
        const dayEvents: any[] = [];

        while (remainingHours > 0 && topics.length > 0) {
          const topic = topics[0];
          const topicHours = Math.min(
            remainingHours,
            Math.ceil(topic.pages * hoursPerPage)
          );

          const examType = Object.values(barristerTopics)
            .flat()
            .some((t: Topic) => t.topic === topic.topic)
            ? "Barrister"
            : "Solicitor";

          dayEvents.push({
            title: `${topic.topic} (${topicHours}h)`,
            start: currentDate,
            allDay: true,
            color: examType === "Barrister" ? "#3788d8" : "#38b000",
          });

          remainingHours -= topicHours;
          topic.pages -= Math.floor(topicHours / hoursPerPage);

          if (topic.pages <= 0) {
            topics.shift();
          } else {
            // Move the partially completed topic to the end of the array
            topics.push(topics.shift()!);
          }
        }

        newEvents.push(...dayEvents);
      }
      currentDate = addDays(currentDate, 1);
    }

    setEvents(newEvents);
    setIsCalendarGenerated(true);
    toast({
      title: "Schedule Generated",
      description: "Your study schedule has been created successfully.",
    });
  };

  const handleDayToggle = (day: string) => {
    setStudyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleHoursChange = (day: string, hours: number) => {
    setHoursPerDay((prev) => ({ ...prev, [day]: hours }));
  };

  const handlePrint = () => {
    if (calendarRef.current) {
      const calendarApi = (calendarRef.current as any).getApi();
      calendarApi.render();

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Study Calendar</title>
              <style>
                @page { size: landscape; }
                body { margin: 0; }
                #calendar { width: 100%; height: 100vh; }
                .calendar-footer { position: absolute; bottom: 10px; right: 10px; font-size: 12px; color: #888; }
              </style>
            </head>
            <body>
              <div id="calendar"></div>
              <div class="calendar-footer">Calendar made in barquest.ca</div>
              <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.2/main.min.js"></script>
              <link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.2/main.min.css" rel="stylesheet">
              <script>
                document.addEventListener('DOMContentLoaded', function() {
                  var calendarEl = document.getElementById('calendar');
                  var calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    events: ${JSON.stringify(events)},
                    headerToolbar: false
                  });
                  calendar.render();
                  setTimeout(() => { window.print(); window.close(); }, 1000);
                });
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const resetCalendar = () => {
    setEvents([]);
    setIsCalendarGenerated(false);
    toast({
      title: "Calendar Reset",
      description: "Your study schedule has been reset.",
    });
  };

  return (
    <ToastProvider>
      <div className="container mx-auto p-4">
        <Head>
          <title>Study Calendar - BarQuest</title>
          <meta
            name="description"
            content="Create and manage your exam dates for Barrister and Solicitor tests"
          />
        </Head>
        <h1 className="text-2xl font-bold mb-6">Create your Study Calendar</h1>
        <Card className="mb-6">
          <CardContent className="p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                generateSchedule();
              }}
              className="space-y-4"
            >
              <div>
                <Tabs defaultValue="barrister">
                  <TabsList>
                    <TabsTrigger value="barrister">Barrister Exam</TabsTrigger>
                    <TabsTrigger value="solicitor">Solicitor Exam</TabsTrigger>
                  </TabsList>
                  <TabsContent value="barrister">
                    <div>
                      <Label htmlFor="barristerExamDate">
                        Barrister Exam Date
                      </Label>
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
                      <Label htmlFor="solicitorExamDate">
                        Solicitor Exam Date
                      </Label>
                      <Input
                        id="solicitorExamDate"
                        type="date"
                        value={solicitorExamDate}
                        onChange={(e) => setSolicitorExamDate(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                <Label>Study Days and how many hours to study each day</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={studyDays.includes(day.id)}
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                      <Label htmlFor={day.id}>{day.label}</Label>
                      {studyDays.includes(day.id) && (
                        <Input
                          id={`hours-${day.id}`}
                          type="number"
                          value={hoursPerDay[day.id]}
                          onChange={(e) =>
                            handleHoursChange(day.id, Number(e.target.value))
                          }
                          min="0"
                          max="24"
                          className="w-16 ml-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-lg font-semibold">
                Total study hours before exam: {totalStudyHours}
              </div>

              <Button
                className="bg-orange-400 hover:bg-orange-600 text-white"
                type="submit"
              >
                Generate Schedule
              </Button>
            </form>
          </CardContent>
        </Card>

        {isCalendarGenerated && (
          <>
            <div className="calendar-container mb-6">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                events={events}
                height="auto"
                eventContent={(arg) => (
                  <div style={{ fontSize: "0.9em" }}>{arg.event.title}</div>
                )}
              />
            </div>
            <div className="mb-4 flex justify-between items-center">
              <Button
                className="bg-orange-400 hover:bg-orange-600 text-white"
                onClick={handlePrint}
              >
                Print Calendar
              </Button>
              <Button
                className="bg-red-400 hover:bg-red-600 text-white"
                onClick={resetCalendar}
              >
                Reset Calendar
              </Button>
            </div>
          </>
        )}
      </div>
    </ToastProvider>
  );
}
