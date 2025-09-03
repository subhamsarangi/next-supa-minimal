'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [sessionEmail, setSessionEmail] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getUser();
            setSessionEmail(data.user?.email ?? null);
            setLoading(false);
        };
        init();

        // Live updates on auth state
        const { data: sub } = supabase.auth.onAuthStateChange(
            async (_event, sess) => {
                setSessionEmail(sess?.user?.email ?? null);
            }
        );
        return () => sub.subscription.unsubscribe();
    }, [supabase]);

    const signInGithub = async () => {
        setLoading(true);
        await supabase.auth.signInWithOAuth({ provider: 'github' });
        // Redirect handled by provider; on return, auth state updates.
    };

    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow p-6 space-y-4">
                <h1 className="text-2xl font-semibold">
                    Next.js + Supabase Minimal
                </h1>

                <p className="text-sm text-zinc-400">
                    {loading ? (
                        'Checking session…'
                    ) : sessionEmail ? (
                        <>
                            Signed in as{' '}
                            <span className="font-medium text-zinc-100">
                                {sessionEmail}
                            </span>
                        </>
                    ) : (
                        'You are signed out.'
                    )}
                </p>

                <div className="flex gap-3">
                    {!sessionEmail ? (
                        <button
                            onClick={signInGithub}
                            className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        >
                            Sign in with GitHub
                        </button>
                    ) : (
                        <button
                            onClick={signOut}
                            className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        >
                            Sign out
                        </button>
                    )}
                    <Link
                        href="/todos"
                        className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    >
                        Todos
                    </Link>
                </div>
            </div>
        </main>
    );
}
