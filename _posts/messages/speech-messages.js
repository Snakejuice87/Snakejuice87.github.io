function speakText(element) {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
        // Get the inner text of the clicked element
        let text = element.innerText;
        
        // Split the text into words
        let words = text.split(' ');

        // Create a new SpeechSynthesisUtterance object
        let utterance = new SpeechSynthesisUtterance(text);

        // Set voice properties (optional)
        utterance.lang = 'en-AU';
        utterance.pitch = 1;
        utterance.rate = 1;

        // Initialize word index
        let wordIndex = 0;

        // Function to highlight the current word
        function highlightWord() {
            // Reset the inner HTML of the element
            element.innerHTML = words.map((word, index) => {
                if (index === wordIndex) {
                    return `<span style="background-color: #00000020">${word}</span>`;
                }
                return word;
            }).join(' ');

            // Increment the word index
            wordIndex++;
        }

        // Add event listener for boundary events to track word being spoken
        utterance.addEventListener('boundary', event => {
            if (event.name === 'word') {
                highlightWord();
            }
        });

        // Reset highlighting when speech ends
        utterance.addEventListener('end', () => {
            element.innerHTML = text;
             element.style.textDecoration = 'none';
        });

        // Underline the entire paragraph
        element.style.textDecoration = 'underline';
        element.style.textDecorationColor = '#0000fe70';

        // Speak the text
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Sorry, your browser does not support speech synthesis.');
    }
}

// Function to handle the click event
function handleClick(event) {
    // Call the speakText function with the clicked element
    speakText(event.target);
}

// Select all elements with the specified class name
let elements = document.querySelectorAll('.message');

// Add click event listener to each selected element
elements.forEach(element => {
    element.addEventListener('click', handleClick);
});
