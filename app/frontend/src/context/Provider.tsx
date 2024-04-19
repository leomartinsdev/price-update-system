import React, { useState, useMemo, ReactNode } from 'react';
import Context from './Context';

interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  const [products, setProducts] = useState([]);

  // const values = useMemo(() => ({ products, setProducts }), [products, setProducts]);

  return <Context.Provider value={ {products, setProducts} }>{children}</Context.Provider>;
}