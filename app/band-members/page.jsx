import { MongoClient } from "mongodb"

export const revalidate = 120

export const metadata = {
  title: 'Band Members - Primordial Atrocity',
  description: 'Our lineup',
}

async function getBandMembers() {
  const mongo = new MongoClient(process.env.MONGO_URI)
  let bandMembers = []

  try {
    await mongo.connect()
    const client = mongo.db('VarialCMS')

    const bandMemberModel = await client.collection('content_models').findOne({ 'name.plural': 'band-members' })

    for await (let member of client.collection('contents').find({ contentModel: bandMemberModel._id })) {
      if (member.published) {
        bandMembers.push(member)
      }
    }

    await mongo.close()
  } catch (error) {
    console.error('Error fetching band members:', error)
  }

  return [...bandMembers].sort((a, b) => new Date(b.fields.startDate) - new Date(a.fields.startDate))
}

export default async function BandMembersPage() {
  const bandMembers = await getBandMembers()

  console.log(bandMembers)
  return (
    <main className="grid min-h-full place-items-center p-5 py-16 lg:py-24">
      <div className="bg-zinc-900 p-5 grid gap-5">
        <h1 className="text-center">Band Members</h1>
        <div className="flex flex-col lg:flex-row gap-2.5">
          {bandMembers.map(member => (
            <div key={member._id} className="p-5 bg-zinc-800 text-center grid gap-2.5">
              <img src={member.fields.coverPhoto.url} alt={member.fields.coverPhoto.alt} width={350} className="" />
              <h2>{member.fields.name}</h2>
              <p className="text-sm italic">Joined {new Date(member.fields.startDate).toLocaleDateString()}</p>
              {member.fields.bio && <p>{member.fields.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}