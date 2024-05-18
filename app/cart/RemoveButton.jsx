'use client'

import { useRouter } from "next/navigation"

export default function RemoveButton({ item, removeItem = async (item) => {}}) {
  const router = useRouter()

  return (
    <button 
      onClick={async () => {
        await removeItem(item).then(() => router.refresh())
      }} 
      className="absolute bg-orange-600 bottom-4 right-4 md:bottom-4 md:right-4 px-2 py-1 text-sm"
    >
      Remove
    </button>
  )
}