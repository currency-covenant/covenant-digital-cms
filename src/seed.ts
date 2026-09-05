import { Config } from 'payload'

export const seed: NonNullable<Config['onInit']> = async (payload): Promise<void> => {
  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Lbdluxe',
      slug: 'lbdluxe',
      domain: 'lbdluxe.localhost',
    },
  })

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
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant.id,
        },
      ],
      username: 'lbdluxe',
    },
  })

  await payload.create({
    collection: 'pages',
    draft: true,
    data: {
      slug: 'home',
      tenant: tenant.id,
      title: 'Home',
    },
  })
}