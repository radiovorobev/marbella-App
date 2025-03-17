import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../utils/supabaseClient";

// Определяем доступные языковые коды
export enum LanguageCode {
  EN = 'en',
  ES = 'es',
  RU = 'ru'
}

// Тип для языка
export type Language = {
  code: LanguageCode;
  name: string;
  is_active: boolean;
}

// Тип для контекста
type LanguageContextType = {
  currentLanguage: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  languages: Language[];
  isLoading: boolean;
}

// Создаем контекст
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Пропсы для провайдера
type LanguageProviderProps = {
  children: ReactNode;
}

// Провайдер языкового контекста
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    // Пытаемся получить предпочтительный язык из localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    // Если есть сохраненный язык и он соответствует LanguageCode, используем его
    if (savedLanguage && Object.values(LanguageCode).includes(savedLanguage as LanguageCode)) {
      return savedLanguage as LanguageCode;
    }
    // По умолчанию используем английский
    return LanguageCode.EN;
  });
  
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загружаем языки при монтировании компонента
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('languages')
          .select('*')
          .eq('is_active', true);
          
        if (error) throw error;
        
        // Преобразуем данные к типу Language[]
        setLanguages(
          data?.map(item => ({
            code: item.code as LanguageCode,
            name: item.name,
            is_active: item.is_active
          })) || []
        );
      } catch (error) {
        console.error('Error fetching languages:', error);
        // Установим хотя бы английский язык если запрос не удался
        setLanguages([
          { code: LanguageCode.EN, name: 'English', is_active: true }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLanguages();
  }, []);

  // Функция для смены языка
  const setLanguage = (code: LanguageCode) => {
    setCurrentLanguage(code);
    localStorage.setItem('preferredLanguage', code);
  };

  const value = {
    currentLanguage,
    setLanguage,
    languages,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования языкового контекста
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};