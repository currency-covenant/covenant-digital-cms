import * as migration_20260619_add_missing_locked_docs_columns from './20260619_add_missing_locked_docs_columns';

export const migrations = [
  {
    up: migration_20260619_add_missing_locked_docs_columns.up,
    down: migration_20260619_add_missing_locked_docs_columns.down,
    name: '20260619_add_missing_locked_docs_columns',
  },
];
