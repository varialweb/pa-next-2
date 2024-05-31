'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CartIcon from "./CartIcon";

export default function DesktopNav() {
  const pathname = usePathname()
  return (
    <div className="hidden lg:grid grid-cols-[1fr_900px_1fr] lg:grid-cols-[1fr_980_1fr] xl:grid-cols-[1fr_1150px_1fr] 2xl:grid-cols-[1fr_1280px_1fr] text-2xl bg-zinc-950 shadow-lg px-4 justify-center items-center overflow-x-clip max-w-full">
      <div />
      <ul className="flex justify-between w-full max-w-6xl 2xl:max-w-7xl relative pl-10">
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
        <li className="relative w-[200px] justify-self-center">
          <Link href="/" className="absolute">
            <img src="https://media.primordial-atrocity.band/images/branding/pa-logo-2024/v1?w=400" alt="home" width="200" className="hover:scale-110 transition" />
          </Link>
        </li>
        <li className="py-6"><Link href="/shows" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Shows</Link></li>
        <GalleryLink />
        <li className="py-6"><Link href="/merch" className="underline decoration-transparent underline-offset-8 hover:decoration-orange-400">Merch</Link></li>
      </ul>
      <CartIcon className="justify-self-end relative" />
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