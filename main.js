const API_URL = "http://localhost:3000/api/movies"; // Cambiar la URL de la API para películas

function getMoviePayload() {
  // Obtener los valores de los campos del formulario
  const title = document.getElementById("title").value;
  const director = document.getElementById("director").value;
  const releaseYear = document.getElementById("releaseYear").value;
  const genre = document.getElementById("genre").value;
  const description = document.getElementById("description").value;
  const language = document.getElementById("language").value;
  const duration = document.getElementById("duration").value;
  const posterImage = document.getElementById("posterImage").value;

  // Crear el objeto de datos que se enviará como JSON
  const data = {
    title,
    director,
    releaseYear,
    genre,
    description,
    language,
    duration,
    posterImage,
  };

  // Eliminar propiedades con valores vacíos
  for (const key in data) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      delete data[key];
    }
  }

  return data;
}

// Función para cargar la lista de películas
function loadMovies() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const movieList = document.getElementById("movieList");
      movieList.innerHTML = ""; // Limpiar la lista antes de agregar elementos

      data.forEach((movie) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>${movie.title}</strong> - ${movie.director}<br>
          <small>${movie.releaseYear}, ${movie.genre || "Sin género"}</small><br>
          <p>${movie.description || "Sin descripción"}</p>
          <button onclick="editMovie('${movie._id}')">Editar</button>
          <button onclick="deleteMovie('${movie._id}')">Eliminar</button>
        `;
        movieList.appendChild(listItem);
      });
    });
}

// Función para guardar una película
function saveMovie(event) {
  event.preventDefault();

  const data = getMoviePayload();

  // Obtener el id de la película a editar
  const movieId = document.getElementById("id").value;
  const isEditing = movieId !== "";

  const API_SAVE_URL = isEditing ? `${API_URL}/${movieId}` : API_URL;
  const API_SAVE_METHOD = isEditing ? "PUT" : "POST";

  fetch(API_SAVE_URL, {
    method: API_SAVE_METHOD,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      // Limpiar el formulario
      event.target.reset();
      // Refrescar la lista de películas después de agregar una nueva
      loadMovies();
    });
}

// Función para eliminar una película
function deleteMovie(movieId) {
  if (confirm("¿Seguro que desea eliminar esta película?")) {
    fetch(`${API_URL}/${movieId}`, {
      method: "DELETE",
    }).then(() => {
      loadMovies();
    });
  }
}

// Función para editar una película
function editMovie(movieId) {
  fetch(`${API_URL}/${movieId}`)
    .then((response) => response.json())
    .then((movie) => {
      // Llena los campos del formulario de agregar una nueva película
      document.getElementById("id").value = movie._id;
      document.getElementById("title").value = movie.title;
      document.getElementById("director").value = movie.director;
      document.getElementById("releaseYear").value = movie.releaseYear;
      document.getElementById("genre").value = movie.genre || "";
      document.getElementById("description").value = movie.description || "";
      document.getElementById("language").value = movie.language || "";
      document.getElementById("duration").value = movie.duration || "";
      document.getElementById("posterImage").value = movie.posterImage || "";
    });
}

// Cargar la lista de películas al cargar la página
loadMovies();

// Evento para agregar una nueva película
document.getElementById("addMovieForm").addEventListener("submit", saveMovie);
