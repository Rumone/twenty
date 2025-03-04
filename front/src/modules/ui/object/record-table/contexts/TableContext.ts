import { createContext } from 'react';

import { FieldMetadata } from '@/ui/object/field/types/FieldMetadata';

import { ColumnDefinition } from '../types/ColumnDefinition';

export const TableContext = createContext<{
  onColumnsChange?: (
    columns: ColumnDefinition<FieldMetadata>[],
  ) => void | Promise<void>;
}>({});
