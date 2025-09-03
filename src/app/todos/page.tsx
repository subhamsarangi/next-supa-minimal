'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

type Todo = { id: number; title: string; inserted_at: string };

export default function TodosPage() {
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            const uid = data.user?.id ?? null;
            setUserId(uid);
            setLoading(false);
            if (uid) await loadTodos(uid);
        })();
    }, []);

    async function loadTodos(uid: string) {
        const { data, error } = await supabase
            .from('todos')
            .select('id,title,inserted_at')
            .eq('user_id', uid)
            .order('inserted_at', { ascending: false });
        if (error) setError(error.message);
        else setTodos((data ?? []) as Todo[]);
    }

    async function addTodo(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!userId) return;
        const text = title.trim();
        if (!text) return;
        const { error } = await supabase
            .from('todos')
            .insert({ title: text, user_id: userId });
        if (error) setError(error.message);
        setTitle('');
        await loadTodos(userId);
    }

    if (loading) return <div className="p-6">Loading…</div>;

    if (!userId) {
        return (
            <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 text-zinc-100">
                <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow p-6">
                    <p className="mb-4 text-zinc-300">You’re signed out.</p>
                    <Link
                        href="/"
                        className="underline text-zinc-100 hover:text-zinc-300"
                    >
                        Go back and sign in
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 text-zinc-100">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow p-6">
                <h1 className="text-xl font-semibold mb-4">My Todos</h1>
                <form onSubmit={addTodo} className="flex gap-2 mb-4">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="New todo title"
                        className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    >
                        Add
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                <ul className="space-y-2">
                    {todos.map((t) => (
                        <li
                            key={t.id}
                            className="rounded-xl border border-zinc-800 bg-zinc-900 p-3"
                        >
                            <p className="font-medium text-zinc-100">
                                {t.title}
                            </p>
                            <p className="text-xs text-zinc-500">
                                {new Date(t.inserted_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                    {todos.length === 0 && (
                        <p className="text-sm text-zinc-500">No todos yet.</p>
                    )}
                </ul>
            </div>
        </main>
    );
}
