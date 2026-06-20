import * as migration_20260619_add_missing_locked_docs_columns from './20260619_add_missing_locked_docs_columns';
import * as migration_20260620_125822 from './20260620_125822';

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
];
