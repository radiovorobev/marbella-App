import { useEffect, useState } from "react";
import MediaBlock from "../../components/new/mediaBlock/mediaBlock";
import LeadText from "../../components/new/leadText/leadText";
import TextBlock from "../../components/new/textBlock/textBlock";
import { useLanguage } from "../../context/languageContext";
import { supabase } from '../../utils/supabaseClient';

import styles from './campsPage.module.css';

// Тип секции страницы
interface PageSection {
  id: number;
  component_type_id: string;
  content_en: any;
  content_es: any | null;
  content_ru: any | null;
}

// Основной компонент страницы
const NewCampsPage = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const getNewCampsPage = async () => {
      // Получаем данные страницы
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'camps')
        .single();

      if (pageError || !pageData) {
        console.error('Ошибка загрузки страницы:', pageError);
        return;
      }

      // Получаем секции страницы
      const { data: sectionData, error: sectionError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (sectionError) {
        console.error('Ошибка загрузки секций:', sectionError);
        return;
      }

      setSections(sectionData || []);
    };

    getNewCampsPage();
  }, [currentLanguage]);

  return (
    <main>
      {sections.map((section) => {
        const fullContent = section[`content_${currentLanguage}`] || section.content_en;
        const ComponentRenderer = ComponentRenderers[section.component_type_id as keyof typeof ComponentRenderers];

        if (!ComponentRenderer) {
          console.warn(`Не найден компонент для типа: ${section.component_type_id}`);
          return null;
        }

        // Для компонентов с текстом — передаём text, для остальных — весь объект
        const isTextComponent = ['lead_text', 'text_block'].includes(section.component_type_id);
        const props = isTextComponent
          ? { text: fullContent?.text || '' }
          : fullContent;

        return <ComponentRenderer key={section.id} {...props} />;
      })}
    </main>
  );
};

// Рендереры компонентов
const ComponentRenderers: Record<'media_block' | 'lead_text' | 'text_block', React.FC<any>> = {
  media_block: MediaBlock,
  lead_text: LeadText,
  text_block: TextBlock,
};

export default NewCampsPage;
