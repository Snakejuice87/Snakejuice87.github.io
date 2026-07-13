let speechStopped = false;
let speaking = false;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function speakText(element) {
    return new Promise(resolve => {

        if (!('speechSynthesis' in window)) {
            alert('Sorry, your browser does not support speech synthesis.');
            resolve();
            return;
        }

        const text = element.innerText;
        const words = text.split(/\s+/);

        const utterance = new SpeechSynthesisUtterance(text);

        //   -----  jshe
        utterance.lang = 'en-AU';

const parent = element.closest('.messages');

if (parent?.classList.contains('messages--received')) {
    // Slightly higher-pitched voice
    utterance.pitch = 1.15;
    utterance.rate = 1.0;
} else if (parent?.classList.contains('messages--sent')) {
    // Slightly faster and higher-pitched voice
    utterance.pitch = 1.3;
    utterance.rate = 1.12;
} else {
    // Default
    utterance.pitch = 1;
    utterance.rate = 1;
}
        /*
        utterance.lang = 'en-AU';
        utterance.pitch = 1;
        utterance.rate = 1;
        */


        let wordIndex = 0;

        function highlightWord() {
            element.innerHTML = words.map((word, index) => {
                return index === wordIndex
                    ? `<span style="background-color:#00000020">${word}</span>`
                    : word;
            }).join(' ');

            wordIndex++;
        }

        utterance.onboundary = e => {
            if (e.name === "word") {
                highlightWord();
            }
        };

        utterance.onend = () => {
            element.innerHTML = text;
            element.style.textDecoration = "none";
            resolve();
        };

        utterance.onerror = () => {
            element.innerHTML = text;
            element.style.textDecoration = "none";
            resolve();
        };

        element.style.textDecoration = "underline";
        element.style.textDecorationColor = "#0000fe70";

        speechSynthesis.speak(utterance);

    });
}

async function speakMessages(messagesContainer) {

    let current = messagesContainer;

    while (current && !speechStopped) {

        if (current.classList.contains("messages")) {

            const msgs = current.querySelectorAll(":scope > .message");

            for (const msg of msgs) {

                if (speechStopped) return;

                await speakText(msg);

                if (speechStopped) return;

                await delay(700);
            }
        }

        current = current.nextElementSibling;
    }

    speaking = false;
}

function stopSpeaking() {

    speechStopped = true;
    speaking = false;

    speechSynthesis.cancel();

    document.querySelectorAll(".message").forEach(el => {
        el.innerHTML = el.innerText;
        el.style.textDecoration = "none";
    });
}

document.addEventListener("click", function(e) {

    const message = e.target.closest(".message");

    if (!message) return;

    // Toggle
    if (speaking) {
        stopSpeaking();
        return;
    }

    speechStopped = false;
    speaking = true;

    const messagesContainer = message.closest(".messages");

    speakMessages(messagesContainer);

});

/*
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
*/
