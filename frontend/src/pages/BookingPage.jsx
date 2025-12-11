import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResources, setSelectedCourt, setSelectedSlot, toggleCoach } from '../redux/bookingSlice';
import { format } from 'date-fns';
import LivePriceReceipt from '../components/LivePriceReceipt';
import { Check, User, Clock } from 'lucide-react';

const BookingPage = () => {
  const dispatch = useDispatch();
  const { courts, coaches, selectedCourt, selectedDate, selectedSlot, selectedCoach } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  // Generate Slots (6 AM to 9 PM)
  const generateSlots = () => {
    const slots = [];
    let start = 6; 
    for (let i = 0; i < 15; i++) { 
      slots.push(start + i);
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Court Selection */}
        <div className="md:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">1. Select Court</h2>
          <div className="space-y-3">
            {courts.map((court) => (
              <div 
                key={court._id}
                onClick={() => dispatch(setSelectedCourt(court))}
                className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                  selectedCourt?._id === court._id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-white bg-white hover:border-gray-200'
                }`}
              >
                <div className="font-semibold text-gray-700">{court.name}</div>
                <div className="text-sm text-gray-500">{court.type} • ₹{court.basePrice}/hr</div>
              </div>
            ))}
          </div>

          {/* Coach Selection (Moved here for flow) */}
          <h2 className="text-xl font-bold text-gray-800 pt-4">Optional: Add Coach</h2>
          <div className="space-y-3">
            {coaches.map((coach) => (
              <div 
                key={coach._id}
                onClick={() => dispatch(toggleCoach(coach))}
                className={`p-3 rounded-lg cursor-pointer border-2 flex items-center gap-3 ${
                  selectedCoach?._id === coach._id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-white bg-white'
                }`}
              >
                <User size={20} className="text-purple-600" />
                <div>
                  <div className="font-medium text-sm">{coach.name}</div>
                  <div className="text-xs text-gray-500">+₹{coach.hourlyRate}/hr</div>
                </div>
                {selectedCoach?._id === coach._id && <Check size={16} className="ml-auto text-purple-600" />}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN: Slot Grid */}
        <div className="md:col-span-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">2. Select Time</h2>
          
          {/* Date Header (Simple today view for MVP) */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
             <span className="text-gray-500">Date:</span> 
             <span className="font-bold ml-2 text-gray-800">{format(new Date(selectedDate), 'PPPP')}</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {generateSlots().map((hour) => {
              const isSelected = selectedSlot?.startTime === hour;
              
              return (
                <button
                  key={hour}
                  onClick={() => dispatch(setSelectedSlot({ startTime: hour, endTime: hour + 1 }))}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center gap-1
                    ${isSelected 
                      ? 'bg-blue-600 text-white shadow-lg scale-105' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  <Clock size={16} />
                  {hour}:00 - {hour + 1}:00
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Price & Checkout */}
        <div className="md:col-span-3">
          <LivePriceReceipt />
        </div>

      </div>
    </div>
  );
};

export default BookingPage;