'use client';;
import * as React from 'react';

import { isEqualTags } from '@platejs/tag';
import {
  MultiSelectPlugin,
  TagPlugin,
  useSelectableItems,
  useSelectEditorCombobox,
} from '@platejs/tag/react';
import { Command as CommandPrimitive, useCommandActions } from '@udecode/cmdk';
import { Fzf } from 'fzf';
import { PlusIcon } from 'lucide-react';
import { isHotkey, KEYS } from 'platejs';
import {
  Plate,
  useEditorContainerRef,
  useEditorRef,
  usePlateEditor,
} from 'platejs/react';

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Editor, EditorContainer } from './editor';
import { TagElement } from './tag-node';

const SelectEditorContext = React.createContext(undefined);

const useSelectEditorContext = () => {
  const context = React.useContext(SelectEditorContext);

  if (!context) {
    throw new Error('useSelectEditor must be used within SelectEditor');
  }

  return context;
};

export function SelectEditor({
  children,
  defaultValue,
  items = [],
  value,
  onValueChange
}) {
  const [open, setOpen] = React.useState(false);
  const [internalValue] = React.useState(defaultValue);

  return (
    <SelectEditorContext.Provider
      value={{
        items,
        open,
        setOpen,
        value: value ?? internalValue,
        onValueChange,
      }}>
      <Command
        className="overflow-visible bg-transparent has-data-readonly:w-fit"
        shouldFilter={false}
        loop>
        {children}
      </Command>
    </SelectEditorContext.Provider>
  );
}

export function SelectEditorContent({
  children
}) {
  const { value } = useSelectEditorContext();
  const { setSearch } = useCommandActions();

  const editor = usePlateEditor({
    plugins: [MultiSelectPlugin.withComponent(TagElement)],
    value: createEditorValue(value),
  }, []);

  React.useEffect(() => {
    if (!isEqualTags(editor, value)) {
      editor.tf.replaceNodes(createEditorValue(value), {
        at: [],
        children: true,
      });
    }
  }, [editor, value]);

  return (
    <Plate
      onValueChange={({ editor }) => {
        setSearch(editor.api.string([]));
      }}
      editor={editor}>
      <EditorContainer variant="select">{children}</EditorContainer>
    </Plate>
  );
}

export const SelectEditorInput = React.forwardRef((props, ref) => {
  const editor = useEditorRef();
  const { setOpen } = useSelectEditorContext();
  const { selectCurrentItem, selectFirstItem } = useCommandActions();

  return (
    <Editor
      ref={ref}
      variant="select"
      onBlur={() => setOpen(false)}
      onFocusCapture={() => {
        setOpen(true);
        selectFirstItem();
      }}
      onKeyDown={(e) => {
        if (isHotkey('enter', e)) {
          e.preventDefault();
          selectCurrentItem();
          editor.tf.removeNodes({ at: [], empty: false, text: true });
        }
        if (isHotkey('escape', e) || isHotkey('mod+enter', e)) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      autoFocusOnEditable
      {...props} />
  );
});

export function SelectEditorCombobox() {
  const editor = useEditorRef();
  const containerRef = useEditorContainerRef();
  const { items, open, onValueChange } = useSelectEditorContext();
  const selectableItems = useSelectableItems({
    filter: fzfFilter,
    items,
  });
  const { selectFirstItem } = useCommandActions();

  useSelectEditorCombobox({ open, selectFirstItem, onValueChange });

  if (!open || selectableItems.length === 0) return null;

  return (
    <Popover open={open}>
      <PopoverAnchor virtualRef={containerRef} />
      <PopoverContent
        className="p-0 data-[state=open]:animate-none"
        style={{
          width: (containerRef.current?.offsetWidth ?? 0) + 8,
        }}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="start"
        alignOffset={-4}
        sideOffset={8}>
        <CommandList>
          <CommandGroup>
            {selectableItems.map((item) => (
              <CommandItem
                key={item.value}
                className="cursor-pointer gap-2"
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  editor.getTransforms(TagPlugin).insert.tag(item);
                }}>
                {item.isNew ? (
                  <div className="flex items-center gap-1">
                    <PlusIcon className="size-4 text-foreground" />
                    Create new label:
                    <span className="text-gray-600">"{item.value}"</span>
                  </div>
                ) : (
                  item.value
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </PopoverContent>
    </Popover>
  );
}

const createEditorValue = (value) => [
  {
    children: [
      { text: '' },
      ...(value?.flatMap((item) => [
        {
          children: [{ text: '' }],
          type: KEYS.tag,
          ...item,
        },
        {
          text: '',
        },
      ]) ?? []),
    ],
    type: KEYS.p,
  },
];

const fzfFilter = (value, search) => {
  if (!search) return true;

  const fzf = new Fzf([value], {
    casing: 'case-insensitive',
    selector: (v) => v,
  });

  return fzf.find(search).length > 0;
};

/**
 * You could replace this with import from '@/components/ui/command' + replace
 * 'cmdk' import with '@udecode/cmdk'
 */
function Command({
  className,
  ...props
}) {
  return (
    <CommandPrimitive
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className
      )}
      data-slot="command"
      {...props} />
  );
}

function CommandList({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.List
      className={cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className)}
      data-slot="command-list"
      {...props} />
  );
}

function CommandGroup({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className
      )}
      data-slot="command-group"
      {...props} />
  );
}

function CommandItem({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      data-slot="command-item"
      {...props} />
  );
}
