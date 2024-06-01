'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { addToCart } from "./AddToCart"
import { useRouter } from "next/navigation"

export default function MerchItem({ item }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [currentSize, setCurrentSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [maxQuantity, setMaxQuantity] = useState(1)

  const router = useRouter()

  useEffect(() => {
    let hasMultipleSizes = Number(item.fields.sizeSmallStock) > 0 || Number(item.fields.sizeMediumStock) > 0 || Number(item.fields.sizeLargeStock) > 0 || Number(item.fields.sizeXLStock) > 0

    if (hasMultipleSizes) {
      if (Number(item.fields.sizeMediumStock) > 0) return setCurrentSize('medium')
      if (Number(item.fields.sizeLargeStock) > 0) return setCurrentSize('large')
      if (Number(item.fields.sizeSmallStock) > 0) return setCurrentSize('small')
      if (Number(item.fields.sizeXlStock) > 0) return setCurrentSize('xl')
    }
  }, [])

  useEffect(() => {
    if (currentSize) {
      const smallStock = Number(item.fields.sizeSmallStock)
      const mediumStock = Number(item.fields.sizeMediumStock)
      const largeStock = Number(item.fields.sizeLargeStock)
      const xlStock = Number(item.fields.sizeXlStock)
      
      if (currentSize === 'small' && quantity > smallStock) setQuantity(smallStock)
      if (currentSize === 'medium' && quantity > mediumStock) setQuantity(mediumStock)
      if (currentSize === 'large' && quantity > largeStock) setQuantity(largeStock)
      if (currentSize === 'xl' && quantity > xlStock) setQuantity(xlStock)

      if (currentSize === 'small') setMaxQuantity(smallStock)
      if (currentSize === 'medium') setMaxQuantity(mediumStock)
      if (currentSize === 'large') setMaxQuantity(largeStock)
      if (currentSize === 'xl') setMaxQuantity(xlStock)
    } else {
      if (quantity > Number(item.fields.stock)) setQuantity(Number(item.fields.stock))
      setMaxQuantity(Number(item.fields.stock))
    }

    if (quantity < 0) setQuantity(0)
  }, [currentSize, quantity])

  return (
    <div className="bg-zinc-900 p-5 w-full max-w-xl shadow-2xl flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Link href="/merch" className="text-sm">Back</Link>
        <h1 className="text-2xl leading-none">{item.fields.name}</h1>
        <h2 className="font-medium text-sm">${item.fields.price.slice(0, item.fields.price.length - 2)}.{item.fields.price.slice(item.fields.price.length - 2, item.fields.price.length)}</h2>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-zinc-800 p-5 shadow-inner">
          <picture>
            <source srcSet={`${item.fields.images[currentImage].url}?w=1024`} media="(min-width: 768px)" />
            <img src={`${item.fields.images[currentImage].url}?w=750`} alt={item.fields.images[currentImage].alt} width={item.fields.images[currentImage].width} className="w-full aspect-[4/3] object-contain" />
          </picture>
        </div>
        <div className="flex gap-2">
          {item.fields.images.map((image, index) => (
            <button key={image.url} className={`border p-2 ${currentImage === index ? 'border-orange-500' : 'border-gray-500'}`} onClick={() => setCurrentImage(index)}>
              <img src={`${image.url}?w=80`} alt={image.alt} width="40" />
            </button>
          ))}
        </div>
      </div>
      <p>{item.fields.description}</p>
      {currentSize && (
        <div className="flex gap-2 text-sm">
          {Number(item.fields.sizeSmallStock) > 0 && <button onClick={() => { setCurrentSize('small') }} className={`border p-2 ${currentSize === 'small' ? 'border-orange-500' : 'border-gray-500'}`}>Small</button>}
          {Number(item.fields.sizeMediumStock) > 0 && <button onClick={() =>  { setCurrentSize('medium') }} className={`border p-2 ${currentSize === 'medium' ? 'border-orange-500' : 'border-gray-500'}`}>Medium</button>}
          {Number(item.fields.sizeLargeStock) > 0 && <button onClick={() => { setCurrentSize('large') }} className={`border p-2 ${currentSize === 'large' ? 'border-orange-500' : 'border-gray-500'}`}>Large</button>}
          {Number(item.fields.sizeXlStock) > 0 && <button onClick={() => { setCurrentSize('xl') }} className={`border p-2 ${currentSize === 'xl' ? 'border-orange-500' : 'border-gray-500'}`}>XL</button>}
        </div>
      )}
      <div className="flex gap-4 items-end">
        <div className="grid w-fit">
          <label htmlFor="quantity">Quantity</label>
          <input
            name="quantiy"
            id="quantity"
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={event => setQuantity(event.target.value)}
            className="text-black w-full p-2"
          />
        </div>
        {maxQuantity < 5 && <p className="mb-2">Only {maxQuantity} left in stock!</p>}
      </div>
      <button 
        className="bg-orange-600 p-3 mt-4" 
        onClick={async () => {
          await addToCart({ 
            _id: item._id,
            name: currentSize ? (
              currentSize === 'small' ? `${item.fields.name} - Small` : currentSize === 'medium' ? `${item.fields.name} - Medium` : currentSize === 'large' ? `${item.fields.name} - Large` : `${item.fields.name} - XL`
            ) : item.fields.name,
            quantity: quantity,
          })
          .then(() => {
            router.push('/cart')
          })
        }}>
          Add to cart (${((quantity * Number(item.fields.price)) / 100).toFixed(2)})
        </button>
    </div>
  )
} 