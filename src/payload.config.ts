import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Products } from "./collections/Products";
import { Works } from "./collections/Works";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Tenants } from "./collections/Tenants";
import Users from "./collections/Users";
import { APIKeys } from "./collections/APIKeys";
import { Webhooks } from "./collections/Webhooks";
import { AuditLogs } from "./collections/AuditLogs";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { s3Storage } from "@payloadcms/storage-s3";
import { isSuperAdmin } from "./access/isSuperAdmin";
import { hasTenantPermission } from "./access/hasTenantPermission";
import type { Config } from "./payload-types";
import { getUserTenantIDs } from "./utilities/getUserTenantIDs";
import { plugins } from "./plugins";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Posts, Products, Works, Media, Categories, Users, Tenants, APIKeys, Webhooks, AuditLogs],
  // db: mongooseAdapter({
  //   url: process.env.DATABASE_URL as string,
  // }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
  }),
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
  secret: process.env.PAYLOAD_SECRET as string,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
  ],
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
  ],
  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET!,
      config: {
        region: process.env.S3_REGION!,
        endpoint: `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
      collections: {
        media: {
          prefix: "media",
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${prefix ? prefix + '/' : ''}${filename}`,
        },
      },
    }),
    multiTenantPlugin<Config>({
      collections: {
        pages: {
          accessResultOverride: ({ accessResult, req }: { accessResult: any; req: any }) =>
            hasTenantPermission({ req, collectionSlug: 'pages', accessResult }),
        },
        posts: {
          accessResultOverride: ({ accessResult, req }: { accessResult: any; req: any }) =>
            hasTenantPermission({ req, collectionSlug: 'posts', accessResult }),
        },
        products: {
          accessResultOverride: ({ accessResult, req }: { accessResult: any; req: any }) =>
            hasTenantPermission({ req, collectionSlug: 'products', accessResult }),
        },
        works: {
          accessResultOverride: ({ accessResult, req }: { accessResult: any; req: any }) =>
            hasTenantPermission({ req, collectionSlug: 'works', accessResult }),
        },
        media: {
          accessResultOverride: ({ accessResult, req }: { accessResult: any; req: any }) =>
            hasTenantPermission({ req, collectionSlug: 'media', accessResult }),
        },
        categories: {
          accessResultOverride: ({ accessResult, req }: { accessResult: any; req: any }) =>
            hasTenantPermission({ req, collectionSlug: 'categories', accessResult }),
        },
      },
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true;
            }
            return getUserTenantIDs(req.user).length > 0;
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    ...plugins,
  ],
});
