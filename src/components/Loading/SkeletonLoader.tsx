

export const SkeletonCard = () => (
  <div className="bg-surface-container-lowest p-8 rounded-xl animate-pulse">
    <div className="h-10 w-10 bg-surface-container rounded-full mb-4"></div>
    <div className="h-4 w-24 bg-surface-container rounded mb-4"></div>
    <div className="h-8 w-32 bg-surface-container rounded mb-6"></div>
    <div className="h-px bg-surface-container/50 my-6"></div>
    <div className="h-3 w-40 bg-surface-container rounded"></div>
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="hover:bg-surface-container-low/50 animate-pulse">
    <td className="px-8 py-6">
      <div className="h-4 w-20 bg-surface-container rounded"></div>
      <div className="h-3 w-16 bg-surface-container rounded mt-2"></div>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-container"></div>
        <div className="h-4 w-24 bg-surface-container rounded"></div>
      </div>
    </td>
    <td className="px-8 py-6">
      <div className="h-6 w-16 bg-surface-container rounded-full"></div>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="h-6 w-20 bg-surface-container rounded ml-auto"></div>
    </td>
  </tr>
);

export const SkeletonWealthTiles = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
    <table className="w-full border-collapse">
      <thead className="bg-surface-container-low">
        <tr>
          <th className="px-8 py-5 h-4 bg-surface-container/50"></th>
          <th className="px-8 py-5 h-4 bg-surface-container/50"></th>
          <th className="px-8 py-5 h-4 bg-surface-container/50"></th>
          <th className="px-8 py-5 h-4 bg-surface-container/50"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container-low">
        {[...Array(5)].map((_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </tbody>
    </table>
  </div>
);
