import * as migration_20260619_add_missing_locked_docs_columns from './20260619_add_missing_locked_docs_columns';
import * as migration_20260620_125822 from './20260620_125822';
import * as migration_20260620_links_profile from './20260620_links_profile';
import * as migration_20260620_drop_social_links from './20260620_drop_social_links';
import * as migration_20260620_drop_links_profile_correct from './20260620_drop_links_profile_correct';
import * as migration_20260620_fix_tenants_permissions from './20260620_fix_tenants_permissions';
import * as migration_20260620_profile_links from './20260620_profile_links';

export const migrations = [
  {
    up: migration_20260619_add_missing_locked_docs_columns.up,
    down: migration_20260619_add_missing_locked_docs_columns.down,
    name: '20260619_add_missing_locked_docs_columns',
  },
  {
    up: migration_20260620_125822.up,
    down: migration_20260620_125822.down,
    name: '20260620_125822'
  },
  {
    up: migration_20260620_links_profile.up,
    down: migration_20260620_links_profile.down,
    name: '20260620_links_profile'
  },
  {
    up: migration_20260620_drop_social_links.up,
    down: migration_20260620_drop_social_links.down,
    name: '20260620_drop_social_links'
  },
  {
    up: migration_20260620_drop_links_profile_correct.up,
    down: migration_20260620_drop_links_profile_correct.down,
    name: '20260620_drop_links_profile_correct'
  },
  {
    up: migration_20260620_fix_tenants_permissions.up,
    down: migration_20260620_fix_tenants_permissions.down,
    name: '20260620_fix_tenants_permissions'
  },
  {
    up: migration_20260620_profile_links.up,
    down: migration_20260620_profile_links.down,
    name: '20260620_profile_links'
  },
];
