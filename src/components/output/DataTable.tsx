export interface ColumnDef<T> {
    key: string;
    header: string;
    width?: string;
    render: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    onRowClick?: (row: T) => void;
    getRowKey: (row: T) => string | number;
}

export function DataTable<T>({ data, columns, onRowClick, getRowKey }: DataTableProps<T>) {
    return (
        <table className='min-w-full text-lg border'>
            <thead className='bg-primary border-b border-primary'>
                <tr>
                    {columns.map(col => (
                        <th
                            key={col.key}
                            scope='col'
                            className={`${col.width ?? 'w-1/5'} px-3 py-2 text-left font-medium`}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className='divide-y divide-accent'>
                {data.map(row => (
                    <tr
                        key={getRowKey(row)}
                        className='hover:bg-accent transition-colors last:border-b-0 hover:cursor-pointer'
                        onClick={() => onRowClick?.(row)}
                    >
                        {columns.map(col => (
                            <td key={col.key} className='px-3 py-2'>
                                {col.render(row)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}