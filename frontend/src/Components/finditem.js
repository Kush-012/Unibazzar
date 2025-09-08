import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Finditem() {
  const [items, setItems] = useState("");
  const [products, setProducts] = useState([]);
     
  const setteritem = (e) => {
    setItems(e.target.value);
  };
    
  const data = async () => {
    const res = await fetch("http://localhost:4500/products");
    if (!res.ok) {
      return "error in fetching";
    } else {
      const result = await res.json();
      setProducts(result);
    }
  };
    
  useEffect(() => {
    data();
  }, []);

const handleClaim = async (item, place) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const claimerid = user?.id;  // real logged-in user ID

  try {
    const res = await fetch("http://localhost:4500/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, place, claimerid }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Item claimed successfully!");
      data(); // refresh product list
    } else {
      alert(result.message || "Failed to claim item");
    }
  } catch (error) {
    console.error(error);
    alert("Error while claiming item");
  }
};


  const filteredProducts = products.filter((p) =>
    p.item.toLowerCase().includes(items.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-4xl font-bold text-gray-800">Find Item</h3>
          <p className="text-lg text-gray-600">UniBazaar – Find What’s Lost, Return What’s Found.</p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl p-6 mx-auto mb-8 bg-white shadow-lg rounded-xl">
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Item name:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for an item..."
                className="w-full p-4 text-lg placeholder-gray-400 transition-all duration-300 border-2 border-blue-200 rounded-xl bg-blue-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                value={items}
                onChange={setteritem}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {items && (
              <p className="mt-2 text-sm text-blue-600">
                {filteredProducts.length} item(s) found for "{items}"
              </p>
            )}
          </div>
        </div>
           
        {/* Results Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, index) => (
              <div key={index} className="overflow-hidden transition-all duration-300 transform bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1">
                <div className="p-6 space-y-4">
                  <div className="flex items-center mb-4 space-x-2">
                    <div className={`w-3 h-3 rounded-full ${p.available === "yes" ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className={`text-sm font-medium ${p.available === "yes" ? "text-green-600" : "text-red-600"}`}>
                      {p.available === "yes" ? "Available" : "Claimed"}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">Item</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{p.item}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{p.place}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">Reporter ID</p>
                        <p className="text-lg font-semibold text-gray-900 truncate">{p.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-3 border-t border-gray-100">
                    {p.available === "yes" ? (
                      <button
                        onClick={() => handleClaim(p.item, p.place)}
                        className="inline-flex items-center justify-center w-full px-2 py-2 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 hover:scale-105 hover:shadow-lg"
                      >
                        Claim Item
                      </button>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center w-full px-2 py-2 font-semibold text-white bg-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Already Claimed
                      </button>
                    )}

                    {/* Chat button always shown */}
                    <Link
                      to="/chat"
                      className="inline-flex items-center justify-center w-full px-2 py-2 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-105 hover:shadow-lg"
                    >
                      Chat With Us
                    </Link>
                  </div>
                </div>
              </div>
             ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-1 py-12 md:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mb-2 text-xl font-semibold text-gray-500">No items found</h3>
                <p className="text-gray-400">Try searching with different keywords</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
