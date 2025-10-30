// Answer key for the trivia questions
const answerKey = {
    q1: 'B',  // William Carlos Williams
    q2: 'D',  // Luncheon of the Boating Party by Pierre-Auguste Renoir
    q3: 'C',  // A large quantity of liquid LSD
    q4: 'B',  // The Denial of Death by Ernest Becker
    q5: 'A',  // Drencrom
    q6: 'C',  // Braverman Grant
    q7: ['binoculars'],  // Moonrise Kingdom
    q8: ['snoop'],  // Anatomy of a Fall
    q9: ['halladay'],  // Frances Ha
    q10: ['orgasmic']  // Movie list name
};

// Normalize string for comparison (case-insensitive, trim spaces, remove extra spaces)
function normalizeAnswer(answer) {
    return answer
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/^(the|a|an)\s+/i, '');  // Remove leading articles
}

// Check if short answer is correct
function checkShortAnswer(userAnswer, correctAnswers) {
    const normalized = normalizeAnswer(userAnswer);

    // Check if normalized answer matches any of the acceptable answers
    return correctAnswers.some(correct => {
        const normalizedCorrect = normalizeAnswer(correct);
        return normalized === normalizedCorrect ||
               normalized.includes(normalizedCorrect) ||
               normalizedCorrect.includes(normalized);
    });
}

// Check all answers
function checkAnswers() {
    let allCorrect = true;
    const errorMessage = document.getElementById('errorMessage');

    // Hide error message initially
    errorMessage.style.display = 'none';

    // Clear previous error states
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('correct', 'incorrect');
    });

    // Check multiple choice questions (1-6)
    for (let i = 1; i <= 6; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        const questionCard = document.querySelector(`[data-question="${i}"]`);

        if (!selectedOption) {
            questionCard.classList.add('incorrect');
            allCorrect = false;
        } else if (selectedOption.value === answerKey[`q${i}`]) {
            questionCard.classList.add('correct');
        } else {
            questionCard.classList.add('incorrect');
            allCorrect = false;
        }
    }

    // Check short answer questions (7-10)
    for (let i = 7; i <= 10; i++) {
        const input = document.getElementById(`q${i}`);
        const questionCard = document.querySelector(`[data-question="${i}"]`);
        const userAnswer = input.value.trim();

        if (!userAnswer) {
            questionCard.classList.add('incorrect');
            allCorrect = false;
        } else if (checkShortAnswer(userAnswer, answerKey[`q${i}`])) {
            questionCard.classList.add('correct');
            input.classList.add('correct-input');
            input.classList.remove('incorrect-input');
        } else {
            questionCard.classList.add('incorrect');
            input.classList.add('incorrect-input');
            input.classList.remove('correct-input');
            allCorrect = false;
        }
    }

    // Show result
    if (allCorrect) {
        showSuccessModal();
    } else {
        errorMessage.style.display = 'block';
        // Scroll to first incorrect answer
        const firstIncorrect = document.querySelector('.question-card.incorrect');
        if (firstIncorrect) {
            firstIncorrect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('triviaSuccessModal');
    modal.style.display = 'flex';
}

// Initialize - allow Enter key on short answer inputs to submit
document.addEventListener('DOMContentLoaded', () => {
    const shortAnswerInputs = document.querySelectorAll('.short-answer');
    shortAnswerInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswers();
            }
        });
    });
});
