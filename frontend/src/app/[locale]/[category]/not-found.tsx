// app/[locale]/[category]/not-found.tsx
import Link from 'next/link'

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
      <p className="text-text-body mb-6">This category doesn't exist.</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-primary text-white rounded"
      >
        Go Home
      </Link>
    </div>
  )
}