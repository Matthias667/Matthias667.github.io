// Globalne zmienne
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];

// Funkcja ładowania pytań z JSON
async function loadQuestions() {
    try {
        // Próbujemy załadować plik JSON
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error("Nie udało się załadować pliku JSON.");
        }
        questions = await response.json();
    } catch (error) {
        console.error("Błąd podczas ładowania pytań: ", error);
        alert("Nie udało się załadować pytań. Sprawdź, czy plik 'questions.json' jest dostępny.");
    }
}

// Funkcja rozpoczynająca test
function startTest() {
    // Ukrycie przycisku startowego
    document.getElementById('start-container').style.display = 'none';
    
    // Pokazanie elementów testu
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('next-btn').style.display = 'inline-block';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('score').textContent = '';

    // Inicjalizacja zmiennych
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = [];
    
    // Rozpoczęcie testu i pokazanie pierwszego pytania
    nextQuestion();
}

// Funkcja do losowania pytań i przejścia do następnego pytania
function nextQuestion() {
    if (answeredQuestions.length === 50) {
        // Po odpowiedzeniu na 50 pytań, pokazujemy wyniki
        showResults();
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (answeredQuestions.includes(randomIndex));

    answeredQuestions.push(randomIndex);
    const question = questions[randomIndex];

    // Sprawdzamy, czy pytanie zostało poprawnie załadowane
    if (!question) {
        console.error("Błąd: pytanie jest niezdefiniowane.");
        return;
    }

    // Wyświetlanie pytania
    document.getElementById('question-text').textContent = question.question;

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = ''; // Czyszczenie poprzednich odpowiedzi

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => checkAnswer(index, randomIndex);
        answersContainer.appendChild(button);
    });
}

// Funkcja sprawdzająca odpowiedź
function checkAnswer(selectedIndex, questionIndex) {
    const question = questions[questionIndex];
    if (selectedIndex === question.correct) {
        score++;
    }
    // Po zaznaczeniu odpowiedzi przechodzimy do kolejnego pytania
    nextQuestion();
}

// Funkcja pokazująca wynik
function showResults() {
    const percentage = (score / 50) * 100; // Zmieniamy na 50, ponieważ jest 50 pytań
    document.getElementById('score').textContent = `Twój wynik: ${percentage.toFixed(2)}%`;
    
    if (percentage >= 90) {
        alert('Gratulacje! Zdałeś test!');
    } else {
        alert('Niestety, nie zdałeś testu.');
    }

    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'inline-block';
}

// Funkcja restartująca test
function restartTest() {
    startTest();
}

// Ładowanie pytań po załadowaniu strony
loadQuestions();
