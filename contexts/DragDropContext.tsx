import React, { createContext, useContext, useState, useCallback } from 'react';
import { BlockNode, Layout, Section } from '../types';

export type DragItem = {
  type: 'block' | 'layout' | 'section';
  item: BlockNode | Layout | Section;
  sourceId: string; // ID of the container this item came from
  sourceIndex: number;
};

export type DropZone = {
  type: 'column' | 'layout' | 'section';
  id: string;
  index?: number; // Position within the drop zone
  accepts: ('block' | 'layout' | 'section')[];
};

interface DragDropContextType {
  dragItem: DragItem | null;
  isDragging: boolean;
  dragPreview: { x: number; y: number } | null;
  activeDropZone: string | null;
  
  startDrag: (item: DragItem, initialPosition: { x: number; y: number }) => void;
  updateDragPosition: (position: { x: number; y: number }) => void;
  setActiveDropZone: (zoneId: string | null) => void;
  endDrag: () => void;
  
  // Drop handlers
  onDrop: ((dragItem: DragItem, dropZone: DropZone) => void) | null;
  setDropHandler: (handler: (dragItem: DragItem, dropZone: DropZone) => void) => void;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: React.ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [dragItem, setDragItem] = useState<DragItem | null>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number } | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [onDrop, setOnDrop] = useState<((dragItem: DragItem, dropZone: DropZone) => void) | null>(null);

  const startDrag = useCallback((item: DragItem, initialPosition: { x: number; y: number }) => {
    setDragItem(item);
    setDragPreview(initialPosition);
  }, []);

  const updateDragPosition = useCallback((position: { x: number; y: number }) => {
    setDragPreview(position);
  }, []);

  const endDrag = useCallback(() => {
    setDragItem(null);
    setDragPreview(null);
    setActiveDropZone(null);
  }, []);

  const setDropHandler = useCallback((handler: (dragItem: DragItem, dropZone: DropZone) => void) => {
    setOnDrop(() => handler);
  }, []);

  const value: DragDropContextType = {
    dragItem,
    isDragging: dragItem !== null,
    dragPreview,
    activeDropZone,
    startDrag,
    updateDragPosition,
    setActiveDropZone,
    endDrag,
    onDrop,
    setDropHandler,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};