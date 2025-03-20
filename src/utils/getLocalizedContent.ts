interface MultiLanguageItem {
  [key: string]: any;
}

const getLocalizedContent = <T extends MultiLanguageItem>(
  item: T | null | undefined,
  baseKey: string,
  language: string,
  fallback: string = ''
): string => {
  if (!item) return fallback;
  
  const fieldKey = `${baseKey}_${language}`;
  const fallbackKey = `${baseKey}_en`;
  
  return (item[fieldKey] as string) || (item[fallbackKey] as string) || fallback;
};

export default getLocalizedContent;