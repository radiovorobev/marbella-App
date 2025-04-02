import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface EditorProps {
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
}

const QuillEditor = forwardRef<Quill | null, EditorProps>(
  ({ 
    readOnly = false, 
    value = '', 
    onChange,
    label,
    required = false 
  }, ref) => {
    const [quillInstance, setQuillInstance] = useState<Quill | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Конфигурация модулей Quill
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
      ],
    };

    useEffect(() => {
      // Если контейнер существует и Quill еще не инициализирован
      if (containerRef.current && !quillInstance) {
        const quill = new Quill(containerRef.current, {
          theme: 'snow',
          modules: modules,
        });

        // Установка начального значения
        if (value) {
          quill.root.innerHTML = value;
        }

        // Обработчик изменений
        quill.on('text-change', () => {
          if (onChange) {
            onChange(quill.root.innerHTML);
          }
        });

        // Управление режимом редактирования
        quill.enable(!readOnly);

        // Сохраняем экземпляр Quill
        setQuillInstance(quill);

        // Если передан ref, устанавливаем экземпляр
        if (typeof ref === 'function') {
          ref(quill);
        } else if (ref && 'current' in ref) {
          ref.current = quill;
        }
      }

      // Очистка при размонтировании
      return () => {
        if (quillInstance) {
          if (typeof ref === 'function') {
            ref(null);
          } else if (ref && 'current' in ref) {
            ref.current = null;
          }
          quillInstance.off('text-change');
        }
      };
    }, []);

    // Обновление значения при изменении пропса value
    useEffect(() => {
      if (quillInstance && value !== quillInstance.root.innerHTML) {
        quillInstance.root.innerHTML = value || '';
      }
    }, [value, quillInstance]);

    // Обновление режима редактирования
    useEffect(() => {
      if (quillInstance) {
        quillInstance.enable(!readOnly);
      }
    }, [readOnly, quillInstance]);

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div ref={containerRef} className="bg-white"></div>
        {required && (!value || value === '<p><br></p>') && (
          <p className="text-red-500 text-xs mt-1">Это поле обязательно к заполнению</p>
        )}
      </div>
    );
  }
);

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;