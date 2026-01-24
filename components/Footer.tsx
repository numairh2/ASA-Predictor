'use client'

import { AlertTriangle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-8 md:mt-12">
      <div className="bg-gradient-to-br from-brown-800 to-brown-700 dark:from-slate-800 dark:to-slate-700 rounded-sm p-6 md:p-8 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-gold-400" />
            <span className="text-sm md:text-base font-bold text-gold-400 uppercase tracking-wide font-sans">
              Disclaimer
            </span>
            <AlertTriangle size={20} className="text-gold-400" />
          </div>

          <p className="text-sm md:text-base text-cream-100 leading-relaxed mb-4 font-body">
            This is an independent fan-made tool and is <strong className="text-gold-400">not affiliated with, endorsed by, or officially connected to ASA (A Cappella South Asia)</strong> or any of its member organizations.
            All team names and competition references are used for informational and simulation purposes only.
          </p>

          <p className="text-xs md:text-sm text-cream-200/80 font-body">
            Rankings are based on an ELO formula that approximates competition outcomes and do not reflect actual judges' scores.
            These rankings are not fully accurate and should not be taken as official or definitive.
            Use this tool for entertainment and scenario planning purposes only.
          </p>

          <div className="mt-6 pt-4 border-t border-cream-100/20">
            <p className="text-xs text-cream-200/60 font-sans">
              ASA ELO Simulator &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
