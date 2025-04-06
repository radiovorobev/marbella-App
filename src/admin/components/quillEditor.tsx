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

/**
 * Функция для очистки HTML от лишних элементов Quill
 * Имитирует поведение getSemanticHTML()
 */
const getCleanHTML = (html: string): string => {
  if (!html) return '';
  
  // Создаем временный DOM-элемент для обработки HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Удаляем элементы редактора и служебные атрибуты
  const toolbars = tempDiv.querySelectorAll('.ql-toolbar');
  toolbars.forEach(toolbar => toolbar.remove());
  
  // Удаляем атрибуты, начинающиеся с 'data-' и 'ql-'
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('data-') || attr.name.startsWith('ql-')) {
        el.removeAttribute(attr.name);
      }
    });
    
    // Удаляем классы Quill
    if (el.classList) {
      Array.from(el.classList).forEach(className => {
        if (className.startsWith('ql-')) {
          el.classList.remove(className);
        }
      });
      
      // Если после очистки не осталось классов, удаляем атрибут class
      if (el.classList.length === 0) {
        el.removeAttribute('class');
      }
    }
  });
  
  return tempDiv.innerHTML;
};

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
    const editorRef = useRef<HTMLDivElement>(null);

    // Quill modules configuration
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
      // If container exists and Quill is not initialized
      if (containerRef.current && editorRef.current && !quillInstance) {
        // Create a new div for the editor
        const quill = new Quill(editorRef.current, {
          theme: 'snow',
          modules: modules,
        });

        // Set initial value
        if (value) {
          quill.root.innerHTML = value;
        }

        // Change handler
        quill.on('text-change', () => {
          if (onChange) {
            // Используем нашу функцию очистки HTML
            const cleanHTML = getCleanHTML(quill.root.innerHTML);
            onChange(cleanHTML);
          }
        });

        // Manage editing mode
        quill.enable(!readOnly);

        // Save Quill instance
        setQuillInstance(quill);

        // Set ref if provided
        if (typeof ref === 'function') {
          ref(quill);
        } else if (ref && 'current' in ref) {
          ref.current = quill;
        }
      }

      // Cleanup on unmount
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

    // Update value when value prop changes
    useEffect(() => {
      if (quillInstance && value !== quillInstance.root.innerHTML) {
        quillInstance.root.innerHTML = value || '';
      }
    }, [value, quillInstance]);

    // Update editing mode
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
        <div ref={containerRef} className="quill-container">
          <div ref={editorRef} className="bg-white"></div>
        </div>
        {required && (!value || value === '<p><br></p>') && (
          <p className="text-red-500 text-xs mt-1">This field is required</p>
        )}
      </div>
    );
  }
);

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;