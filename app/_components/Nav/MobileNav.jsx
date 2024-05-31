'use client'

import Link from "next/link"
import { useState } from "react"
import CartIcon from "./CartIcon"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center justify-between lg:hidden bg-zinc-950 p-5 relative shadow-lg">
      <button onClick={() => setOpen(!open)}>
        <img src="/img/icon_hamburger.svg" alt="menu" width="28" />
      </button>
      <div className="w-[160px] relative">
        <img src="https://media.primordial-atrocity.band/images/branding/pa-logo-2024/v1?w=320" alt="" width="160" className="absolute -top-12" />
      </div>
      <CartIcon />
      {open && (
        <div className="fixed w-5/6 h-screen top-0 left-0 bg-zinc-950 shadow-lg py-6 px-5 flex flex-col gap-6">
          <button onClick={() => setOpen(!open)}>
            <img src="/img/icon_hamburger.svg" alt="menu" width="28" />
          </button>
          <ul className="text-2xl grid gap-2">
            <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li>
              <details className="grid gap-6">
                <summary className="list-none">About</summary>
                <Link href="/history" className="pl-4" onClick={() => setOpen(false)}> - History</Link>
                <Link href="/band-members" className="pl-4" onClick={() => setOpen(false)}> - Band Members</Link>
              </details>
            </li>
            <li><Link href="/blog" onClick={() => setOpen(false)}>Blog</Link></li>
            <li><Link href="/shows" onClick={() => setOpen(false)}>Shows</Link></li>
            <li>
              <details className="grid gap-6">
                <summary className="list-none">Gallery</summary>
                <Link href="/photo-gallery" className="pl-4" onClick={() => setOpen(false)}> - Photos</Link>
                <Link href="/video-gallery" className="pl-4" onClick={() => setOpen(false)}> - Videos</Link>
              </details>
            </li>
            <li><Link href="/merch" onClick={() => setOpen(false)}>Merch</Link></li>
          </ul>
        </div>
      )}
    </div>
  )
}