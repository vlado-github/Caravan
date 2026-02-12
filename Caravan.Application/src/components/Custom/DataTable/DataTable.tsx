import { Button } from "@mantine/core";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { type ReactElement } from "react";
import type { PagedViewModel } from "../../Paging/PagedViewModel";
import type { DataTableSearch } from "./DataTableSearch";
import { DefaultConsts } from "../../../consts/DefaultConsts";
import { functionalUpdate, useNavigate } from "@tanstack/react-router";
import styles from './DataTable.module.scss'

type DataTableProps<T> = {
  model: PagedViewModel<T>;
  actions?: ReactElement;
  search: DataTableSearch | null;
  columns: ColumnDef<T, unknown>[];
}

const DataTable = <T extends object>({model, actions, search, columns} : DataTableProps<T>) => {
  const navigate = useNavigate();

  const table = useReactTable({
    data: model.items,
    columns: columns,
    state: { 
      pagination :{
        pageIndex: search?.start ? search.start - 1 : DefaultConsts.FirstPageIndex - 1,
        pageSize: search?.size ?? DefaultConsts.RowsPerPage,
      }
    },
    manualPagination: true,
    pageCount: model.pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const data = functionalUpdate(updater, {
        pageIndex: search?.start ? search.start - 1 : DefaultConsts.FirstPageIndex - 1,
        pageSize: search?.size ? search.size : DefaultConsts.RowsPerPage
      });
      navigate({
        to: '.', 
        search: {
          ...search,
          start: ++data.pageIndex,
          size: data.pageSize,
        }
      });
    }
  });

  return (
    <>
      {actions}
      <table className={styles.dataTable}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.dataTablePagination}>
        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </Button>
        <Button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </Button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default DataTable;