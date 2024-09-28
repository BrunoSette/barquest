"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

// Mock data for the test with longer questions and answers
const testQuestions = [
  {
    id: 1,
    question: "In the context of Canadian constitutional law, the doctrine of parliamentary sovereignty plays a crucial role in shaping the legal landscape. This principle, inherited from the British legal system, asserts that the Parliament has the authority to make or unmake any law. However, the Canadian legal system has evolved to include certain limitations on this sovereignty. Consider the following scenario: The federal Parliament passes a law that appears to infringe on provincial jurisdiction as outlined in the Constitution Act, 1867. Which of the following statements most accurately describes the potential outcome of this situation under Canadian constitutional law?",
    choices: [
      "The law would be automatically void as Parliament cannot legislate in areas of provincial jurisdiction. The principle of parliamentary sovereignty is absolute and allows Parliament to override constitutional divisions of power.",
      "The law would be valid as long as it serves a national interest, regardless of provincial jurisdiction. The doctrine of parliamentary sovereignty allows Parliament to legislate in any area it deems necessary for the country's welfare.",
      "The law could be challenged in court, and if found to truly infringe on provincial jurisdiction, it may be struck down as ultra vires. This reflects the balance between parliamentary sovereignty and constitutional supremacy in Canada.",
      "The law would remain in force unless unanimously opposed by all provinces. The principle of cooperative federalism requires consensus between federal and provincial governments for any law affecting provincial jurisdictions."
    ],
    correctAnswer: "The law could be challenged in court, and if found to truly infringe on provincial jurisdiction, it may be struck down as ultra vires. This reflects the balance between parliamentary sovereignty and constitutional supremacy in Canada."
  },
  {
    id: 2,
    question: "The Canadian legal system's approach to Aboriginal rights and title has evolved significantly over the past few decades. The Supreme Court of Canada has played a pivotal role in shaping this area of law through several landmark decisions. One such case is the 1997 decision in Delgamuukw v. British Columbia, which provided important clarifications on the nature of Aboriginal title. Consider a hypothetical situation where a First Nation is claiming Aboriginal title over a specific territory that is currently being used for resource development by a provincial government. Based on the principles established in Delgamuukw and subsequent jurisprudence, which of the following statements most accurately reflects the current state of Canadian law regarding Aboriginal title?",
    choices: [
      "Aboriginal title is a right of exclusive use and occupation of the land, including the right to choose how the land can be used. However, this right is absolute and cannot be infringed upon under any circumstances, meaning the resource development must cease immediately.",
      "Aboriginal title is a sui generis right that falls short of fee simple ownership. While it includes the right to exclusive use and occupation of the land, it can be infringed upon by the Crown if the infringement is justified according to the test established in R. v. Sparrow.",
      "Aboriginal title is merely a right to be consulted about land use decisions. The provincial government can continue its resource development activities as long as it engages in meaningful consultation with the First Nation, regardless of the outcome of these consultations.",
      "Aboriginal title is equivalent to fee simple ownership and includes mineral rights. The First Nation has the unilateral right to evict the provincial government and take over the resource development project without compensation."
    ],
    correctAnswer: "Aboriginal title is a sui generis right that falls short of fee simple ownership. While it includes the right to exclusive use and occupation of the land, it can be infringed upon by the Crown if the infringement is justified according to the test established in R. v. Sparrow."
  },
  // Add more questions here...
]

const COLORS = ['#4CAF50', '#F44336']

export function MultipleChoiceTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
  const [isTestComplete, setIsTestComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleNextQuestion()
          return 180
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion])

  const handleAnswerSelection = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === testQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    if (currentQuestion === testQuestions.length - 1) {
      setIsTestComplete(true)
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setTimeLeft(180) // Reset timer for next question
    }
  }

  const handlePreviousQuestion = () => {
    setSelectedAnswer("")
    setCurrentQuestion(currentQuestion - 1)
    setTimeLeft(180) // Reset timer for previous question
  }

  const isLastQuestion = currentQuestion === testQuestions.length - 1

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const resultData = [
    { name: 'Correct', value: score },
    { name: 'Incorrect', value: testQuestions.length - score },
  ]

  if (isTestComplete) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Canadian Bar Exam Practice Test Results</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Score: {score} / {testQuestions.length}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resultData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Canadian Bar Exam Practice Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Question {currentQuestion + 1} of {testQuestions.length}</span>
            <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(timeLeft / 180) * 100} className="mb-4" />
          <p className="text-lg mb-6">{testQuestions[currentQuestion].question}</p>
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelection}>
            {testQuestions[currentQuestion].choices.map((choice, index) => (
              <div key={index} className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value={choice} id={`choice-${index}`} className="mt-1" />
                <Label htmlFor={`choice-${index}`} className="flex-1">{choice}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={handlePreviousQuestion} 
            disabled={currentQuestion === 0}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswer}
          >
            {isLastQuestion ? "Finish" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}