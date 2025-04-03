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
            onChange(quill.root.innerHTML);
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