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
        <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md rounded-2xl shadow p-6 bg-white space-y-4">
                <h1 className="text-2xl font-semibold">
                    Next.js + Supabase Minimal
                </h1>
                <p className="text-sm text-gray-600">
                    {loading ? (
                        'Checking session…'
                    ) : sessionEmail ? (
                        <>
                            Signed in as{' '}
                            <span className="font-medium">{sessionEmail}</span>
                        </>
                    ) : (
                        'You are signed out.'
                    )}
                </p>

                <div className="flex gap-3">
                    {!sessionEmail ? (
                        <button
                            onClick={signInGithub}
                            className="px-4 py-2 rounded-xl border hover:bg-gray-100"
                        >
                            Sign in with GitHub
                        </button>
                    ) : (
                        <button
                            onClick={signOut}
                            className="px-4 py-2 rounded-xl border hover:bg-gray-100"
                        >
                            Sign out
                        </button>
                    )}
                    <Link
                        href="https://supabase.com/docs"
                        className="px-4 py-2 rounded-xl border hover:bg-gray-100"
                        target="_blank"
                    >
                        Docs
                    </Link>
                </div>

                <p className="text-xs text-gray-500">
                    Tailwind is set up. Edit <code>src/app/page.tsx</code> to
                    customize.
                </p>
            </div>
        </main>
    );
}
