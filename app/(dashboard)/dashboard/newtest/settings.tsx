"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { TeamDataWithMembers, User } from "@/lib/db/schema";

import React from "react";

const subjects = [
  { id: 1, name: "Business Law", test: "Solicitor" },
  { id: 2, name: "Criminal Law", test: "Solicitor" },
  { id: 3, name: "Civil Litigation", test: "Barrister" },
  { id: 4, name: "Estate Planning", test: "Solicitor" },
  { id: 5, name: "Family Law", test: "Barrister" },
  {
    id: 6,
    name: "Professional Responsibility",
    test: ["Barrister", "Solicitor"],
  },
  { id: 7, name: "Public Law", test: "Barrister" },
  { id: 8, name: "Real Estate", test: "Solicitor" },
];

const barristerSubjects = subjects.filter(
  (subject) =>
    subject.test === "Barrister" || subject.test.includes("Barrister")
);
const solicitorSubjects = subjects.filter(
  (subject) =>
    subject.test === "Solicitor" || subject.test.includes("Solicitor")
);

export function Settings({ teamData }: { teamData: TeamDataWithMembers }) {
  const router = useRouter();
  const [isTutor, setIsTutor] = useState(true);
  const [isTimed, setIsTimed] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(
    subjects.map((subject) => subject.id)
  ); // All subjects selected by default
  const [questionMode, setQuestionMode] = useState("Unused");
  const [numberOfQuestions, setNumberOfQuestions] = useState("1");
  const [secondsPerQuestion, setSecondsPerQuestion] = useState("75");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const subscriptionStatus = teamData.subscriptionStatus || "free";
  const planName = teamData.planName || "none";

  console.log("teamData", teamData);
  console.log("subscriptionStatus", subscriptionStatus);

  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSelectAllSubjects = (subjects: { id: number }[]) => {
    const allSelected = subjects.every((subject) =>
      selectedSubjects.includes(subject.id)
    );
    if (allSelected) {
      setSelectedSubjects((prev) =>
        prev.filter((id) => !subjects.some((subject) => subject.id === id))
      ); // Deselect all if all are selected
    } else {
      setSelectedSubjects((prev) => [
        ...prev,
        ...subjects
          .filter((subject) => !prev.includes(subject.id))
          .map((subject) => subject.id),
      ]); // Select all
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError("");
    setSuccess("");

    try {
      // Simulate form action
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Test created successfully");

      // Construct query parameters
      const queryParams = new URLSearchParams({
        isTutor: String(isTutor),
        isTimed: String(isTimed),
        selectedSubjects: JSON.stringify(selectedSubjects),
        questionMode,
        numberOfQuestions,
        secondsPerQuestion,
      });

      // Navigate to the /create page with the state as query parameters
      router.push(`/dashboard/teste?${queryParams.toString()}`);
    } catch (error) {
      setError("Failed to create test");
    } finally {
      localStorage.removeItem("timeLeft");
      setIsPending(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Create a New Test
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Test Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="tutor">Tutor</Label>
                <Switch
                  id="tutor"
                  checked={isTutor}
                  onCheckedChange={(checked) => setIsTutor(checked)}
                  className="w-12 h-6"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="timed">Timed</Label>
                <Switch
                  id="timed"
                  checked={isTimed}
                  onCheckedChange={(checked) => setIsTimed(checked)}
                  className="w-12 h-6"
                />
                {isTimed && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="secondsPerQuestion">Seconds</Label>
                    <input
                      type="number"
                      id="secondsPerQuestion"
                      max={600}
                      min={30}
                      value={secondsPerQuestion}
                      onChange={(e) => setSecondsPerQuestion(e.target.value)}
                      className="border border-gray-300 rounded p-2 w-13"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="font-medium text-gray-900 mb-4">Barrister</h2>
                {barristerSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center space-x-2 p-2"
                  >
                    <input
                      type="checkbox"
                      id={subject.name}
                      className="h-4 w-4 rounded"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => handleSubjectChange(subject.id)}
                      disabled={
                        !(
                          (planName === "Barrister" &&
                            (subscriptionStatus === "active" ||
                              subscriptionStatus === "trialing")) ||
                          (planName === "Solicitor + Barrister" &&
                            (subscriptionStatus === "active" ||
                              subscriptionStatus === "trialing"))
                        )
                      }
                    />
                    <Label htmlFor={subject.name}>{subject.name}</Label>
                  </div>
                ))}

                {((planName === "Barrister" &&
                  (subscriptionStatus === "active" ||
                    subscriptionStatus === "trialing")) ||
                  (planName === "Solicitor + Barrister" &&
                    (subscriptionStatus === "active" ||
                      subscriptionStatus === "trialing"))) && (
                  <Button
                    type="button"
                    className="bg-orange-500 mt-4 hover:bg-orange-600 text-white"
                    onClick={() => handleSelectAllSubjects(barristerSubjects)}
                  >
                    {barristerSubjects.every((subject) =>
                      selectedSubjects.includes(subject.id)
                    )
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                )}
              </div>
              <div>
                <h2 className="font-medium text-gray-900 mb-4">Solicitor</h2>
                {solicitorSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center space-x-2 p-2"
                  >
                    <input
                      type="checkbox"
                      id={subject.name}
                      className="h-4 w-4 rounded"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => handleSubjectChange(subject.id)}
                      disabled={
                        !(
                          (planName === "Solicitor" &&
                            (subscriptionStatus === "active" ||
                              subscriptionStatus === "trialing")) ||
                          (planName === "Solicitor + Barrister" &&
                            (subscriptionStatus === "active" ||
                              subscriptionStatus === "trialing"))
                        )
                      }
                    />
                    <Label htmlFor={subject.name}>{subject.name}</Label>
                  </div>
                ))}
                {((planName === "Solicitor" &&
                  (subscriptionStatus === "active" ||
                    subscriptionStatus === "trialing")) ||
                  (planName === "Solicitor + Barrister" &&
                    (subscriptionStatus === "active" ||
                      subscriptionStatus === "trialing"))) && (
                  <Button
                    type="button"
                    className="bg-orange-500 mt-4 hover:bg-orange-600 text-white"
                    onClick={() => handleSelectAllSubjects(solicitorSubjects)}
                  >
                    {solicitorSubjects.every((subject) =>
                      selectedSubjects.includes(subject.id)
                    )
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="unused"
                  name="questionMode"
                  value="Unused"
                  checked={questionMode === "Unused"}
                  onChange={(e) => setQuestionMode(e.target.value)}
                />
                <Label htmlFor="unused">Only Unused Questions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="all"
                  name="questionMode"
                  value="All"
                  checked={questionMode === "All"}
                  onChange={(e) => setQuestionMode(e.target.value)}
                />
                <Label htmlFor="all">All Questions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="wrong"
                  name="questionMode"
                  value="Wrong"
                  checked={questionMode === "Wrong"}
                  onChange={(e) => setQuestionMode(e.target.value)}
                />
                <Label htmlFor="wrong">Only My Mistakes</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Number of Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-5">
              <Label htmlFor="numberOfQuestions"></Label>
              <input
                type="number"
                id="numberOfQuestions"
                max={120}
                min={1}
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                className="border border-gray-300 rounded p-2"
              />
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={
                  isPending ||
                  !(
                    subscriptionStatus === "active" ||
                    subscriptionStatus === "trialing"
                  )
                }
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Test"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </section>
  );
}
