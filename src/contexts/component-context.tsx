
"use client";

import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import type { RailwayComponent } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, getDoc, addDoc, updateDoc, setDoc, Timestamp, GeoPoint } from 'firebase/firestore';

interface ComponentContextType {
  components: RailwayComponent[];
  loading: boolean;
  getComponentById: (id: string) => Promise<RailwayComponent | undefined>;
  addComponent: (component: Omit<RailwayComponent, 'id' | 'geoPosition' > & {id: string}) => Promise<string>;
  updateComponent: (id:string, updates: Partial<RailwayComponent>) => Promise<void>;
}

export const ComponentContext = createContext<ComponentContextType | undefined>(undefined);

const toISOStringSafe = (timestamp: Timestamp | undefined | null): string => {
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    return new Date().toISOString(); // Sensible fallback
}

export const ComponentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<RailwayComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "components"), (snapshot) => {
        const componentsData: RailwayComponent[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            componentsData.push({
                ...data,
                id: doc.id,
                installDate: toISOStringSafe(data.installDate),
                supplyDate: toISOStringSafe(data.supplyDate),
                warrantyUntil: toISOStringSafe(data.warrantyUntil),
                history: data.history?.map((h: any) => ({
                  ...h,
                  date: toISOStringSafe(h.date)
                })) || []
            } as RailwayComponent);
        });
        setComponents(componentsData);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getComponentById = useCallback(
    async (id: string): Promise<RailwayComponent | undefined> => {
        const docRef = doc(db, 'components', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                id: docSnap.id,
                installDate: toISOStringSafe(data.installDate),
                supplyDate: toISOStringSafe(data.supplyDate),
                warrantyUntil: toISOStringSafe(data.warrantyUntil),
                 history: data.history?.map((h: any) => ({
                  ...h,
                  date: toISOStringSafe(h.date)
                })) || []
            } as RailwayComponent;
        }
        return undefined;
    }, []
  );
  
  const addComponent = useCallback(
    async (component: Omit<RailwayComponent, 'id' | 'geoPosition'> & {id: string}) => {
        const { id, ...componentData } = component;
        const docRef = doc(db, 'components', id!);
        await setDoc(docRef, {
          ...componentData,
          installDate: Timestamp.fromDate(new Date(componentData.installDate)),
          supplyDate: Timestamp.fromDate(new Date(componentData.supplyDate)),
          warrantyUntil: Timestamp.fromDate(new Date(componentData.warrantyUntil)),
          history: [],
          geoPosition: componentData.geoPosition ? new GeoPoint(componentData.geoPosition.latitude, componentData.geoPosition.longitude) : null,
        });
        return id!;
    }, []
  );

  const updateComponent = useCallback(
    async (id: string, updates: Partial<RailwayComponent>) => {
        const docRef = doc(db, 'components', id);
        
        const updatesWithTimestamps: Record<string, any> = {...updates};

        if (updates.installDate) updatesWithTimestamps.installDate = Timestamp.fromDate(new Date(updates.installDate));
        if (updates.supplyDate) updatesWithTimestamps.supplyDate = Timestamp.fromDate(new Date(updates.supplyDate));
        if (updates.warrantyUntil) updatesWithTimestamps.warrantyUntil = Timestamp.fromDate(new Date(updates.warrantyUntil));
        if (updates.history) {
            updatesWithTimestamps.history = updates.history.map(h => ({
                ...h,
                date: Timestamp.fromDate(new Date(h.date))
            }));
        }
        if (updates.geoPosition && 'latitude' in updates.geoPosition && 'longitude' in updates.geoPosition) {
            updatesWithTimestamps.geoPosition = new GeoPoint(updates.geoPosition.latitude, updates.geoPosition.longitude);
        }

        await updateDoc(docRef, updatesWithTimestamps);
    }, []
  );


  return (
    <ComponentContext.Provider value={{ components, loading, getComponentById, addComponent, updateComponent }}>
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
