// Commandes de lancements : cd D:\Openclassroom\SophieBluel\Backend   - npm start
// Fonction asynchrone pour récupérer et afficher des données depuis l'API //
async function fetchData(filter = "") {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    data.forEach((item) => {
      if (filter === "" || item.category.name === filter) {
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
    console.error("Erreur lors de la récupération des données: ", error);
  }
}

// Gestionnaires d'événements pour les boutons de filtre //
document.querySelectorAll(".filters").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.textContent;
    fetchData(category === "Tous" ? "" : category);
  });
});

// Initialise la galerie avec toutes les données au chargement de la page //
fetchData();

// Event Listener pour le login //
document.addEventListener("DOMContentLoaded", () => {
  const loginLogoutButton = document.getElementById("login-logout-button");

  if (localStorage.getItem("userToken")) {
    loginLogoutButton.textContent = "Logout";
    loginLogoutButton.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      window.location.reload();
    });
  } else {
    loginLogoutButton.textContent = "Login";
    loginLogoutButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});

// N'affiche le bouton d'edit que lorsque le token de co est dans le localStorage //
document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("edit-button");

  if (localStorage.getItem("userToken")) {
    editButton.style.display = "block";
  } else {
    editButton.style.display = "none";
  }
});

// Ouverture de Modal au clic sur le bouton modifier //
document.getElementById("edit-button").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  loadGallery();
});

// Fermeture de la modale par la croix //
document.querySelector(".close-button").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
});

// La croix de modal2 ferme les deux modales d'un coup //
document.querySelector("#close-button2").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal2").style.display = "none";
});

// Fermeture des modales si l'on clic en dehors //
window.onclick = function (event) {
  if (event.target == document.getElementById("modal")) {
    document.getElementById("modal").style.display = "none";
  }
  if (event.target == document.getElementById("modal2")) {
    document.getElementById("modal2").style.display = "none";
  }
};

// Mise à jour de la gallery-container //
function loadGallery() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((images) => {
      const galleryContainer = document.querySelector(".gallery-container");
      galleryContainer.innerHTML = "";

      images.forEach((image) => {
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";

        const imgElement = document.createElement("img");
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title || "Image";

        const iconOverlay = document.createElement("span");
        iconOverlay.className = "icon-overlay";
        iconOverlay.innerHTML =
          '<img src="./assets/icons/trash-can-solid.svg" alt="Supprimer">';

        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(iconOverlay);
        galleryContainer.appendChild(imageContainer);

        iconOverlay.addEventListener("click", function () {
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
              imageContainer.remove();
              fetchData(); // Met à jour la galerie .gallery //
              loadGallery(); // Met à jour la galerie .gallery-container //
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

// EvenListener du bouton ajout de photo//
document.getElementById("add_photo").addEventListener("click", function () {
  document.getElementById("modal2").style.display = "block";
});

// La flèche de retour ramène sur modal1//
document.querySelector(".back-arrow").addEventListener("click", function () {
  document.getElementById("modal2").style.display = "none";
});

// Listener du bouton valider //
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector("#validate-button");

  btn.addEventListener("click", function (event) {
    event.preventDefault();
    const title = document.getElementById("photo-title").value;
    const imageUrl = document.getElementById("photo-upload").files[0];
    const category = document.getElementById("photo-category").value;

    const data = new FormData();
    data.append("title", title);
    data.append("image", imageUrl);
    data.append("category", parseInt(category));

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userToken"),
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Échec de l'ajout du projet");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Projet ajouté avec succès:", data);
        fetchData(); // Met à jour la galerie .gallery //
        loadGallery(); // Met à jour la galerie .gallery-container //
        document.getElementById("modal2").style.display = "none"; // Ferme la modal2 //
        resetForm(); // Reset le formulaire //
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  });

  // Fonction pour reset le formulaire après un ajout //
  function resetForm() {
    document.getElementById("photo-title").value = "";
    document.getElementById("photo-upload").value = "";
    document.getElementById("photo-category").selectedIndex = 0;
  }
});
