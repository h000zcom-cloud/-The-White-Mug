import { createContext } from "react";

/**
 * ReserveCtx.Provider = (itemName?: string) => void  — opens the reservation
 * dialog with an optional pre-selected menu item context.
 * Components anywhere in the tree can call it via useContext(ReserveCtx).
 */
export const ReserveCtx = createContext(null);
