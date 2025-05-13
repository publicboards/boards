import { PrimaryLayout } from "@/components/layout/primary-layout";
import { PostEntry } from "@/components/ui/post-entry";
import { useParams } from "react-router-dom";

export default function BoardPage() {
    const { boardname } = useParams<{ boardname: string }>();

    return (
        <PrimaryLayout>
            <div className="flex flex-col sm:flex-row">
                <div className="flex-1">
                    <ul className="space-y-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <PostEntry
                                key={i}
                                title={`Post Title ${i + 1}`}
                                description={`This is a sample description for post ${i + 1}. It provides a brief overview of the content.`}
                                votes={Math.floor(Math.random() * 100)}
                                author={`User${i + 1}`}
                                date={new Date().toLocaleDateString()}
                                imageUrl={i % 2 === 0 ? "/public/vite.svg" : undefined}
                                isHighlighted={i === 0}
                                isDownvoted={i === 1}
                            />
                        ))}
                    </ul>
                </div>
                <aside className="w-full sm:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md sm:ml-4">
                    <h1 className="text-2xl font-bold mb-4">_/{boardname}</h1>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        Welcome to our community! This is a place where members can share ideas, discuss topics, and connect with others.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li>Total Members: 1,234</li>
                        <li>Active Users: 123</li>
                        <li>Posts Today: 45</li>
                        <li>New Members: 12</li>
                    </ul>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Subscribe</button>
                </aside>
            </div>
        </PrimaryLayout>
    );
}