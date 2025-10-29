// Crossword grid structure (11x11)
// 0 = black square, letter = answer square
const gridStructure = [
    ['E', 'M', 'S', 'A', 0, 'C', 0, 0, 'B', 0, 0],
    [0, 0, 0, 0, 0, 'H', 0, 0, 'E', 0, 0],
    [0, 0, 0, 'F', 'R', 'A', 'N', 'C', 'E', 'S', 0],
    [0, 0, 0, 'O', 0, 'L', 0, 0, 'T', 0, 0],
    [0, 'B', 'A', 'S', 'I', 'L', 0, 0, 'S', 'I', 'X'],
    [0, 'I', 0, 'S', 0, 'E', 0, 0, 0, 0, 0],
    [0, 'L', 0, 'I', 0, 'N', 'I', 'N', 'E', 0, 0],
    [0, 'L', 0, 'L', 0, 'G', 0, 0, 0, 0, 0],
    [0, 'Y', 0, 0, 0, 'E', 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 'B', 'R', 'O', 'W', 'N', 0, 0],
    [0, 0, 0, 0, 0, 'S', 0, 0, 0, 0, 0]
];

// Clue numbers positioning
const clueNumbers = {
    '1': [0, 0],    // EMSA (across)
    '2': [0, 5],    // C (across) / CHALLENGERS (down)
    '3': [0, 8],    // B (across) / BEETS (down)
    '4': [2, 3],    // FRANCES (across) / FOSSIL (down)
    '5': [4, 1],    // BASIL (across) / BILLY (down)
    '6': [4, 8],    // SIX (across)
    '7': [6, 5],    // NINE (across)
    '8': [9, 4]     // BROWN (across)
};

let currentCell = null;
let currentDirection = 'across';
let isAutoAdvancing = false; // Track if focus is from auto-advance

// Initialize the crossword grid
function initializeCrossword() {
    const grid = document.getElementById('crosswordGrid');
    grid.style.gridTemplateColumns = `repeat(11, 1fr)`;

    gridStructure.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');

            if (cell === 0) {
                cellDiv.className = 'cell black-cell';
            } else {
                cellDiv.className = 'cell';
                cellDiv.dataset.row = rowIndex;
                cellDiv.dataset.col = colIndex;
                cellDiv.dataset.answer = cell;

                // Add clue number if exists
                const clueNum = getClueNumber(rowIndex, colIndex);
                if (clueNum) {
                    const numSpan = document.createElement('span');
                    numSpan.className = 'cell-number';
                    numSpan.textContent = clueNum;
                    cellDiv.appendChild(numSpan);
                }

                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleKeydown);
                input.addEventListener('focus', handleFocus);
                cellDiv.appendChild(input);
            }

            grid.appendChild(cellDiv);
        });
    });
}

// Get clue number for a cell position
function getClueNumber(row, col) {
    for (const [num, [r, c]] of Object.entries(clueNumbers)) {
        if (r === row && c === col) {
            return num;
        }
    }
    return null;
}

// Handle input in a cell
function handleInput(e) {
    const input = e.target;
    const value = input.value.toUpperCase();
    input.value = value;

    if (value) {
        validateCell(input);
        isAutoAdvancing = true; // Set flag before auto-advancing
        moveToNextCell(input);
        isAutoAdvancing = false; // Reset flag after advancing
    }
}

// Validate a single cell
function validateCell(input) {
    const cell = input.parentElement;
    const answer = cell.dataset.answer;
    const value = input.value.toUpperCase();

    if (value === answer) {
        cell.classList.remove('incorrect');
        cell.classList.add('correct');
    } else if (value !== '') {
        cell.classList.remove('correct');
        cell.classList.add('incorrect');
    } else {
        cell.classList.remove('correct', 'incorrect');
    }

    // Check if puzzle is complete
    checkCompletion();
}

// Check if entire puzzle is completed correctly
function checkCompletion() {
    const allCells = document.querySelectorAll('.cell:not(.black-cell)');
    let allCorrect = true;

    for (const cell of allCells) {
        const input = cell.querySelector('input');
        if (!input.value || input.value.toUpperCase() !== cell.dataset.answer) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
        setTimeout(() => {
            showSuccessModal();
        }, 500);
    }
}

// Show theme modal instead of success modal
function showSuccessModal() {
    const modal = document.getElementById('themeModal');
    modal.style.display = 'flex';
    // Focus on the input field
    setTimeout(() => {
        document.getElementById('themeAnswer').focus();
    }, 300);
}

// Check theme answer
function checkThemeAnswer() {
    const answer = document.getElementById('themeAnswer').value.trim().toUpperCase();
    const errorMsg = document.getElementById('themeError');

    if (answer === 'US') {
        // Correct answer - show solved puzzle
        document.getElementById('themeModal').style.display = 'none';
        showSolvedPuzzle();
    } else {
        // Wrong answer - show error
        errorMsg.style.display = 'block';
        document.getElementById('themeAnswer').value = '';
        document.getElementById('themeAnswer').focus();
    }
}

// Show solved puzzle with real clues
function showSolvedPuzzle() {
    const solvedView = document.getElementById('solvedView');
    solvedView.style.display = 'flex';

    // Create the solved grid with answers visible
    const solvedGrid = document.getElementById('solvedGrid');
    solvedGrid.innerHTML = ''; // Clear any existing content
    solvedGrid.style.gridTemplateColumns = `repeat(11, 1fr)`;

    gridStructure.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');

            if (cell === 0) {
                cellDiv.className = 'cell black-cell';
            } else {
                cellDiv.className = 'cell solved-cell';
                cellDiv.dataset.row = rowIndex;
                cellDiv.dataset.col = colIndex;

                // Add clue number if exists
                const clueNum = getClueNumber(rowIndex, colIndex);
                if (clueNum) {
                    const numSpan = document.createElement('span');
                    numSpan.className = 'cell-number';
                    numSpan.textContent = clueNum;
                    cellDiv.appendChild(numSpan);
                }

                // Add the letter as plain text (not input)
                const letterSpan = document.createElement('span');
                letterSpan.className = 'solved-letter';
                letterSpan.textContent = cell;
                cellDiv.appendChild(letterSpan);
            }

            solvedGrid.appendChild(cellDiv);
        });
    });
}

// Allow Enter key to submit theme answer
document.addEventListener('DOMContentLoaded', () => {
    const themeInput = document.getElementById('themeAnswer');
    if (themeInput) {
        themeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkThemeAnswer();
            }
        });
    }
});

// Handle keyboard navigation
function handleKeydown(e) {
    const input = e.target;
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (e.key === 'Backspace' && !input.value) {
        e.preventDefault();
        moveToPreviousCell(input);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        currentDirection = 'across';
        moveInDirection(row, col, 0, 1);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        currentDirection = 'across';
        moveInDirection(row, col, 0, -1);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentDirection = 'down';
        moveInDirection(row, col, 1, 0);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentDirection = 'down';
        moveInDirection(row, col, -1, 0);
    }
}

// Move to next cell
function moveToNextCell(input) {
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (currentDirection === 'across') {
        moveInDirection(row, col, 0, 1);
    } else {
        moveInDirection(row, col, 1, 0);
    }
}

// Move to previous cell
function moveToPreviousCell(input) {
    const cell = input.parentElement;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (currentDirection === 'across') {
        moveInDirection(row, col, 0, -1);
    } else {
        moveInDirection(row, col, -1, 0);
    }
}

// Move in a specific direction
function moveInDirection(row, col, rowDelta, colDelta) {
    let newRow = row + rowDelta;
    let newCol = col + colDelta;

    while (newRow >= 0 && newRow < 11 && newCol >= 0 && newCol < 11) {
        const nextCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        if (nextCell) {
            nextCell.querySelector('input').focus();
            return;
        }
        newRow += rowDelta;
        newCol += colDelta;
    }
}

// Handle cell focus
function handleFocus(e) {
    const input = e.target;
    const cell = input.parentElement;

    // If this is from auto-advancing, keep the current direction
    if (isAutoAdvancing) {
        input.select();
        return;
    }

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const canGoAcross = hasAcrossWord(row, col);
    const canGoDown = hasDownWord(row, col);

    // If clicking the same cell again, toggle direction
    if (cell === currentCell) {
        if (canGoAcross && canGoDown) {
            currentDirection = currentDirection === 'across' ? 'down' : 'across';
        }
    } else {
        // New cell - set direction with priority: across first
        if (canGoAcross && canGoDown) {
            currentDirection = 'across'; // Prioritize across
        } else if (canGoDown) {
            currentDirection = 'down';
        } else {
            currentDirection = 'across';
        }
        currentCell = cell;
    }

    input.select();
}

// Check if a cell has an across word
function hasAcrossWord(row, col) {
    // Check if there's a cell to the left or right
    const hasLeft = col > 0 && gridStructure[row][col - 1] !== 0;
    const hasRight = col < 10 && gridStructure[row][col + 1] !== 0;
    return hasLeft || hasRight;
}

// Check if a cell has a down word
function hasDownWord(row, col) {
    // Check if there's a cell above or below
    const hasAbove = row > 0 && gridStructure[row - 1][col] !== 0;
    const hasBelow = row < 10 && gridStructure[row + 1][col] !== 0;
    return hasAbove || hasBelow;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeCrossword);
