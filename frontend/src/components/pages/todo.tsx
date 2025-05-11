import { PrimaryLayout } from "@/components/layout/primary-layout";

export default function TodoPage() {
  return (
    <PrimaryLayout>
      <h1 className="text-2xl font-bold mb-4">TODO</h1>
      <p className="text-lg mb-4">This page is under construction.</p>

      <ul className="list-disc list-inside">
        <li><a href ="/">Home</a></li>
        <li><a href ="/settings">Settings</a></li>
        <li><a href ="/messages">Messages</a></li>
        <li><a href ="/@/username">@/username</a></li>
        <li><a href ="/_/boardname">_/boardname</a></li>
      </ul>
    </PrimaryLayout>
  );
}