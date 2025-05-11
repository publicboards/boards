import { PrimaryLayout } from "@/components/layout/primary-layout";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { uuid } = useParams<{ uuid: string }>();

  return (
    <PrimaryLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome to PublicBoards.org</h1>
      <p className="text-lg mb-4">This is the profile page.</p>
      <p className="text-lg font-mono">User ID: {uuid}</p>
    </PrimaryLayout>
  );
}