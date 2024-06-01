import { MongoClient } from "mongodb"
import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export const revalidate = 120

export const metadata = {
  title: 'Shows - Primordial Atrocity',
  description: 'Find out about our upcoming gigs',
}

async function getGigs() {
  const mongo = new MongoClient(process.env.MONGO_URI)
  let gigs = []

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    const gigModel = await client.collection('content_models').findOne({ 'name.plural': 'gigs' })

    for await (const gig of client.collection('contents').find({ contentModel: gigModel._id })) {
      if (gig.published) {
        gigs.push(gig)
      }
    }
  } catch (error) {
    console.error('Error loading gigs:', error)
  }

  return [...gigs].sort((a, b) => new Date(a.fields.date) - new Date(b.fields.date))
}

export default async function ShowsPage() {
  const gigs = await getGigs()

  console.log('gigs', gigs)
  return (
    <main className="grid place-items-center min-h-full p-5 py-16 md:py-24">
      <div className="bg-zinc-900 p-5 lg:p-8 shadow-2xl w-full max-w-md lg:max-w-4xl grid gap-2.5 lg:gap-8">
        <h1 className={`${metalMania.className} text-center`}>Shows</h1>
        {gigs.map(gig => (
          <div key={gig._id} className="flex flex-col lg:grid lg:grid-cols-[1fr_2fr] lg:w-fit bg-zinc-800 p-5 lg:p-8 gap-2.5 lg:gap-12 shadow-2xl">
            <img src={`${gig.fields.coverPhoto.url}?w=750`} alt={gig.fields.coverPhoto.alt} width={255} className="w-full" />
            <div className="flex flex-col justify-center gap-1">
              <h2 className="text-center lg:text-left">{gig.fields.name}</h2>
              <p className="text-center lg:text-left text-sm mb-2.5">{new Date(gig.fields.date).toDateString()}</p>
              <p className="text-center lg:text-left">{gig.fields.location.trim()}, {gig.fields.address}</p>
              <hr className="my-4" />
              <p className="italic text-center lg:text-left">{gig.fields.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}