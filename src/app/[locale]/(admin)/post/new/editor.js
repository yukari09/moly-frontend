'use client'; 

import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';

import Header from '@editorjs/header';
import List from '@editorjs/list';

const EDITOR_TOOLS = {
  header: Header,
  list: List
};

const EditorComponent = ({ holder, onDataChange, className, placeholder, editorRef }) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: holder,
        placeholder: placeholder,
        tools: EDITOR_TOOLS,
        onChange: async () => {
          // Clear any pending timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Set a new timeout to debounce the save
          timeoutRef.current = setTimeout(async () => {
            try {
              const data = await editor.saver.save();
              onDataChange(data);
            } catch (error) {
              console.error('Error saving editor data:', error);
            }
          }, 50);
        },
      });
      editorRef.current = editor;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [holder, onDataChange, placeholder, editorRef]);

  return <div id={holder} className={className} />;
};

export default EditorComponent;