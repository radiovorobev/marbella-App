import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertToRaw, 
  convertFromHTML, 
  ContentState,
  AtomicBlockUtils,
  Modifier,
  CompositeDecorator
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';

interface DraftEditorProps {
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
}

// Функция для конвертации HTML в состояние редактора
const htmlToEditorState = (html: string): EditorState => {
  if (!html || html === '<p><br></p>' || html === '<p></p>') {
    return EditorState.createEmpty();
  }
  
  const blocksFromHTML = convertFromHTML(html);
  const contentState = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  
  return EditorState.createWithContent(contentState);
};

// Функция для конвертации состояния редактора в HTML
const editorStateToHtml = (editorState: EditorState): string => {
  const contentState = editorState.getCurrentContent();
  return stateToHTML(contentState);
};

// Компонент кнопки для панели инструментов
const StyleButton = ({ active, label, style, onToggle }: any) => {
  return (
    <button
      className={`px-2 py-1 mr-1 text-sm rounded ${active ? 'bg-gray-300' : 'bg-gray-100'}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
    >
      {label}
    </button>
  );
};

// Панель инструментов для форматирования
const BlockStyleControls = ({ editorState, onToggle }: any) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
  ];

  return (
    <div className="inline-block mb-2 mr-4">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

// Панель инструментов для стилей текста
const InlineStyleControls = ({ editorState, onToggle }: any) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Strikethrough', style: 'STRIKETHROUGH' },
  ];

  return (
    <div className="inline-block mb-2">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const DraftEditor = forwardRef<Editor | null, DraftEditorProps>(
  ({ 
    readOnly = false, 
    value = '', 
    onChange,
    label,
    required = false 
  }, ref) => {
    const [editorState, setEditorState] = useState(() => 
      htmlToEditorState(value)
    );
    
    const editorRef = useRef<Editor>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Обновление состояния редактора
    const handleEditorChange = (state: EditorState) => {
      setEditorState(state);
      
      if (onChange) {
        const html = editorStateToHtml(state);
        onChange(html);
      }
    };

    // Обработка клавиатурных команд
    const handleKeyCommand = (command: string, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      
      if (newState) {
        handleEditorChange(newState);
        return 'handled';
      }
      
      return 'not-handled';
    };

    // Применение стилей блока
    const toggleBlockType = (blockType: string) => {
      handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
    };

    // Применение инлайн-стилей
    const toggleInlineStyle = (inlineStyle: string) => {
      handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };

    // Фокус на редактор
    const focusEditor = () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    };

    // Обновление состояния при изменении props
    useEffect(() => {
      if (value) {
        const newEditorState = htmlToEditorState(value);
        const currentHtml = editorStateToHtml(editorState);
        
        // Обновляем состояние только если HTML отличается
        if (value !== currentHtml) {
          setEditorState(newEditorState);
        }
      }
    }, [value]);

    // Передача ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(editorRef.current);
        } else if (ref && 'current' in ref) {
          ref.current = editorRef.current;
        }
      }
      
      return () => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(null);
          } else if (ref && 'current' in ref) {
            ref.current = null;
          }
        }
      };
    }, [ref, editorRef.current]);

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div ref={containerRef} className="draft-editor-container">
          {!readOnly && (
            <div className="draft-editor-controls bg-gray-50 p-2 border border-gray-300 rounded-t">
              <BlockStyleControls
                editorState={editorState}
                onToggle={toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={toggleInlineStyle}
              />
            </div>
          )}
          
          <div 
            className={`draft-editor-wrapper p-2 border ${!readOnly ? 'border-t-0 rounded-b' : 'rounded'} border-gray-300 min-h-[150px] bg-white`}
            onClick={focusEditor}
          >
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={handleEditorChange}
              handleKeyCommand={handleKeyCommand}
              placeholder="Введите текст..."
              readOnly={readOnly}
              spellCheck={true}
            />
          </div>
        </div>
        
        {required && (!value || value === '<p><br></p>' || value === '<p></p>') && (
          <p className="text-red-500 text-xs mt-1">Это поле обязательно</p>
        )}
      </div>
    );
  }
);

DraftEditor.displayName = 'DraftEditor';

export default DraftEditor;