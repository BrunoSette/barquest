import { useState, useEffect } from 'react';
import { TestHistory } from "@/app/types";

interface DashboardData {
  totalAnswers: number | null;
  correctAnswers: number | null;
  answersPerSubject: { subject: string; total_answers: number; correct_answers: number }[];
  testHistory: TestHistory[];
}

export function useDashboardData(userId: number) {
  const [data, setData] = useState<DashboardData>({
    totalAnswers: null,
    correctAnswers: null,
    answersPerSubject: [],
    testHistory: [],
  });
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const response = await fetch(`/api/total_answers?user_id=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedData = await response.json();

      setData({
        totalAnswers: fetchedData.total_answers,
        correctAnswers: fetchedData.correct_answers,
        answersPerSubject: fetchedData.answers_per_subject,
        testHistory: fetchedData.test_history,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const deleteTestHistory = async (testHistoryId: number) => {
    try {
      const response = await fetch("/api/save-test-results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testHistoryId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Refresh the data after deletion
      await fetchDashboardData();
    } catch (error) {
      console.error("Error deleting test history:", error);
    }
  };

  return { ...data, loading, deleteTestHistory };
}