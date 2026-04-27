import React, { useState } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import './VoiceInput.css';

function VoiceInput({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onstart = () => {
        setIsListening(true);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognizer.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.results[event.results.length - 1].isFinal) {
          onTranscript(transcript);
        }
      };

      recognizer.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognizer);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <button
      className={`voice-btn ${isListening ? 'listening' : ''}`}
      onClick={toggleListening}
      title="Voice input"
    >
      {isListening ? <FiMicOff /> : <FiMic />}
    </button>
  );
}

export default VoiceInput;
