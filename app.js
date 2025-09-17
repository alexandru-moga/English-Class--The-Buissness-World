// Game data from the provided JSON
const gameData = {
    welcome: {
        title: "Business World: Remote Work Game",
        objectives: [
            "Learn workplace changes, employee well-being, and remote work in business context.",
            "Understand pros/cons for employers and employees.",
            "Practice vocabulary, linkers, and grammar from the lesson."
        ]
    },
    mind_map: {
        instructions: "Categorize each statement as an advantage or disadvantage for employers or employees.",
        statements: [
            { text: "Employers need less office space.", category: "employers_advantage" },
            { text: "Workers can be equally or more productive.", category: "employers_advantage" },
            { text: "Difficult to manage teams from home.", category: "employers_disadvantage" },
            { text: "May need to pay for employees' home equipment.", category: "employers_disadvantage" },
            { text: "Employees save time and money commuting.", category: "employees_advantage" },
            { text: "Flexible work environment at home.", category: "employees_advantage" },
            { text: "Blurs line between work/life; loneliness.", category: "employees_disadvantage" },
            { text: "Harder access to professional development.", category: "employees_disadvantage" }
        ]
    },
    vocabulary: {
        instructions: "Fill in the blanks with the given words: productive, lonely, dramatic, trend, priority, commute, suitable, range.",
        questions: [
            { sentence: "I'm far more ______ when I work from home because nobody interrupts me.", answer: "productive" },
            { sentence: "Do you ever feel ______ when working from home? Don't you miss socialising?", answer: "lonely" },
            { sentence: "There's been a ______ increase in remote working since 2020.", answer: "dramatic" },
            { sentence: "There's no doubt that the flexible working ______ will continue in the years to come.", answer: "trend" },
            { sentence: "Mental health should be a ______ for all managers.", answer: "priority" },
            { sentence: "It takes time and money to ______ to the office.", answer: "commute" },
            { sentence: "You will need a desk and a ______ chair to work from home comfortably.", answer: "suitable" },
            { sentence: "We have a ______ of options for employees if they need support.", answer: "range" }
        ]
    },
    linkers: {
        instructions: "Match each linker to its function: add information, contrast, give examples, result.",
        linkers: [
            { word: "however", function: "contrast" },
            { word: "such as", function: "give examples" },
            { word: "therefore", function: "result" },
            { word: "so", function: "result" },
            { word: "also", function: "add information" },
            { word: "and", function: "add information" },
            { word: "despite", function: "contrast" }
        ]
    },
    grammar: {
        instructions: "Choose the correct modal for each use: need to (necessary), have to (obligation), might (possibility, unsure), can (ability or possibility).",
        questions: [
            { prompt: "talk about something that is necessary", answer: "need to" },
            { prompt: "talk about something that is not an obligation", answer: "don't have to" },
            { prompt: "talk about something that is possible", answer: "can" },
            { prompt: "talk about something that is possible, but we are not sure", answer: "might" }
        ]
    },
    writing: {
        instructions: "Imagine your company is planning remote work. Write an email to your boss about how you feel and ideas for a positive experience.",
        tips: [
            "Mention feelings about remote work.",
            "Suggest ways to make remote work successful.",
            "Be polite and constructive."
        ]
    }
};

// Game state
let currentSection = 0;
let scores = {
    mindMap: 0,
    vocabulary: 0,
    linkers: 0,
    grammar: 0,
    writing: 1
};
let userAnswers = {
    mindMap: {},
    vocabulary: {},
    linkers: {},
    grammar: {},
    writing: {}
};

// Initialize the game
function startGame() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('progress-tracker').classList.remove('hidden');
    showSection(1);
}

function showSection(sectionNumber) {
    // Hide all sections
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    // Show current section
    document.getElementById(`section-${sectionNumber}`).classList.remove('hidden');
    document.getElementById(`section-${sectionNumber}`).classList.add('active');
    
    currentSection = sectionNumber;
    updateProgress();
    
    // Initialize section-specific content
    switch(sectionNumber) {
        case 1:
            initMindMap();
            break;
        case 2:
            initVocabulary();
            break;
        case 3:
            initLinkers();
            break;
        case 4:
            initGrammar();
            break;
        case 5:
            initWriting();
            break;
    }
}

function updateProgress() {
    const progress = (currentSection / 5) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Module ${currentSection} of 5`;
}

function nextSection() {
    if (currentSection < 5) {
        showSection(currentSection + 1);
    } else {
        completeGame();
    }
}

// Mind Map Section
function initMindMap() {
    const statementsContainer = document.getElementById('statements-list');
    statementsContainer.innerHTML = '';
    
    gameData.mind_map.statements.forEach((statement, index) => {
        const statementEl = document.createElement('div');
        statementEl.className = 'statement';
        statementEl.textContent = statement.text;
        statementEl.draggable = true;
        statementEl.dataset.category = statement.category;
        statementEl.dataset.index = index;
        
        statementEl.addEventListener('dragstart', handleDragStart);
        statementEl.addEventListener('dragend', handleDragEnd);
        
        statementsContainer.appendChild(statementEl);
    });
    
    // Setup drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const statementIndex = e.dataTransfer.getData('text/plain');
    const statementEl = document.querySelector(`[data-index="${statementIndex}"]`);
    const dropZone = e.target.closest('.drop-zone');
    const quadrant = dropZone.closest('.quadrant');
    
    if (statementEl && quadrant) {
        dropZone.appendChild(statementEl);
        statementEl.classList.add('placed');
        userAnswers.mindMap[statementIndex] = quadrant.dataset.category;
    }
}

function checkMindMap() {
    let correct = 0;
    const total = gameData.mind_map.statements.length;
    
    gameData.mind_map.statements.forEach((statement, index) => {
        const statementEl = document.querySelector(`[data-index="${index}"]`);
        const userCategory = userAnswers.mindMap[index];
        
        if (userCategory === statement.category) {
            statementEl.classList.add('correct');
            correct++;
        } else {
            statementEl.classList.add('incorrect');
        }
    });
    
    scores.mindMap = correct;
    
    const feedback = document.getElementById('mindmap-feedback');
    feedback.innerHTML = `
        <h4>Results: ${correct}/${total} correct</h4>
        <p>${correct === total ? 'Excellent work!' : 'Review the incorrect answers and think about the perspective of employers vs employees.'}</p>
    `;
    feedback.classList.remove('hidden');
    feedback.className = `feedback ${correct === total ? 'success' : 'error'}`;
    
    document.getElementById('mindmap-next').disabled = false;
}

// Vocabulary Section
function initVocabulary() {
    const questionsContainer = document.getElementById('vocab-questions');
    questionsContainer.innerHTML = '';
    
    gameData.vocabulary.questions.forEach((question, index) => {
        const questionEl = document.createElement('div');
        questionEl.className = 'vocab-question';
        
        const sentence = question.sentence.replace('______', `<input type="text" class="blank-input" data-index="${index}" placeholder="?">`);
        
        questionEl.innerHTML = `
            <div class="vocab-sentence">${sentence}</div>
        `;
        
        questionsContainer.appendChild(questionEl);
    });
    
    // Add event listeners to inputs
    document.querySelectorAll('.blank-input').forEach(input => {
        input.addEventListener('input', handleVocabInput);
    });
}

function handleVocabInput(e) {
    const index = e.target.dataset.index;
    userAnswers.vocabulary[index] = e.target.value.toLowerCase().trim();
}

function checkVocab() {
    let correct = 0;
    const total = gameData.vocabulary.questions.length;
    
    gameData.vocabulary.questions.forEach((question, index) => {
        const input = document.querySelector(`[data-index="${index}"]`);
        const userAnswer = userAnswers.vocabulary[index] || '';
        const correctAnswer = question.answer.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            correct++;
        } else {
            input.classList.add('incorrect');
            input.value = question.answer; // Show correct answer
        }
    });
    
    scores.vocabulary = correct;
    
    const feedback = document.getElementById('vocab-feedback');
    feedback.innerHTML = `
        <h4>Results: ${correct}/${total} correct</h4>
        <p>${correct === total ? 'Perfect vocabulary!' : 'The correct answers have been filled in. Study these words!'}</p>
    `;
    feedback.classList.remove('hidden');
    feedback.className = `feedback ${correct === total ? 'success' : 'error'}`;
    
    document.getElementById('vocab-next').disabled = false;
}

// Linkers Section
function initLinkers() {
    const linkerWordsContainer = document.getElementById('linker-words');
    linkerWordsContainer.innerHTML = '';
    
    gameData.linkers.linkers.forEach((linker, index) => {
        const linkerEl = document.createElement('div');
        linkerEl.className = 'linker-word';
        linkerEl.textContent = linker.word;
        linkerEl.draggable = true;
        linkerEl.dataset.function = linker.function;
        linkerEl.dataset.index = index;
        
        linkerEl.addEventListener('dragstart', handleLinkerDragStart);
        
        linkerWordsContainer.appendChild(linkerEl);
    });
    
    // Setup function drop zones
    document.querySelectorAll('.function-drop-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleLinkerDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleLinkerDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function handleLinkerDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const linkerIndex = e.dataTransfer.getData('text/plain');
    const linkerEl = document.querySelector(`[data-index="${linkerIndex}"]`);
    const dropZone = e.target.closest('.function-drop-zone');
    const functionBox = dropZone.closest('.function-box');
    
    if (linkerEl && functionBox) {
        dropZone.appendChild(linkerEl);
        userAnswers.linkers[linkerIndex] = functionBox.dataset.function;
    }
}

function checkLinkers() {
    let correct = 0;
    const total = gameData.linkers.linkers.length;
    
    gameData.linkers.linkers.forEach((linker, index) => {
        const linkerEl = document.querySelector(`[data-index="${index}"]`);
        const userFunction = userAnswers.linkers[index];
        
        if (userFunction === linker.function) {
            linkerEl.classList.add('correct');
            correct++;
        } else {
            linkerEl.classList.add('incorrect');
        }
    });
    
    scores.linkers = correct;
    
    const feedback = document.getElementById('linkers-feedback');
    feedback.innerHTML = `
        <h4>Results: ${correct}/${total} correct</h4>
        <p>${correct === total ? 'Great job matching linkers!' : 'Review how different linkers function in sentences.'}</p>
    `;
    feedback.classList.remove('hidden');
    feedback.className = `feedback ${correct === total ? 'success' : 'error'}`;
    
    document.getElementById('linkers-next').disabled = false;
}

// Grammar Section
function initGrammar() {
    const questionsContainer = document.getElementById('grammar-questions');
    questionsContainer.innerHTML = '';
    
    const options = ['need to', "don't have to", 'can', 'might'];
    
    gameData.grammar.questions.forEach((question, index) => {
        const questionEl = document.createElement('div');
        questionEl.className = 'grammar-question';
        
        questionEl.innerHTML = `
            <div class="grammar-prompt">When you want to ${question.prompt}, you use:</div>
            <div class="grammar-options" data-question="${index}">
                ${options.map(option => `
                    <div class="grammar-option" data-option="${option}" onclick="selectGrammarOption(${index}, '${option}')">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;
        
        questionsContainer.appendChild(questionEl);
    });
}

function selectGrammarOption(questionIndex, option) {
    // Clear previous selections for this question
    document.querySelectorAll(`[data-question="${questionIndex}"] .grammar-option`).forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select the clicked option
    event.target.classList.add('selected');
    userAnswers.grammar[questionIndex] = option;
}

function checkGrammar() {
    let correct = 0;
    const total = gameData.grammar.questions.length;
    
    gameData.grammar.questions.forEach((question, index) => {
        const userAnswer = userAnswers.grammar[index];
        const correctAnswer = question.answer;
        const options = document.querySelectorAll(`[data-question="${index}"] .grammar-option`);
        
        options.forEach(option => {
            const optionText = option.dataset.option;
            if (optionText === correctAnswer) {
                option.classList.add('correct');
                if (userAnswer === correctAnswer) {
                    correct++;
                }
            } else if (optionText === userAnswer && userAnswer !== correctAnswer) {
                option.classList.add('incorrect');
            }
        });
    });
    
    scores.grammar = correct;
    
    const feedback = document.getElementById('grammar-feedback');
    feedback.innerHTML = `
        <h4>Results: ${correct}/${total} correct</h4>
        <p>${correct === total ? 'Perfect grammar skills!' : 'The correct answers are highlighted in green.'}</p>
    `;
    feedback.classList.remove('hidden');
    feedback.className = `feedback ${correct === total ? 'success' : 'error'}`;
    
    document.getElementById('grammar-next').disabled = false;
}

// Writing Section
function initWriting() {
    // Writing section is already initialized in HTML
    userAnswers.writing.subject = '';
    userAnswers.writing.message = '';
}

function showWritingTips() {
    const feedback = document.getElementById('writing-feedback');
    feedback.innerHTML = `
        <h4>Sample Response:</h4>
        <div class="feedback-item">
            <strong>Subject:</strong> Thoughts on Remote Work Implementation
        </div>
        <div class="feedback-item">
            <strong>Dear [Boss's Name],</strong><br><br>
            I hope this email finds you well. I wanted to share my thoughts about our upcoming remote work implementation.<br><br>
            I feel quite excited about this opportunity as it will allow me to be more productive and maintain a better work-life balance. However, I also understand the importance of staying connected with the team.<br><br>
            To ensure a positive remote work experience, I suggest we:<br>
            • Schedule regular video check-ins<br>
            • Use collaborative tools effectively<br>
            • Set clear communication expectations<br>
            • Maintain team social activities virtually<br><br>
            I'm committed to making this transition successful and look forward to discussing this further.<br><br>
            Best regards,<br>
            [Your Name]
        </div>
    `;
    feedback.classList.remove('hidden');
    feedback.className = 'feedback success';
    
    // Save user's writing
    userAnswers.writing.subject = document.getElementById('email-subject').value;
    userAnswers.writing.message = document.getElementById('email-message').value;
}

// Completion
function completeGame() {
    // Save final writing answers
    userAnswers.writing.subject = document.getElementById('email-subject').value;
    userAnswers.writing.message = document.getElementById('email-message').value;
    
    document.getElementById('section-5').classList.remove('active');
    document.getElementById('section-5').classList.add('hidden');
    document.getElementById('completion-screen').classList.remove('hidden');
    document.getElementById('completion-screen').classList.add('active');
    document.getElementById('progress-tracker').classList.add('hidden');
    
    showFinalResults();
}

function showFinalResults() {
    const totalPossible = Object.keys(scores).length - 1; // Exclude writing from score
    const totalScored = scores.mindMap + scores.vocabulary + scores.linkers + scores.grammar;
    const percentage = Math.round((totalScored / (gameData.mind_map.statements.length + gameData.vocabulary.questions.length + gameData.linkers.linkers.length + gameData.grammar.questions.length)) * 100);
    
    const resultsContainer = document.getElementById('final-results');
    resultsContainer.innerHTML = `
        <div class="score-item">
            <span>Mind Map Challenge:</span>
            <span>${scores.mindMap}/${gameData.mind_map.statements.length}</span>
        </div>
        <div class="score-item">
            <span>Vocabulary Quiz:</span>
            <span>${scores.vocabulary}/${gameData.vocabulary.questions.length}</span>
        </div>
        <div class="score-item">
            <span>Linkers Game:</span>
            <span>${scores.linkers}/${gameData.linkers.linkers.length}</span>
        </div>
        <div class="score-item">
            <span>Grammar Quiz:</span>
            <span>${scores.grammar}/${gameData.grammar.questions.length}</span>
        </div>
        <div class="score-item">
            <span>Writing Task:</span>
            <span>Completed ✓</span>
        </div>
        <div class="score-item" style="border-top: 2px solid var(--color-primary); font-weight: var(--font-weight-bold); margin-top: var(--space-12); padding-top: var(--space-12);">
            <span>Overall Score:</span>
            <span>${percentage}%</span>
        </div>
    `;
}

function reviewMistakes() {
    const modal = document.getElementById('review-modal');
    const content = document.getElementById('review-content');
    
    let reviewHTML = '<h4>Review of Your Answers:</h4>';
    
    // Mind Map Review
    reviewHTML += '<h5>Mind Map Challenge:</h5>';
    gameData.mind_map.statements.forEach((statement, index) => {
        const userCategory = userAnswers.mindMap[index];
        const correct = userCategory === statement.category;
        const categoryNames = {
            'employers_advantage': 'Employers - Advantage',
            'employers_disadvantage': 'Employers - Disadvantage',
            'employees_advantage': 'Employees - Advantage',
            'employees_disadvantage': 'Employees - Disadvantage'
        };
        
        reviewHTML += `
            <div class="feedback-item">
                <strong>"${statement.text}"</strong><br>
                Your answer: ${userCategory ? categoryNames[userCategory] : 'Not answered'}<br>
                Correct answer: ${categoryNames[statement.category]}
                ${correct ? ' ✓' : ' ✗'}
            </div>
        `;
    });
    
    // Vocabulary Review
    reviewHTML += '<h5>Vocabulary Quiz:</h5>';
    gameData.vocabulary.questions.forEach((question, index) => {
        const userAnswer = userAnswers.vocabulary[index] || 'Not answered';
        const correct = userAnswer.toLowerCase() === question.answer.toLowerCase();
        
        reviewHTML += `
            <div class="feedback-item">
                <strong>${question.sentence.replace('______', '...')}</strong><br>
                Your answer: ${userAnswer}<br>
                Correct answer: ${question.answer}
                ${correct ? ' ✓' : ' ✗'}
            </div>
        `;
    });
    
    content.innerHTML = reviewHTML;
    modal.classList.remove('hidden');
}

function closeReview() {
    document.getElementById('review-modal').classList.add('hidden');
}

function restartGame() {
    // Reset game state
    currentSection = 0;
    scores = {
        mindMap: 0,
        vocabulary: 0,
        linkers: 0,
        grammar: 0,
        writing: 1
    };
    userAnswers = {
        mindMap: {},
        vocabulary: {},
        linkers: {},
        grammar: {},
        writing: {}
    };
    
    // Reset UI
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    document.getElementById('welcome-screen').classList.add('active');
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('progress-tracker').classList.add('hidden');
    
    // Reset buttons
    document.querySelectorAll('[id$="-next"]').forEach(btn => {
        btn.disabled = true;
    });
    
    // Clear feedback
    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.classList.add('hidden');
        feedback.innerHTML = '';
    });
    
    // Clear form inputs
    document.getElementById('email-subject').value = '';
    document.getElementById('email-message').value = '';
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Game is initialized with welcome screen visible
    console.log('Remote Work Learning Game Loaded!');
});