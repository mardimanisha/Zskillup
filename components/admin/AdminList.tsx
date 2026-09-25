"use client";

/** Shared list table used by the Blog/Events/Testimonials admin pages. */
export function AdminListTable<T>({
  items,
  columns,
  onEdit,
  onDelete,
  keyField,
  emptyLabel = "Nothing here yet.",
}: {
  items: T[];
  columns: { header: string; render: (item: T) => React.ReactNode }[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  keyField: (item: T) => string;
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return <p className="rounded-md border border-dashed border-neutral-300 p-6 text-sm text-neutral-400">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            {columns.map((c) => (
              <th key={c.header} className="whitespace-nowrap px-4 py-2.5 font-medium">
                {c.header}
              </th>
            ))}
            <th className="px-4 py-2.5 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={keyField(item)} className="border-b border-neutral-100 last:border-0">
              {columns.map((c) => (
                <td key={c.header} className="px-4 py-2.5 align-top">
                  {c.render(item)}
                </td>
              ))}
              <td className="whitespace-nowrap px-4 py-2.5 align-top">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="mr-3 font-medium text-neutral-700 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
