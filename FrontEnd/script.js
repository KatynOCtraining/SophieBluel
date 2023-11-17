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




  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission standard du formulaire

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password
    };

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      localStorage.setItem('userToken', data.token);
      window.location.href = './index.html'; 
        
    })
    .catch((error) => {
        console.error('Error:', error);
        // Gérez ici les erreurs (par exemple, affichez un message d'erreur)
    });
  });


  document.addEventListener('DOMContentLoaded', (event) => {
    const editButton = document.getElementById('edit-button');

    if (localStorage.getItem('userToken')) {
        // Si l'utilisateur est connecté, affichez le bouton
        editButton.style.display = 'block';
    } else {
        // Si l'utilisateur n'est pas connecté, cachez le bouton
        editButton.style.display = 'none';
    }
});