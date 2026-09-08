import { Config } from 'payload'

export const seed: NonNullable<Config['onInit']> = async (payload): Promise<void> => {
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@lbdluxe.digital',
      password: 'demo',
      roles: ['super-admin'],
    },
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@lbdluxe.digital',
      password: 'demo',
      roles: ['user'],
      username: 'lbdluxe',
    },
  })

  await payload.create({
    collection: 'pages',
    draft: true,
    data: {
      slug: 'home',
      title: 'Home',
    },
  })
}