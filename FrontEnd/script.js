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

