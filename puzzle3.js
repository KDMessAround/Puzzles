// Answer key for the photo puzzle
const photoAnswers = {
    1: ['first ever picture', 'first picture', 'first photo'],
    2: ['first date'],
    3: ['blue hen date', 'bluehendate', 'blue hen'],
    4: ['gallery date', 'gallerydate'],
    5: ['first trip']
};

// Normalize answer for comparison
function normalizeAnswer(answer) {
    return answer
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/[^\w\s]/g, '');  // Remove punctuation
}

// Check if answer matches any acceptable answers
function checkAnswer(userAnswer, correctAnswers) {
    const normalized = normalizeAnswer(userAnswer);

    return correctAnswers.some(correct => {
        const normalizedCorrect = normalizeAnswer(correct);
        return normalized === normalizedCorrect ||
               normalized.includes(normalizedCorrect) ||
               normalizedCorrect.includes(normalized);
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

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('photoSuccessModal');
    modal.style.display = 'flex';
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.photo-answer');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPhotoAnswers();
            }
        });
    });
});
