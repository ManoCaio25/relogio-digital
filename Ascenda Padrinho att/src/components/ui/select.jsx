import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils";

const SelectContext = React.createContext(null);
let selectIdCounter = 0;
const selectRegistry = new Map();

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within <Select>");
  }
  return context;
}

const getTextFromChildren = (children) => {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;
      if (typeof child === "number") return String(child);
      if (React.isValidElement(child)) {
        return getTextFromChildren(child.props.children);
      }
      return "";
    })
    .join(" ")
    .trim();
};

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}) {
  const [openState, setOpenState] = React.useState(defaultOpen);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? null);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [options, setOptions] = React.useState({});
  const [optionOrder, setOptionOrder] = React.useState([]);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [triggerRect, setTriggerRect] = React.useState(null);
  const triggerRef = React.useRef(null);
  const optionRefs = React.useRef(new Map());

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : openState;

  const selectIdRef = React.useRef(null);
  if (selectIdRef.current === null) {
    selectIdRef.current = `select-${++selectIdCounter}`;
  }

  const close = React.useCallback(() => {
    if (!isOpenControlled) {
      setOpenState(false);
    }
    onOpenChange?.(false);
  }, [isOpenControlled, onOpenChange]);

  React.useEffect(() => {
    selectRegistry.set(selectIdRef.current, close);
    return () => {
      selectRegistry.delete(selectIdRef.current);
    };
  }, [close]);

  const setOpen = React.useCallback(
    (nextOpen) => {
      const resolved = typeof nextOpen === "function" ? nextOpen(open) : nextOpen;
      if (resolved) {
        selectRegistry.forEach((closeFn, id) => {
          if (id !== selectIdRef.current) {
            closeFn();
          }
        });
      }
      if (!isOpenControlled) {
        setOpenState(resolved);
      }
      onOpenChange?.(resolved);
    },
    [isOpenControlled, onOpenChange, open],
  );

  const registerOption = React.useCallback((optionValue, label) => {
    setOptions((prev) => ({ ...prev, [optionValue]: label }));
    setOptionOrder((prev) => (prev.includes(optionValue) ? prev : [...prev, optionValue]));
  }, []);

  const unregisterOption = React.useCallback((optionValue) => {
    setOptions((prev) => {
      if (!(optionValue in prev)) return prev;
      const next = { ...prev };
      delete next[optionValue];
      return next;
    });
    setOptionOrder((prev) => prev.filter((value) => value !== optionValue));
    optionRefs.current.delete(optionValue);
  }, []);

  React.useEffect(() => {
    if (currentValue != null && options[currentValue]) {
      setSelectedLabel(options[currentValue]);
    }
  }, [currentValue, options]);

  const updateTriggerRect = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom,
    });
  }, []);

  const selectValue = React.useCallback(
    (nextValue, label) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      setSelectedLabel(label ?? options[nextValue] ?? "");
      onValueChange?.(nextValue);
      close();
    },
    [close, isControlled, onValueChange, options],
  );

  React.useEffect(() => {
    if (!open) return;
    updateTriggerRect();
    const handleResize = () => updateTriggerRect();
    const handleScroll = () => updateTriggerRect();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, updateTriggerRect]);

  React.useEffect(() => {
    if (!open) {
      setHighlightedIndex(-1);
      return;
    }
    const currentIndex = optionOrder.indexOf(currentValue);
    setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
  }, [open, optionOrder, currentValue]);

  React.useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const valueAtIndex = optionOrder[highlightedIndex];
    if (!valueAtIndex) return;
    const node = optionRefs.current.get(valueAtIndex);
    node?.focus();
  }, [open, highlightedIndex, optionOrder]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      value: currentValue,
      selectedLabel,
      registerOption,
      unregisterOption,
      selectValue,
      highlightedIndex,
      setHighlightedIndex,
      optionOrder,
      triggerRef,
      triggerRect,
      updateTriggerRect,
      optionRefs,
    }),
    [
      open,
      setOpen,
      currentValue,
      selectedLabel,
      registerOption,
      unregisterOption,
      selectValue,
      highlightedIndex,
      optionOrder,
      triggerRect,
      updateTriggerRect,
    ],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={cn("relative w-full", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef(function SelectTrigger(
  { className, children, onClick, onKeyDown, ...props },
  forwardedRef,
) {
  const { open, setOpen, triggerRef, updateTriggerRect } = useSelectContext();

  const assignRef = React.useCallback(
    (node) => {
      triggerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef, triggerRef],
  );

  const handleToggle = React.useCallback(
    (event) => {
      onClick?.(event);
      updateTriggerRect();
      setOpen((prev) => !prev);
    },
    [onClick, setOpen, updateTriggerRect],
  );

  const handleKeyDown = React.useCallback(
    (event) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const keysToOpen = ["Enter", " ", "ArrowDown", "ArrowUp"];
      if (keysToOpen.includes(event.key)) {
        event.preventDefault();
        updateTriggerRect();
        setOpen(true);
      }
    },
    [onKeyDown, setOpen, updateTriggerRect],
  );

  return (
    <button
      type="button"
      ref={assignRef}
      data-state={open ? "open" : "closed"}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-2xl border border-border/60 bg-surface2/70 px-4 text-sm text-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:ring-2 data-[state=open]:ring-brand data-[placeholder]:text-muted",
        className,
      )}
      aria-haspopup="listbox"
      aria-expanded={open}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2 overflow-hidden">{children}</div>
      <ChevronDown className="ml-2 h-4 w-4 text-muted" aria-hidden="true" />
    </button>
  );
});

export const SelectValue = ({ placeholder, className }) => {
  const { selectedLabel } = useSelectContext();
  const hasValue = Boolean(selectedLabel);
  return (
    <span className={cn("truncate", !hasValue && "text-muted", className)}>
      {hasValue ? selectedLabel : placeholder || "Select"}
    </span>
  );
};

export function SelectContent({ className, children, position = "popper", sideOffset = 6, viewportClassName }) {
  const {
    open,
    setOpen,
    triggerRef,
    triggerRect,
    highlightedIndex,
    setHighlightedIndex,
    optionOrder,
    optionRefs,
  } = useSelectContext();

  const contentRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event) => {
      const target = event.target;
      if (contentRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab") {
        setOpen(false);
        return;
      }
      if (!optionOrder.length) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev < optionOrder.length - 1 ? prev + 1 : 0;
          return nextIndex;
        });
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : optionOrder.length - 1;
          return nextIndex;
        });
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, optionOrder, setHighlightedIndex, setOpen, triggerRef]);

  if (!open || !triggerRect) return null;

  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const shouldOpenUpwards = position === "popper" && spaceAbove > spaceBelow && spaceBelow < 200;

  const availableSpaceRaw = shouldOpenUpwards
    ? Math.max(spaceAbove - sideOffset - 12, 0)
    : Math.max(spaceBelow - sideOffset - 12, 0);
  const maxViewportHeight = Math.max(window.innerHeight - 120, 220);
  const maxAvailable = Math.min(Math.max(availableSpaceRaw, 160), maxViewportHeight);

  const style = {
    top: shouldOpenUpwards
      ? triggerRect.top + window.scrollY - sideOffset
      : triggerRect.bottom + window.scrollY + sideOffset,
    left: triggerRect.left + window.scrollX,
    maxHeight: `${maxAvailable}px`,
    transform: shouldOpenUpwards ? "translateY(-100%)" : undefined,
    "--trigger-width": `${triggerRect.width}px`,
  };

  const content = (
    <div
      ref={contentRef}
      style={style}
      className={cn(
        "z-[9999] w-[var(--trigger-width)] min-w-[12rem] overflow-hidden rounded-xl border border-border/60 bg-surface shadow-e3",
        "data-[placement=top]:origin-bottom data-[placement=bottom]:origin-top",
        className,
      )}
      data-placement={shouldOpenUpwards ? "top" : "bottom"}
      role="listbox"
      tabIndex={-1}
    >
      <div className={cn("max-h-full overflow-y-auto p-1", viewportClassName)}>{children}</div>
    </div>
  );

  return createPortal(content, document.body);
}

export function SelectItem({ className, value, children }) {
  const {
    value: selected,
    selectValue,
    registerOption,
    unregisterOption,
    optionOrder,
    highlightedIndex,
    optionRefs,
    open,
    setHighlightedIndex,
  } = useSelectContext();
  const label = React.useMemo(() => getTextFromChildren(children), [children]);
  const internalRef = React.useRef(null);

  React.useEffect(() => {
    registerOption(value, label);
    return () => unregisterOption(value);
  }, [label, registerOption, unregisterOption, value]);

  React.useEffect(() => {
    if (internalRef.current) {
      optionRefs.current.set(value, internalRef.current);
      return () => {
        optionRefs.current.delete(value);
      };
    }
  }, [optionRefs, value]);

  const index = optionOrder.indexOf(value);
  const isSelected = selected === value;
  const isHighlighted = highlightedIndex === index;

  React.useEffect(() => {
    if (isHighlighted && open) {
      internalRef.current?.focus();
    }
  }, [isHighlighted, open]);

  const handleMouseEnter = React.useCallback(() => {
    if (index >= 0) {
      setHighlightedIndex(index);
    }
  }, [index, setHighlightedIndex]);

  const handleFocus = React.useCallback(() => {
    if (index >= 0) {
      setHighlightedIndex(index);
    }
  }, [index, setHighlightedIndex]);

  return (
    <button
      type="button"
      ref={internalRef}
      onClick={() => selectValue(value, label)}
      className={cn(
        "relative flex w-full select-none items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-primary outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        "hover:bg-surface2/80 focus:bg-surface2/80",
        isSelected && "bg-surface2/80 text-primary",
        isHighlighted && !isSelected && "bg-surface2/60",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
    >
      <span className="pointer-events-none absolute right-3 flex h-3.5 w-3.5 items-center justify-center text-brand">
        {isSelected && <Check className="h-3 w-3" aria-hidden="true" />}
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
}

export const SelectSeparator = ({ className }) => (
  <div className={cn("-mx-1 my-1 h-px bg-border/60", className)} aria-hidden="true" />
);
