//Cet élément sera utilisé pour afficher les projets récupérés à partir de l'API.
const gallery = document.querySelector(".gallery");

//Cette fonction récupère les projets à partir de l'API.  Elle prend un paramètre pour filtrer les projets par catégorie.
const getWorks = async (categoryId) => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("data recovery error");
      }
    })

    // Une fois que les projets sont récupérés, nous utilisons la méthode then pour traiter les données
    .then((project) => {
      //supprimer tous les éléments enfants d'un élément parent donné.
      removeElement(gallery);
      //si catégorie vide > afficher tout, si catégorie vraie > afficher la catégorie uniquement
      project.forEach((project) => {
        if (categoryId == project.category.id || categoryId == null) {
          createProject(project);
        }
      });
    })

    .catch((error) => {
      console.log(errror);
    });
};

// Fonction pour créer un projet
const createProject = (project) => {
  // Créer un élément figure pour le projet
  const figureProject = document.createElement("figure");
  // Ajouter des attributs à l'élément figure pour stocker les informations de la catégorie et de l'ID du projet
  figureProject.setAttribute("data-tag", project.category.name);
  figureProject.setAttribute("data-id", project.id);

  // Créer un élément image pour le projet
  const imageProject = document.createElement("img");
  // Définir la source et le texte alternatif de l'image
  imageProject.src = project.imageUrl;
  imageProject.alt = project.title;

  // Créer un élément figcaption pour le titre du projet
  const figcaptionProject = document.createElement("figcaption");
  // Définir le texte du titre
  figcaptionProject.innerText = project.title;

  // Ajouter les éléments enfants à leur parent
  figureProject.appendChild(imageProject);
  figureProject.appendChild(figcaptionProject);
  // Ajouter le projet à la galerie
  gallery.appendChild(figureProject);
};

// Fonction pour supprimer les éléments d'un parent pour afficher une page blanche
const removeElement = (parent_element) => {
  // Boucle while pour supprimer les éléments enfants tant qu'il en reste
  while (parent_element.childNodes.length > 0) {
    // Supprimer le dernier élément enfant jusqu'à ce qu'il n'y en ait plus
    parent_element.removeChild(parent_element.lastChild);
  }
};

//Cette fonction appelle les deux fonctions pour récupérer les projets et les catégories à partir des API.
const main = async () => {
  await getWorks();
  await getCategories();
};

//thread main
main();
