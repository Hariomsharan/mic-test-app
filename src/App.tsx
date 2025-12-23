import { useNavigate } from 'react-router-dom'
import Button from './components/Button'
import { MicrophoneIcon } from '@heroicons/react/24/outline'

function App() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
            <MicrophoneIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Mic Test App
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Verify your microphone works in seconds. 
            <br />
            <span className="text-slate-500">Browser permission + quick recording test</span>
          </p>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => navigate('/mic-test')}
          className="transform hover:scale-105"
        >
          <MicrophoneIcon className="w-5 h-5" />
          Start Mic Test
        </Button>
        
        <p className="text-xs text-slate-500">
          Chrome/Edge recommended • HTTPS required
        </p>
      </div>
    </main>
  )
}

export default App
