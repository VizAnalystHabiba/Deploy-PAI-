document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newsForm = document.getElementById('news-form');
    const newsTextArea = document.getElementById('news-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultSection = document.getElementById('result-section');
    const predictionElement = document.getElementById('prediction');
    const confidenceElement = document.getElementById('confidence');
    const resultDetails = document.getElementById('result-details');
    const loaderContainer = document.querySelector('.loader-container');
    const resultContent = document.querySelector('.result-content');
  
    // Event Listeners
    newsForm.addEventListener('submit', handleFormSubmit);
    newsTextArea.addEventListener('input', handleTextInput);
  
    // Functions
    function handleFormSubmit(e) {
      e.preventDefault();
      
      const text = newsTextArea.value.trim();
      
      if (!validateInput(text)) {
        showError('Please enter at least 100 characters for accurate analysis');
        return;
      }
      
      analyzeArticle(text);
    }
  
    function handleTextInput() {
      // Hide results when user starts typing again
      if (!resultSection.classList.contains('hidden')) {
        resultSection.classList.add('hidden');
      }
    }
  
    function validateInput(text) {
      return text.length >= 100;
    }
  
    function showError(message) {
      // Create or update error element
      let errorElement = document.querySelector('.error-message');
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        newsForm.insertBefore(errorElement, newsForm.firstChild);
      }
      
      errorElement.textContent = message;
      errorElement.style.color = 'var(--danger-color)';
      errorElement.style.marginBottom = 'var(--space-md)';
      
      // Remove error after 5 seconds
      setTimeout(() => {
        errorElement.remove();
      }, 5000);
    }
  
    async function analyzeArticle(text) {
      try {
        // Show loading state
        toggleLoading(true);
        
        // Make API request
        const response = await fetch('/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display results
        displayResults(data);
      } catch (error) {
        console.error('Error analyzing article:', error);
        showError('Failed to analyze article. Please try again later.');
      } finally {
        toggleLoading(false);
      }
    }
  
    function displayResults(data) {
      // Update DOM elements
      predictionElement.textContent = data.prediction;
      predictionElement.className = 'result-value ' + data.prediction.toLowerCase();
      confidenceElement.textContent = data.confidence;
      
      // Show result details if available
      if (data.details) {
        resultDetails.classList.remove('hidden');
      }
      
      // Show result section
      resultSection.classList.remove('hidden');
      
      // Scroll to results
      resultSection.scrollIntoView({ behavior: 'smooth' });
    }
  
    function toggleLoading(isLoading) {
      if (isLoading) {
        loaderContainer.classList.remove('hidden');
        resultContent.classList.add('hidden');
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span class="button-text">Analyzing...</span>';
      } else {
        loaderContainer.classList.add('hidden');
        resultContent.classList.remove('hidden');
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="button-text">Analyze Article</span><span class="button-icon" aria-hidden="true">🔍</span>';
      }
    }
  
    // Initialize
    function init() {
      // Any initialization code can go here
      console.log('Fake News Detector initialized');
    }
  
    init();
  });