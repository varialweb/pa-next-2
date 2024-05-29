import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 flex flex-col gap-5 p-5 items-center">
      <img src="/img/pa-crest-white-120w.png" alt="" width="60" className="-mt-10" />
      <div className="flex justify-center gap-4 items-center">
        <Link href="https://primordialatrocity.bandcamp.com/"><img src="/img/bandcamp.svg" alt="Bandcamp" width="48" /></Link>
        <Link href="https://www.instagram.com/primordialatrocityofficial"><img src="/img/instagram.svg" alt="Instagram" width="48" /></Link>
        <Link href="https://www.facebook.com/primordialatrocity"><img src="/img/facebook.svg" alt="Facebook" width="48" /></Link>
      </div>
      <div className="grid justify-center text-center">
        <p>&copy;2013 - {new Date().getFullYear()}</p>
        <p>Created by <Link href="https://www.varial.dev" className="text-orange-500">Varial Web Development</Link></p>
      </div>
    </footer>
  )
}