"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";

const DropdownContext = createContext<{
  open: boolean;
  toggle: () => void;
  close: () => void;
}>({
  open: false,
  toggle: () => { return; },
  close: () => { return; },
});

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, toggle, close }}>
      {/* attach ref here */}
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// rest is unchanged
export function DropdownButton({ children }: { children: React.ReactNode }) {
  const { toggle } = useContext(DropdownContext);
  return (
    <button
      onClick={toggle}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      {children}
    </button>
  );
}

export function DropdownItems({ children }: { children: React.ReactNode }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;
  return (
    <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md border z-10">
      <ul className="py-1">{children}</ul>
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { close } = useContext(DropdownContext);
  const handleClick = () => {
    onClick?.();
    close(); // also close when you select an item
  };
  return (
    <li
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      {children}
    </li>
  );
}