// app/time/page.tsx  (Server Component by default)

export default async function TimePage() {
    const now = new Date().toLocaleString(); // runs on server
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 text-zinc-100">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow p-6 text-center space-y-4">
                <h1 className="text-2xl font-semibold">⏰ Server Time</h1>
                <p className="text-lg text-zinc-300">{now}</p>
                <p className="text-sm text-zinc-500">
                    This page is rendered on the server each time you load it.
                </p>
            </div>
        </main>
    );
}
