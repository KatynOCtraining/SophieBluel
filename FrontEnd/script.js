// Commande à lancer pour lancer le serv : cd D:\Openclassroom\SophieBluel\Backend    -npm start //

// Fonction pour récupérer et afficher des données depuis l'API //
async function fetchData(filter = "") {
  try {
    // Envoie une requête GET à l'API //
    const response = await fetch("http://localhost:5678/api/works");
    // Gère les erreurs de réponse HTTP //
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    // Convertit la réponse en JSON //
    const data = await response.json();

    // Sélectionne la div de la galerie et efface son contenu //
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Boucle sur les données reçues et affiche les éléments correspondant au filtre //
    data.forEach((item) => {
      if (filter === "" || item.category.name === filter) {
        // Crée et ajoute des éléments pour chaque donnée
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = item.imageUrl;
        img.alt = item.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = item.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      }
    });
  } catch (error) {
    // Affiche une erreur en cas de problème lors de la récupération des données //
    console.error("Erreur lors de la récupération des données: ", error);
  }
}

// Gestionnaires d'événements pour les boutons de filtre //
document.querySelectorAll(".filters").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.textContent; // Utilise le texte du bouton comme filtre //
    fetchData(category === "Tous" ? "" : category);
  });
});

// Initialise la galerie avec toutes les données au chargement //
fetchData();

// Gestionnaire d'événements pour le bouton de connexion/déconnexion //
document.addEventListener("DOMContentLoaded", () => {
  const loginLogoutButton = document.getElementById("login-logout-button");

  if (localStorage.getItem("userToken")) {
    // Change le texte et le comportement du bouton si l'utilisateur est connecté //
    loginLogoutButton.textContent = "Logout";
    loginLogoutButton.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      window.location.reload(); // Recharge la page ou redirige vers la page de connexion //
    });
  } else {
    // Réglage pour un utilisateur non connecté //
    loginLogoutButton.textContent = "Login";
    loginLogoutButton.addEventListener("click", () => {
      window.location.href = "login.html"; // Redirige vers la page de connexion //
    });
  }
});

// Gestionnaire pour afficher/cacher le bouton d'édition selon l'état de connexion //
document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("edit-button");

  if (localStorage.getItem("userToken")) {
    editButton.style.display = "block";
  } else {
    editButton.style.display = "none";
  }
});

// Gestionnaire pour ouvrir et fermer une modale d'édition //
document.getElementById("edit-button").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  loadGallery(); // Charge les images pour l'édition //
});

document.querySelector(".close-button").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
});

// Ferme la modale si on clique en dehors de celle-ci //
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function loadGallery() {
  // Envoie une requête HTTP GET pour récupérer les données du serveur //
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json()) // Convertit la réponse en JSON //
    .then((images) => {
      // Sélectionne le conteneur de la galerie dans le DOM //
      const galleryContainer = document.querySelector(".gallery-container");
      galleryContainer.innerHTML = ""; // Efface le contenu actuel de la galerie //

      // Itère sur chaque image reçue du serveur //
      images.forEach((image) => {
        const imageContainer = document.createElement("div"); // Crée une nouvelle div pour chaque image//
        imageContainer.className = "image-container"; // Attribue une classe pour le style //

        const imgElement = document.createElement("img"); // Crée un élément img //
        imgElement.src = image.imageUrl; // Définit l'URL de l'image //
        imgElement.alt = image.title || "Image"; // Définit le texte alternatif de l'image //

        // Crée un élément pour l'icône de suppression //
        const iconOverlay = document.createElement("span");
        iconOverlay.className = "icon-overlay";
        iconOverlay.innerHTML =
          '<img src="./assets/icons/trash-can-solid.svg" alt="Supprimer">';

        // Ajoute l'image et l'icône de suppression au conteneur de l'image //
        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(iconOverlay);
        // Ajoute le conteneur de l'image au conteneur de la galerie //
        galleryContainer.appendChild(imageContainer);

        // Ajoute un écouteur d'événements pour gérer la suppression de l'image//
        iconOverlay.addEventListener("click", function () {
          // Envoie une requête DELETE pour supprimer l'image du serveur //
          fetch(`http://localhost:5678/api/works/${image.id}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("userToken"),
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Échec de la suppression");
              }
              imageContainer.remove(); // Supprime l'image du DOM en cas de succès //
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression:", error);
            });
        });
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement de la galerie:", error);
    });
}

// Ajoute un écouteur d'événements au bouton pour ajouter une photoc//
document.getElementById("add_photo").addEventListener("click", function () {
  // Sélectionne le contenu de la fenêtre modalec//
  const modalContent = document.querySelector(".modal-content");

  // Remplace le contenu de la fenêtre modale avec un formulaire d'ajout de photoc//
  modalContent.innerHTML = `
      <span class="close-button">&times;</span>
      <h3>Ajout Photo</h3>
      <div id="form-add-photo">
          <input type="file" id="photo-upload">
          <input type="text" id="photo-title" placeholder="Titre de la photo">
          <select id="photo-category">
              <option value="categorie1">Appartements</option>
              <option value="categorie2">Hotels & restaurants</option>
              <option value="categorie2">Objets</option>
          </select>
          <button id="validate-button" class="validate-button">Valider</button>
      </div>
  `;

  // Ajoute un écouteur d'événements à la nouvelle icône de fermeture pour fermer la modale //
  document
    .querySelector(".close-button")
    .addEventListener("click", function () {
      document.getElementById("modal").style.display = "none";
    });
});

// Ajoute un écouteur d'événement qui s'active une fois le contenu du DOM entièrement chargé //
document.addEventListener("DOMContentLoaded", function () {
  // Sélectionne le bouton de validation et ajoute un écouteur d'événement de clic //
  document
    .querySelector("#validate-button")
    .addEventListener("click", function () {
      // Récupère la valeur du titre depuis l'élément d'entrée du titre //
      const title = document.getElementById("photo-title").value;
      // Récupère l'URL de l'image depuis l'élément d'entrée de l'URL de l'image //
      const imageUrl = document.getElementById("photo-url").value;
      // Récupère l'ID de la catégorie depuis l'élément de sélection de catégorie //
      const categoryId = document.getElementById("photo-category").value;

      // Prépare les données à envoyer dans la requête POST //
      const data = {
        title: title,
        imageUrl: imageUrl,
        categoryId: categoryId,
      };

      // Envoie une requête POST au serveur avec les données du formulaire //
      fetch("http://localhost:5678/api/works", {
        method: "POST", // Spécifie la méthode POST pour l'envoi de données //
        headers: {
          "Content-Type": "application/json", // Définit le type de contenu comme JSON //
        },
        body: JSON.stringify(data), // Convertit les données du formulaire en chaîne JSON //
      })
        .then((response) => {
          if (!response.ok) {
            // Lance une erreur si la réponse n'est pas OK //
            throw new Error("Échec de l'ajout du projet");
          }
          return response.json(); // Convertit la réponse en JSON //
        })
        .then((data) => {
          console.log("Projet ajouté avec succès:", data);
          loadGallery(); // Recharge la galerie pour afficher le nouvel élément //
        })
        .catch((error) => {
          console.error("Erreur:", error);
          // Gère les erreurs ici, comme afficher un message à l'utilisateur //
        });
    });
});
