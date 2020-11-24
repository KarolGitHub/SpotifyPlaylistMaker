import React from 'react';
import classes from './Filters.module.scss';

export type CellProps = {
  row: any;
  rows: any;
  toggleRowExpanded: any;
};

type ColumnProps = {
  column: {
    filterValue: any;
    setFilter: any;
    preFilteredRows: { length: number };
  };
};

type FilterProps = {
  column: any;
};

export const ColumnFilter = ({ column }: ColumnProps) => (
  <input
    className={classes.Input}
    value={column.filterValue || ''}
    onChange={(e) => {
      column.setFilter(e.target.value || undefined);
    }}
    placeholder={`search (${column.preFilteredRows.length}) ...`}
  />
);

export const Filter = ({ column }: FilterProps) => {
  return <div>{column.canFilter && column.render('Filter')}</div>;
};
