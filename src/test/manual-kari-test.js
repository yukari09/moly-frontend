// Manual test script to verify KariOptimizer result interaction features
// Run this in browser console on a page with KariOptimizer

console.log('Testing KariOptimizer Result Interaction Features');

// Test localStorage functionality
const testSavedResult = {
  id: Date.now().toString(),
  timestamp: new Date().toISOString(),
  originalPrompt: 'Test original prompt',
  optimizedPrompt: 'Test optimized prompt with improvements',
  platform: 'chatgpt',
  mode: 'BASIC',
  generatorType: 'writing',
  keyImprovements: ['Better clarity', 'More specific'],
  techniquesApplied: ['Role assignment', 'Context layering'],
  proTip: 'Test pro tip'
};

// Test saving to localStorage
try {
  const existingSaved = JSON.parse(localStorage.getItem('kari-saved-results') || '[]');
  const updatedSaved = [testSavedResult, ...existingSaved.slice(0, 19)];
  localStorage.setItem('kari-saved-results', JSON.stringify(updatedSaved));
  console.log('✅ Successfully saved test result to localStorage');
  console.log('Saved result:', testSavedResult);
} catch (error) {
  console.error('❌ Failed to save to localStorage:', error);
}

// Test loading from localStorage
try {
  const saved = localStorage.getItem('kari-saved-results');
  if (saved) {
    const parsedSaved = JSON.parse(saved);
    console.log('✅ Successfully loaded saved results from localStorage');
    console.log('Number of saved results:', parsedSaved.length);
    console.log('First saved result:', parsedSaved[0]);
  } else {
    console.log('ℹ️ No saved results found in localStorage');
  }
} catch (error) {
  console.error('❌ Failed to load from localStorage:', error);
}

// Test clipboard functionality (requires user interaction)
console.log('To test clipboard functionality:');
console.log('1. Navigate to a page with KariOptimizer');
console.log('2. Generate an optimized prompt');
console.log('3. Click the Copy button');
console.log('4. Check if the prompt is copied to clipboard');

// Test Web Share API availability
if (navigator.share) {
  console.log('✅ Web Share API is available');
  console.log('Can share:', navigator.canShare ? 'Yes' : 'Unknown');
} else {
  console.log('ℹ️ Web Share API is not available (will fallback to clipboard)');
}

// Test result structure validation
function validateResultStructure(result) {
  const requiredFields = [
    'id', 'timestamp', 'originalPrompt', 'optimizedPrompt', 
    'platform', 'mode', 'generatorType'
  ];
  
  const missingFields = requiredFields.filter(field => !(field in result));
  
  if (missingFields.length === 0) {
    console.log('✅ Result structure is valid');
    return true;
  } else {
    console.error('❌ Result structure is invalid. Missing fields:', missingFields);
    return false;
  }
}

validateResultStructure(testSavedResult);

console.log('Manual test completed. Check the console output above for results.');