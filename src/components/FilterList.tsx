// components/FilteredList.tsx
import React from "react";

type FilteredListProps<T> = {
  items: T[];
  filterFunction?: (item: T) => boolean;
  renderItem: (item: T) => React.ReactNode;
};

function FilteredList<T>({
  items,
  filterFunction,
  renderItem,
}: FilteredListProps<T>) {
  const filteredItems = filterFunction ? items.filter(filterFunction) : items;

  return <>{filteredItems.map(renderItem)}</>;
}

export default FilteredList;

// ------ Without TypeScript ---------

// import React from 'react';

// const FilteredList = ({ items, filterFunction, renderItem }) => {
//   const filteredItems = filterFunction
//     ? items.filter(filterFunction)
//     : items;

//   return (
//     <ul>
//       {filteredItems.map((item, index) => (
//         <li key={index}>{renderItem(item)}</li>
//       ))}
//     </ul>
//   );
// };

// export default FilteredList;
