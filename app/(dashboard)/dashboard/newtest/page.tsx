"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/auth";

const subjects = [
  { id: 1, name: "Business Law" },
  { id: 2, name: "Criminal Law" },
  { id: 3, name: "Civil Litigation" },
  { id: 4, name: "Estate Planning" },
  { id: 5, name: "Family Law" },
  { id: 6, name: "Professional Responsibility" },
  { id: 7, name: "Public Law" },
  { id: 8, name: "Real Estate" },
];

export default function GeneralPage() {
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

  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSelectAllSubjects = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // Prevent form submission
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]); // Deselect all if all are selected
    } else {
      setSelectedSubjects(subjects.map((subject) => subject.id)); // Select all
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
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={subject.name}
                    className="h-4 w-4 rounded"
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => handleSubjectChange(subject.id)}
                  />
                  <Label htmlFor={subject.name}>{subject.name}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-between mb-4">
              <Button
                className="bg-orange-500 mt-4 hover:bg-orange-600 text-white"
                onClick={handleSelectAllSubjects}
              >
                {selectedSubjects.length === subjects.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
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
                disabled={isPending}
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
