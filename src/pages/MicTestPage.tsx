import Button from '../components/Button'
import { useMicTest } from '../hooks/useMicTest'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircleIcon, 
  ClockIcon,
  PlayIcon 
} from '@heroicons/react/24/outline'

const testSentence = '"Hello, this is a microphone test. Please speak clearly."'

function MicTestPage() {
  const navigate = useNavigate()
  const {
    micStatus,
    recordStatus,
    audioUrl,
    timer,
    requestMicAccess,
    startRecording,
    resetTest,
  } = useMicTest()

  const permissionGranted = micStatus === 'granted'
  const isRequesting = micStatus === 'requesting'
  const isRecording = recordStatus === 'recording'
  const isFinished = recordStatus === 'finished'

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/')}
          >
            ← Back
          </Button>
          <div className="text-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
            Microphone Test
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Step 1: Permission */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-200">1. Check Access</h2>
              </div>
              
              <Button
                size="lg"
                className="w-full justify-center"
                onClick={requestMicAccess}
                disabled={isRequesting || permissionGranted}
              >
                {isRequesting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Checking...
                  </>
                ) : permissionGranted ? (
                  '✅ Mic Access Granted'
                ) : (
                  'Grant Microphone Permission'
                )}
              </Button>

              {permissionGranted && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-emerald-400 font-medium flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Mic is working perfectly ✅
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Recording */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-200">2. Record Test</h2>
              </div>

              {/* Test Sentence */}
              <div className="mb-6 p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl border-2 border-dashed border-slate-600">
                <p className="text-slate-300 font-mono text-lg leading-relaxed text-center">
                  {testSentence}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={() => startRecording(5)}
                disabled={!permissionGranted || isRecording}
              >
                {isRecording ? (
                  <>
                    <div className="mic-indicator animate-pulse" />
                    Recording... {timer}s
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5" />
                    Start Recording (5s)
                  </>
                )}
              </Button>

              {isFinished && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-emerald-400 font-medium flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Audio captured successfully ✅
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {isFinished && audioUrl && (
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border border-emerald-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3 justify-center">
              <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
              Test Complete!
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-slate-900/50 rounded-2xl">
                <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-400 font-semibold">✅ Permission Granted</p>
              </div>
              <div className="text-center p-6 bg-slate-900/50 rounded-2xl">
                <CheckCircleIcon className="w-16 h-16 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-400 font-semibold">✅ Audio Recorded</p>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <audio controls className="w-full rounded-xl" src={audioUrl} />
            </div>

            <div className="flex gap-4 mt-8">
              <Button 
                variant="secondary" 
                size="lg"
                className="flex-1"
                onClick={resetTest}
              >
                🔄 Retry Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default MicTestPage
