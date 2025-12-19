import { createContext } from 'react';
import type { AppContextType } from './AppState';

export const AppContext = createContext<AppContextType | undefined>(undefined);

