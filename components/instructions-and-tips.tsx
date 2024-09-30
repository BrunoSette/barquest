"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for video content
const videoContent = [
  {
    category: "Getting Started",
    videos: [
      {
        id: "1",
        title: "Welcome to BarQuest: An Introduction",
        youtubeId: "9n8-PyyeugQ",
      },
      { id: "2", title: "Creating your First Test", youtubeId: "9n8-PyyeugQ" },
      {
        id: "3",
        title: "Monitoring Your Progress: Using Analytics and Feedback Tools",
        youtubeId: "9n8-PyyeugQ",
      },
    ],
  },
  {
    category: "Help & Study Tips",
    videos: [
      {
        id: "4",
        title: "Understanding the Ontario Bar Exam Format",
        youtubeId: "9n8-PyyeugQ",
      },
      {
        id: "5",
        title: "Time Management Strategies",
        youtubeId: "iONDebHX9qk",
      },
      { id: "6", title: "Avoiding Common Pitfalls", youtubeId: "dQw4w9WgXcQ" },

      {
        id: "7",
        title: "Stress Management During Bar Exam Prep",
        youtubeId: "J4BrO_i2DsU",
      },
      {
        id: "8",
        title: "How to Organize your Study Materials",
        youtubeId: "J4BrO_i2DsU",
      },
    ],
  },
  {
    category: "Troubleshooting",
    videos: [
      {
        id: "9",
        title: "Common Issues and Solutions",
        youtubeId: "9n8-PyyeugQ",
      },
      { id: "10", title: "Contacting Support", youtubeId: "9n8-PyyeugQ" },
      { id: "11", title: "Updating the Software", youtubeId: "9n8-PyyeugQ" },
    ],
  },
];

export function InstructionsAndTipsComponent() {
  const [selectedCategory, setSelectedCategory] = useState(videoContent[0]);
  const [selectedVideo, setSelectedVideo] = useState(videoContent[0].videos[0]);

  const handleTabChange = (category: string) => {
    const newCategory = videoContent.find((cat) => cat.category === category);
    setSelectedCategory(newCategory!);
    setSelectedVideo(newCategory!.videos[0]);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        User Guide and Study Strategies
      </h1>

      <Tabs
        defaultValue={videoContent[0].category}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-3">
          {videoContent.map((category) => (
            <TabsTrigger
              key={category.category}
              value={category.category}
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>
        {videoContent.map((category) => (
          <TabsContent key={category.category} value={category.category}>
            <Card>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>
                  Watch these videos to learn about{" "}
                  {category.category.toLowerCase()}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div
                      className="relative"
                      style={{ paddingBottom: "56.25%", height: 0 }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                      ></iframe>
                    </div>
                    <h3 className="text-xl font-semibold mt-4">
                      {selectedVideo.title}
                    </h3>
                  </div>
                  <ScrollArea className="h-[300px] md:h-auto">
                    <div className="space-y-2 pr-4">
                      {category.videos.map((video) => (
                        <Card
                          key={video.id}
                          className={`cursor-pointer transition-colors ${
                            selectedVideo.id === video.id ? "bg-orange-100" : ""
                          }`}
                          onClick={() => setSelectedVideo(video)}
                        >
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">
                              {video.title}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
