// Commande à lancer pour lancer le serv : cd D:\Openclassroom\SophieBluel\Backend   -   npm install   -npm start

// Fonction pour récupérer les données //
async function fetchData(filter = '') {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
        const data = await response.json();
        

            // Sélection de la div gallery //
      const gallery = document.querySelector('.gallery');
      gallery.innerHTML = ''; // Effacer les éléments existants
  
      data.forEach(item => {
        if (filter === '' || item.category.name === filter) {
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          img.src = item.imageUrl;
          img.alt = item.title;
  
          const figcaption = document.createElement('figcaption');
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
  
  // Ajout de gestionnaires d'événements pour les boutons de filtre
  document.querySelectorAll('.filters').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.textContent; // Utilisez le texte du bouton comme filtre
      fetchData(category === 'Tous' ? '' : category);
    });
  });
  
  // Initialiser avec toutes les données
  fetchData();



  document.addEventListener('DOMContentLoaded', () => {
    const loginLogoutButton = document.getElementById('login-logout-button');

    if (localStorage.getItem('userToken')) {
        loginLogoutButton.textContent = 'Logout';
        loginLogoutButton.addEventListener('click', () => {
            localStorage.removeItem('userToken');
            window.location.reload(); // ou redirigez vers la page de login
        });
    } else {
        loginLogoutButton.textContent = 'Login';
        loginLogoutButton.addEventListener('click', () => {
            window.location.href = 'login.html'; // Redirection vers la page de login
        });
    }

   
  });

  document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');

    // Vérifie si l'utilisateur est connecté
    if (localStorage.getItem('userToken')) {
        // Affiche le bouton si un token est trouvé
        editButton.style.display = 'block'; // ou 'inline', 'inline-block', selon le contexte
    } else {
        // Cache le bouton si aucun token n'est trouvé
        editButton.style.display = 'none';
    }
  });




  document.getElementById('edit-button').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block';
    loadGallery(); // Chargez les images lorsque la modale s'ouvre
});

document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});
window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target == modal) {
      modal.style.display = 'none';
  }
}










function loadGallery() {
  fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(images => {
          const galleryContainer = document.querySelector('.gallery-container');
          galleryContainer.innerHTML = '';

          images.forEach(image => {
              const imageContainer = document.createElement('div');
              imageContainer.className = 'image-container';

              const imgElement = document.createElement('img');
              imgElement.src = image.imageUrl;
              imgElement.alt = image.title || 'Image';

              const iconOverlay = document.createElement('span');
              iconOverlay.className = 'icon-overlay';
              iconOverlay.innerHTML = '<img src="./assets/icons/trash-can-solid.svg" alt="Supprimer">'; // Icône de suppression

              imageContainer.appendChild(imgElement);
              imageContainer.appendChild(iconOverlay);
              galleryContainer.appendChild(imageContainer);

              // Gestionnaire d'événements pour la suppression
              iconOverlay.addEventListener('click', function() {
                  fetch(`http://localhost:5678/api/works/${image.id}`, { // Assurez-vous d'avoir l'ID correct de l'image
                    method: 'DELETE',
                    headers: {
                      'Authorization': 'Bearer ' + localStorage.getItem('userToken') // Ajoutez l'en-tête d'autorisation
                  }
          
                    
                  })
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Échec de la suppression');
                      }
                      imageContainer.remove(); // Supprime l'image du DOM
                  })
                  .catch(error => {
                      console.error('Erreur lors de la suppression:', error);
                      // Affichez ici un message d'erreur à l'utilisateur
                  });
              });
          });
      })
      .catch(error => {
          console.error('Erreur lors du chargement de la galerie:', error);
      });
}


document.getElementById('add_photo').addEventListener('click', function() {
  const modalContent = document.querySelector('.modal-content');

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
              <!-- Autres options de catégorie -->
          </select>
          <button id="validate-button" class="validate-button">Valider</button>
      </div>
  `;

  // Assurez-vous de rajouter le gestionnaire d'événements pour la nouvelle icône de fermeture
  document.querySelector('.close-button').addEventListener('click', function() {
      document.getElementById('modal').style.display = 'none';
  });
});















document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('validate-button').addEventListener('click', function() {
    const title = document.getElementById('photo-title').value;
    const imageUrl = document.getElementById('photo-url').value;
    const categoryId = document.getElementById('photo-category').value;
  

  
    const data = {
        title: title,
        imageUrl: imageUrl,
        categoryId: categoryId,
      
    };
  
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de l\'ajout du projet');
        }
        return response.json();
    })
    .then(data => {
      console.log('Projet ajouté avec succès:', data);
      loadGallery();
        // Mettez à jour la galerie ici
    })
    .catch(error => {
        console.error('Erreur:', error);
        // Gérez les erreurs ici
    });
  });
});