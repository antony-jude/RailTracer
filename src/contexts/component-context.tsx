
"use client";

import React, { createContext, useState, useCallback, useContext } from 'react';
import type { RailwayComponent } from '@/lib/types';
import { components as initialComponents } from '@/lib/data';

interface ComponentContextType {
  components: RailwayComponent[];
  getComponentById: (id: string) => RailwayComponent | undefined;
  addComponent: (component: RailwayComponent) => void;
  updateComponent: (id:string, updates: Partial<RailwayComponent>) => void;
}

export const ComponentContext = createContext<ComponentContextType | undefined>(undefined);

export const ComponentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<RailwayComponent[]>(initialComponents);

  const getComponentById = useCallback(
    (id: string): RailwayComponent | undefined => {
        return components.find(c => c.id === id);
    }, [components]
  );
  
  const addComponent = useCallback(
    (component: RailwayComponent) => {
        setComponents(prev => {
            if (prev.find(c => c.id === component.id)) {
                return prev;
            }
            return [...prev, component];
        });
    }, []
  );

  const updateComponent = useCallback(
    (id: string, updates: Partial<RailwayComponent>) => {
        setComponents(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []
  );


  return (
    <ComponentContext.Provider value={{ components, getComponentById, addComponent, updateComponent }}>
      {children}
    </ComponentContext.Provider>
  );
};

export const useComponents = () => {
    const context = useContext(ComponentContext);
    if (!context) {
        throw new Error('useComponents must be used within a ComponentProvider');
    }
    return context;
};
