import React, { useState } from "react";

export default function ReportItem() {
  const [form, setForm] = useState({
    id: "",
    item: "",
    place: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4500/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Item reported successfully!");
        setError(false);
        setSubmitted(true);

        // Clear form fields after submission
        setForm({ id: "", item: "", place: "" });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage("");
          setSubmitted(false);
        }, 5000);
      } else {
        setMessage("❌ Failed to report item: " + data.message);
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error reporting item. Please try again.");
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container max-w-6xl px-4 py-12 mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Report Lost Item
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Help reunite lost items with their owners through the UniBazaar community
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Left Column - Image and Features */}
          <div className="p-8 bg-white shadow-2xl rounded-2xl">
            {/* Image Section */}
            <div className="mb-8">
              <div className="p-6 text-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <div className="flex items-center justify-center w-full h-64 rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200">
                  <img 
                    src="lost.png" 
                    alt="Lost item illustration" 
                    className="object-contain w-full h-full rounded-lg"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Helping lost items find their way home.
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Why Report Lost Items?</h2>
              
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
                  <p className="text-gray-600">Your information is protected and only shared with verified community members</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community Driven</h3>
                  <p className="text-gray-600">Join thousands of students helping each other recover lost belongings</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Response</h3>
                  <p className="text-gray-600">Get notifications when someone finds your item or matches your report</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Campus Coverage</h3>
                  <p className="text-gray-600">Comprehensive coverage across all campus locations and facilities</p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="p-6 mt-8 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1,250+</div>
                  <div className="text-sm text-gray-600">Items Reunited</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-8 bg-white shadow-2xl rounded-2xl">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="flex justify-center mb-6">
                  <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Report Submitted Successfully!</h2>
                <p className="text-gray-600">Thank you for helping reunite this item with its owner.</p>
                <p className="mt-4 text-sm text-gray-500">This message will disappear in 5 seconds.</p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Report a Found Item</h2>
                  <p className="text-gray-600">Fill out the form below to help someone find their lost item</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Student ID Field */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Student ID *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0V5a2 2 0 014 0v1" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="id"
                        value={form.id}
                        onChange={handleChange}
                        placeholder="Enter your student ID"
                        className="block w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Item Name Field */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Item Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="item"
                        value={form.item}
                        onChange={handleChange}
                        placeholder="e.g. Wallet, Bag, Phone, Keys"
                        className="block w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Place Found Field */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Place Found *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="place"
                        value={form.place}
                        onChange={handleChange}
                        placeholder="Where was the item found? (e.g., Library, Cafeteria, Dorm A)"
                        className="block w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                    >
                      Submit Report
                    </button>
                  </div>

                  {/* Success/Error Message */}
                  {message && (
                    <div className={`mt-6 p-4 rounded-xl border-l-4 ${
                      error 
                        ? "bg-red-50 border-red-400 text-red-700" 
                        : "bg-green-50 border-green-400 text-green-700"
                    }`}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {error ? (
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>

                {/* Footer Info */}
                <div className="pt-6 mt-8 border-t border-gray-200">
                  <p className="text-sm text-center text-gray-500">
                    By submitting this form, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}