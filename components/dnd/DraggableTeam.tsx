'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface DraggableTeamProps {
  teamName: string
  isPlaced: boolean
}

export function DraggableTeam({ teamName, isPlaced }: DraggableTeamProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: teamName,
    disabled: isPlaced,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <span
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        px-2 md:px-3 py-1 rounded-sm text-xs font-body border transition-all
        ${isPlaced
          ? 'bg-gray-100 dark:bg-slate-600 border-gray-200 dark:border-slate-500 text-gray-400 dark:text-slate-400 cursor-not-allowed line-through'
          : 'bg-white dark:bg-slate-700 border-tan-300 dark:border-slate-600 text-brown-800 dark:text-slate-100 cursor-grab active:cursor-grabbing hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-slate-600'
        }
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
    >
      {teamName}
    </span>
  )
}
