'use client'

import { ReactNode, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'

interface PlacementDndContextProps {
  children: ReactNode
  onDragEnd: (activeId: string, overId: string) => void
}

export function PlacementDndContext({ children, onDragEnd }: PlacementDndContextProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      onDragEnd(active.id as string, over.id as string)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeId ? (
          <div className="bg-gold-500 text-white px-3 py-1.5 rounded-sm text-xs font-semibold shadow-lg opacity-90">
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
