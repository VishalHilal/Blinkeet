import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const DisplayTable = ({ data, column }) => {
  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 overflow-auto rounded-lg border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-800 text-xs uppercase tracking-wide">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              <th className="border px-3 py-2 font-medium">Sr. No</th>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="border px-3 py-2 font-medium whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-gray-700">
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="border px-3 py-2">{index + 1}</td>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="border px-3 py-2 whitespace-nowrap"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  )
}

export default DisplayTable
