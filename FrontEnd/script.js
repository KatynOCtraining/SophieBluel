// Commandes de lancements : cd D:\Openclassroom\SophieBluel\Backend   - npm start
// Variable globale pour conserver le filtre actuel et toutes les données //
let currentFilter = "Tous";
let allData = [];

// Fonction asynchrone pour charger les données depuis l'API //
async function loadInitialData() {
  try {
    //Récupération des données//
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    allData = await response.json();
    applyFilter(currentFilter); // Application du filtre initial //
  } catch (error) {
    console.error("Erreur lors du chargement initial des données: ", error);
  }
}

// Fonction pour appliquer un filtre sur les données stockées//
function applyFilter(filter) {
  const categoryToDataId = {
    Objets: "1",
    Appartements: "2",
    "Hotels & restaurants": "3",
  };

  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  allData.forEach((item) => {
    if (filter === "Tous" || item.category.name === filter) {
      const figure = document.createElement("figure");
      figure.setAttribute(
        "data-catID",
        categoryToDataId[item.category.name] || "0"
      );
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
}

//Récupération des catégories pour les intégrés à btn-filters//

if (!localStorage.getItem("userToken")) {
  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((elem) => {
        const btn = document.createElement("button");
        btn.classList.add("filters");
        btn.innerHTML = elem.name;

        document.querySelector(".btn_filters").appendChild(btn);
      });

      document.querySelectorAll(".filters").forEach((button) => {
        button.addEventListener("click", (e) => {
          const filter = e.currentTarget.textContent;
          applyFilter(filter);
        });
      });
    });
}

//Récupération des catégories pour les intégrés au formulaire lors de l'ajout de work //

fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((data) => {
    const select = document.getElementById("photo-category");
    select.innerHTML = ""; // Efface les options existantes

    data.forEach((elem) => {
      const option = document.createElement("option");
      option.value = elem.id; // Supposons que chaque élément a un identifiant
      option.textContent = elem.name; // Et un nom à afficher

      select.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des données:", error);
  });

// Gestionnaires d'événements pour les boutons de filtre //
document.querySelectorAll(".filters").forEach((button) => {
  button.addEventListener("click", (e) => {
    const filter = e.currentTarget.textContent;
    applyFilter(filter);
  });
});

// Event Listener pour le login //
document.addEventListener("DOMContentLoaded", () => {
  const loginLogoutButton = document.getElementById("login-logout-button");

  if (localStorage.getItem("userToken")) {
    loginLogoutButton.textContent = "Logout";
    loginLogoutButton.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      window.location.reload();
    });

    // Cache les filtres si user est co //
    document.querySelectorAll(".filters").forEach((button) => {
      button.style.display = "none";
    });

    // Affiche le bouton d'edit si user co //
    const editButton = document.getElementById("edit-button");
    editButton.style.display = "block";
  } else {
    loginLogoutButton.textContent = "Login";
    loginLogoutButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });

    // Affiche les boutons de filtrage si user = visiteur //
    document.querySelectorAll(".filters").forEach((button) => {
      button.style.display = "block";
    });

    // Cache le bouton d'edit si user = visiteur //
    const editButton = document.getElementById("edit-button");
    editButton.style.display = "none";
  }
});

// Ouverture de modal1 au clic sur le bouton modifier //
document.getElementById("edit-button").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  loadGallery();
});

// Fermeture de modal1 par la croix //
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

// Mise à jour de  .gallery-container //
function loadGallery() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      allData = data; // Met à jour les données locales //
      applyFilter(currentFilter); // Met à jour la galerie .gallery //

      const galleryContainer = document.querySelector(".gallery-container");
      galleryContainer.innerHTML = "";

      data.forEach((image) => {
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
              loadGallery(); // Rafraîchit les deux galeries après la suppression d'un work//
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

// Listener du bouton valider pour l'ajout d'une photo //
document.getElementById("add_photo").addEventListener("click", function () {
  document.getElementById("modal2").style.display = "block";
});

// La flèche de retour de modal2 ramène sur modal1 //
document.querySelector(".back-arrow").addEventListener("click", function () {
  document.getElementById("modal2").style.display = "none";
});

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
        document.getElementById("modal2").style.display = "none";
        loadGallery(); // Rafraîchit les deux galeries après l'ajout d'un work //
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  });
});

document.getElementById("photo-upload").addEventListener("change", function () {
  const fileInput = this;
  const preview = document.getElementById("image-preview");
  const otherContents = document.querySelector(".champ_photo").children;

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";

      // Cache les autres contenus du label //
      Array.from(otherContents).forEach((child) => {
        if (child !== preview) {
          child.style.display = "none";
        }
      });
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    preview.src = "";
    preview.style.display = "none"; // Cache l'aperçu si besoin //

    // Réaffiche les autres contenus du label
    Array.from(otherContents).forEach((child) => {
      child.style.display = "";
    });
  }
});

// Initialise la galerie avec toutes les données au chargement de la page //
loadInitialData();
