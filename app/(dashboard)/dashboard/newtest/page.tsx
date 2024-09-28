"use client";

import { startTransition, useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/auth";
import { updateAccount } from "@/app/(login)/actions";
import Link from "next/link";

type ActionState = {
  error?: string;
  success?: string;
};

const subjects = [
  "Constitutional Law",
  "Criminal Law",
  "Family Law",
  "Civil Procedure",
  "Evidence",
  "Professional Responsibility",
  "Real Estate",
  "Business Law",
  "Wills and Estates",
  "Administrative Law",
];

export default function GeneralPage() {
  const { user } = useUser();
  const [isTutor, setIsTutor] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [questionMode, setQuestionMode] = useState("Unused");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    { error: "", success: "" }
  );

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      formAction(new FormData(event.currentTarget));
    });
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
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                  />
                  <Label htmlFor={subject}>{subject}</Label>
                </div>
              ))}
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

        <Link href="/dashboard/teste" passHref>
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
        </Link>
      </form>
    </section>
  );
}
