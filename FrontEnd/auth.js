// Définit une fonction pour vérifier si l'utilisateur est connecté //
function isUserLoggedIn() {
  // Vérifie si le token de l'utilisateur est dans le localstorage//
  return localStorage.getItem("userToken") !== null;
}
// Rend la fonction appelable sur d'autre pages//
window.isUserLoggedIn = isUserLoggedIn;

// EventListener du formulaire //
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    // Empêche le rechargement de la page//
    event.preventDefault();

    // Récupère les valeurs des champs email et mot de passe du formulaire //
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Récupère l'élément pour afficher les messages d'erreur
    const errorMessage = document.getElementById("error-message");

    // Création de l'objet pour la requête //
    const loginData = { email, password };

    // Envoie une requête POST à l'API pour la connexion //
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        // Vérifie si la réponse de l'API indique une erreur //
        if (!response.ok) {
          throw new Error(
            "Oups, vos doigts ont ripés, veuillez vérifier vos identifiants."
          );
        }
        // Si la réponse est OK, extrait le JSON du token //
        return response.json();
      })
      .then((data) => {
        // Stocke le token de l'utilisateur dans le localstorage//
        localStorage.setItem("userToken", data.token);
        // Redirige l'utilisateur vers la page d'accueil //
        window.location.href = "index.html";
      })
      .catch((error) => {
        // Affiche un message d'erreur si la connexion échoue //
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";
      });
  });
