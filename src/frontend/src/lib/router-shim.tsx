/**
 * Thin compatibility shim that maps react-router-dom APIs to
 * browser-native history + React state so the project compiles
 * without the react-router-dom package.
 *
 * Only the subset used in this project is implemented:
 *   BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate
 */

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ─── Context ────────────────────────────────────────────────────────────────

interface RouterState {
  pathname: string;
  navigate: (to: string | number) => void;
}

const RouterContext = createContext<RouterState>({
  pathname: "/",
  navigate: () => {},
});

// ─── BrowserRouter ───────────────────────────────────────────────────────────

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  const navigate = useCallback((to: string | number) => {
    if (typeof to === "number") {
      window.history.go(to);
    } else {
      window.history.pushState(null, "", to);
      setPathname(to);
    }
  }, []);

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useLocation() {
  const { pathname } = useContext(RouterContext);
  return { pathname };
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate as (to: string | number) => void;
}

// ─── Routes / Route ──────────────────────────────────────────────────────────

interface RouteProps {
  path: string;
  element: ReactNode;
}

interface RoutesProps {
  children: ReactNode;
}

export function Routes({ children }: RoutesProps) {
  const { pathname } = useContext(RouterContext);

  const childArray = Array.isArray(children) ? children : [children];

  // Find first matching Route
  for (const child of childArray) {
    if (!child || typeof child !== "object" || !("props" in child)) continue;
    const props = (child as { props: RouteProps }).props;
    if (matchPath(props.path, pathname)) {
      return <>{props.element}</>;
    }
  }
  return null;
}

export function Route(_props: RouteProps) {
  // Route is only a descriptor; rendering is handled by Routes
  return null;
}

function matchPath(pattern: string, pathname: string): boolean {
  if (pattern === "*") return true;
  if (pattern === pathname) return true;
  // simple wildcard: /foo/* matches /foo/bar
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2);
    return pathname.startsWith(`${base}/`) || pathname === base;
  }
  return false;
}

// ─── Navigate ────────────────────────────────────────────────────────────────

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    if (replace) {
      window.history.replaceState(null, "", to);
      // Trigger re-render via a custom event since replaceState doesn't fire popstate
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      navigate(to);
    }
  }, [to, replace, navigate]);
  return null;
}

// ─── Link ────────────────────────────────────────────────────────────────────

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  children: ReactNode;
}

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only intercept plain left-clicks without modifier keys
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      navigate(to);
      onClick?.(e);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
