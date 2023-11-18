// Fonction pour vérifier l'état de connexion
function isUserLoggedIn() {
    return localStorage.getItem('userToken') !== null;
}
window.isUserLoggedIn = isUserLoggedIn;

// Gestion de l'événement de soumission du formulaire
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const loginData = { email, password };

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Oups, vos doigts ont ripés, veuillez vérifier vos identifiants.');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('userToken', data.token);
        window.location.href = 'index.html';
    })
    .catch(error => {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block'; // Affiche le message d'erreur
    });
});