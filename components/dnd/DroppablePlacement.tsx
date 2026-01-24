'use client'

import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode } from 'react'

interface DroppablePlacementProps {
  position: number
  currentTeam: string | undefined
  children: ReactNode
}

export function DroppablePlacement({ position, currentTeam, children }: DroppablePlacementProps) {
  const droppableId = `placement-${position}`

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: droppableId,
  })

  return (
    <div
      ref={setDroppableRef}
      className={`
        flex-1 relative transition-all rounded-sm
        ${isOver ? 'ring-2 ring-gold-500 bg-gold-50 dark:bg-gold-900/20' : ''}
      `}
    >
      {children}
    </div>
  )
}

interface DraggablePlacedTeamProps {
  teamName: string
  position: number
}

export function DraggablePlacedTeam({ teamName, position }: DraggablePlacedTeamProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `placed-${position}-${teamName}`,
    data: {
      type: 'placed',
      position,
      teamName,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        absolute inset-0 flex items-center px-3 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-95 z-10' : ''}
      `}
    >
      <span className="text-sm text-brown-800 dark:text-slate-100 font-body pointer-events-none">
        {teamName}
      </span>
    </div>
  )
}
