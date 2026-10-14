const API_KEY = 'e858e4afd001a4db65bcf425d55470c9'; // Replace with your TMDB API Key
let currentPage = 1;
let totalPages = 1;
let currentQuery = '';
let currentSort = '';

const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Fetch movies from TMDB API
async function fetchMovies(page = 1, query = '') {
    let url;
    if (query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        let movies = data.results || [];
        totalPages = data.total_pages || 1;

        // Apply sorting based on selected option
        if (currentSort === 'release-date-asc') {
            movies.sort((a, b) => new Date(a.release_date || '') - new Date(b.release_date || ''));
        } else if (currentSort === 'release-date-desc') {
            movies.sort((a, b) => new Date(b.release_date || '') - new Date(a.release_date || ''));
        } else if (currentSort === 'rating-asc') {
            movies.sort((a, b) => a.vote_average - b.vote_average);
        } else if (currentSort === 'rating-desc') {
            movies.sort((a, b) => b.vote_average - a.vote_average);
        }

        displayMovies(movies);
        updatePaginationUI();
    } catch (error) {
        console.error('Error fetching data from TMDB:', error);
    }
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';

    if (movies.length === 0) {
        movieGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';

        const card = document.createElement('div');
        card.classList.add('movie-card');

        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>Release Date: ${movie.release_date || 'N/A'}</p>
                <p>Rating: ${movie.vote_average ?? 'N/A'}</p>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}

// Pagination Controls
function updatePaginationUI() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    currentQuery = e.target.value.trim();
    currentPage = 1;
    fetchMovies(currentPage, currentQuery);
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    fetchMovies(currentPage, currentQuery);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage, currentQuery);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(currentPage, currentQuery);
    }
});

// Initial Load
fetchMovies(currentPage);