"use server"

import { cookies } from "next/headers"

export async function getCart() {
  return cookies().get('cart')
}