// src/pages/ResponsePrompt.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Type, Send } from "lucide-react";
import { pipeline, env } from "@xenova/transformers";

// Force CDN for model files (avoid local 404→HTML parse errors)
env.allowLocalModels = false;
env.useBrowserCache = false;

export default function ResponsePrompt() {
  const navigate = useNavigate();

  const [responseMethod, setResponseMethod] = useState("typing"); // "typing" or "voice"
  const [typedResponse, setTypedResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [micPermissionStatus, setMicPermissionStatus] = useState('unknown');
  const [realtimeTranscript, setRealtimeTranscript] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const transcriberRef = useRef(null);
  const audioContextRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptionIntervalRef = useRef(null);

  const prompt =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua…";

  // Check microphone permissions on component mount
  useEffect(() => {
    checkMicrophonePermission().then(setMicPermissionStatus);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Check microphone permissions
  const checkMicrophonePermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        console.log('Microphone permission status:', permission.state);
        setMicPermissionStatus(permission.state);
        return permission.state;
      }
      setMicPermissionStatus('unknown');
      return 'unknown';
    } catch (error) {
      console.log('Permission API not supported:', error);
      setMicPermissionStatus('unknown');
      return 'unknown';
    }
  };

  // Test microphone access
  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionStatus('granted');
      alert('Microphone access successful! You can now use voice recording.');
    } catch (error) {
      console.error('Microphone test failed:', error);
      setMicPermissionStatus('denied');
      if (error.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone access and try again.');
      } else {
        alert(`Microphone test failed: ${error.message}`);
      }
    }
  };

  // Setup real-time speech recognition
  const setupRealtimeRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update realtime display
        setRealtimeTranscript(interimTranscript);
        
        // Add final results to typed response
        if (finalTranscript.trim()) {
          setTypedResponse(prev => {
            const newText = prev ? prev + ' ' + finalTranscript.trim() : finalTranscript.trim();
            return newText;
          });
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Speech recognition permission denied.');
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setRealtimeTranscript("");
      };
      
      recognitionRef.current = recognition;
      return recognition;
    }
    return null;
  };

  // Load Whisper model when needed
  const loadModel = async () => {
    if (transcriberRef.current || modelLoading) return;
    
    setModelLoading(true);
    try {
      console.log("Loading Whisper model...");
      transcriberRef.current = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en",
        { device: "webgpu" }
      );
      console.log("Whisper model loaded successfully");
    } catch (error) {
      console.log("WebGPU not available, falling back to CPU");
      try {
        transcriberRef.current = await pipeline(
          "automatic-speech-recognition",
          "Xenova/whisper-tiny.en"
        );
        console.log("Whisper model loaded successfully (CPU)");
      } catch (cpuError) {
        console.error("Failed to load model:", cpuError);
        alert("Failed to load speech recognition model. Please refresh and try again.");
      }
    } finally {
      setModelLoading(false);
    }
  };

  // Convert audio blob to format suitable for Whisper
  const convertAudioToFloat32Array = async (audioBlob) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    // Create audio context if it doesn't exist
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000 // Whisper expects 16kHz
      });
    }
    
    const audioContext = audioContextRef.current;
    
    try {
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get the first channel (mono)
      let audioData = audioBuffer.getChannelData(0);
      
      // Resample to 16kHz if necessary
      if (audioBuffer.sampleRate !== 16000) {
        const resampleRatio = 16000 / audioBuffer.sampleRate;
        const resampledLength = Math.floor(audioData.length * resampleRatio);
        const resampledData = new Float32Array(resampledLength);
        
        for (let i = 0; i < resampledLength; i++) {
          const srcIndex = i / resampleRatio;
          const srcIndexFloor = Math.floor(srcIndex);
          const srcIndexCeil = Math.min(srcIndexFloor + 1, audioData.length - 1);
          const fraction = srcIndex - srcIndexFloor;
          
          resampledData[i] = audioData[srcIndexFloor] * (1 - fraction) + 
                            audioData[srcIndexCeil] * fraction;
        }
        
        audioData = resampledData;
      }
      
      return audioData;
    } catch (error) {
      console.error("Error converting audio:", error);
      throw new Error("Failed to process audio data");
    }
  };

  // startRecording / stopRecording
  const startRecording = async () => {
    try {
      // Check permission first
      const permissionStatus = await checkMicrophonePermission();
      console.log('Permission status:', permissionStatus);
      
      if (permissionStatus === 'denied') {
        alert('Microphone access is blocked. Please enable microphone permissions in your browser settings and refresh the page.');
        return;
      }
      
      console.log('Requesting microphone access...');
      
      // Request with simpler constraints first
      let stream;
      try {
        // Try with optimal settings
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
      } catch (constraintError) {
        console.log('Optimal constraints failed, trying basic audio:', constraintError);
        // Fallback to basic audio
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true 
        });
      }
      
      console.log('Microphone access granted, setting up recorder...');
      
      // Start real-time speech recognition if available
      const recognition = setupRealtimeRecognition();
      if (recognition) {
        recognition.start();
        console.log('Real-time speech recognition started');
      }
      
      // Check what mime types are supported
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let mimeType = '';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log('Using mime type:', type);
          break;
        }
      }
      
      if (!mimeType) {
        console.warn('No supported mime types found, using default');
      }
      
      const options = mimeType ? { mimeType } : {};
      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('Audio chunk received:', e.data.size, 'bytes');
          audioChunksRef.current.push(e.data);
        }
      };
      
      mr.onstop = async () => {
        console.log("Recording stopped, processing audio...");
        
        // Stop real-time recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setRealtimeTranscript("");
        
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || 'audio/webm' });
        console.log("Audio blob size:", blob.size, "bytes");
        
        if (blob.size === 0) {
          console.error("No audio data recorded");
          alert("No audio was recorded. Please try again and speak clearly.");
          return;
        }
        
        // Only use Whisper as fallback if real-time recognition didn't work well
        if (transcriberRef.current && !recognitionRef.current) {
          await transcribeAudio(blob);
        }
        
        // Stop all tracks
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log('Audio track stopped');
        });
      };

      mr.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        alert("Recording error occurred. Please try again.");
        setIsRecording(false);
      };

      // Start recording with data collection every 1 second
      mr.start(1000);
      setIsRecording(true);
      console.log("Recording started successfully");
      
    } catch (err) {
      console.error("Microphone access error:", err);
      
      // Provide specific error messages
      if (err.name === 'NotAllowedError') {
        alert("Microphone access denied. Please:\n1. Click the microphone icon in your browser's address bar\n2. Allow microphone access\n3. Refresh the page and try again");
      } else if (err.name === 'NotFoundError') {
        alert("No microphone found. Please connect a microphone and try again.");
      } else if (err.name === 'NotReadableError') {
        alert("Microphone is already in use by another application. Please close other apps using the microphone and try again.");
      } else {
        alert(`Microphone error: ${err.message}. Please check your microphone settings and try again.`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Stop real-time recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRealtimeTranscript("");
  };

  const transcribeAudio = async (blob) => {
    if (!transcriberRef.current) {
      alert("Speech model not loaded. Please wait for it to load and try again.");
      return;
    }
    
    setIsTranscribing(true);
    console.log("Starting transcription...");
    
    try {
      // Convert audio to the format expected by Whisper
      const audioData = await convertAudioToFloat32Array(blob);
      console.log("Audio data length:", audioData.length);
      
      if (audioData.length === 0) {
        throw new Error("No audio data to transcribe");
      }
      
      // Transcribe using Whisper
      const result = await transcriberRef.current(audioData, {
        language: 'english',
        task: 'transcribe'
      });
      
      console.log("Raw transcription result:", result);
      
      // Handle different possible result formats
      let transcribedText = '';
      
      if (typeof result === 'string') {
        transcribedText = result.trim();
      } else if (result && typeof result === 'object') {
        // Try different possible properties
        if (result.text) {
          transcribedText = result.text.trim();
        } else if (result.transcription) {
          transcribedText = result.transcription.trim();
        } else if (result.result) {
          transcribedText = result.result.trim();
        } else if (Array.isArray(result) && result.length > 0) {
          // Handle array results
          if (typeof result[0] === 'string') {
            transcribedText = result[0].trim();
          } else if (result[0] && result[0].text) {
            transcribedText = result[0].text.trim();
          }
        } else {
          // Log the structure to help debug
          console.log("Unknown result structure:", Object.keys(result));
          console.log("Full result object:", JSON.stringify(result, null, 2));
        }
      }
      
      if (transcribedText) {
        setTypedResponse(prev => prev ? prev + " " + transcribedText : transcribedText);
        console.log("Transcription successful:", transcribedText);
      } else {
        console.log("No valid transcription found in result:", result);
        alert("No speech detected or transcription failed. Please try speaking more clearly.");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      alert(`Transcription failed: ${err.message}. Please try again.`);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handlers for toggles
  const handleVoiceClick = async () => {
    // if already recording, stop; else start
    if (isRecording) {
      stopRecording();
      return;
    }
    
    // Set to voice mode first
    setResponseMethod("voice");
    
    // Load model if not loaded (as fallback)
    if (!transcriberRef.current && !modelLoading) {
      loadModel(); // Don't await - let it load in background
    }
    
    // Start recording (will use real-time recognition if available)
    await startRecording();
  };

  const handleTypeClick = () => {
    if (isRecording) stopRecording();
    setResponseMethod("typing");
  };

  const handleSubmit = () => {
    if (typedResponse.trim()) {
      console.log("User response:", typedResponse);
      navigate("/"); // adjust as needed
    }
  };

  const canSubmit = typedResponse.trim().length > 0 && !isTranscribing;

  // Get the display text (typed response + realtime transcript)
  const displayText = typedResponse + (realtimeTranscript ? (typedResponse ? ' ' : '') + realtimeTranscript : '');

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <div className="flex-1 flex flex-col overflow-auto p-8">
        <form className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Share Your Thoughts
          </h2>

          <div className="bg-gray-50 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Prompt:</h3>
            <p className="text-gray-600 leading-relaxed">{prompt}</p>
          </div>

          {/* Microphone Permission Status */}
          {micPermissionStatus === 'denied' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                Microphone access denied. 
                <button 
                  onClick={testMicrophone}
                  className="ml-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
                >
                  Test Microphone
                </button>
              </div>
            </div>
          )}

          {micPermissionStatus === 'prompt' && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center text-yellow-700">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                Microphone permission needed. 
                <button 
                  onClick={testMicrophone}
                  className="ml-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded text-sm"
                >
                  Grant Access
                </button>
              </div>
            </div>
          )}

          {/* Toggle Buttons */}
          <div className="mb-6 flex gap-4">
            <button
              type="button"
              onClick={handleTypeClick}
              className={`flex items-center px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                responseMethod === "typing"
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                  : "border-gray-300 text-gray-700 hover:border-pink-300"
              }`}
            >
              <Type className="mr-2" size={20} />
              Type Response
            </button>

            <button
              type="button"
              onClick={handleVoiceClick}
              disabled={isTranscribing}
              className={`flex items-center px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                responseMethod === "voice"
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                  : "border-gray-300 text-gray-700 hover:border-pink-300"
              } ${isTranscribing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isRecording ? (
                <MicOff className="mr-2" size={20} />
              ) : (
                <Mic className="mr-2" size={20} />
              )}
              {isTranscribing
                ? "Transcribing…"
                : isRecording
                ? "Stop Recording"
                : "Voice Response"}
            </button>
          </div>

          {/* Model Loading Indicator */}
          {modelLoading && (
            <div className="flex items-center text-blue-500 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2" />
              Loading fallback speech model...
            </div>
          )}

          {/* Unified Response Box */}
          <div className="mb-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              value={displayText}
              onChange={(e) => {
                // Only allow manual editing when not recording
                if (!isRecording) {
                  setTypedResponse(e.target.value);
                }
              }}
              className={`w-full border border-gray-300 rounded-2xl p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                isRecording ? 'bg-gray-50' : ''
              }`}
              rows={6}
              placeholder="Type or dictate your response here..."
              disabled={isTranscribing}
              readOnly={isRecording}
            />
            {realtimeTranscript && (
              <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Speaking:</span> {realtimeTranscript}
              </div>
            )}
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center text-red-500 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
              Recording... (Click "Stop Recording" when done)
            </div>
          )}

          {/* Transcribing Indicator */}
          {isTranscribing && (
            <div className="flex items-center text-blue-500 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2" />
              Processing your speech...
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                if (isRecording) stopRecording();
                navigate(-1);
              }}
              className="px-6 py-2 bg-gray-300 rounded-full text-gray-800 hover:scale-105 transition-all duration-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
                canSubmit
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send className="mr-2" size={16} />
              Submit Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}