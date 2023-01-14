movieForm.title.addEventListener('keyup', (e) => validateField(e.target));
movieForm.title.addEventListener('blur', (e) => validateField(e.target));

movieForm.actors.addEventListener('input', (e) => validateField(e.target));
movieForm.actors.addEventListener('blur', (e) => validateField(e.target));

movieForm.genre.addEventListener('input', (e) => validateField(e.target));
movieForm.genre.addEventListener('blur', (e) => validateField(e.target));

movieForm.description.addEventListener('input', (e) => validateField(e.target));
movieForm.description.addEventListener('blur', (e) => validateField(e.target));

movieForm.releaseDate.addEventListener('input', (e) => validateField(e.target));
movieForm.releaseDate.addEventListener('blur', (e) => validateField(e.target));

movieForm.addEventListener('submit', onSubmit);

const movieListElement = document.getElementById('movieList');

let titleValid = true;
let actorsValid = true;
let genreValid = true;
let descriptionValid = true;
let releaseDateValid = true;

const api = new Api('http://localhost:5000/movies');

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = '';
  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'actors': {
        if (value.length < 2) {
          actorsValid = false;
          validationMessage = "Fältet 'Actors' måste innehålla minst 2 tecken.";
        } else if (value.length > 100) {
          actorsValid = false;
          validationMessage = "Fältet 'Actors' får inte innehålla mer än 100 tecken.";
        } else {
          actorsValid = true;
        }
        break;
      }
      case 'genre': {
        if (value.length < 2) {
          genreValid = false;
          validationMessage = "Fältet 'Genre' måste innehålla minst 2 tecken.";
        } else if (value.length > 100) {
          genreValid = false;
          validationMessage = "Fältet 'Genre' får inte innehålla mer än 100 tecken.";
        } else {
          genreValid = true;
        }
        break;
      }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage = "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'releaseDate': {
      if (value.length === 0) {
        releaseDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        releaseDateValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && actorsValid && genreValid && descriptionValid && releaseDateValid) {
    console.log('Submit');
    saveMovie();
  }
}

function saveMovie() {
  const movie = {
    image: movieForm.image.value,
    title: movieForm.title.value,
    actors: movieForm.actors.value,
    genre: movieForm.genre.value,
    description: movieForm.description.value,
    releaseDate: movieForm.releaseDate.value,
  };

  api.create(movie).then((movie) => {
    if (movie) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');
  api.getAll().then((movies) => {
    movieListElement.innerHTML = '';

    if (movies && movies.length > 0) {
      movies.sort((a, b) => a.title - b.title).forEach((movie) => {
        movieListElement.insertAdjacentHTML('beforeend', renderMovie(movie));
      });
    }
  });
}

function renderMovie({ id, image, title, actors, genre, description, releaseDate }) {
    let html = `
      <div class="select-none mt-2">
        <div class="border border-gray-400">`;
    
    image && (
      html += `<img class="object-cover h-48 w-full" src="${image}"/>`
    );
  
    html += `
          <div class="flex flex-col p-2">
            <h3 class="flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
            <p class="mb-1"><b>Skådespelare:</b> ${actors}</p>
            <p class="mb-1"><b>Genre:</b> ${genre}</p>
            <p class="mb-1"><b>Beskrivning:</b> ${description}</p>
            <p class="mb-1"><b>Utgivningsdatum:</b> ${releaseDate}</p>
            <button onclick="deleteMovie(${id})" class="inline-block bg-gray-500 text-xs text-white border border-white px-3 py-1 rounded-md ml-auto">Delete</button>
          </div>
        </div>
      </div>`;
    return html;
}

function deleteMovie(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

renderList();
