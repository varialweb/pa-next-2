import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({ subsets: ['latin'], weight: ['400'] })

export const metadata = {
  title: 'Video Gallery - Primordial Atrocity',
  description: 'Watch our latest videos',
}

async function getVideos() {
  let videos = []

  try {
    await fetch(`https://www.googleapis.com/youtube/v3/search?channelId=${process.env.YOUTUBE_ID}&key=${process.env.YOUTUBE_KEY}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(response => {
      videos = [...response.items]
    })
    .catch(error => console.error('Fetch error:', error))
  } catch (error) {
    console.error('Error loading videos:', error)
  }

  return [...videos]
}

export default async function VideoGalleryPage() {
  const videos = await getVideos()

  return (
    <main className="min-h-full grid place-items-center p-5 py-16 md:py-24">
      <div className="bg-zinc-900 p-5 w-full max-w-5xl grid gap-4 md:gap-8 shadow-2xl">
        <h1 className={`${metalMania.className} text-center`}>Video Gallery</h1>
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          {videos.map(video => video.id.kind === 'youtube#video' && (
            <div key={video.etag}>
              <iframe 
                width="560" 
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowfullscreen 
                className="w-full aspect-video shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}