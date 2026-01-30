'use client';

import { useState, useEffect } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import { uploadAudioToS3, analyzeAudioCall, getCallAnalysis, getCallHistory, confirmCustomerAction } from '@/utils/audioApi';
import { FaMicrophone, FaSpinner, FaCheckCircle, FaExclamationCircle, FaUser, FaClock, FaComments, FaSearch, FaChartBar, FaTable } from 'react-icons/fa';
import SalesAnalytics from './SalesAnalytics';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SalesIntelligencePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('record'); // 'record' | 'analytics'
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Phase 1 & 2: Review & Confirm State
  const [editForm, setEditForm] = useState({ 
     name: '', 
     mobile: '', 
     email: '',
     address: '',
     budget: '',
     preferredCar: '',
     paymentMethod: 'Unknown',
     employmentType: 'Unknown'
  });
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const router = useRouter();

  // Fetch call history on mount
  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      const response = await getCallHistory(1, 10);
      setCallHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
  };

  const handleRecordingComplete = (file) => {
    // Store file and create preview URL
    setRecordedFile(file);
    setAudioPreviewUrl(URL.createObjectURL(file));
    toast.success('Recording saved! Click "Analyze" to process.', { duration: 3000 });
  };

  const handleAnalyze = async () => {
    if (!recordedFile) {
      toast.error('No recording found');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Step 0: Get Accurate Duration
      const getDuration = (file) => new Promise((resolve) => {
          const audio = new Audio(URL.createObjectURL(file));
          audio.onloadedmetadata = () => {
              resolve(Math.floor(audio.duration));
          };
          // Fallback if metadata fails
          setTimeout(() => resolve(Math.floor(file.size / 16000)), 1000); 
      });

      const accurateDuration = await getDuration(recordedFile);
      console.log('Calculated Duration:', accurateDuration);

      // Step 1: Upload to S3
      toast.loading('Uploading audio...', { id: 'upload' });
      const audioUrl = await uploadAudioToS3(recordedFile);
      toast.success('Audio uploaded!', { id: 'upload' });
      
      // Step 2: Start analysis
      toast.loading('Analyzing call...', { id: 'analyze' });
      const analysisResponse = await analyzeAudioCall(audioUrl, accurateDuration);
      const analysisId = analysisResponse.analysisId;
      
      // Step 3: Poll for completion
      setIsPolling(true);
      pollForAnalysis(analysisId);
      
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error(error.message || 'Failed to process recording', { id: 'analyze' });
      setIsProcessing(false);
      setIsPolling(false);
    }
  };

  const pollForAnalysis = async (analysisId, maxAttempts = 30) => {
    let attempts = 0;
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const analysis = await getCallAnalysis(analysisId);
        
        if (analysis.status === 'completed') {
          clearInterval(poll);
          setIsPolling(false);
          setIsProcessing(false);
          setCurrentAnalysis(analysis);
          
          // Initialize edit form and matches if pending
          if (analysis.customerAction === 'pending' && analysis.analysis) { // Use analysis.structuredData priority if available
             const structured = analysis.structuredData || {};
             
             setEditForm({
                name: analysis.analysis.customerName || '',
                mobile: '', // Will be filled if match selected or extracted
                email: '',
                address: structured.address || '',
                budget: structured.budget || '',
                preferredCar: structured.preferredCar ? structured.preferredCar.join(', ') : '',
                paymentMethod: structured.paymentMethod || 'Unknown',
                employmentType: structured.employmentType || 'Unknown'
             });
             setSuggestedMatches(analysis.suggestedMatches || []);
          }
          
          toast.success('Analysis complete! Please review.', { id: 'analyze' });
          fetchCallHistory(); // Refresh history
        } else if (analysis.status === 'failed') {
          clearInterval(poll);
          setIsPolling(false);
          setIsProcessing(false);
          toast.error('Analysis failed: ' + (analysis.error || 'Unknown error'), { id: 'analyze' });
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          setIsPolling(false);
          setIsProcessing(false);
          toast.error('Analysis timed out. Please check history.', { id: 'analyze' });
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(poll);
        setIsPolling(false);
        setIsProcessing(false);
        toast.error('Failed to check analysis status', { id: 'analyze' });
      }
    }, 2000); // Poll every 2 seconds
  };

  const getSentimentBadge = (sentiment) => {
    const colors = {
      'Positive': 'bg-green-100 text-green-800 border-green-300',
      'Neutral': 'bg-gray-100 text-gray-800 border-gray-300',
      'Negative': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Hostile': 'bg-red-100 text-red-800 border-red-300'
    };
    
    return colors[sentiment] || colors['Neutral'];
  };

  const handleConfirmAction = async (action) => {
    if (!currentAnalysis) return;

    try {
        const toastId = toast.loading('Processing...');
        
        await confirmCustomerAction(
            currentAnalysis._id,
            action,
            editForm,
            selectedMatch // customerId if update
        );

        toast.success(`Action ${action} completed successfully!`, { id: toastId });
        
        // Refresh analysis state
        const updatedAnalysis = await getCallAnalysis(currentAnalysis._id);
        setCurrentAnalysis(updatedAnalysis);
        fetchCallHistory();

    } catch (error) {
        console.error('Confirmation error:', error);
        toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FaMicrophone className="text-4xl text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Field Sales Audio Intelligence
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Record in-person interactions, get AI-powered insights, and automatically update customer records.
          </p>
        </div>



        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('record')}
            className={`pb-3 px-1 flex items-center space-x-2 font-medium transition-all ${
              activeTab === 'record' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaMicrophone /> <span>Record & Analyze</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-1 flex items-center space-x-2 font-medium transition-all ${
              activeTab === 'analytics' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaChartBar /> <span>Performance Analytics</span>
          </button>
        </div>

        {activeTab === 'analytics' ? (
          <SalesAnalytics />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Recorder */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaMicrophone className="mr-2 text-indigo-500" />
                Record Interaction
              </h2>
              
              <AudioRecorder 
                onRecordingComplete={handleRecordingComplete}
              />
              
              {/* Audio Preview & Analyze Button */}
              {recordedFile && !isProcessing && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Preview Recording</div>
                    <audio 
                      controls 
                      src={audioPreviewUrl} 
                      className="w-full"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      File size: {(recordedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Analyze Interaction</span>
                  </button>
                </div>
              )}
              
              {isProcessing && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaSpinner className="text-blue-600 animate-spin text-xl" />
                    <div>
                      <div className="font-semibold text-blue-900">Processing...</div>
                      <div className="text-sm text-blue-700">
                        {isPolling ? 'Analyzing transcript...' : 'Uploading audio...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-bold text-indigo-900 mb-3">📋 How to Use</h3>
              <ol className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Click the microphone button to start recording</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Have your conversation with the customer (Hindi/English supported)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Click stop when finished, then upload & analyze</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>AI will extract customer details and create/update their profile</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Right Column: Results & History */}
          <div className="space-y-6">
            
            {/* Analysis Results / Review Panel */}
            {(currentAnalysis || isProcessing) && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 p-4">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Recording...
                      </>
                    ) : currentAnalysis?.customerAction === 'pending' ? (
                      <>
                        <FaExclamationCircle className="text-amber-500 mr-2" />
                        Review & Confirm Customer Data
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-green-500 mr-2" />
                        Analysis Results
                      </>
                    )}
                  </h2>
                </div>

                {isProcessing && (
                   <div className="p-8 text-center space-y-4"> 
                      <div className="max-w-md mx-auto">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 animate-progress origin-left"></div>
                          </div>
                          <p className="text-sm text-slate-500 mt-2">
                              {isPolling ? "Finalizing analysis..." : "Uploading & Transcribing..."}
                          </p>
                      </div>
                   </div>
                )}

                {!isProcessing && currentAnalysis && (
                  <div className="p-6 space-y-8">
                    
                    {/* Review Mode: Form & Matches */}
                    {currentAnalysis.customerAction === 'pending' && (
                      <div className="space-y-6">
                         {/* Transcript Toggle Section */}
                          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                            <button 
                                onClick={() => setShowTranscript(!showTranscript)}
                                className="w-full flex justify-between items-center p-4 hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-bold text-indigo-600">
                                    <FaComments /> Call Transcript
                                </div>
                                <div className="text-xs text-slate-500 font-semibold uppercase">{showTranscript ? 'Hide' : 'Show'}</div>
                            </button>
                            
                            {showTranscript && (
                                <div className="p-4 border-t border-slate-200 max-h-[300px] overflow-y-auto bg-white text-sm space-y-3">
                                    {currentAnalysis.diarization && currentAnalysis.diarization.length > 0 ? (
                                        currentAnalysis.diarization.map((turn, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className={`min-w-[80px] text-xs font-bold uppercase ${turn.speaker.includes('0') ? 'text-indigo-600' : 'text-green-600'}`}>
                                                    {turn.speaker.includes('0') ? 'Sales Rep' : 'Customer'}
                                                </div>
                                                <div className="text-slate-700">{turn.text}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-slate-500 whitespace-pre-wrap italic">
                                            {currentAnalysis.transcript || 'No transcript available.'}
                                        </div>
                                    )}
                                </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Left: Extracted Data Form */}
                             <div className="space-y-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                              <h3 className="text-sm font-semibold text-amber-800 flex items-center mb-1">
                                  <FaUser className="mr-2" /> AI Extracted Data
                              </h3>
                              <p className="text-xs text-amber-700">
                                  Review and edit extracted details before saving.
                              </p>
                            </div>

                            <div className="space-y-4">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                                  <input 
                                      type="text" 
                                      value={editForm.name}
                                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                      className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
                                      placeholder="Enter customer name"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                  <input 
                                      type="text" 
                                      value={editForm.mobile}
                                      onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                                      className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
                                      placeholder="Enter phone number"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                  <input 
                                      type="email" 
                                      value={editForm.email}
                                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                      className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
                                      placeholder="Enter email address"
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
                                      <input 
                                          type="text" 
                                          value={editForm.budget}
                                          onChange={(e) => setEditForm({...editForm, budget: e.target.value})}
                                          className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                                          placeholder="e.g. 2-3 Lakhs"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Car</label>
                                      <input 
                                          type="text" 
                                          value={editForm.preferredCar}
                                          onChange={(e) => setEditForm({...editForm, preferredCar: e.target.value})}
                                          className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                                          placeholder="e.g. Swift, Alto"
                                      />
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                      <select 
                                          value={editForm.paymentMethod}
                                          onChange={(e) => setEditForm({...editForm, paymentMethod: e.target.value})}
                                          className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                                      >
                                          <option value="Unknown" className="text-slate-900">Unknown</option>
                                          <option value="Cash" className="text-slate-900">Cash</option>
                                          <option value="Finance" className="text-slate-900">Finance</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">Employment</label>
                                      <select 
                                          value={editForm.employmentType}
                                          onChange={(e) => setEditForm({...editForm, employmentType: e.target.value})}
                                          className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                                      >
                                          <option value="Unknown" className="text-slate-900">Unknown</option>
                                          <option value="Business" className="text-slate-900">Business</option>
                                          <option value="Govt Job" className="text-slate-900">Govt Job</option>
                                          <option value="Pvt Job" className="text-slate-900">Pvt Job</option>
                                          <option value="Other" className="text-slate-900">Other</option>
                                      </select>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Address / Location</label>
                                  <input 
                                      type="text" 
                                      value={editForm.address}
                                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                      className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
                                      placeholder="e.g. Bariatu, Ranchi"
                                  />
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                              <h4 className="text-sm font-medium text-slate-700 mb-2">Analysis Summary</h4>
                              <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mb-4">
                                  {currentAnalysis.analysis.summary}
                              </div>
                              
                              {/* Phase 2: Coaching Scorecard */}
                              {currentAnalysis.coaching && (
                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                                   <div className="flex justify-between items-center mb-2">
                                     <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Quality Scorecard</h4>
                                     {currentAnalysis.structuredData?.customerStatus && (
                                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                          currentAnalysis.structuredData.customerStatus === 'Hot' ? 'bg-red-100 text-red-700' :
                                          currentAnalysis.structuredData.customerStatus === 'Warm' ? 'bg-orange-100 text-orange-700' :
                                          'bg-blue-100 text-blue-700'
                                       }`}>
                                         {currentAnalysis.structuredData.customerStatus} Lead
                                       </span>
                                     )}
                                   </div>
                                   <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="flex items-center">
                                         <span className="mr-2">{currentAnalysis.coaching.brandPitchDetected ? '✅' : '❌'}</span>
                                         <span className={currentAnalysis.coaching.brandPitchDetected ? 'text-green-700' : 'text-red-700'}>Brand Pitch</span>
                                      </div>
                                      <div className="flex items-center">
                                         <span className="mr-2">{currentAnalysis.coaching.processExplained ? '✅' : '❌'}</span>
                                         <span className={currentAnalysis.coaching.processExplained ? 'text-green-700' : 'text-red-700'}>Process Explained</span>
                                      </div>
                                   </div>
                                   {currentAnalysis.coaching.feedback && (
                                      <div className="mt-2 text-xs text-indigo-700 italic border-t border-indigo-100 pt-2">
                                        "{currentAnalysis.coaching.feedback}"
                                      </div>
                                   )}
                                </div>
                              )}
                            </div>
                         </div>

                         {/* Right: Smart Matches */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                                  <FaSearch className="mr-2 text-indigo-500" /> 
                                  {suggestedMatches.length > 0 ? 'Suggested Matches' : 'No matches found'}
                              </h3>

                              <div className="space-y-3">
                                  {suggestedMatches.length > 0 ? (
                                      suggestedMatches.map((match) => (
                                          <div 
                                              key={match._id}
                                              onClick={() => {
                                                  setSelectedMatch(match._id);
                                                  setEditForm({
                                                      name: match.customerName,
                                                      mobile: match.mobile,
                                                      email: match.email || ''
                                                  });
                                              }}
                                              className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                                                  selectedMatch === match._id
                                                  ? 'border-indigo-500 bg-indigo-50' 
                                                  : 'border-slate-200 hover:border-indigo-300'
                                              }`}
                                          >
                                              <div className="flex justify-between items-start mb-2">
                                                  <div>
                                                      <div className="font-semibold text-slate-800">{match.customerName}</div>
                                                      <div className="text-xs text-slate-500">{match.customId}</div>
                                                  </div>
                                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                      match.confidenceScore > 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                  }`}>
                                                      {match.confidenceScore}% Match
                                                  </span>
                                              </div>
                                              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                  <div>📱 {match.mobile || 'N/A'}</div>
                                                  <div>📧 {match.email || 'N/A'}</div>
                                                  <div className="col-span-2">🕒 Last active: {new Date(match.lastContact).toLocaleDateString()}</div>
                                              </div>
                                          </div>
                                      ))
                                  ) : (
                                      <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                                          <p className="text-sm text-slate-500">
                                              No existing customers matched this profile.
                                          </p>
                                          <p className="text-xs text-slate-400 mt-1">
                                              Based on name and phone similarity.
                                          </p>
                                      </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="pt-6 space-y-3">
                                      <button
                                          onClick={() => handleConfirmAction(selectedMatch ? 'update' : 'create')}
                                          className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all ${
                                              selectedMatch 
                                              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                                              : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                          }`}
                                      >
                                          {selectedMatch ? 'Update Selected Customer' : 'Create New Customer'}
                                      </button>
                                      
                                      <button
                                          onClick={() => handleConfirmAction('discard')}
                                          className="w-full py-3 rounded-lg font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-all"
                                      >
                                          Discard Analysis
                                      </button>
                                  </div>
                              </div>
                         </div>
                      </div>
                    </div>
                    )}

                    {/* Confirmed View (Read Only) */}
                    {currentAnalysis.customerAction !== 'pending' && (
                      <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center">
                                  <div className="bg-green-100 p-2 rounded-full mr-3">
                                      <FaCheckCircle className="text-green-600 text-xl" />
                                  </div>
                                  <div>
                                      <h3 className="font-semibold text-green-900">
                                          Customer {currentAnalysis.customerAction === 'create' ? 'Created' : 'Updated'} Successfully
                                      </h3>
                                      <p className="text-sm text-green-700">
                                          Data has been saved to the CRM.
                                      </p>
                                  </div>
                              </div>
                              <a 
                                  href={`/admin/customers/${currentAnalysis.linkedCustomer?._id || currentAnalysis.linkedCustomer}`}
                                  className="px-4 py-2 bg-white text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-50"
                              >
                                  View Profile
                              </a>
                          </div>

                          {/* Full Analysis Display */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer Profile</h4>
                                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                      <div className="text-lg font-bold text-slate-800 mb-1">{currentAnalysis.analysis.customerName || 'Unknown'}</div>
                                      <div className="text-sm text-slate-600 mb-2">Sentiment: 
                                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                              currentAnalysis.analysis.customerSentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                                              currentAnalysis.analysis.customerSentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                                              'bg-slate-100 text-slate-700'
                                          }`}>
                                              {currentAnalysis.analysis.customerSentiment}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                              
                              <div>
                                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Interaction Highlights</h4>
                                  <div className="space-y-2">
                                      {currentAnalysis.analysis.topicsDiscussed?.map((topic, i) => (
                                          <span key={i} className="inline-block bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium mr-2 mb-2">
                                              {topic}
                                          </span>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          
                          <div>
                              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Action Items</h4>
                              <ul className="space-y-2">
                                  {currentAnalysis.analysis.actionItems?.map((item, i) => (
                                      <li key={i} className="flex items-start text-sm text-slate-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                          <span className="mr-2 mt-0.5 text-yellow-500">☐</span>
                                          <span>{item.task} {item.dueDate && <span className="text-slate-400 text-xs ml-1">({item.dueDate})</span>}</span>
                                      </li>
                                  ))}
                                  {(!currentAnalysis.analysis.actionItems || currentAnalysis.analysis.actionItems.length === 0) && (
                                      <li className="text-sm text-slate-400 italic">No action items detected.</li>
                                  )}
                              </ul>
                          </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* Interaction History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaComments className="mr-2 text-indigo-500" />
                Recent Interactions
              </h2>
              
              {callHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No call history yet. Record your first call!</p>
              ) : (
                <div className="space-y-3">
                  {callHistory.map((call) => (
                    <div 
                      key={call._id} 
                      className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        if (call.status === 'completed') {
                          setCurrentAnalysis(call);
                          
                          // Initialize edit form and matches if pending
                          if (call.customerAction === 'pending' && call.analysis) {
                             setEditForm({
                                name: call.analysis.customerName || '',
                                mobile: '', 
                                email: ''
                             });
                             setSuggestedMatches(call.suggestedMatches || []);
                          }
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">
                            {call.analysis?.customerName || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {call.analysis?.customerSentiment && (
                              <span className={`inline-block px-2 py-0.5 rounded text-xs mr-2 ${getSentimentBadge(call.analysis.customerSentiment)}`}>
                                {call.analysis.customerSentiment}
                              </span>
                            )}
                            {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')} min
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(call.createdAt).toLocaleDateString()}
                          </div>
                          <div className={`text-xs font-semibold mt-1 ${
                            call.status === 'completed' ? 'text-green-600' :
                            call.status === 'processing' ? 'text-blue-600' :
                            'text-red-600'
                          }`}>
                            {call.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
