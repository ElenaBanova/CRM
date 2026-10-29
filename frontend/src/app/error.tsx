"use client";

import {startTransition, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    const handleRetry = () => {
        startTransition(() => {
            router.refresh();
            reset();
        });
    };

    return (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h1>Something went wrong</h1>
            <p>Contact the administrator</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
                <button onClick={handleRetry}>Try again</button>
                <Link href="/">Go to the authorization page</Link>
            </div>
        </div>
    );
}