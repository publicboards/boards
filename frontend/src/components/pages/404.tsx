import { PrimaryLayout } from "@/components/layout/primary-layout";

export default function NotFoundPage() {
  return (
    <PrimaryLayout>
      <h1>404 - Page Not Found</h1>
      <p>The page located at <code>{window.location.href}</code> was not found.</p>
    </PrimaryLayout>
  );
}
