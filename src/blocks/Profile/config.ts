import type { Block } from 'payload'

export const Profile: Block = {
  slug: 'profile',
  interfaceName: 'ProfileBlock',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Display Name',
    },
    {
      name: 'words',
      type: 'array',
      required: true,
      label: 'Typewriter Words',
      labels: {
        plural: 'Words',
        singular: 'Word',
      },
      fields: [
        {
          name: 'word',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Bio Description',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Image',
    },
  ],
  labels: {
    plural: 'Profiles',
    singular: 'Profile',
  },
}
