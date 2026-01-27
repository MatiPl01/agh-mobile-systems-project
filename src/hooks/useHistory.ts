import type { HandPoints as ScoringResult, TileId } from '@/types/hand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const HISTORY_KEY = 'calculation-history';

export interface HistoryItem {
  id: string;
  tiles: TileId[];
  result: ScoringResult;
  timestamp: number;
}

// Simple event emitter to sync multiple hook instances
let listeners: (() => void)[] = [];
const notify = () => listeners.forEach(l => l());

const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      if (json) {
        setItems(JSON.parse(json));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    return subscribe(loadHistory);
  }, [loadHistory]);

  const addItem = useCallback(
    async (tiles: TileId[], result: ScoringResult) => {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        tiles,
        result,
        timestamp: Date.now()
      };

      try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        const currentItems: HistoryItem[] = json ? JSON.parse(json) : [];
        const newItems = [newItem, ...currentItems];
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newItems));
        notify();
        return newItem.id;
      } catch (error) {
        console.error('Failed to add history item:', error);
        return null;
      }
    },
    []
  );

  const removeItem = useCallback(async (id: string) => {
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      const currentItems: HistoryItem[] = json ? JSON.parse(json) : [];
      const newItems = currentItems.filter(item => item.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newItems));
      notify();
    } catch (error) {
      console.error('Failed to remove history item:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      notify();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, []);

  const updateItem = useCallback(
    async (id: string, tiles: TileId[], result: ScoringResult) => {
      try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        const currentItems: HistoryItem[] = json ? JSON.parse(json) : [];
        const newItems = currentItems.map(item =>
          item.id === id
            ? { ...item, tiles, result, timestamp: Date.now() }
            : item
        );
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newItems));
        notify();
      } catch (error) {
        console.error('Failed to update history item:', error);
      }
    },
    []
  );

  const getItem = useCallback(
    (id: string): HistoryItem | undefined => {
      return items.find(item => item.id === id);
    },
    [items]
  );

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    updateItem,
    clearHistory,
    getItem,
    refresh: loadHistory
  };
}
