import { Hand, HandPoints } from '@/types/hand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const HISTORY_KEY = 'calculation-history-2';

export type HistoryItem = {
  id: string;
  hand: Hand;
  result: HandPoints;
  timestamp: number;
};

// Storage helpers
const getStoredItems = async (): Promise<HistoryItem[]> => {
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  return json ? JSON.parse(json) : [];
};

const saveItems = (items: HistoryItem[]) =>
  AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));

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
      setItems(await getStoredItems());
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

  const addItem = useCallback(async (hand: Hand, result: HandPoints) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      hand,
      result,
      timestamp: Date.now()
    };
    try {
      const currentItems = await getStoredItems();
      await saveItems([newItem, ...currentItems]);
      notify();
      return newItem.id;
    } catch (error) {
      console.error('Failed to add history item:', error);
      return null;
    }
  }, []);

  const removeItem = useCallback(async (id: string) => {
    try {
      const currentItems = await getStoredItems();
      await saveItems(currentItems.filter(item => item.id !== id));
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
    async (id: string, hand: Hand, result: HandPoints) => {
      try {
        const currentItems = await getStoredItems();
        await saveItems(
          currentItems.map(item =>
            item.id === id
              ? { ...item, hand, result, timestamp: Date.now() }
              : item
          )
        );
        notify();
      } catch (error) {
        console.error('Failed to update history item:', error);
      }
    },
    []
  );

  const getItem = useCallback(
    (id: string) => items.find(item => item.id === id),
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
