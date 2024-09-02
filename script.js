const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const decodeSection = document.querySelector('.decode-section');
const decodeBox = document.querySelector('.decode-box');
const checkSimilarity = document.querySelector('.check-similarity');
const questionsList = document.querySelector('.questions-list');

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

continueBtn.onclick = () => {
    decodeSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    decodeBox.classList.add('active');

    showQuestions(0);
}

let questionCount = 0;

const nextBtn = document.querySelector(".next-btn");

nextBtn.onclick = () => {
    questionCount++;
    showQuestions(questionCount);
}

const submitBtn = document.querySelector(".submit-btn");
const hint = document.querySelector(".hint");


//obtain questions from the array

function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    const currentQuestion = questions[index];
    const cipher = randomCaesarCipher(currentQuestion.question);
    const clue = currentQuestion.clue;
    const answer = currentQuestion.answer;
    const similarityElement = document.querySelector('.percentage');
    const messageElement = document.querySelector(".message");

    if (currentQuestion) {
        questionText.textContent = `${currentQuestion.number}. ${cipher}`;
        hint.onclick = () => {
            Swal.fire({
                title: "Hint?",
                text: `${clue}`, // Pass the current question's clue here
                icon: "question"
            });
        }
        // Remove existing buttons
        const buttons = document.querySelectorAll('.question-btn');
        buttons.forEach(button => button.remove());

        // Create new buttons based on the length of the questions array
        for (let i = 0; i < noOfQuestions; i++) {
            const btn = document.createElement('button');
            btn.textContent = `${i + 1}`;
            btn.classList.add('question-btn');
            btn.onclick = () => {
                showQuestions(i);
            }
            questionsList.appendChild(btn);
        }
        checkSimilarity.onclick = () => {
            let givenAnswer = document.getElementById("given-answer").value;
            const similarity = calculateSimilarity(answer, givenAnswer);
            similarityElement.textContent = `Similarity: ${similarity}%`;
        }

        submitBtn.onclick = () => {
            let givenAnswer = document.getElementById("given-answer").value;
            const similarity = calculateSimilarity(answer, givenAnswer);
            if(similarity==100){
                messageElement.textContent = "Correct!";
                messageElement.style.color = "green";
            } else {
                messageElement.textContent = "Wrong!";
                messageElement.style.color = "red";
            }
        }
        
    } else {
        // Handle the case when all questions have been answered
        console.log('All questions have been answered.');
    }
}

function randomCaesarCipher(text) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shift = Math.floor(Math.random() * 25) + 1; // Random shift between 1 and 25
    let cipherText = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (alphabet.includes(char.toUpperCase())) {
            let isUpperCase = char === char.toUpperCase();
            let currentIndex = alphabet.indexOf(char.toUpperCase());
            let newIndex = (currentIndex + shift) % 26;
            let newChar = alphabet[newIndex];

            cipherText += isUpperCase ? newChar : newChar.toLowerCase();
        } else {
            cipherText += char; // Keep non-alphabet characters unchanged
        }
    }

    console.log(`Shift: ${shift}`); // Optional: Log the shift value for reference
    return cipherText;
}

function calculateSimilarity(originalText, inputText) {
    // Convert both texts to lowercase to make the comparison case-insensitive
    originalText = originalText.toLowerCase();
    inputText = inputText.toLowerCase();

    // Determine the maximum length between the two texts
    const maxLength = Math.max(originalText.length, inputText.length);

    // Count the number of matching characters at the same positions
    let matchCount = 0;
    for (let i = 0; i < maxLength; i++) {
        if (originalText[i] === inputText[i]) {
            matchCount++;
        }
    }

    // Calculate the similarity percentage based on the maximum length
    const similarityPercentage = (matchCount / maxLength) * 100;

    return similarityPercentage.toFixed(2); // Return the percentage with 2 decimal places
}
