import { PrimaryLayout } from "@/components/layout/primary-layout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ProfilePage() {
  const [userId, setUserId] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];
    setUserId(id);
  }, [location]);

  return (
    <PrimaryLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome to PublicBoards.org</h1>
      <p className="text-lg mb-4">This is the profile page.</p>
      <p className="text-lg font-mono">User ID: {userId}</p>
    </PrimaryLayout>
  );
}