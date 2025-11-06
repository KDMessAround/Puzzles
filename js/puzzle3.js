// Answer key for the photo puzzle
const photoAnswers = {
    1: ['first picture sent'],
    2: ['first date'],
    3: ['blue hen date'],
    4: ['gallery date'],
    5: ['arba minch trip']
};

// Normalize answer for comparison
function normalizeAnswer(answer) {
    return answer
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/[^\w\s]/g, '');  // Remove punctuation
}

// Check if answer matches any acceptable answers (strict matching, case-insensitive)
function checkAnswer(userAnswer, correctAnswers) {
    const normalized = normalizeAnswer(userAnswer);

    return correctAnswers.some(correct => {
        const normalizedCorrect = normalizeAnswer(correct);
        return normalized === normalizedCorrect;
    });
}

// Check all photo answers
function checkPhotoAnswers() {
    let allCorrect = true;
    const errorMessage = document.getElementById('photoErrorMessage');

    // Hide error message initially
    errorMessage.style.display = 'none';

    // Clear previous states
    document.querySelectorAll('.photo-card').forEach(card => {
        card.classList.remove('correct', 'incorrect');
    });

    document.querySelectorAll('.photo-answer').forEach(input => {
        input.classList.remove('correct-input', 'incorrect-input');
    });

    // Check each photo answer
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`answer${i}`);
        const photoCard = document.querySelector(`[data-photo="${i}"]`);
        const photoImage = document.getElementById(`photo${i}`);
        const userAnswer = input.value.trim();

        if (!userAnswer) {
            photoCard.classList.add('incorrect');
            input.classList.add('incorrect-input');
            allCorrect = false;
        } else if (checkAnswer(userAnswer, photoAnswers[i])) {
            photoCard.classList.add('correct');
            input.classList.add('correct-input');
            // Unblur the photo when correct
            photoImage.classList.remove('blurred');
            photoImage.classList.add('revealed');
        } else {
            photoCard.classList.add('incorrect');
            input.classList.add('incorrect-input');
            allCorrect = false;
        }
    }

    // Show result
    if (allCorrect) {
        // Small delay to show all photos revealed
        setTimeout(() => {
            showSuccessModal();
        }, 800);
    } else {
        errorMessage.style.display = 'block';
        // Scroll to first incorrect answer
        const firstIncorrect = document.querySelector('.photo-card.incorrect');
        if (firstIncorrect) {
            firstIncorrect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Validate single input in real-time
function validateSingleInput(input) {
    const photoNum = input.id.replace('answer', '');
    const photoCard = document.querySelector(`[data-photo="${photoNum}"]`);
    const photoImage = document.getElementById(`photo${photoNum}`);
    const userAnswer = input.value.trim();

    // Clear previous states for this card only
    photoCard.classList.remove('correct', 'incorrect');
    input.classList.remove('correct-input', 'incorrect-input');

    // Only validate if user has typed something
    if (userAnswer && checkAnswer(userAnswer, photoAnswers[photoNum])) {
        photoCard.classList.add('correct');
        input.classList.add('correct-input');
        photoImage.classList.remove('blurred');
        photoImage.classList.add('revealed');
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('photoSuccessModal');
    modal.style.display = 'flex';
}

// Check location password
function checkLocationPassword() {
    const password = document.getElementById('locationPassword').value.trim().toUpperCase();
    const errorMsg = document.getElementById('passwordError');

    // Temporary password - user will replace this
    if (password === 'TEMP3') {
        // Correct password - proceed to next puzzle
        window.location.href = 'puzzle4.html';
    } else {
        // Wrong password - show error
        errorMsg.style.display = 'block';
        document.getElementById('locationPassword').value = '';
        document.getElementById('locationPassword').focus();
    }
}

// Allow Enter key to submit and add real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.photo-answer');
    inputs.forEach(input => {
        // Enter key to submit
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPhotoAnswers();
            }
        });

        // Real-time validation as user types
        input.addEventListener('input', () => {
            validateSingleInput(input);
        });
    });

    // Allow Enter key on password input
    const passwordInput = document.getElementById('locationPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkLocationPassword();
            }
        });
    }
});
