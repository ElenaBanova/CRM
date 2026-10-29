"use client";

export default function GlobalError() {
    return (
        <html>
        <body style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1>Something went wrong</h1>
        <p>Contact the administrator</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">Go to the authorization page</a>
        </body>
        </html>
    );
}