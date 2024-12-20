"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { UserProduct } from "@/lib/db/schema";
import { mergeProductNames, Products, subjects } from "@/lib/utils";
import { PricingDialog } from "@/components/ManageSubscriptionDialog";
import Head from "next/head";

const metadata = {
  title: "Create New Test - BarQuest",
  description: "Your Ultimate Prep Tool for the Ontario Bar Exam",
};

export function Settings({
  userProducts,
  // teamData,
}: {
  userProducts: UserProduct[];
  // teamData: TeamDataWithMembers | null;
}) {
  const router = useRouter();
  const [isTutor, setIsTutor] = useState(true);
  const [isTimed, setIsTimed] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(() =>
    subjects.map((subject) => subject.id)
  );
  const [questionMode, setQuestionMode] = useState("all");
  const [numberOfQuestions, setNumberOfQuestions] = useState("20");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [showPricingDialog, setShowPricingDialog] = useState(false);

  const subscriptionStatus = userProducts.some((p) => p.active) ? "active" : "free";
  const planName = mergeProductNames(userProducts);

  const isActiveOrTrialing = subscriptionStatus === "active";

  useEffect(() => {
    if (!isActiveOrTrialing) {
      setShowPricingDialog(true);
    }
  }, [isActiveOrTrialing]);

  const barristerSubjects = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          subject.test === "Barrister" || subject.test.includes("Barrister")
      ),
    []
  );

  const solicitorSubjects = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          subject.test === "Solicitor" || subject.test.includes("Solicitor")
      ),
    []
  );

  const [selectedBarristerSubjects, setSelectedBarristerSubjects] = useState<
    number[]
  >([]);
  const [selectedSolicitorSubjects, setSelectedSolicitorSubjects] = useState<
    number[]
  >([]);

  const handleSubjectChange = useCallback(
    (subjectId: number, isBarrister: boolean) => {
      const setSubjects = isBarrister
        ? setSelectedBarristerSubjects
        : setSelectedSolicitorSubjects;
      setSubjects((prev) =>
        prev.includes(subjectId)
          ? prev.filter((id) => id !== subjectId)
          : [...prev, subjectId]
      );
    },
    []
  );

  const handleSelectAllSubjects = useCallback(
    (subjects: { id: number }[], isBarrister: boolean) => {
      const setSubjects = isBarrister
        ? setSelectedBarristerSubjects
        : setSelectedSolicitorSubjects;
      setSubjects((prev) => {
        const allSelected = subjects.every((subject) =>
          prev.includes(subject.id)
        );
        return allSelected ? [] : subjects.map((subject) => subject.id);
      });
    },
    []
  );

  const renderSubjects = useCallback(
    (
      subjectList: typeof subjects,
      productIndex: number,
      isBarrister: boolean
    ) => (
      <div>
        {subjectList.map((subject) => (
          <div key={subject.id} className="flex items-center space-x-2 p-2">
            <input
              type="checkbox"
              id={`${subject.name}-${isBarrister ? "barrister" : "solicitor"}`}
              className="h-4 w-4 rounded"
              checked={
                isBarrister
                  ? selectedBarristerSubjects.includes(subject.id)
                  : selectedSolicitorSubjects.includes(subject.id)
              }
              onChange={() => handleSubjectChange(subject.id, isBarrister)}
              disabled={
                !(
                  (userProducts.some((p) => p.stripeProductName === Products[productIndex].name) && isActiveOrTrialing) ||
                  (userProducts.some((p) => p.stripeProductName === Products[2].name) && isActiveOrTrialing)
                )
              }
            />
            <Label
              htmlFor={`${subject.name}-${
                isBarrister ? "barrister" : "solicitor"
              }`}
            >
              {subject.name}
            </Label>
          </div>
        ))}
        {((userProducts.some((p) => p.stripeProductName === Products[productIndex].name) && isActiveOrTrialing) ||
          (userProducts.some((p) => p.stripeProductName === Products[2].name) && isActiveOrTrialing)) && (
          <Button
            type="button"
            className="bg-orange-500 mt-4 hover:bg-orange-600 text-white"
            onClick={() => handleSelectAllSubjects(subjectList, isBarrister)}
          >
            {subjectList.every((subject) =>
              isBarrister
                ? selectedBarristerSubjects.includes(subject.id)
                : selectedSolicitorSubjects.includes(subject.id)
            )
              ? "Deselect All"
              : "Select All"}
          </Button>
        )}
      </div>
    ),
    [
      selectedBarristerSubjects,
      selectedSolicitorSubjects,
      handleSubjectChange,
      handleSelectAllSubjects,
      userProducts,
      isActiveOrTrialing,
    ]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsPending(true);
      setError("");
      localStorage.clear();

      try {
        const allSelectedSubjects = [
          ...new Set([
            ...selectedBarristerSubjects,
            ...selectedSolicitorSubjects,
          ]),
        ];
        const queryParams = new URLSearchParams({
          isTutor: String(isTutor),
          isTimed: String(isTimed),
          selectedSubjects: JSON.stringify(allSelectedSubjects),
          questionMode,
          numberOfQuestions,
        });

        router.push(`/dashboard/teste?${queryParams.toString()}`);
      } catch (error) {
        setError("Failed to create test");
      } finally {
        localStorage.removeItem("timeLeft");
        setIsPending(false);
      }
    },
    [
      isTutor,
      isTimed,
      selectedBarristerSubjects,
      selectedSolicitorSubjects,
      questionMode,
      numberOfQuestions,
      router,
    ]
  );

  if (showPricingDialog) {
    return (
      <PricingDialog
        isOpen={showPricingDialog}
        onClose={() => setShowPricingDialog(false)}
        subscriptionStatus={subscriptionStatus}
        planName={planName}
      />
    );
  }

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <section className="flex-1 p-4 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
            Create a New Test
          </h1>
          {/* <Button
            onClick={() => setShowPricingDialog(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isActiveOrTrialing ? "Manage Subscription" : "Upgrade Plan"}
          </Button> */}
        </div>

        <PricingDialog
          isOpen={showPricingDialog}
          onClose={() => setShowPricingDialog(false)}
          subscriptionStatus={subscriptionStatus}
          planName={planName}
        />

        {!showPricingDialog && (
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
                      onCheckedChange={setIsTutor}
                      className="w-12 h-6"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="timed">Timed</Label>
                    <Switch
                      id="timed"
                      checked={isTimed}
                      onCheckedChange={setIsTimed}
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
                  <div>
                    <h2 className="font-medium text-gray-900 mb-4">
                      Barrister
                    </h2>
                    {renderSubjects(barristerSubjects, 0, true)}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900 mb-4">
                      Solicitor
                    </h2>
                    {renderSubjects(solicitorSubjects, 1, false)}
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
                  {["unused", "all", "incorrect"].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={mode}
                        name="questionMode"
                        value={mode}
                        checked={questionMode === mode}
                        onChange={(e) => setQuestionMode(e.target.value)}
                      />
                      <Label htmlFor={mode}>
                        {mode === "unused"
                          ? "Only Unused Questions"
                          : mode === "all"
                          ? "All Questions"
                          : "Only My Mistakes"}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Max Number of Questions</CardTitle>
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
                    type={isActiveOrTrialing ? "submit" : "button"}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isPending}
                    onClick={() => {
                      if (!isActiveOrTrialing) {
                        setShowPricingDialog(true);
                      }
                    }}
                  >
                    {isPending ? (
                      <div>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      "Create Test"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}
      </section>
    </div>
  );
}
