import { MongoClient } from "mongodb";
import { Metal_Mania } from "next/font/google";
import Link from "next/link";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export const metadata = {
  title: "News - Primordial Atrocity",
  description: "Generated by create next app",
};

async function getNews() {
  const mongo = new MongoClient(process.env.MONGO_URI)
  let latestPost
  let latestGallery
  let latestMerch

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    const postModel = await client.collection('content_models').findOne({ 'name.plural': 'blog-posts' })
    const galleryModel = await client.collection('content_models').findOne({ 'name.plural': 'photo-galleries' })
    const merchModel = await client.collection('content_models').findOne({ 'name.plural': 'merch-items' })

    for await (const post of client.collection('contents').find({ contentModel: postModel._id }).limit(1).sort({ $natural: -1 })) {
      latestPost = post
    }

    for await (const gallery of client.collection('contents').find({ contentModel: galleryModel._id }).limit(1).sort({ $natural: -1 })) {
      latestGallery = gallery
    }

    for await (const merch of client.collection('contents').find({ contentModel: merchModel._id }).limit(1).sort({ $natural: -1 })) {
      latestMerch = merch
    }

    await mongo.close()
  } catch (error) {
    console.error('Error fetching news:', error)
  }

  return {
    latestPost,
    latestGallery,
    latestMerch,
  }
}

export default async function Home() {
  const { latestPost, latestGallery, latestMerch } = await getNews()

  // console.log(latestGallery)

  function LatestPost() {
    return (
      <div className="w-full grid gap-2 bg-zinc-800 p-5 shadow-2xl">
        <div>
          <h3 className="text-2xl font-medium">{latestPost.fields.title}</h3>
          <p className="text-sm">{new Date(latestPost.createdAt).toDateString()}</p>
        </div>
        <p>{latestPost.fields.description}..</p>
        <Link href={`/blog/${latestPost.fields.url}`} className="bg-orange-600 w-full text-center p-2 font-medium mt-2">
          Read full post
        </Link>
      </div>
    )
  }

  function LatestGallery() {
    return (
      <div className="w-full grid gap-4 bg-zinc-800 p-5 shadow-2xl">
        {latestGallery.fields.images.map(image => (
          <picture>
            <source srcSet={`${image.url}?w=1024`} media="(min-width: 768px)" />
            <img key={image.url} src={`${image.url}?w=750`} alt={image.alt} width={375} className="w-full aspect-[4/3] object-cover hover:object-contain bg-zinc-900 shadow-2xl" />
          </picture>
        ))}
      </div>
    )
  }

  function LatestMerch() {
    return (
      <div className="w-full grid gap-4 bg-zinc-800 p-5 shadow-2xl">
        <picture>
        <source srcSet={`${latestMerch.fields.images[0].url}?w=1024`} media="(min-width: 768px)" />
          <img src={`${latestMerch.fields.images[0].url}?w=750`} className="aspect-[4/3] object-contain bg-zinc-700 p-2.5" />
        </picture>
        <div>
          <h3 className="text-2xl font-medium">{latestMerch.fields.name}</h3>
          <p>${(Number(latestMerch.fields.price) / 100).toFixed(2)}</p>
          <p className="my-2">{latestMerch.fields.description}</p>
        </div>
        <Link href={`/merch/${latestMerch.fields.url}`} className="bg-orange-600 w-full text-center p-2 font-medium">
          View more details
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-full grid place-items-center p-5 py-16 md:py-24 bg-[url('https://media.primordial-atrocity.band/images/art/pa-molested-divinity/v1')] bg-contain md:bg-cover">
      <div className="bg-zinc-900 shadow-2xl p-5 md:max-w-xl">
        <h1 className={`${metalMania.className} text-center`}>News</h1>
        <hr className="my-4" />
        <h2 className="mb-4 text-center text-3xl">Featured Post</h2>
        <LatestPost />
        <hr className="my-4" />
        <h2 className="mb-4 text-center text-3xl">Featured Gallery</h2>
        <LatestGallery />
        <hr className="my-4" />
        <h2 className="mb-4 text-center text-3xl">Featured Merch</h2>
        <LatestMerch />
      </div>
    </main>
  );
}
