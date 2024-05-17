'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DesktopNav() {
  const pathname = usePathname()
  return (
    <div className="hidden lg:block text-2xl bg-zinc-950 shadow-lg px-4">
      <ul className="flex justify-between  max-w-6xl 2xl:max-w-7xl mx-auto">
        <li className="py-6">
          <Link 
            href="/" 
            className={`underline decoration-transparent underline-offset-8  ${pathname === '/' ? `decoration-orange-600` : 'hover:decoration-orange-400'}`}
          >
            Home
          </Link>
        </li>
        <AboutLink />
        <li className="py-6"><Link href="/blog" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Blog</Link></li>
        <li className="relative w-[199px] justify-self-center pt-6">
          <Link href="/" className="absolute">
            <img src="/img/pa-logo-white-388w.png" alt="home" width="199" className="" />
          </Link>
        </li>
        <li className="py-6 -mr-5"><Link href="/shows" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Shows</Link></li>
        <GalleryLink />
        <li className="py-6"><Link href="/merch" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Merch</Link></li>
      </ul>
    </div>
  )
}

function AboutLink() {
  const [open, setOpen] = useState(false)
  return (
    <div onMouseLeave={() => setOpen(false)} className="relative py-6 group">
      <button onMouseEnter={() => setOpen(true)} className="underline decoration-transparent underline-offset-8 group-hover:decoration-orange-400">About</button>
      {open && (
        <div className="absolute grid w-[15ch] p-4 bg-zinc-950 -left-4 top-20 gap-2 rounded shadow-lg">
          <Link href="/history" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Our History</Link>
          <Link href="/band-members" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Band Members</Link>
        </div>
      )}
    </div>
  )
}

function GalleryLink() {
  const [open, setOpen] = useState(false)
  return (
    <div onMouseLeave={() => setOpen(false)} className="relative py-6 group">
      <button onMouseEnter={() => setOpen(true)} className="underline decoration-transparent underline-offset-8 group-hover:decoration-orange-400">Gallery</button>
      {open && (
        <div className="absolute grid w-[15ch] p-4 bg-zinc-950 -left-4 top-20 gap-2 rounded shadow-lg">
          <Link href="/photo-gallery" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Photos</Link>
          <Link href="/video-gallery" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Videos</Link>
        </div>
      )}
    </div>
  )
}