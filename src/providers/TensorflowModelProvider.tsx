import { ReactNode, createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';

// Provides a single TensorFlow Lite model instance to the entire app
const TensorflowModelContext = createContext<ReturnType<
  typeof useTensorflowModel
> | null>(null);

type TensorflowModelProviderProps = {
  children: ReactNode;
};

export function TensorflowModelProvider({
  children
}: TensorflowModelProviderProps) {
  const delegate = Platform.OS === 'ios' ? 'core-ml' : undefined;
  const model = useTensorflowModel(require('@/assets/model.tflite'), delegate);

  return (
    <TensorflowModelContext.Provider value={model}>
      {children}
    </TensorflowModelContext.Provider>
  );
}

export function useTensorflowModelInstance() {
  const context = useContext(TensorflowModelContext);

  if (!context) {
    throw new Error(
      'useTensorflowModelInstance must be used within a TensorflowModelProvider'
    );
  }

  return context;
}
