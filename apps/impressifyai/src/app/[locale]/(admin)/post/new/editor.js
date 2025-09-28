'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getCsrfToken } from 'next-auth/react';
import EditorJS from '@editorjs/editorjs';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image'; // Import the base tool
import List from '@editorjs/list';
import Quote from '@editorjs/quote';

// As per your suggestion, extend the image tool to enhance the image removal lifecycle.
class CustomImage extends ImageTool {
  removed() {
    // Access the image block's file data, which we received from our upload API.
    const fileData = this._data?.file;

    if (fileData && fileData.id && fileData.s3Key) {
      console.log('Image removed, triggering deletion for:', fileData);

      // Fire-and-forget API call to the backend to delete the attachment and S3 object.
      // We don't need to wait for the response here, as the user has already
      // seen the image disappear from the editor. We'll handle errors silently in the console.
      fetch('/api/admin/posts/delete-attachment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: fileData.id,
          s3Key: fileData.s3Key,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Successfully deleted attachment:', fileData.id);
        } else {
          console.error('Failed to delete attachment:', data.message);
        }
      })
      .catch(error => {
        console.error('Error calling delete-attachment API:', error);
      });
    } else {
        console.warn('Image removed, but no file data found to delete.', this._data);
    }
  }
}

const EditorComponent = ({ holder, onDataChange, className, placeholder, editorRef, initialData }) => {
  const timeoutRef = useRef(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCsrfToken();
      if (token) {
        setCsrfToken(token);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!csrfToken || editorRef.current) {
      return;
    }

    const EDITOR_TOOLS = {
      table: Table,
      embed: Embed,
      code: CodeTool,
      header: {
        class: Header,
        inlineToolbar: true,
      },
      image: {
        class: CustomImage, // Use our new CustomImage class
        config: {
          additionalRequestHeaders: {
            'x-csrf-token': csrfToken,
          },
          endpoints: {
            byFile: '/api/admin/posts/upload',
            byUrl: '/api/admin/posts/fetch-url',
          },
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered',
        },
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: "Quote's author",
        },
      },
    };

    const editor = new EditorJS({
      holder: holder,
      placeholder: placeholder,
      tools: EDITOR_TOOLS,
      data: initialData,
      onChange: async () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
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

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [csrfToken, holder, onDataChange, placeholder, editorRef]);

  return <div id={holder} className={className} />;
};

export default EditorComponent;