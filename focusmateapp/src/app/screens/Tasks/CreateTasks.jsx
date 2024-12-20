import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/Context';
import { db } from "../../../utils/Firebase/FirebaseConfig"
import { OpenAI } from 'openai';
import axios from 'axios';
import { FaMicrophone } from 'react-icons/fa';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

function CreateTasks() {
  const { user } = useAuth();
  const [taskText, setTaskText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Start recording audio
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioFile(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Stop recording after 10 seconds
        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 10000); // Stop after 10 seconds or adjust as needed
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });
  };

  // Transcribe the audio using OpenAI's Whisper API
  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'whisper-1');

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: process.env.REACT_APP_OPENAI_API_KEY,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const transcription = response.data.text;
      setTaskText(transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  // Generate task based on user input or transcribed text
  const generateTaskFromText = async (text) => {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate a task from this input: ${text}`,
        max_tokens: 50,
      });
      return response.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating task:', error);
      return null;
    }
  };

  // Handle task submission (manual or voice input)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to create a task.');
      return;
    }

    setIsProcessing(true);
    const task = await generateTaskFromText(taskText);

    if (!task) {
      alert('Failed to create task.');
      setIsProcessing(false);
      return;
    }

    try {
      const userDocRef = db.collection('users').doc(user.uid);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        // Add task to Firestore under the user's document
        await userDocRef.collection('tasks').add({
          text: task,
          createdAt: new Date(),
        });
        alert('Task created successfully!');
        setTaskText('');
      } else {
        alert('User not found in Firestore.');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task.');
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    if (audioFile) {
      transcribeAudio(audioFile);
    }
  }, [audioFile]);

  return (
    <div className="task-container">
      <h1>Create Task</h1>

      <div className="task-input-container">
        <textarea
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task here"
          rows="4"
        />
      </div>

      <div className="voice-input-container">
        <button onClick={startRecording} disabled={isRecording}>
          <p> <FaMicrophone /></p>
        </button>
        <button onClick={() => setIsRecording(false)} disabled={!isRecording}>
          Stop Recording
        </button>
        {isRecording && <p>Recording...</p>}
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Create Task'}
      </button>
    </div>
  );
}

export default CreateTasks;
