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
  "Business Law",
  "Criminal Law",
  "Civil Litigation",
  "Estate Planing",
  "Family Law",
  "Professional Responsibility - Barristers",
  "Professional Responsibility - Solicitors",
  "Public Law",
  "Real Estate",
];

export default function GeneralPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isTutor, setIsTutor] = useState(true);
  const [isTimed, setIsTimed] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(subjects); // All subjects selected by default
  const [questionMode, setQuestionMode] = useState("Unused");
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");
  const [secondsPerQuestion, setSecondsPerQuestion] = useState("75");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSelectAllSubjects = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // Prevent form submission
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]); // Deselect all if all are selected
    } else {
      setSelectedSubjects(subjects); // Select all
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

      // Map selected subjects to their indices
      const selectedSubjectIndices = selectedSubjects.map((subject) =>
        subjects.indexOf(subject)
      );

      // Construct query parameters
      const queryParams = new URLSearchParams({
        isTutor: String(isTutor),
        isTimed: String(isTimed),
        selectedSubjects: JSON.stringify(selectedSubjectIndices),
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
                    <Label htmlFor="secondsPerQuestion">
                      Seconds per Question
                    </Label>
                    <input
                      type="number"
                      id="secondsPerQuestion"
                      value={secondsPerQuestion}
                      onChange={(e) => setSecondsPerQuestion(e.target.value)}
                      className="border border-gray-300 rounded p-2 w-20"
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
                <div key={subject} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={subject}
                    className="h-4 w-4 rounded"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                  />
                  <Label htmlFor={subject}>{subject}</Label>
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
            <div className="flex items-center space-x-2">
              <Label htmlFor="numberOfQuestions">Number of Questions</Label>
              <input
                type="number"
                id="numberOfQuestions"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                className="border border-gray-300 rounded p-2"
              />
            </div>
          </CardContent>
        </Card>

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
      </form>
    </section>
  );
}
