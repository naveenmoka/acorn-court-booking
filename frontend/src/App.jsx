import BookingPage from './pages/BookingPage';
import LivePriceReceipt from './components/LivePriceReceipt'; // Ensure import works

function App() {
  return (
    <div>
      {/* Simple Header */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="font-bold text-xl tracking-tight">AcornCourts</span>
        </div>
      </nav>
      
      <BookingPage />
    </div>
  );
}

export default App;