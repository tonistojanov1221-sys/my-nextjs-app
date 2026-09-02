'use client';

import React, { useState } from 'react';

const products = [
  {
    id: "klein-tools-mm325",
    title: "Klein Tools MM325 Digital Multimeter",
    category: "Specialized Tools & Parts",
    price: 34.99,
    description: "Manual-ranging 600V AC/DC voltage tester for batteries, current, resistance, diodes, and continuity.",
    image: "https://m.media-amazon.com/images/I/61m1hD4tQdL._AC_SL1500_.jpg",
    amazonUrl: "https://www.amazon.com/Klein-Tools-MM325-Multimeter-Manual-Ranging/dp/B0B57L9FNL/ref=ab_uc_d_grid_213428019011_213382818011_d_sccl_8/135-1353462-3149521?pd_rd_w=CaLWE&content-id=amzn1.sym.1c297939-9850-403b-ae76-52c853498468&pf_rd_p=1c297939-9850-403b-ae76-52c853498468&pf_rd_r=N7Y6D4YF21NAT8Z6NB2M&pd_rd_wg=lzZyM&pd_rd_r=8b494ccf-d743-4616-af95-b05c48e916e2&pd_rd_i=B0B57L9FNL&th=1",
    score: 9.8
  },
  {
    id: "garmin-forerunner-265",
    title: "Garmin Forerunner 265",
    category: "Sports",
    price: 449.99,
    description: "Advanced GPS running smartwatch with a vibrant AMOLED display.",
    image: "https://m.media-amazon.com/images/I/61R1w2W32iL._AC_SL1000_.jpg",
    amazonUrl: "https://www.amazon.com/",
    score: 9.6
  },
  {
    id: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5",
    category: "Electronics",
    price: 398.00,
    description: "Industry-leading noise canceling wireless headphones.",
    image: "https://m.media-amazon.com/images/I/51SKmu2xzFL._AC_SL1000_.jpg",
    amazonUrl: "https://affiliate-program.amazon.com/",
    score: 9.5
  },
  {
    id: "kindle-paperwhite",
    title: "Kindle Paperwhite",
    category: "Electronics",
    price: 149.99,
    description: "6.8\" display, adjustable warm light, up to 10 weeks of battery life.",
    image: "https://m.media-amazon.com/images/I/51WwH4YQ0iL._AC_SL1000_.jpg",
    amazonUrl: "https://affiliate-program.amazon.com/home?openid.assoc_handle=amzn_associates_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHDDM2OCHHDYTIOEAJVAKLLZFNHQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHDDM2OCHHDYTIOEAJVAKLLZFNHQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2026-09-02T15%3A37%3A28Z5809056531920017862&openid.return_to=https%3A%2F%2Faffiliate-program.amazon.com%2Fhome&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fmulti-factor&openid.pape.auth_time=2026-09-02T15%3A36%3A31Z&openid.sig=D2Nqqze1auYqTQD33jGsC14tcB0Fz0ZH8%2BtZSPboF0M%3D&serial=#",
    score: 9.7
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">SmartPick Recommendations</h1>
        
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between border border-gray-100">
              <div>
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-48 object-contain p-4 bg-white" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="p-5">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">{product.category}</span>
                  <div className="flex justify-between items-start mt-3">
                    <h2 className="text-lg font-bold text-gray-800">{product.title}</h2>
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-gray-500">Score: {product.score}</span>
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Buy on Amazon (Affiliate)
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}