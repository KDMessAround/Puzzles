// Password answers for each location (REPLACE THESE WITH YOUR ACTUAL PASSWORDS)
const passwords = {
    1: 'CLOSET',      // Closet - REPLACE WITH YOUR PASSWORD
    2: 'BATHROOM',    // Toilet - REPLACE WITH YOUR PASSWORD
    3: 'WINDOW',      // Windows - REPLACE WITH YOUR PASSWORD
    4: 'TABLE'        // Table - REPLACE WITH YOUR PASSWORD
    // No password for step 5 (Refrigerator)
};

// Success messages for each step
const successMessages = {
    1: "You found the first treasure! The adventure continues...",
    2: "Excellent! You're halfway through the hunt!",
    3: "Amazing! Only two more locations to go!",
    4: "Almost there! One final location awaits..."
};

let currentStep = 1;

// Check password for current step
function checkPassword(step) {
    const input = document.getElementById(`password${step}`);
    const userAnswer = input.value.trim().toUpperCase();
    const correctPassword = passwords[step].toUpperCase();
    const errorMsg = document.getElementById(`error${step}`);

    // Hide previous error
    errorMsg.style.display = 'none';

    if (userAnswer === correctPassword) {
        // Correct password
        showSuccessMessage(step);
    } else {
        // Wrong password
        errorMsg.style.display = 'block';
        input.value = '';
        input.classList.add('shake');
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
    }
}

// Show success message
function showSuccessMessage(step) {
    const successMsg = document.getElementById('success-msg');
    const successText = document.getElementById('success-text');

    successText.textContent = successMessages[step];
    successMsg.style.display = 'flex';

    // Update progress indicator
    document.getElementById(`step${step}-indicator`).classList.add('completed');
}

// Move to next riddle
function nextRiddle() {
    const successMsg = document.getElementById('success-msg');
    const currentRiddle = document.getElementById(`riddle${currentStep}`);

    // Hide success message
    successMsg.style.display = 'none';

    // Hide current riddle
    currentRiddle.style.display = 'none';
    currentRiddle.classList.remove('active');

    // Move to next step
    currentStep++;

    // Show next riddle
    const nextRiddle = document.getElementById(`riddle${currentStep}`);
    nextRiddle.style.display = 'block';

    // Animate in
    setTimeout(() => {
        nextRiddle.classList.add('active');
    }, 50);

    // Update progress indicator
    document.getElementById(`step${currentStep}-indicator`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show final modal
function showFinale() {
    // Mark final step as complete
    document.getElementById('step5-indicator').classList.add('completed');

    // Show finale modal
    const modal = document.getElementById('finaleModal');
    modal.style.display = 'flex';
}

// Allow Enter key to submit passwords
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`password${i}`);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    checkPassword(i);
                }
            });
        }
    }
});
