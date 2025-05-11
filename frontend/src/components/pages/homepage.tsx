import { PrimaryLayout } from "@/components/layout/primary-layout";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch("/api/v1/time");
        if (!response.ok) {
          console.error("HTTP error! status:", response.status);
          setCurrentTime("Failed to get time.");
          return;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Failed to populate time. Invalid content type, expected application/json");
          setCurrentTime("Failed to get time.");
          return;
        }
        const data = await response.json();
        setCurrentTime(data.current_time_utc);
      } catch (error) {
        console.error("Failed to fetch time:", error);
        setCurrentTime("Failed to get time.");
      }
    };

    fetchTime();
    const interval = setInterval(fetchTime, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PrimaryLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome to PublicBoards.org</h1>
      <p className="text-lg mb-4">This is the homepage. The time below is populated from the API.</p>
      <p className="text-lg font-mono">Current Time: {currentTime || "Loading..."}</p>
    </PrimaryLayout>
  );
}