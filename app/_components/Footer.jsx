import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 flex flex-col gap-5 p-5 items-center">
      <img src="/img/pa-crest-white-120w.png" alt="" width="60" className="-mt-10" />
      <div className="flex justify-center gap-4 items-center">
        <Link href="/"><img src="/img/bandcamp.svg" alt="Bandcamp" width="60" /></Link>
        <Link href="/"><img src="/img/instagram.svg" alt="Instagram" width="60" /></Link>
        <Link href="/"><img src="/img/facebook.svg" alt="Facebook" width="60" /></Link>
      </div>
    </footer>
  )
}