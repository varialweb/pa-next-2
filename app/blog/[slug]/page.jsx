import { MongoClient, ObjectId } from "mongodb"
import RichText from "./RichText"

export const revalidate = 120

export async function generateMetadata({ params }) {
  const mongo = new MongoClient(process.env.MONGO_URI)
  let post = {}

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    post = await client.collection('contents').findOne({ 'fields.url': params.slug })

    mongo.close()
  } catch (error) {
    console.error('Error loading merch item', error)
  }

  return {
    title: `${post.fields.title} - Blog - Primordial Atrocity`,
    description: post.fields.description,
  }
}

async function getBlogPost(slug) {
  const mongo = new MongoClient(process.env.MONGO_URI)

  let blogPost = {}

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')
    
    let post = await client.collection('contents').findOne({ 'fields.url': slug })
    let authors = []
    
    for await (let authorId of post.fields.authors) {
      const author = await client.collection('users').findOne({ _id: new ObjectId(authorId)})

      authors.push({
        _id: author._id,
        name: author.name,
        avatar: author.avatar,
      })
    }

    blogPost = {
      ...post,
      fields: {
        ...post.fields,
        authors: [...authors],
      }
    }

    await mongo.close()
  } catch (error) {
    console.error('Error loading blog post', error)
  }

  return blogPost
}

export default async function BlogPost({ params }) {
  const blogPost = await getBlogPost(params.slug)

  return (
    <main className="grid place-items-center h-full p-5 md:px-16 py-16 md:py-24 max-w-5xl mx-auto">
      <article className="p-5 md:p-8 bg-zinc-900 border border-zinc-800 w-full flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h1>{blogPost.fields.title}</h1>
            <p className="text-sm">{new Date(blogPost.createdAt).toLocaleString()}</p>
          </div>
          {blogPost.fields.authors.map(author => <img key={author._id} src={author.avatar} className="aspect-square object-cover rounded-full w-8" />)}
        </div>
        <div className="bg-zinc-800 shadow-inner aspect-square grid place-items-center">
          <img src={blogPost.fields.coverPhoto.url} alt={blogPost.fields.coverPhoto.alt} width={blogPost.fields.coverPhoto.width} className="shadow-inner object-cover max-w-full" />
        </div>
        <RichText src={blogPost.fields.body} />
      </article>
    </main>
  )
}

