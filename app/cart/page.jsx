import { MongoClient, ObjectId } from "mongodb"
import { cookies } from "next/headers"
import { Metal_Mania } from "next/font/google";
import RemoveButton from "./RemoveButton";
import Link from "next/link";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

async function getItems() {
  const mongo = new MongoClient(process.env.MONGO_URI)
  const cart = cookies().has('cart') ? JSON.parse(cookies().get('cart').value) : []
  let items = []

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    for await (const item of cart) {
      items.push(await client.collection('contents').findOne({ _id: new ObjectId(item._id) }))
    }

    await mongo.close()
  } catch (error) {
    console.error('Error loading items', error)
  }

  return [...items]
}

export default async function CartPage() {
  const items = await getItems()
  const cart = cookies().has('cart') ? JSON.parse(cookies().get('cart').value) : []

  console.log('items', items)

  async function removeItem(item) {
    'use server'

    let newCart = []

    for (let oldCartItem of cart) {
      if (oldCartItem.name !== item.name) newCart.push({...oldCartItem})
    }

    console.log('new cart', newCart)

    if (newCart.length > 0) cookies().set('cart', JSON.stringify([...newCart]))
    if (newCart.length === 0) cookies().delete('cart')
  }

  function getSubtotal() {
    let subTotal = 0

    for (const item of cart) {
      const dbItem = items.find(i => JSON.stringify(i._id) === JSON.stringify(item._id))
      subTotal += Number(dbItem.fields.price) * Number(item.quantity)
    }

    return subTotal
  }

  function getTax() {
    return Math.round(getSubtotal() * 0.098) 
  }

  function getShipping() {
    return 0
  }

  function getTotal() {
    return Math.round(getSubtotal() + getTax() + getShipping())
  }

  return (
    <main className="grid min-h-full place-items-center p-5 py-16">
      <div className="bg-zinc-900 p-5 md:p-8 w-full flex flex-col items-center gap-2 md:gap-4 lg:w-fit shadow-2xl">
        <h1 className={`${metalMania.className} text-center`}>Cart</h1>
        {!cart || cart.length === 0 ? (
          <p className="text-center">Your cart is empty!</p>
        ) : (
          <>
            {cart.map(item => {
              const dbItem = items.find(i => JSON.stringify(i._id) === JSON.stringify(item._id))
              const price = dbItem.fields.price
              const totalPrice = Number(price) * Number(item.quantity)
              const image = dbItem.fields.images[0]
              return (
                <div key={item.name} className="bg-zinc-800 p-4 md:p-4 grid gap-4 relative w-full max-w-2xl">
                  <h2 className="text-lg text-center">{item.name}</h2>
                  <img src={image.url} alt={image.alt} width="375" className="justify-self-center aspect-square object-contain bg-zinc-700 p-5" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">Price: ${`${price.slice(0, price.length - 2)}.${price.slice(price.length - 2, price.length)}`}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium">Total: ${`${totalPrice.toString().slice(0, totalPrice.toString().length - 2)}.${totalPrice.toString().slice(totalPrice.toString().length - 2, totalPrice.toString().length)}`}</p>
                  </div>
                  <RemoveButton item={item} removeItem={removeItem} />
                </div>
              )})
            }
            <div className="flex flex-col items-end w-full">
              <p>Subtotal: ${`${(getSubtotal() / 100).toFixed(2)}`}</p>
              <p>Tax: ${(getTax() / 100).toFixed(2)}</p>
              <p>Shipping ${(getShipping() / 100).toFixed(2)}</p>
              <p>Total: ${(getTotal() / 100).toFixed(2)}</p>
            </div>
            <Link href="/checkout" className="bg-orange-600 px-6 py-2 text-lg w-full max-w-2xl text-center">Checkout</Link>
          </>
        )}
      </div>
    </main>
  )
}