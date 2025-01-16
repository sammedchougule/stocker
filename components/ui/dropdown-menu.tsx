// components/ui/dropdown-menu.tsx
import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  children: ReactNode;
}

interface DropdownMenuTriggerProps {
    children: ReactNode;
  }

interface DropdownMenuContentProps {
    children: ReactNode;
  }

interface DropdownMenuItemProps {
  children: ReactNode;
  onSelect: () => void;
}
export function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {children}
    </Menu>
  );
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
    return (
      <Menu.Button className="inline-flex justify-center w-full text-sm font-medium focus:outline-none">
        {children}
      </Menu.Button>
    );
  }

  export function DropdownMenuContent({ children }: DropdownMenuContentProps) {
    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                    {children}
                </div>
            </Menu.Items>
        </Transition>

    );
  }


export function DropdownMenuItem({
    children,
    onSelect
  }: DropdownMenuItemProps) {
  return (
    <Menu.Item>
        {({ active }) => (
            <button
                onClick={onSelect}
                className={cn(
                    'block w-full px-4 py-2 text-left text-sm',
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                )}
            >
                {children}
            </button>
        )}
    </Menu.Item>
  );
}