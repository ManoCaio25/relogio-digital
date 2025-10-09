import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const SelectContext = React.createContext(null);
const selectRegistry = new Map();

function useTriggerMeasurements(triggerRef, isListening) {
  const [triggerRect, setTriggerRect] = React.useState(null);

  const measureTriggerRect = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerRect({
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    });
  }, [triggerRef]);

  useIsomorphicLayoutEffect(() => {
    measureTriggerRect();
  }, [measureTriggerRect]);

  useIsomorphicLayoutEffect(() => {
    if (typeof ResizeObserver === "undefined" || !triggerRef.current) {
      return undefined;
    }
    const observer = new ResizeObserver(() => measureTriggerRect());
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [measureTriggerRect, triggerRef]);

  React.useEffect(() => {
    if (!isListening) return undefined;
    measureTriggerRect();

    const handleResize = () => measureTriggerRect();
    const handleScroll = () => measureTriggerRect();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isListening, measureTriggerRect]);

  return { triggerRect, measureTriggerRect };
}

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
  const triggerRef = React.useRef(null);
  const optionRefs = React.useRef(new Map());
  const optionLabelsRef = React.useRef(new Map());

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : openState;
  const { triggerRect, measureTriggerRect } = useTriggerMeasurements(triggerRef, open);

  const reactId = React.useId();
  const selectId = React.useMemo(() => {
    if (id) return id;
    const sanitized = reactId.replace(/:/g, "");
    return `select-${sanitized}`;
  }, [id, reactId]);

  const updateTriggerRect = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerRect({
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateTriggerRect();
  }, [updateTriggerRect]);

  useIsomorphicLayoutEffect(() => {
    if (typeof ResizeObserver === "undefined" || !triggerRef.current) {
      return undefined;
    }
    const observer = new ResizeObserver(() => updateTriggerRect());
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [updateTriggerRect]);

  const updateTriggerRect = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerRect({
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateTriggerRect();
  }, [updateTriggerRect]);

  useIsomorphicLayoutEffect(() => {
    if (typeof ResizeObserver === "undefined" || !triggerRef.current) {
      return undefined;
    }
    const observer = new ResizeObserver(() => updateTriggerRect());
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [updateTriggerRect]);

  const close = React.useCallback(() => {
    if (!isOpenControlled) {
      setOpenState(false);
    }
    onOpenChange?.(false);
  }, [isOpenControlled, onOpenChange]);

  React.useEffect(() => {
    selectRegistry.set(selectId, close);
    return () => {
      selectRegistry.delete(selectId);
    };
  }, [close, selectId]);

  const setOpen = React.useCallback(
    (nextOpen) => {
      const resolved = typeof nextOpen === "function" ? nextOpen(open) : nextOpen;
      if (resolved) {
        selectRegistry.forEach((closeFn, id) => {
          if (id !== currentId) {
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

  const registerOption = React.useCallback(
    (optionValue, label) => {
      optionLabelsRef.current.set(optionValue, label);
      setOptions((prev) => {
        if (prev[optionValue] === label) {
          return prev;
        }
        return { ...prev, [optionValue]: label };
      });
      setOptionOrder((prev) => (prev.includes(optionValue) ? prev : [...prev, optionValue]));
      if (optionValue === currentValue && label) {
        setSelectedLabel(label);
      }
    },
    [currentValue],
  );

  const unregisterOption = React.useCallback((optionValue) => {
    setOptionOrder((prev) => prev.filter((value) => value !== optionValue));
    optionRefs.current.delete(optionValue);
  }, []);

  React.useEffect(() => {
    if (currentValue == null) {
      setSelectedLabel("");
      return;
    }
    if (Object.prototype.hasOwnProperty.call(options, currentValue)) {
      setSelectedLabel(options[currentValue]);
    }
  }, [currentValue, options]);

  const selectValue = React.useCallback(
    (nextValue, label) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      const resolvedLabel =
        label ?? optionLabelsRef.current.get(nextValue) ?? options[nextValue] ?? "";
      setSelectedLabel(resolvedLabel);
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
      measureTriggerRect,
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
      measureTriggerRect,
    ],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={cn("relative w-full", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef(function SelectTrigger(
  { className, children, onClick, onKeyDown, id: _ignoredId, ...props },
  forwardedRef,
) {
  const { open, setOpen, triggerRef, updateTriggerRect, selectId } = useSelectContext();

  const assignRef = React.useCallback(
    (node) => {
      triggerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
      if (node) {
        updateTriggerRect();
      }
    },
    [forwardedRef, triggerRef, updateTriggerRect],
  );

  const handleToggle = React.useCallback(
    (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      updateTriggerRect();
      setOpen((prev) => !prev);
    },
    [onClick, setOpen, measureTriggerRect],
  );

  const handleKeyDown = React.useCallback(
    (event) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const keysToOpen = ["Enter", " ", "ArrowDown", "ArrowUp"];
      if (keysToOpen.includes(event.key)) {
        event.preventDefault();
        measureTriggerRect();
        setOpen(true);
      }
    },
    [onKeyDown, setOpen, measureTriggerRect],
  );

  return (
    <button
      type="button"
      ref={assignRef}
      id={selectId}
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
      <div className="flex flex-1 items-center gap-2 overflow-hidden text-left">{children}</div>
      <ChevronDown
        className={cn("ml-2 h-4 w-4 text-muted transition-transform duration-200", open && "rotate-180")}
        aria-hidden="true"
      />
    </button>
  );
});

export const SelectValue = ({ placeholder, className, children }) => {
  const { selectedLabel } = useSelectContext();

  const fallbackLabel = React.useMemo(() => {
    if (children == null) return "";
    return getTextFromChildren(children);
  }, [children]);

  const hasContextValue = Boolean(selectedLabel);
  const hasFallbackValue = Boolean(fallbackLabel);
  const content = hasContextValue ? selectedLabel : children ?? fallbackLabel;

  return (
    <span className={cn("truncate", !(hasContextValue || hasFallbackValue) && "text-muted", className)}>
      {hasContextValue || hasFallbackValue ? content : placeholder || "Select"}
    </span>
  );
};

export function SelectContent({ className, children, position = "popper", sideOffset = 6, viewportClassName }) {
  const {
    selectId,
    open,
    setOpen,
    triggerRef,
    triggerRect,
    highlightedIndex,
    setHighlightedIndex,
    optionOrder,
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
    position: "fixed",
    top: shouldOpenUpwards ? triggerRect.top - sideOffset : triggerRect.bottom + sideOffset,
    left: triggerRect.left,
    width: `${triggerRect.width}px`,
    maxHeight: `${maxAvailable}px`,
    transform: shouldOpenUpwards ? "translateY(-100%)" : undefined,
  };

  const content = (
    <div
      ref={contentRef}
      style={style}
      className={cn(
        "z-[9999] overflow-hidden rounded-xl border border-border/60 bg-surface shadow-e3",
        "data-[placement=top]:origin-bottom data-[placement=bottom]:origin-top",
        className,
      )}
      data-placement={shouldOpenUpwards ? "top" : "bottom"}
      role="listbox"
      aria-labelledby={selectId}
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
