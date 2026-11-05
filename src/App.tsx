import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Layout } from './components/Layout';
import { CartProvider } from './lib/CartProvider';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const page = (load: () => Promise<{ default: ComponentType }>) => {
  const C = lazy(load);
  return (
    <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
      <C />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: page(() => import('./pages/Shop')) },
      { path: 'shop/:slug', element: page(() => import('./pages/Product')) },
      { path: 'cart', element: page(() => import('./pages/Cart')) },
      { path: 'checkout/success', element: page(() => import('./pages/CheckoutSuccess')) },
      { path: 'fuel-log', element: page(() => import('./pages/FuelLog')) },
      // Old tracker URL
      { path: 'tracker', element: page(() => import('./pages/FuelLog')) },
      { path: 'about', element: page(() => import('./pages/About')) },
      { path: 'faq', element: page(() => import('./pages/Faq')) },
      { path: 'contact', element: page(() => import('./pages/Contact')) },
      { path: 'privacy', element: page(() => import('./pages/Legal').then((m) => ({ default: m.Privacy }))) },
      { path: 'terms', element: page(() => import('./pages/Legal').then((m) => ({ default: m.Terms }))) },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
