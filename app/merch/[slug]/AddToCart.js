"use server"

import { cookies } from "next/headers"

export async function addToCart(item) {
  if (!cookies().has('cart')) {
    cookies().set('cart', JSON.stringify([{ _id: item._id, name: item.name, quantity: item.quantity }]))
  } else {
    let oldCart = JSON.parse(cookies().get('cart').value)
    console.log('OLD CART', oldCart)
    let newCart = []

    if (oldCart.length === 0) {
      newCart.push({ _id: item._id, name: item.name, quantity: item.quantity })
      cookies().set('cart', JSON.stringify([...newCart]))
    } 
    
    if (oldCart.length > 0) {
      let itemInCartAlready = false
      
      for await (let oldCartItem of oldCart) {
        if (oldCartItem.name === item.name) {
          itemInCartAlready = true
        }
      }

      if (!itemInCartAlready) {
        newCart = [...oldCart]
        newCart.push({ _id: item._id, name: item.name, quantity: item.quantity })
      }

      if (itemInCartAlready) {
        for await (let oldCartItem of oldCart) {
          if (oldCartItem.name === item.name) {
            newCart.push({ _id: item._id, name: item.name, quantity: item.quantity })
          } else {
            newCart.push(oldCartItem)
          }
        }
      }

      cookies().set('cart', JSON.stringify([...newCart]))
    }



    
  }
}