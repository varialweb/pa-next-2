

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "./GetCart";

export default function CartIcon({ className }) {
  const [cart, setCart] = useState()

  // useEffect(async () => {
  //   const c = await getCart()
  //   setCart(c)
  //   console.log('cart', c)
  // }, [])

  // useEffect(() => {
  //   async function findCart() {
  //     const c = await getCart()
  //     setCart(c)
  //     console.log('cart', c)
  //   }
  
  //   findCart()
  // }, [])

  

  return (
    <Link href="/cart" className={`relative ${className}`}>
      <img src="/img/icon_cart.svg" alt="cart" width="28" />
      {/* <div className="bg-orange-600 grid place-items-center leading-none rounded-full aspect-square absolute -top-1.5 -right-1.5 bg-opacity-90 font-mono text-sm font-bold">
        {cart ? JSON.parse(cart.value).length : 0 }
      </div> */}
    </Link>
  )
}