import { PrimaryLayout } from "@/components/layout/primary-layout";
import { Button } from "../ui/button";
import { useState } from "react";

export default function TodoPage() {
  const [ count, setCount ] = useState(0);

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
        <li><a href ="/404">404</a></li>
      </ul>

      <br />
      <hr />
      <br />
      <br />

      <Button onClick={() => setCount(count + 1)}>Add Todo</Button>
      <p>The count is {count}.</p>
      {count >= 1 && (
        <p>Keep clicking!</p>
      )}
      {count >= 5 && (
        <p>That's right! Keep going!</p>
      )}
      {count >= 15 && (
        <p>Wow, what a maniac.</p>
      )}
      {count >= 25 && (
        <p>Do you ever quit?</p>
      )}
      {count >= 100 && (
        <p>Try getting past 9000.</p>
      )}
      {count >= 9000 && (
        <p>His power levels are over 9000!</p>
      )}
    </PrimaryLayout>
  );
}