// app/time-client/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TimeClientPage() {
    const [now, setNow] = useState<string>(() => new Date().toLocaleString());

    useEffect(() => {
        const id = setInterval(() => {
            setNow(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 text-zinc-100">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow p-6 text-center space-y-4">
                <h1 className="text-2xl font-semibold">⏰ Client Time</h1>
                <p className="text-lg text-zinc-300">{now}</p>
                <p className="text-sm text-zinc-500">
                    This page is rendered in the browser and updates every
                    second.
                </p>
            </div>
        </main>
    );
}
