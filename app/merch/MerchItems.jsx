'use client'

import { Metal_Mania } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export default function MerchItems({ merch, categories, filteredCategories }) {
  const searchParams = useSearchParams()
  // let filteredItems = [...merch]
  const [filteredItems, setFilteredItems] = useState([])

  let array = []
  
  filteredCategories.forEach(category => {
    categories.forEach(i => {
      if (JSON.stringify(i._id) === JSON.stringify(category)) {
        array.push(i)
      }
    })
  })

  useEffect(() => {
    if (!searchParams.get('category')) {
      setFilteredItems([...merch])
    } else {
      let newFilteredItems = []

      merch.forEach(item => {
        item.fields.categories.forEach(category => {
          if (category.fields.name === searchParams.get('category')) newFilteredItems.push(item)
        })
      })

      setFilteredItems([...newFilteredItems])
    }
  }, [searchParams])

  return (
    <main className="grid place-items-center min-h-full p-5 py-12 lg:py-24">
      <div className="bg-zinc-900 shadow-2xl p-5 w-full grid gap-4 max-w-6xl">
        <h1 className={`${metalMania.className} text-center`}>Merch</h1>
        <div className="flex gap-2 justify-center">
          <Link href="/merch" className={`${!searchParams.get('category') && 'text-orange-500'}`}>All merch</Link>
          {array.map(category => (
            <Link key={category._id} href={`?category=${category.fields.name}`} className={`${searchParams.get('category') === category.fields.name && 'text-orange-500'}`}>
              {category.fields.name}
            </Link>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:grid-cols-3">
          {filteredItems.map(item => (
            <div key={item._id} className="bg-zinc-800 max-w-lg">
              <div className="bg-zinc-700 p-4">
                <img src={`${item.fields.images[0].url}?w=750`} alt={item.fields.images[0].alt} width={item.fields.images[0].width} className="object-contain aspect-[4/3]" />
              </div>
              <div className="p-4 w-full flex flex-col">
                <h2>{item.fields.name}</h2>
                <p>${item.fields.price.toString().slice(0, item.fields.price.toString().length - 2)}.{item.fields.price.toString().slice(item.fields.price.toString().length - 2, item.fields.price.toString().length)}</p>
                {item.fields.stock === '0' ? (
                  <Link href="#" className="w-full text-center mt-4 p-2.5 bg-gray-500">Out of stock</Link>
                ) : (
                  <div className="flex flex-col mt-4 gap-1">
                    {Number(item.fields.stock) < 5 ? <p className="text-sm text-orange-500">Only {item.fields.stock} left in stock!</p> : <div className="h-[20px]" />}
                    <Link href={`/merch/${item.fields.url}`} className="bg-orange-600 w-full text-center p-2.5 shadow-lg">View more details</Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}