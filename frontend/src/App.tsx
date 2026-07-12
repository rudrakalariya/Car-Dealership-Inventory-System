import { Button } from '@/components/ui/button';

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Car Dealership UI</h1>
        <p className="text-zinc-500 mb-6">
          Welcome to the Car Dealership Inventory System frontend.
        </p>
        <div className="flex gap-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
