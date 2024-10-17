import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getURL = (path: string = "") => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
      process?.env?.NEXT_PUBLIC_VERCEL_URL &&
        process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : // If neither is set, default to localhost for local development.
        "http://localhost:3000/";

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, "");
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, "");

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

export const subjects = [
  { id: 1, name: "Business Law", test: "Solicitor" },
  { id: 2, name: "Criminal Law", test: "Barrister" },
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

export const COLORS = ["#F97316", "#3B82F6"]; // Orange and Blue

export const Products = [
  {
    id: "1",
    name: "BarQuest - Barrister",
    description: "Barrister Test",
    price: 14700,
    interval: "3 months",
    trialDays: 7,
    features: [
      "+500 Questions with Commentary",
      "Unlimited Usage",
      "Real-Time Progress Tracking",
      "Mobile-Friendly Access",
      "Instant Feedback",
      "Regular Content Updates",
      "7 Days Risk-Free Trial",
    ],
  },
  {
    id: "2",
    name: "BarQuest - Solicitor",
    description: "Solicitor Test",
    price: 14700,
    interval: "3 months",
    trialDays: 7,
    features: [
      "+600 Questions with Commentary",
      "Unlimited Usage",
      "Real-Time Progress Tracking",
      "Mobile-Friendly Access",
      "Instant Feedback",
      "Regular Content Updates",
      "7 Days Risk-Free Trial",
    ],
  },
  {
    id: "3",
    name: "BarQuest - Full",
    description: "Full Test",
    price: 24700,
    interval: "3 months",
    trialDays: 7,
    features: [
      "+1000 Questions with Commentary",
      "Unlimited Usage",
      "Real-Time Progress Tracking",
      "Mobile-Friendly Access",
      "Instant Feedback",
      "Regular Content Updates",
      "7 Days Risk-Free Trial",
    ],
  },
];
