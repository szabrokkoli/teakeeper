// useFilteredTeas.js
import { useMemo } from 'react';

export function useFilteredTeas(teas, { search, category, origin, selectedTag, lang }) {
  return useMemo(() => {
    return teas.filter(tea => {
      const teaName = tea.name[lang] || "";
      const teaDesc = tea.description?.[lang] || "";

      const matchesSearch =
        teaName.toLowerCase().includes(search.toLowerCase()) ||
        teaDesc.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category ? (tea.tea_categories?.name === category) : true;
      const matchesOrigin = origin ? (tea.origin[lang]?.toLowerCase().includes(origin.toLowerCase())) : true;
      const matchesTag = selectedTag 
        ? tea.tea_tags?.some(relation => relation.tag.name[lang] === selectedTag)
        : true;

      return matchesSearch && matchesCategory && matchesOrigin && matchesTag;
    });
  }, [teas, search, category, origin, selectedTag, lang]);
}
