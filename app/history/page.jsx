import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export default function HistoryPage() {
  return (
    <main className="min-h-full grid place-items-center p-5 py-16 md:py-24">
      <div className="bg-zinc-900 p-5 shadow-2xl w-full max-w-2xl grid gap-8">
        <h1 className={`${metalMania.className} text-center`}>Our History</h1>
        <p className="text-center">Coming soon!</p>
      </div>
    </main>
  )
}