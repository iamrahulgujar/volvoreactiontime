const gameArea = document.getElementById('gameArea');
const message = document.getElementById('message');
const result = document.getElementById('result');
const formArea = document.getElementById('formArea');
const userInfoForm = document.getElementById('userInfoForm');
const submitBtn = document.getElementById('submitBtn');
const submitMessage = document.getElementById('submitMessage');

let startTime;
let timeoutId;
let gameState = 'initial'; // initial, waiting, ready, go, result, form
let reactionTime = 0;

function getRandomDelay(min, max) {
    return Math.random() * (max - min) + min;
}

function formatTime(timeMs) {
    return (timeMs / 1000).toFixed(3);
}

function showForm() {
    gameArea.style.display = 'none';
    formArea.style.display = 'block';
    gameState = 'form';
    // Remove event listeners for game interaction
    gameArea.removeEventListener('click', handleInteraction);
    document.removeEventListener('keydown', handleKeyPress);
}

function handleInteraction() {
    if (gameState === 'initial') {
        // Start the game
        message.textContent = 'Wait for green...';
        result.textContent = '';
        gameArea.classList.remove('initial', 'result', 'ready');
        gameArea.classList.add('waiting');
        gameState = 'waiting';
        const delay = getRandomDelay(5000, 10000); // 5-10 seconds
        timeoutId = setTimeout(() => {
            message.textContent = 'Click NOW!';
            gameArea.classList.remove('waiting');
            gameArea.classList.add('go');
            startTime = performance.now();
            gameState = 'go';
        }, delay);
    } else if (gameState === 'waiting') {
        // Clicked too early
        clearTimeout(timeoutId);
        message.textContent = 'Too soon! Click to try again.';
        result.textContent = '';
        gameArea.classList.remove('waiting');
        gameArea.classList.add('ready'); // Use 'ready' style for too soon
        gameState = 'initial'; // Reset to initial state
    } else if (gameState === 'go') {
        // Clicked on time
        const endTime = performance.now();
        reactionTime = endTime - startTime;
        message.textContent = `Your time: ${formatTime(reactionTime)}s`;
        result.textContent = 'Click or Press Spacebar to record score and continue.';
        gameArea.classList.remove('go');
        gameArea.classList.add('result'); // Add a result class if needed, or reuse initial/ready
        gameState = 'result';
    } else if (gameState === 'result') {
        // Proceed to form
        showForm();
    }
}

function handleKeyPress(event) {
    // Check if the event target is not an input field within the form
    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
        return; // Don't interfere with form input
    }

    if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling
        handleInteraction();
    }
}

// Initial setup
message.textContent = 'Click or Press Spacebar to Start';
gameArea.classList.add('initial'); // Add an initial class for styling if needed

// Add event listeners
gameArea.addEventListener('click', handleInteraction);
document.addEventListener('keydown', handleKeyPress);

// Form submission handler
submitBtn.addEventListener('click', () => {
    if (userInfoForm.checkValidity()) {
        // In a real scenario, you would send this data to a server.
        // For this local version, we just show a message.
        console.log('Form submitted (locally):');
        console.log('Name:', document.getElementById('name').value);
        console.log('Mobile:', document.getElementById('mobile').value);
        console.log('Email:', document.getElementById('email').value);
        
        // Hide form, show thank you message
        userInfoForm.style.display = 'none';
        submitMessage.style.display = 'block';
        
        // Optionally reset after a delay
        // setTimeout(() => {
        //     location.reload(); // Or reset state without reload
        // }, 3000);
    } else {
        userInfoForm.reportValidity(); // Show validation errors
    }
});

