import { createContext, useState } from "react";

export const TagContext = createContext();

export const TagProvider = ({ children }) => {
  const [selectedTagsFilter, setSelectedTagsFilter] = useState({});
  const [selectedTagsSort, setSelectedTagsSort] = useState({});
  
  return (
    <TagContext.Provider value={{ selectedTagsFilter, setSelectedTagsFilter, selectedTagsSort, setSelectedTagsSort }} >
      {children}
    </TagContext.Provider>
  );
};
