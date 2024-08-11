// Sélectionne l'élément de filtres de navigation dans le DOM
const navFilters = document.querySelector(".filters-nav");
//Cet élément sera utilisé pour afficher les projets récupérés à partir de l'API.
const gallery = document.querySelector(".gallery");
const asideModal = document.querySelector("#modal");
const galleryModal = document.querySelector(".modal-box-gallery");
const modalGallery = document.querySelector(".modal-gallery");
const addModal = document.querySelector(".modal-add-picture");
const selectForm = document.querySelector("#category");

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

const createOption = (category) => {
  const optionForm = document.createElement("option");
  optionForm.setAttribute("value", category.id);
  optionForm.innerText = category.name;
  selectForm.appendChild(optionForm);
};

const removeElement = (parent_element) => {
  while (parent_element.childNodes.length > 0) {
    parent_element.removeChild(parent_element.lastChild);
  }
};

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
      removeElement(modalGallery);
      project.forEach((project) => {
        //si catégorie vide > afficher tout, si catégorie vraie > afficher la catégorie uniquement
        if (categoryId == project.category.id || categoryId == null) {
          createProject(project);
          createModalProject(project);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Crée une fonction getCategories qui récupère les catégories de manière asynchrone
const getCategories = async (category) => {
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
        createOption(category);
      });
    })

    // Une fois les boutons créés, sélectionne tous les boutons dans l'élément navFilters
    .then((Filter) => {
      const buttons = document.querySelectorAll(".filters-nav button");
      // Ajoute un événement click à chaque bouton
      buttons.forEach((button) => {
        // Récupère l'ID de la catégorie associée au bouton cliqué
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
      console.log(error);
    });
};

//Cette fonction appelle les deux fonctions pour récupérer les projets et les catégories à partir des API.
const main = async () => {
  await getWorks();
  await getCategories();
};

main();

/********* --------- ADMIN MODE ---------- ********/
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

  /* --- LOGIN / LOGOUT --- */
  // Récupérer l'élément bouton de connexion
  const logButton = document.querySelector("#logButton");
  console.log("#logButton");
  // Mettre à jour le bouton de connexion pour afficher un lien de déconnexion
  logButton.innerHTML = `<a href="./index.html">logout</a>`;
  // Ajouter un écouteur d'événement au bouton de connexion pour appeler la fonction logOut
  logButton.addEventListener("click", logOut);

  /* --- OPPENING MODAL --- */
  // Récupérer l'élément lien modal
  const modalLink = document.querySelector("#open-modal");
  // Ajouter un écouteur d'évènement au lien modal pour appeler la fonction openModal
  modalLink.addEventListener("click", openModal);
};

const deleteWork = async (workID) => {
  await fetch("http://localhost:5678/api/works/" + workID, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: "bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
  });
  getWorks();
};

const createModalProject = (project) => {
  const figureModalProject = document.createElement("figure");
  figureModalProject.setAttribute("data-tag", project.id);

  const imageModalProject = document.createElement("img");
  imageModalProject.src = project.imageUrl;
  imageModalProject.alt = project.title;
  imageModalProject.classList.add("modal-project-img");

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("trash-icon", "fas", "fa-trash-alt");
  trashIcon.setAttribute("data-id", project.id);
  let trashIconID = trashIcon.getAttribute("data-id");
  const moveIcon = document.createElement("div");
  moveIcon.classList.add("move-icon");
  trashIcon.addEventListener("click", function (event) {
    event.preventDefault();
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?") == true) {
      deleteWork(trashIconID);
    }
  });

  figureModalProject.appendChild(imageModalProject);
  figureModalProject.appendChild(trashIcon);
  trashIcon.appendChild(moveIcon);
  modalGallery.appendChild(figureModalProject);
};

/******** ------- ADD PROJECT ------ **********/

const addWork = document.querySelector("#add-box");
const inputElement = document.querySelector("#title");
const selectElement = document.querySelector("#category");
const fileInputElement = document.querySelector("#image");
const submitButton = document.querySelector("#validate-button");
const inputFile = document.querySelector("#image");

const showfile = (e) => {
  e.preventDefault();

  const reader = new FileReader();

  reader.readAsDataURL(inputFile.files[0]);

  reader.addEventListener("load", function () {
    previewImage.src = reader.result;
  });

  const previewBox = document.querySelector(".upload-picture-box");
  const previewImage = document.createElement("img");
  previewImage.setAttribute("id", "preview-image");

  if (!document.querySelector(".preview-image")) {
    previewImage.style.position = "absolute";
    previewImage.style.objectFit = "contain";
    previewImage.style.width = "100%";
    previewImage.style.height = "100%";
  }

  const uploadbutton = document.querySelector(".upload-button");
  uploadbutton.style.display = "none";
  const pictureIcon = document.querySelector(".picture-icon");
  pictureIcon.style.display = "none";
  const typeFiles = document.querySelector(".type-files");
  typeFiles.style.display = "none";

  previewBox.appendChild(previewImage);
};

const checkForm = () => {
  if (
    inputElement.value !== "" &&
    selectElement.value !== "" &&
    fileInputElement.value !== ""
  ) {
    submitButton.style.backgroundColor = "#1D6154";
    submitButton.style.color = "#ffffff";
  } else {
    return console.log("Formulaire incomplet");
  }
};

inputFile.addEventListener("change", showfile);
inputElement.addEventListener("input", checkForm);
selectElement.addEventListener("input", checkForm);
fileInputElement.addEventListener("change", checkForm);

const addWorks = async () => {
  let getpic = document.getElementById("image").files[0];
  let gettitle = document.getElementById("title").value;
  let getCategory = document.getElementById("category").value;

  let formData = new FormData();
  formData.append("image", getpic);
  formData.append("title", gettitle);
  formData.append("category", getCategory);

  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        getWorks();
        closeModal();
        console.log("Le projet a été ajouté !");
        return response.json();
      } else {
        console.log("Api data recovery error");
      }
    })

    .catch((error) => {
      console.log(error);
    });
};

const validateForm = (e) => {
  e.preventDefault();

  let imgIssue = document.querySelector("#error-img");
  let titleIssue = document.querySelector("#error-title");
  let categoryIssue = document.querySelector("#error-category");

  imgIssue.innerHTML = "";
  titleIssue.innerHTML = "";
  categoryIssue.innerHTML = "";

  if (inputElement.value === "") {
    titleIssue.innerHTML = "Titre obligatoire";
  }
  if (selectElement.value === "") {
    categoryIssue.innerHTML = "Catégorie obligatoire";
  }
  if (fileInputElement.files.length === 0) {
    imgIssue.innerHTML = "Image obligatoire";
  }

  if (
    inputElement.value !== "" &&
    selectElement.value !== "" &&
    fileInputElement.files.length > 0
  ) {
    addWorks();
  }
};

/* --- ADMIN PAGE ELEMENTS --- */

const openModal = () => {
  asideModal.classList.remove("unactive-modal");
  asideModal.setAttribute("aria-hidden", "false");

  galleryModal.classList.remove("unactive-modal");

  const addPicButton = document.querySelector("#add-photo");
  addPicButton.addEventListener("click", (event) => {
    galleryModal.classList.add("unactive-modal");

    addModal.classList.remove("unactive-modal");

    const closeIcon2 = document.querySelector(".close-icon-2");
    closeIcon2.addEventListener("click", closeModal);

    const backIcon = document.querySelector(".back-icon");
    backIcon.addEventListener("click", (event) => {
      galleryModal.classList.remove("unactive-modal");

      addModal.classList.add("unactive-modal");
    });
  });

  addWork.addEventListener("submit", validateForm);

  const closeIcon = document.querySelector(".close-icon");
  closeIcon.addEventListener("click", closeModal);

  document.getElementById("modal").addEventListener("click", (event) => {
    if (event.target === document.getElementById("modal")) {
      closeModal();
    }
  });

  getWorks();
};

const closeModal = () => {
  asideModal.classList.add("unactive-modal");
  modalGallery.classList.add("unactive-modal");
  addModal.classList.add("unactive-modal");

  document.querySelector("#add-box").reset();
  const previewBox = document.querySelector(".upload-picture-box");
  const previewImage = document.querySelector("#preview-image");
  if (previewImage !== null) {
    previewBox.removeChild(previewImage);
  }

  const uploadButtonPic = document.querySelector(".upload-button");
  uploadButtonPic.style.display = "block";

  const pictureIcon = document.querySelector(".picture-icon");
  pictureIcon.style.display = "";

  const typeFiles = document.querySelector(".type-files");
  typeFiles.style.display = "";

  submitButton.style.backgroundColor = "#a7a7a7";
};

// Si le token n'est pas null, afficher la page d'administration
if (token !== null) {
  adminPage();
}
