'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormInput, FormPageHeader } from '@/components/admin/forms'
import StatusSelect from '@/components/admin/StatusSelect'
import OrderStatusTimeline, { StatusStep } from '@/components/admin/OrderStatusTimeline'

interface CustomOrderFormData {
  price: string
  shipping: string
}

const orderStatusOptions = [
  { value: 'placed', label: 'Order Placed' },
  { value: 'processed', label: 'Processed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'canceled', label: 'Canceled' },
]

// Sample order data
const orderData = {
  id: '#732365',
  customer: 'Ahmed Fawzy Aly',
  email: 'fawzymail@gmail.com',
  phone: '+2 01229807230',
  deliveredTo: '421 Gamal Abdelnasser St. Panorama Tower, Cairo, Egypt',
  orderDetails: {
    productType: 'T shirt',
    color: 'Navy Blue',
    gender: 'Men',
    size: 'Large',
    quantity: 1,
    details: 'Manchester united logo with name Youssef on the back',
  },
  images: [
    '/custom-orders/ref1.jpg',
    '/custom-orders/ref2.jpg',
    '/custom-orders/ref3.jpg',
  ],
}

const statusSteps: StatusStep[] = [
  { label: 'Order Placed', timestamp: '13:45 Nov 10,2025', completed: true, active: false },
  { label: 'Processed', timestamp: '00:00 MM DD,YY', completed: false, active: false },
  { label: 'Shipped', timestamp: '00:00 MM DD,YY', completed: false, active: false },
  { label: 'Delivered', timestamp: '00:00 MM DD,YY', completed: false, active: false },
]

export default function CustomOrderDetailsPage() {
  const [orderStatus, setOrderStatus] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CustomOrderFormData>({
    defaultValues: {
      price: '1,630 EGP',
      shipping: '60 EGP',
    }
  })

  const onSubmit = async (data: CustomOrderFormData) => {
    console.log('Save custom order:', { ...data, status: orderStatus })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <FormPageHeader
        title="Order Details"
        backHref="/admin/orders"
        isSubmitting={isSubmitting}
      />

      <div className="bg-white rounded-lg p-6">
        {/* Order Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Order {orderData.id}</h2>
          <StatusSelect
            value={orderStatus}
            onChange={setOrderStatus}
            options={orderStatusOptions}
          />
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-1 mb-6 text-sm">
          <div className="flex gap-4">
            <span className="text-neutral-500 w-28 flex-shrink-0">Customer</span>
            <span className="font-medium text-neutral-900">{orderData.customer}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-neutral-500 w-28 flex-shrink-0">Email</span>
            <span className="font-medium text-neutral-900">{orderData.email}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-neutral-500 w-28 flex-shrink-0">Phone Number</span>
            <span className="font-medium text-neutral-900">{orderData.phone}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-neutral-500 w-28 flex-shrink-0">Delivered to</span>
            <span className="font-medium text-neutral-900">{orderData.deliveredTo}</span>
          </div>
        </div>

        {/* Main Content: Details + Timeline */}
        <div className="flex gap-6">
          {/* Left: Order Details */}
          <div className="flex-1">
            {/* Order Details */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Order Details:</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex gap-4">
                  <span className="text-neutral-500 w-28 flex-shrink-0">Product Type</span>
                  <span className="font-medium text-neutral-900">{orderData.orderDetails.productType}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-neutral-500 w-28 flex-shrink-0">Color</span>
                  <span className="font-medium text-neutral-900">{orderData.orderDetails.color}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-neutral-500 w-28 flex-shrink-0">Gender</span>
                  <span className="font-medium text-neutral-900">{orderData.orderDetails.gender}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-neutral-500 w-28 flex-shrink-0">Size</span>
                  <span className="font-medium text-neutral-900">{orderData.orderDetails.size}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-neutral-500 w-28 flex-shrink-0">Quantity</span>
                  <span className="font-medium text-neutral-900">{orderData.orderDetails.quantity}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-neutral-500 w-28 flex-shrink-0">Details</span>
                  <span className="font-medium text-neutral-900">{orderData.orderDetails.details}</span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Images:</h3>
              <div className="flex gap-3">
                {orderData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-[100px] h-[80px] rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 flex items-center justify-center group"
                  >
                    {/* Placeholder - in real app this would be an actual image */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-300">
                      <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 16L8 10L22 22" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {/* Expand icon */}
                    <button
                      type="button"
                      className="absolute top-1 right-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Set Order Price */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Set Order Price:</h3>
              <div className="space-y-3 max-w-xs">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-neutral-500 w-16 flex-shrink-0">Price</label>
                  <FormInput
                    placeholder="0 EGP"
                    error={errors.price}
                    className="flex-1"
                    {...register('price')}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-neutral-500 w-16 flex-shrink-0">Shipping</label>
                  <FormInput
                    placeholder="0 EGP"
                    error={errors.shipping}
                    className="flex-1"
                    {...register('shipping')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Status Timeline */}
          <div className="w-56 flex-shrink-0 border-l border-neutral-100 pl-6">
            <OrderStatusTimeline steps={statusSteps} />
          </div>
        </div>
      </div>
    </form>
  )
}
