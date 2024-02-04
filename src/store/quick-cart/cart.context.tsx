import React, { useCallback } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import {
  Item,
  getItem,
  inStock,
  addItemWithQuantity,
  removeItemOrQuantity,
  removeItem,
} from './cart.utils';
import { useLocalStorage } from '@/lib/use-local-storage';
import { CART_KEY } from '@/lib/constants';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useServerCart } from '@/framework/cart';
import { CartItem } from '@/types';
interface CartProviderState extends State {
  addItemsToCart: (items: Item[]) => void;
  addItemToCart: (item: Item, quantity: number) => void;
  removeItemFromCart: (id: Item['id']) => void;
  clearItemFromCart: (id: Item['id']) => void;
  getItemFromCart: (id: Item['id']) => any | undefined;
  isInCart: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetCart: () => void;
  updateCartLanguage: (language: string) => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return React.useMemo(() => context, [context]);
};

export const CartProvider: React.FC = (props) => {
  const { updateCart } = useServerCart();

  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    cartReducer,
    savedCart ? JSON.parse(savedCart) : initialState
  );
  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  React.useEffect(() => {
    emptyVerifiedResponse(null);
  }, [emptyVerifiedResponse, state]);

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const updateCarts = useCallback((items: Item[]) => {
    updateCart({
      carts: items.map((e) => {
        return {
          product_id: e.id,
          quantity: e.quantity,
        } as CartItem;
      }),
    }).then((response) => {
      const { data } = response;

      dispatch({
        type: 'SYNC_CART',
        items: items.map((item) => {
          const cartResponse = data.find((i) => i.product_id === item.id);
          if (cartResponse) item.cart_id = cartResponse?.id;
          console.log(item);
          return item;
        }),
      });
    });
  }, []);

  const addItemsToCart = (items: Item[]) => updateCarts(items);
  const addItemToCart = (item: Item, quantity: number) => {
    const items = addItemWithQuantity(state.items, item, quantity);

    updateCarts(items);
  };
  const removeItemFromCart = (id: Item['id']) => {
    const items = removeItemOrQuantity(state.items, id, 1);

    updateCarts(items);
  };
  const clearItemFromCart = (id: Item['id']) => {
    const items = removeItem(state.items, id);

    updateCarts(items);
  };
  const isInCart = useCallback(
    (id: Item['id']) => !!getItem(state.items, id),
    [state.items]
  );
  const getItemFromCart = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items]
  );
  const isInStock = useCallback(
    (id: Item['id']) => inStock(state.items, id),
    [state.items]
  );
  const updateCartLanguage = (language: string) =>
    dispatch({ type: 'UPDATE_CART_LANGUAGE', language });
  const resetCart = () => {
    updateCarts([]);

    dispatch({ type: 'RESET_CART' });
  };
  const value = React.useMemo(
    () => ({
      ...state,
      addItemsToCart,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      isInCart,
      isInStock,
      resetCart,
      updateCartLanguage,
    }),
    [getItemFromCart, isInCart, isInStock, state]
  );
  return <cartContext.Provider value={value} {...props} />;
};
