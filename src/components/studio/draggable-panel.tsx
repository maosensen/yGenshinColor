"use client";

import { type DraggableAttributes, useDraggable } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { createContext, type ReactNode, useContext } from "react";
import { useStudioStore } from "@/lib/stores/studio-store";
import { cn } from "@/lib/utils";

/**
 * A floating panel that can be dragged around the workspace by its handle.
 * Position = docked anchor (given by `className`, e.g. "top-4 left-4") plus a
 * store-kept offset, plus the live drag delta. The panel lives in screen
 * space above the pan/zoom canvas, so moving it never pans the artboard.
 *
 * The header/grip that acts as the drag handle reads listeners from
 * `usePanelHandle()` — the surrounding DndContext (in studio.tsx) commits the
 * delta to the store on drop.
 */

type Handle = {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
};

const PanelHandleContext = createContext<Handle | null>(null);

/** Handle props for the element that should start the drag (null if outside). */
export function usePanelHandle(): Handle | null {
  return useContext(PanelHandleContext);
}

export function DraggablePanel({
  id,
  className,
  centerX = false,
  children,
}: {
  id: string;
  /** Docked anchor + size utilities, e.g. "top-4 left-4 bottom-4 w-72". */
  className?: string;
  /** Anchor is horizontally centered (adds -50% to the x translate). */
  centerX?: boolean;
  children: ReactNode;
}) {
  const offset = useStudioStore((s) => s.panelOffsets[id]);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const x = (offset?.x ?? 0) + (transform?.x ?? 0);
  const y = (offset?.y ?? 0) + (transform?.y ?? 0);
  const tx = centerX ? `calc(-50% + ${x}px)` : `${x}px`;

  return (
    <div
      ref={setNodeRef}
      className={cn("absolute", isDragging ? "z-30" : "z-20", className)}
      style={{ transform: `translate(${tx}, ${y}px)`, touchAction: "none" }}
    >
      <PanelHandleContext.Provider value={{ attributes, listeners }}>
        {children}
      </PanelHandleContext.Provider>
    </div>
  );
}
