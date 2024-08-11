// Sélectionner l'élément body
const body = document.querySelector("body");

// Sélectionner l'élément titre de la galerie
const galleryTitle = document.querySelector("#portfolio h2");

// Récupérer le token depuis le stockage de session
const token = window.sessionStorage.getItem("token");

// Définir une fonction pour se déconnecter
const logOut = () => {
  // Supprimer le token du stockage de session
  sessionStorage.removeItem("token");
  // Rediriger vers la page index.html
  window.location.href = "./index.html";
};

// Définir une fonction pour afficher la page d'administration
const adminPage = () => {
  // Ajouter une barre d'édition en haut de la page
  body.insertAdjacentHTML(
    "afterbegin",
    `<div class="edit-bar">
        <span class="edit"><i class="fa-solid fa-pen-to-square"></i>Mode édition</span>
    </div>`
  );

  // Ajouter un lien pour modifier le titre de la galerie
  galleryTitle.insertAdjacentHTML(
    "afterend",
    `<a id="open-modal" href="#modal" class="edit-link">
        <i class="fa-solid fa-pen-to-square"></i>modifier
    </a>`
  );

  // Cacher la navigation des filtres
  document.querySelector(".filters-nav").style.display = "none";

  // Récupérer l'élément bouton de connexion
  const logButton = document.querySelector("#logButton");
  console.log("#logButton");

  // Mettre à jour le bouton de connexion pour afficher un lien de déconnexion
  logButton.innerHTML = `<a href="./index.html">logout</a>`;

  // Ajouter un écouteur d'événement au bouton de connexion pour appeler la fonction logOut
  logButton.addEventListener("click", logOut);

  // Récupérer l'élément lien modal
  const modalLink = document.querySelector("#open-modal");

  // Ajouter un écouteur d'événement au lien modal pour appeler la fonction openModal
  modalLink.addEventListener("click", openModal);
};

// Si le token n'est pas null, afficher la page d'administration
if (token !== null) {
  adminPage();
}
