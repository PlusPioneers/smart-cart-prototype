import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Search, AlertTriangle, CheckCircle, X, Plus, Minus } from 'lucide-react';

// Mock product data
const mockProducts = [
  { id: "p1", name: "Dove Shampoo", price: 350, category: "shampoo", location: { aisle: 5, shelf: "B2" } },
  { id: "p2", name: "Clinic Plus Shampoo", price: 275, category: "shampoo", location: { aisle: 3, shelf: "A1" } },
  { id: "p3", name: "Head & Shoulders", price: 420, category: "shampoo", location: { aisle: 3, shelf: "A2" } },
  { id: "p4", name: "Pantene Shampoo", price: 385, category: "shampoo", location: { aisle: 5, shelf: "B1" } },
  { id: "p5", name: "Colgate Toothpaste", price: 85, category: "toothpaste", location: { aisle: 2, shelf: "C1" } },
  { id: "p6", name: "Pepsodent Toothpaste", price: 65, category: "toothpaste", location: { aisle: 2, shelf: "C2" } },
  { id: "p7", name: "Close Up Toothpaste", price: 75, category: "toothpaste", location: { aisle: 2, shelf: "C3" } },
  { id: "p8", name: "Lux Soap", price: 45, category: "soap", location: { aisle: 1, shelf: "D1" } },
  { id: "p9", name: "Dettol Soap", price: 35, category: "soap", location: { aisle: 1, shelf: "D2" } },
  { id: "p10", name: "Lifebuoy Soap", price: 25, category: "soap", location: { aisle: 1, shelf: "D3" } }
];

function SmartCartApp() {
  const [budget, setBudget] = useState(1000);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(null);
  const [currentStep, setCurrentStep] = useState('budget'); // budget, shopping, summary
  const [highlightedAisle, setHighlightedAisle] = useState(null);

  // Calculate totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const budgetLeft = budget - cartTotal;
  const totalSaved = cart.reduce((sum, item) => sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0);

  // Find cheaper alternative
  const suggestAlternative = (product) => {
    return mockProducts.find(p => 
      p.category === product.category && 
      p.price < product.price && 
      p.id !== product.id &&
      !cart.some(cartItem => cartItem.id === p.id)
    );
  };

  // Add product to cart with suggestion check
  const addToCart = (product) => {
    const alternative = suggestAlternative(product);
    
    if (alternative && cartTotal + product.price > budget * 0.8) {
      setShowSuggestion({
        original: product,
        alternative: alternative,
        savings: product.price - alternative.price
      });
      setHighlightedAisle(alternative.location.aisle);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Handle suggestion response
  const handleSuggestion = (accept) => {
    if (accept) {
      const alternativeWithOriginal = {
        ...showSuggestion.alternative,
        quantity: 1,
        originalPrice: showSuggestion.original.price
      };
      setCart([...cart, alternativeWithOriginal]);
    } else {
      const existingItem = cart.find(item => item.id === showSuggestion.original.id);
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === showSuggestion.original.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, { ...showSuggestion.original, quantity: 1 }]);
      }
    }
    setShowSuggestion(null);
    setHighlightedAisle(null);
  };

  // Update cart quantity
  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // Filter products by search
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Budget Setup Step
  if (currentStep === 'budget') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingCart className="mx-auto mb-4 text-blue-600" size={48} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Smart Cart</h1>
            <p className="text-gray-600 mb-6">Set your shopping budget to get started</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl font-semibold"
                placeholder="Enter your budget"
              />
            </div>
            
            <button
              onClick={() => setCurrentStep('shopping')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Shopping Interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-800">Smart Cart</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Budget: </span>
                <span className="font-semibold text-gray-800">₹{budget}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Left: </span>
                <span className={`font-semibold ${budgetLeft >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{budgetLeft}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin size={16} className="mr-1" />
                      <span>Aisle {product.location.aisle}, Shelf {product.location.shelf}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart & Map Section */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Cart</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">₹{item.price} each</p>
                        {item.originalPrice && (
                          <p className="text-xs text-green-600">
                            Saved ₹{item.originalPrice - item.price} per item
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">₹{cartTotal}</span>
                  </div>
                  {totalSaved > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-600">Total Saved:</span>
                      <span className="font-bold text-green-600">₹{totalSaved}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget Left:</span>
                    <span className={`font-semibold ${budgetLeft >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{budgetLeft}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${cartTotal > budget ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min((cartTotal / budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {((cartTotal / budget) * 100).toFixed(1)}% of budget used
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Store Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Store Map</h2>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[1, 2, 3, 4, 5].map(aisle => (
                  <div 
                    key={aisle}
                    className={`p-3 rounded-lg text-center font-medium transition-colors ${
                      highlightedAisle === aisle 
                        ? 'bg-green-500 text-white' 
                        : aisle === 3 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Aisle {aisle}
                    <div className="text-xs mt-1 opacity-75">
                      {aisle === 1 && 'Soap & Care'}
                      {aisle === 2 && 'Oral Care'}
                      {aisle === 3 && 'Hair Care'}
                      {aisle === 4 && 'Food Items'}
                      {aisle === 5 && 'Premium Care'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-2 bg-yellow-100 rounded-lg">
                <div className="flex items-center justify-center text-yellow-800 text-sm">
                  <MapPin size={16} className="mr-1" />
                  You are here (Aisle 3)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion Popup */}
      {showSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-orange-500 mr-2" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Smart Suggestion</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Save money by switching to a cheaper alternative!
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{showSuggestion.original.name}</p>
                    <p className="text-sm text-gray-600">
                      Aisle {showSuggestion.original.location.aisle}, Shelf {showSuggestion.original.location.shelf}
                    </p>
                  </div>
                  <span className="font-bold text-red-600">₹{showSuggestion.original.price}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{showSuggestion.alternative.name}</p>
                    <p className="text-sm text-gray-600">
                      Aisle {showSuggestion.alternative.location.aisle}, Shelf {showSuggestion.alternative.location.shelf}
                    </p>
                  </div>
                  <span className="font-bold text-green-600">₹{showSuggestion.alternative.price}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  💰 Save ₹{showSuggestion.savings} by switching!
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleSuggestion(true)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <CheckCircle size={16} className="mr-2" />
                Switch & Save
              </button>
              <button
                onClick={() => handleSuggestion(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <X size={16} className="mr-2" />
                Keep Original
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartCartApp;