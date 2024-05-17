import { MongoClient } from "mongodb"
import MerchItem from "./MerchItem"

async function getMerchItem(url) {
  const mongo = new MongoClient(process.env.MONGO_URI)
  let item = {}

  console.log('URL', url)

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    item = await client.collection('contents').findOne({ 'fields.url': url })

    mongo.close()
  } catch (error) {
    console.error('Error loading merch item', error)
  }

  return JSON.parse(JSON.stringify(item))
}

export default async function MerchItemPage({ params }) {
  const item = await getMerchItem(params.slug)

  return (
    <main className="grid place-items-center min-h-full p-5 py-16">
      <MerchItem item={item} />
    </main>
  )
}