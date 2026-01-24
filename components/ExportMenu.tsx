'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, Image, FileText, Copy, Check, Loader2 } from 'lucide-react'
import { TeamRanking } from '@/types'
import { exportAsImage, exportAsPDF, copyToClipboard } from '@/lib/export'

interface ExportMenuProps {
  rankings: TeamRanking[]
  exportElementId: string
}

type ExportStatus = 'idle' | 'loading' | 'success' | 'error'

export function ExportMenu({ rankings, exportElementId }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = async (type: 'image' | 'pdf' | 'clipboard') => {
    setStatus('loading')
    setStatusMessage('')

    try {
      switch (type) {
        case 'image':
          await exportAsImage(exportElementId)
          setStatusMessage('Image downloaded!')
          break
        case 'pdf':
          await exportAsPDF(rankings)
          setStatusMessage('PDF downloaded!')
          break
        case 'clipboard':
          await copyToClipboard(rankings)
          setStatusMessage('Copied to clipboard!')
          break
      }
      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        setIsOpen(false)
      }, 1500)
    } catch {
      setStatus('error')
      setStatusMessage('Export failed')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[44px] min-w-[44px] p-2 px-3 rounded-sm border-2 border-tan-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-brown-800 dark:text-slate-100 hover:bg-cream-100 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-semibold font-sans"
        aria-label="Export options"
      >
        <Download size={18} />
        <span className="hidden sm:inline">Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border-2 border-tan-300 dark:border-slate-600 rounded-sm shadow-lg z-50">
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2 p-4 text-brown-800 dark:text-slate-100">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Exporting...</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 p-4 text-green-600">
              <Check size={18} />
              <span className="text-sm font-semibold">{statusMessage}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center justify-center p-4 text-red-600">
              <span className="text-sm font-semibold">{statusMessage}</span>
            </div>
          )}

          {status === 'idle' && (
            <>
              <button
                onClick={() => handleExport('image')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-brown-800 dark:text-slate-100 hover:bg-cream-100 dark:hover:bg-slate-700 transition-colors border-b border-tan-200 dark:border-slate-600"
              >
                <Image size={18} className="text-gold-500" />
                <div className="text-left">
                  <div className="font-semibold">Save as Image</div>
                  <div className="text-xs text-tan-400 dark:text-slate-400">Download PNG screenshot</div>
                </div>
              </button>

              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-brown-800 dark:text-slate-100 hover:bg-cream-100 dark:hover:bg-slate-700 transition-colors border-b border-tan-200 dark:border-slate-600"
              >
                <FileText size={18} className="text-bronze-500" />
                <div className="text-left">
                  <div className="font-semibold">Save as PDF</div>
                  <div className="text-xs text-tan-400 dark:text-slate-400">Formatted document</div>
                </div>
              </button>

              <button
                onClick={() => handleExport('clipboard')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-brown-800 dark:text-slate-100 hover:bg-cream-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Copy size={18} className="text-tan-400" />
                <div className="text-left">
                  <div className="font-semibold">Copy to Clipboard</div>
                  <div className="text-xs text-tan-400 dark:text-slate-400">Plain text standings</div>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
