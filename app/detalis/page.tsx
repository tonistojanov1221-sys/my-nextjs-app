'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react'

function ProductDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProductDetail() {
      if (!id) return
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProductDetail()
  }, [id])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 pb-16">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl tracking-tight">SmartPick Pro</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-500 animate-pulse font-medium">Loading product details...</p>
          </div>
        ) : !product ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-600 font-medium">Product not found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {product.badge || 'AI Choice'}
              </span>
              <span className="text-3xl font-black text-slate-900">${product.price}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{product.title}</h1>

            <div className="border-t border-slate-100 pt-6 mb-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">About this product</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                {product.description || 'No detailed description available for this item yet.'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href={product.affiliate_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-indigo-600 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProductDetailContent />
    </Suspense>
  )
}