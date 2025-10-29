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
        moveToNextCell(input);
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

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
}

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
    currentCell = input.parentElement;
    input.select();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeCrossword);
