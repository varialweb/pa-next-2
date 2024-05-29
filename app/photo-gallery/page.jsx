import { MongoClient } from "mongodb"
import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export const revalidate = 120

export const metadata = {
  title: 'Photo Gallery - Primordial Atrocity',
  description: 'Check out our photo albums',
}

async function getPhotoGalleries() {
  const mongo = new MongoClient(process.env.MONGO_URI)
  let galleries = []

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    const galleryModel = await client.collection('content_models').findOne({ 'name.plural': 'photo-galleries' })

    for await (const gallery of client.collection('contents').find({ contentModel: galleryModel._id })) {
      if (gallery.published) {
        galleries.push(gallery)
      }
    }

    await mongo.close()
  } catch (error) {
    console.error('Error fetching photo galleries', error)
  }

  return [...galleries].sort((a, b) => new Date(b.fields.date) - new Date(a.fields.date))
}

export default async function PhotoGalleryPage() {
  const galleries = await getPhotoGalleries()
  
  return (
    <main className="grid min-h-full place-items-center p-5 py-16 md:p-16 md:py-24">
      <div className="bg-zinc-900 p-5 md:p-8 grid gap-4 md:gap-8">
        <h1 className={`${metalMania.className} text-center`}>Photo Gallery</h1>
        {galleries.map(gallery => (
          <div key={gallery._id} className="bg-zinc-800 shadow-2xl p-5 md:p-8 flex flex-col gap-2 md:gap-4">
            <div className="grid">
              <h2>{gallery.fields.name}</h2>
              <h3>{new Date(gallery.fields.date).toDateString()}</h3>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
              {gallery.fields.images.map(image => (
                <img key={image.url} src={image.url} alt={image.alt} width={375} className="aspect-[4/3] md:w-[calc(50%_-_12px)] lg:w-[calc(25%_-_12px)] object-cover hover:object-contain border border-zinc-700 bg-zinc-950" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}