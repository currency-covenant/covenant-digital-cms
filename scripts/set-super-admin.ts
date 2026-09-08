import { getPayload } from 'payload'

import config from '../src/payload.config'

const emails = (process.argv[2] ?? 'admin@currencycovenant.com')
  .split(',')
  .map((e) => e.trim())

const payload = await getPayload({ config })

for (const email of emails) {
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  const user = docs[0]
  if (!user) {
    console.error(`No user found with email "${email}"`)
    process.exitCode = 1
    continue
  }
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { roles: ['super-admin'] },
  })
  console.log(`Set roles ['super-admin'] on ${email} (${user.id})`)
}