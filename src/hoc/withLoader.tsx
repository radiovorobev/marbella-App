import React, { useState, useEffect } from 'react';
import Loader from '../components/loader/loader';

interface WithLoaderOptions {
  size?: 'small' | 'medium' | 'large';
  minLoadingTime?: number;
  placeholder?: React.ReactNode;
}

/**
 * HOC для добавления анимации загрузки к компоненту.
 * Лоадер отображается на месте компонента, а не поверх всей страницы.
 * 
 * @param Component Компонент, к которому добавляется лоадер
 * @param options Опции настройки лоадера
 * @returns Компонент с добавленной анимацией загрузки
 */
const withLoader = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithLoaderOptions = {}
) => {
  const {
    size = 'medium',
    minLoadingTime = 1500,
    placeholder = null
  } = options;

  return (props: P) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, minLoadingTime);

      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      // Если передан пользовательский placeholder, используем его
      if (placeholder) {
        return <>{placeholder}</>;
      }
      // Иначе используем стандартный лоадер
      return <Loader size={size} />;
    }

    return <Component {...props} />;
  };
};

export default withLoader;