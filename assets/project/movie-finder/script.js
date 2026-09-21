const API_KEY = '97480558';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieGrid = document.getElementById('movie-grid');
const statusMessage = document.getElementById('status-message');
const movieModal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

// Event Listener saat form dicari
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});

// Fungsi mengambil datar fil dari OMDB API
async function fetchMovies(title) {
    movieGrid.innerHTML = '';
    statusMessage.textContent = 'Mencari film...';

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`);
        const data = await response.json();

        if (data.Response === 'True') {
            statusMessage.textContent = '';
            displayMovies(data.Search);
        } else {
            statusMessage.textContent = `Film tidak ditemukan: ${data.Error}`;
        }
    } catch (error) {
        statusMessage.textContent = 'Gagal terhubung ke server. coba lagi nanti.';
    }
}

// Kartu Grid
function displayMovies(movies) {
    movies.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('movie-card');

        const poster = movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://placehold.co/300x450/1e293b/94a3b8?text=No+Poster';

        card.innerHTML = `
            <img src="${poster}" alt="{movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Tahun: ${movie.Year}</p>
            </div>
        `;

        // Detail film
        card.addEventListener('click', () => fetchMovieDetails(movie.imdbID));
        movieGrid.appendChild(card);
    });
}

// Detail Lengkap Film
async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
        const movie = await response.json();

        const poster = movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://placehold.co/300x450/1e293b/94a3b8?text=No+Poster';

        modalBody.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
        <div class="modal-details">
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Sutradara:</strong> ${movie.Director}</p>
            <p><strong>Aktor:</strong> ${movie.Actors}</p>
            <p><strong>Rating IMDb:</strong> ⭐ ${movie.imdbRating} / 10</p>
            <p><strong>Sinopsis:</strong> ${movie.Plot}</p>
        </div>
      `;

        movieModal.style.display = 'flex';
    } catch (error) {
        alert('Gagal memuat detail film.');
    }
}

// Tutup modal
closeModal.addEventListener('click', () => {
    movieModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.style.display = 'none';
    }
});