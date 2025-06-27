"use client";
import { createContext, useContext, useState } from "react";

const DropdownContext = createContext<{
  open: boolean;
  toggle: () => void;
}>({
  open: false,
  toggle: () => {
    return;
  },
});

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <DropdownContext.Provider value={{ open, toggle }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

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
};

export function DropdownItems({ children }: { children: React.ReactNode }) {
  const { open } = useContext(DropdownContext);

  if (!open) return null;

  return (
    <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md border z-10">
      <ul className="py-1">{children}</ul>
    </div>
  );
};

export function DropdownItem({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <li
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </li>
  );
};