import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const LivePriceReceipt = () => {
  const { selectedCourt, selectedSlot, selectedCoach, selectedDate } = useSelector((state) => state.booking);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // --- PRICING LOGIC SIMULATION ---
  const calculateTotal = () => {
    if (!selectedCourt || !selectedSlot) return 0;

    let total = selectedCourt.basePrice;
    
    // 1. Weekend Rule (+50)
    const day = new Date(selectedDate).getDay();
    if (day === 0 || day === 6) total += 50;

    // 2. Peak Hour Rule (x1.5) - 6PM to 9PM
    if (selectedSlot.startTime >= 18 && selectedSlot.startTime < 21) {
      total = total * 1.5;
    }

    // 3. Indoor Premium Rule (+30)
    if (selectedCourt.type === 'Indoor') {
      total += 30;
    }

    // 4. Coach Fee
    if (selectedCoach) {
      total += selectedCoach.hourlyRate;
    }

    return Math.round(total);
  };

  const handleBook = async () => {
    if (!selectedCourt || !selectedSlot) return;
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        courtId: selectedCourt._id,
        coachId: selectedCoach?._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        userEmail: "test@user.com" // Hardcoded for MVP, add Input if needed
      };

      // CALL BACKEND
      await axios.post(`${API_BASE_URL}/bookings`, payload);
      setMessage({ type: 'success', text: 'Booking Confirmed! ✅' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Booking Failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCourt) {
    return (
      <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 text-center text-gray-400">
        Select a court to see pricing
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Booking Summary</h3>
      
      {/* Receipt Details */}
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Court Base</span>
          <span>₹{selectedCourt.basePrice}</span>
        </div>
        
        {/* Logic Checks for Visuals */}
        {(new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6) && (
          <div className="flex justify-between text-orange-600">
            <span>Weekend Surge</span>
            <span>+₹50</span>
          </div>
        )}
        
        {selectedCourt.type === 'Indoor' && (
           <div className="flex justify-between text-blue-600">
           <span>Indoor Premium</span>
           <span>+₹30</span>
         </div>
        )}

        {(selectedSlot && selectedSlot.startTime >= 18 && selectedSlot.startTime < 21) && (
          <div className="flex justify-between text-red-600">
            <span>Peak Hour (x1.5)</span>
            <span>Applied</span>
          </div>
        )}

        {selectedCoach && (
          <div className="flex justify-between text-purple-600">
            <span>Coach ({selectedCoach.name})</span>
            <span>+₹{selectedCoach.hourlyRate}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t pt-4 mb-6">
        <span>Total</span>
        <span>₹{calculateTotal()}</span>
      </div>

      {/* Action Button */}
      <button
        onClick={handleBook}
        disabled={!selectedSlot || loading}
        className={`w-full py-3 rounded-lg font-semibold flex justify-center items-center gap-2
          ${!selectedSlot 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800 shadow-lg'
          }
        `}
      >
        {loading && <Loader2 className="animate-spin" size={20} />}
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>

      {/* Status Messages */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default LivePriceReceipt;