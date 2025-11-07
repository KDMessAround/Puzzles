// Check the riddle answer
function checkFinalAnswer() {
    const answer = document.getElementById('finalAnswer').value.trim().toUpperCase();
    const errorMsg = document.getElementById('finalError');

    if (answer === 'SCRABBLE') {
        // Correct answer - show success modal with CLOSET riddle
        errorMsg.style.display = 'none';
        showSuccessModal();
    } else {
        // Wrong answer - show error
        errorMsg.style.display = 'block';
        document.getElementById('finalAnswer').value = '';
        document.getElementById('finalAnswer').focus();
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('finalSuccessModal');
    modal.style.display = 'flex';
}

// Check location password
function checkLocationPassword() {
    const password = document.getElementById('locationPassword').value.trim().toUpperCase();
    const errorMsg = document.getElementById('passwordError');

    if (password === 'MONOPOLY') {
        // Correct password - proceed to next puzzle
        window.location.href = 'puzzle2.html';
    } else {
        // Wrong password - show error
        errorMsg.style.display = 'block';
        document.getElementById('locationPassword').value = '';
        document.getElementById('locationPassword').focus();
    }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    const riddleInput = document.getElementById('finalAnswer');
    if (riddleInput) {
        riddleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkFinalAnswer();
            }
        });
    }

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
