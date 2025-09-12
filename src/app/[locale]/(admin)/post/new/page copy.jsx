'use client';

import { z } from 'zod';

import { Eraser, Undo, Redo } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const Editor = dynamic(() => import('./editor'), {
  ssr: false,
});

export const postForm = z.object({
  postTitle: z.string().min(3, { message: "postTitle must be at least 3 characters long" }),
  postContent: z.string().min(6, { message: "postContent must be at least 6 characters long" })
});

export default function MyPage() {
  const [editorData, setEditorData] = useState(null);
  const [undoData, setUndoData] = useState([]);
  const [redoData, setRedoData] = useState([]);
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({ postTitle: "", postContent: "" });

  const onDataChange = useCallback((data) => {
    if (editorRef.current?.isProgrammaticChange) {
        editorRef.current.isProgrammaticChange = false;
        return;
    }
    setEditorData(data);
    setUndoData(prev => [...prev, data]);
    setRedoData([]);
    setFormData({ ...formData, ["postContent"]: JSON.stringify(data) });
  }, []);

  const handleUndo = () => {
    if (undoData.length > 1) {
      // 移除最后一个状态（当前状态）
      const newUndoData = undoData.slice(0, -1);
      setUndoData(newUndoData);
      
      // 获取上一个状态
      const previousData = newUndoData[newUndoData.length - 1];
      // 将当前状态添加到重做历史
      setRedoData(prev => [editorData, ...prev]);
      // 更新当前数据
      setEditorData(previousData);

      if (editorRef.current) {
        editorRef.current.isProgrammaticChange = true;
        editorRef.current.render(previousData);
      }
    }
  }
  
  const handleRedo = () => {
    if (redoData.length > 0) {
      const [redoState, ...remainingRedo] = redoData;
      // 将重做状态添加回撤销历史
      setUndoData(prev => [...prev, redoState]);
      // 更新当前数据
      setEditorData(redoState);
      // 移除重做记录
      setRedoData(remainingRedo);

      if (editorRef.current) {
        editorRef.current.isProgrammaticChange = true;
        editorRef.current.render(redoState);
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


  return (
    <div className="h-[100vh] overflow-hidden">
        <div className="h-[64px] border-b px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Image src="/logo.svg" width="32" height="32" />
                <Button onClick={handleUndo} variant="ghost" size="sm"  disabled={undoData.length < 2}><Undo className="size-4" /></Button>
                <Button onClick={handleRedo} variant="ghost" size="sm"   disabled={redoData.length == 0}><Redo className="size-4" /></Button>
            </div>
            <div className="flex items-center">
                <Button size="sm" variant="ghost" disabled={!editorData || editorData.blocks.length == 0}>Save draft</Button>
                <Button size="sm" variant="ghost" className="mr-3" disabled={!editorData || editorData.blocks.length == 0}><Eraser className="size-4" />Clear</Button>
                <Button size="sm" disabled={!editorData || editorData.blocks.length == 0}>Public</Button>
            </div>
        </div>

        <form onSubmit={handleSubmit} onChange={handleChange}>
            <div className="flex items-top justify-between mx-auto h-[calc(100vh-4rem)]">
                <div className="flex-1 h-full overflow-y-scroll">
                    <div className="mx-auto lg:w-[840px] ">
                        <div className="w-[650px] mx-auto mt-12">
                            <textarea name="postTitle" value={formData.postTitle}  placeholder='Add a title' className="w-full !border-0 !p-0 !text-4xl font-bold field-sizing-content !outline-none break-words resize-none overflow-hidden"/>
                            <Editor holder="editor-container" placeholder="Type text or paste a link" onDataChange={onDataChange} className="pt-8 prose" editorRef={editorRef} />
                            <input type="hidden" value={JSON.stringify(formData.postContent)} name="postContent" />
                        </div>
                    </div>
                </div>
                <div className="right-0 w-[384px] h-[calc(100vh-65px)] border-l">111</div>
            </div>
        </form>
    </div>
  );
}