import { MongoClient, ObjectId } from "mongodb";
import MerchItems from "./MerchItems";
import { Suspense } from "react";

export const revalidate = 0

export const metadata = {
  title: 'Merch - Primordial Atrocity',
  description: 'Check out sweet gear',
}

async function getMerchItems() {
  const mongo = new MongoClient(process.env.MONGO_URI)

  let merchItems = []
  let merchCategories = []
  let filteredCategories = []

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    const contentModels = client.collection('content_models')
    const merchItemModel = await contentModels.findOne({ 'name.plural': 'merch-items' })
    const merchCategoryModel = await contentModels.findOne({ 'name.plural': 'merch-categories' })
    

    for await (let category of client.collection('contents').find({ 'contentModel': new ObjectId(merchCategoryModel._id) })) {
      merchCategories.push(category)
    }

    for await (let merchItem of client.collection('contents').find({ 'contentModel': new ObjectId(merchItemModel._id) })) {
      let categories = []

      if (merchItem.published) {
        for (let _id of merchItem.fields.categories) {
          
          for (let category of merchCategories) {
            if (JSON.stringify(_id) === JSON.stringify(category._id)) {
              categories.push(category)
  
              if (!filteredCategories.includes(_id)) {
                filteredCategories.push(_id)
              }
            }
          }
        }
      }
      
      
      if (merchItem.published) {
        merchItems.push({
          ...merchItem,
          fields: {
            ...merchItem.fields,
            categories: [...categories],
          }
        })
      }
    }

    await mongo.close()
  } catch(error) {
    console.error('Error loading merch items', error)
  }

  

  return {
    merch: JSON.parse(JSON.stringify([...merchItems])),
    categories: JSON.parse(JSON.stringify([...merchCategories])),
    filteredCategories: JSON.parse(JSON.stringify([...filteredCategories])),
  }
}

export default async function MerchPage() {
  const { merch, categories, filteredCategories } = await getMerchItems()

  return (
    <Suspense fallback={<main className="grid place-items-center min-h-full p-5 py-12 lg:py-24">Loading...</main>}>
      <MerchItems merch={merch} categories={categories} filteredCategories={filteredCategories} />
    </Suspense>
  )
}