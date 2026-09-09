'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { PlusCircle, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [description, setDescription] = useState('')
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [badge, setBadge] = useState('AI Choice')

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    const numericPrice = Number(price)

    if (!title.trim()) {
      setErrorMessage('Внеси име на производот.')
      setLoading(false)
      return
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setErrorMessage('Внеси валидна цена.')
      setLoading(false)
      return
    }

    if (!affiliateUrl.trim()) {
      setErrorMessage('Внеси affiliate линк.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            title: title.trim(),
            price: numericPrice,
            category,
            description: description.trim(),
            affiliate_url: affiliateUrl.trim(),
            badge: badge.trim() || 'AI Choice',
          },
        ])

      if (error) {
        console.error('Error adding product:', error)
        setErrorMessage('Не успеавме да го додадеме производот.')
        return
      }

      setSuccessMessage('Производот е успешно додаден во SmartPick AI.')

      setTitle('')
      setPrice('')
      setDescription('')
      setAffiliateUrl('')
      setBadge('AI Choice')
    } catch (error) {
      console.error(error)
      setErrorMessage('Се појави неочекувана грешка.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SmartPick AI
          </Link>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                SmartPick AI Admin
              </h1>

              <p className="text-slate-400 text-sm">
                Add products and affiliate links
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl mb-6 text-sm font-semibold">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAddProduct} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Product Title
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smart Watch Ultra"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Price ($)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99.99"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all"
                >
                  <option>Electronics</option>
                  <option>Audio</option>
                  <option>Accessories</option>
                  <option>Home & Kitchen</option>
                  <option>Fashion</option>
                  <option>Beauty</option>
                  <option>Sports</option>
                  <option>Gaming</option>
                  <option>Tools</option>
                  <option>Kids</option>
                </select>
              </div>

            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                AI Badge
              </label>

              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Best Budget / Top Rated / AI Choice"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Affiliate Link
              </label>

              <input
                type="url"
                required
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Description
              </label>

              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short product description..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />

              {loading ? 'Adding Product...' : 'Publish Product'}
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}