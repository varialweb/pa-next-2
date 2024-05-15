import { MongoClient, ObjectId } from "mongodb"

import { Metal_Mania } from "next/font/google";
import Link from "next/link";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

async function getBlogPosts() {
  const mongo = new MongoClient(process.env.MONGO_URI)
  let posts = []

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    const contentModels = client.collection('content_models')
    const blogPostModel = await contentModels.findOne({ 'name.plural': 'blog-posts' })

    for await (let post of client.collection('contents').find({ 'contentModel': new ObjectId(blogPostModel._id) })) {
      let authors = []

      for await (let _id of post.fields.authors) {
        const author = await client.collection('users').findOne({ _id: new ObjectId(_id) })

        authors.push({
          _id: author._id,
          name: author.name,
          avatar: author.avatar,
        })
      }

      console.log('authors', authors)

      posts.push({
        ...post,
        fields: {
          ...post.fields,
          authors: [...authors],
        }
      })
    }

    await mongo.close()
  } catch (error) {
    console.error('Error loading blog posts', error)
  }

  return [...posts]
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

  blogPosts.forEach(blogPost => console.log(blogPost.fields))
  return (
    <main className="flex flex-col items-center p-5 py-24 gap-4 md:gap-12">
      <h1><span className={metalMania.className}>Blog</span></h1>
      <div className="w-full max-w-xl">
        {blogPosts.map(blogPost =>  (
          <div 
            key={blogPost._id}
            className="bg-zinc-900 p-5 md:p-8 rounded shadow-2xl flex flex-col gap-4 border border-zinc-800"
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <h2>{blogPost.fields.title}</h2>
                <p className="text-sm">{new Date(blogPost.createdAt).toLocaleString()}</p>
              </div>
              <div className="pt-1">
                {blogPost.fields.authors.map(author => <img key={author._id} src={author.avatar} className="rounded-full aspect-square object-cover w-8 shadow-inner" />)}
              </div>
            </div>
            <div className="bg-zinc-800 grid place-items-center aspect-video object-cover shadow-inner">
              <img src={blogPost.fields.coverPhoto.url} alt="" width="" className="shadow-inner" />
            </div>
            <p>{blogPost.fields.description + '..'}</p>
            <Link href={`/blog/${blogPost.fields.url}`} className="button">Read more</Link>
          </div>
        ))}
      </div>
    </main>
  )
}