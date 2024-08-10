// Sélectionne l'élément de filtres de navigation dans le DOM
const navFilters = document.querySelector(".filters-nav");

// Crée une fonction createButton qui prend en paramètre une catégorie
const createButton = (category) => {
  // Crée un élément HTML de type button et le stocke dans la variable buttonFilters
  const buttonFilters = document.createElement("button");
  // Ajoute un attribut "data-tag" à l'élément buttonFilters avec la valeur du nom de la catégorie
  buttonFilters.setAttribute("data-tag", category.name);
  // Ajoute un attribut "data-id" à l'élément buttonFilters avec la valeur de l'ID de la catégorie
  buttonFilters.setAttribute("data-id", category.id);
  // Définit le texte de l'élément buttonFilters avec le nom de la catégorie
  buttonFilters.innerText = category.name;
  // Ajoute l'élément buttonFilters à l'élément navFilters
  navFilters.appendChild(buttonFilters);
};

// Crée une fonction getCategories qui récupère les catégories de manière asynchrone
const getCategories = async (category) => {
  // Attend la réponse du serveur
  await fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("category data recovery error");
      }
    })

    // Une fois les données récupérées, parcourt chaque catégorie
    .then((category) => {
      category.forEach((category) => {
        // Appelle la fonction createButton pour créer un bouton pour chaque catégorie
        createButton(category);
      });
    })

    // Une fois les boutons créés, sélectionne tous les boutons dans l'élément navFilters
    .then((Filter) => {
      const buttons = document.querySelectorAll(".filters-nav button");
      // Ajoute un événement click à chaque bouton
      buttons.forEach((button) => {
        button.addEventListener("click", function () {
          // Récupère l'ID de la catégorie associée au bouton cliqué
          let categoriesId = button.getAttribute("data-id");
          console.log(categoriesId);
          // Enlève la classe "is-active" de tous les boutons
          buttons.forEach((button) => button.classList.remove("is-active"));
          // Ajoute la classe "is-active" au bouton cliqué
          this.classList.add("is-active");
          // Appelle la fonction getWorks avec l'ID de la catégorie
          getWorks(categoriesId);
        });
      });
    })

    .catch((error) => {
      console.log(errror);
    });
};
