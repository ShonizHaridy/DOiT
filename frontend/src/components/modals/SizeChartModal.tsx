'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { CloseCircle } from 'iconsax-reactjs'
import { useUIStore } from '@/store'

export default function SizeChartModal() {
  const { sizeChart, closeSizeChart } = useUIStore()
  const { isOpen } = sizeChart

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSizeChart()
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeSizeChart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-(--z-modal-backdrop)"
        onClick={closeSizeChart}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <h2 className="font-rubik font-semibold text-xl text-primary">Size Chart</h2>
            <button
              onClick={closeSizeChart}
              className="text-text-body hover:text-primary transition-colors"
              aria-label="Close"
            >
              <CloseCircle size={28} variant="Bold" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {/* Shoe Size Chart */}
            <div className="mb-6">
              <h3 className="font-rubik font-medium text-lg mb-4">Shoe Sizes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-bg-card">
                      <th className="border border-border-light px-3 py-2 text-start font-medium">EU</th>
                      <th className="border border-border-light px-3 py-2 text-start font-medium">US (Men)</th>
                      <th className="border border-border-light px-3 py-2 text-start font-medium">US (Women)</th>
                      <th className="border border-border-light px-3 py-2 text-start font-medium">UK</th>
                      <th className="border border-border-light px-3 py-2 text-start font-medium">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { eu: '35', usM: '4', usW: '5', uk: '2.5', cm: '22' },
                      { eu: '36', usM: '4.5', usW: '5.5', uk: '3', cm: '22.5' },
                      { eu: '37', usM: '5', usW: '6', uk: '3.5', cm: '23' },
                      { eu: '38', usM: '5.5', usW: '6.5', uk: '4', cm: '23.5' },
                      { eu: '39', usM: '6', usW: '7', uk: '5', cm: '24' },
                      { eu: '40', usM: '7', usW: '8', uk: '6', cm: '25' },
                      { eu: '41', usM: '8', usW: '9', uk: '7', cm: '26' },
                      { eu: '42', usM: '9', usW: '10', uk: '8', cm: '27' },
                      { eu: '43', usM: '10', usW: '11', uk: '9', cm: '28' },
                      { eu: '44', usM: '11', usW: '12', uk: '10', cm: '29' },
                    ].map((row) => (
                      <tr key={row.eu} className="hover:bg-gray-50">
                        <td className="border border-border-light px-3 py-2">{row.eu}</td>
                        <td className="border border-border-light px-3 py-2">{row.usM}</td>
                        <td className="border border-border-light px-3 py-2">{row.usW}</td>
                        <td className="border border-border-light px-3 py-2">{row.uk}</td>
                        <td className="border border-border-light px-3 py-2">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clothing Size Chart */}
            <div>
              <h3 className="font-rubik font-medium text-lg mb-4">Clothing Sizes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-bg-card">
                      <th className="border border-border-light px-3 py-2 text-start font-medium">Size</th>
                      <th className="border border-border-light px-3 py-2 text-start font-medium">Chest (cm)</th>
                      <th className="border border-border-light px-3 py-2 text-start font-medium">Waist (cm)</th>
                      <th className="border border-border-light px-3 py-2 text-start font-medium">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'S', chest: '86-91', waist: '71-76', hips: '86-91' },
                      { size: 'M', chest: '91-97', waist: '76-81', hips: '91-97' },
                      { size: 'L', chest: '97-102', waist: '81-86', hips: '97-102' },
                      { size: 'XL', chest: '102-107', waist: '86-91', hips: '102-107' },
                      { size: 'XXL', chest: '107-112', waist: '91-97', hips: '107-112' },
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50">
                        <td className="border border-border-light px-3 py-2 font-medium">{row.size}</td>
                        <td className="border border-border-light px-3 py-2">{row.chest}</td>
                        <td className="border border-border-light px-3 py-2">{row.waist}</td>
                        <td className="border border-border-light px-3 py-2">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-bg-card rounded-lg">
              <h4 className="font-rubik font-medium text-sm mb-2">How to Measure</h4>
              <ul className="text-sm text-text-body space-y-1">
                <li>• <strong>Chest:</strong> Measure around the fullest part of your chest</li>
                <li>• <strong>Waist:</strong> Measure around your natural waistline</li>
                <li>• <strong>Hips:</strong> Measure around the fullest part of your hips</li>
                <li>• <strong>Foot Length:</strong> Stand on paper, mark toe and heel, measure distance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}