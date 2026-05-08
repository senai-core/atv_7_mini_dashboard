const STORAGE_KEY = 'mulberry_music_data';

let musicas = [];
let generoSelecionado = 'todos';
let searchTerm = '';
let chart = null;

async function loadData() {
    try {
        const response = await fetch('dados.json');
        const data = await response.json();
        
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const storedData = JSON.parse(stored);
            musicas = storedData.musicas || [];
        } else {
            musicas = data.musicas;
            saveData();
        }
        
        document.getElementById('userName').textContent = data.user.name;
    } catch (error) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            musicas = data.musicas || [];
        }
    }
}

function saveData() {
    const data = {
        musicas: musicas
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function renderMusics() {
    const grid = document.getElementById('musicGrid');
    let filteredMusics = musicas;

    if (generoSelecionado !== 'todos') {
        filteredMusics = filteredMusics.filter(m => m.genero === generoSelecionado);
    }

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredMusics = filteredMusics.filter(m => 
            m.nome.toLowerCase().includes(term) ||
            m.artista.toLowerCase().includes(term) ||
            m.genero.toLowerCase().includes(term)
        );
    }

    grid.innerHTML = '';

    if (filteredMusics.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-purple-300 py-12 text-lg">Nenhuma música encontrada</div>';
        return;
    }

    for (let i = 0; i < filteredMusics.length; i++) {
        const music = filteredMusics[i];
        const card = document.createElement('div');
        card.className = 'music-card';
        
        const coverHtml = music.url_imagem 
            ? `<img src="${music.url_imagem}" alt="${music.album}" class="album-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
            : '';
        
        const placeholderHtml = `
            <div class="album-cover-placeholder" style="display: ${music.url_imagem ? 'none' : 'flex'}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.182l2.109-.602A9.062 9.062 0 0 1 12 21.75a9.062 9.062 0 0 1-6-2.108m0-12.553v3.75a2.25 2.25 0 0 0 1.632 2.163l1.32.377a1.803 1.803 0 0 0 .99-3.182l-2.109-.602A9.062 9.062 0 0 0 12 2.25a9.062 9.062 0 0 0 6 2.108" />
                </svg>
            </div>
        `;

        card.innerHTML = `
            ${coverHtml}
            ${placeholderHtml}
            <h3 class="music-title">${music.nome}</h3>
            <p class="music-artist">${music.artista}</p>
            <p class="music-genre">${music.genero}</p>
            <div class="music-duration">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                <span>${music.duracao}</span>
            </div>
        `;
        
        grid.appendChild(card);
    }
}

function calculateStats() {
    document.getElementById('totalMusics').textContent = musicas.length;

    let totalSeconds = 0;
    let totalListeners = 0;

    for (let i = 0; i < musicas.length; i++) {
        const music = musicas[i];
        
        const parts = music.duracao.split(':');
        totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
        
        totalListeners += music.ouvintes_mensais || 0;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    document.getElementById('totalDuration').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById('totalListeners').textContent = 
        totalListeners.toLocaleString('pt-BR');
}

function getGenreData() {
    const genres = {};
    const genreMap = {
        'Blues': 'Blues',
        'Heavy Metal': 'Metal',
        'MPB': 'MPB',
        'Groove Metal': 'Metal',
        'Grunge': 'Rock',
        'Countrycore': 'Rock'
    };

    for (let i = 0; i < musicas.length; i++) {
        const music = musicas[i];
        const mappedGenre = genreMap[music.genero] || music.genero;
        
        if (!genres[mappedGenre]) {
            genres[mappedGenre] = 0;
        }
        genres[mappedGenre]++;
    }

    const total = musicas.length || 1;
    const data = [];
    const colors = {
        'Blues': 'rgba(216, 180, 254, 0.8)',
        'Rock': 'rgba(147, 51, 234, 0.8)',
        'MPB': 'rgba(111, 45, 189, 0.8)',
        'Metal': 'rgba(126, 31, 159, 0.8)'
    };

    for (const genre in genres) {
        const percentage = (genres[genre] / total * 100).toFixed(1);
        data.push({
            genre: genre,
            count: genres[genre],
            percentage: percentage,
            color: colors[genre] || 'rgba(168, 85, 247, 0.8)'
        });
    }

    return data;
}

function renderChart() {
    const canvas = document.getElementById('genreChart');
    const ctx = canvas.getContext('2d');
    
    const genreData = getGenreData();
    
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: genreData.map(d => d.genre),
            datasets: [{
                data: genreData.map(d => d.count),
                backgroundColor: genreData.map(d => d.color),
                borderColor: 'rgba(168, 85, 247, 0.5)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    const legendContainer = document.getElementById('chartLegend');
    legendContainer.innerHTML = '';
    
    for (let i = 0; i < genreData.length; i++) {
        const item = genreData[i];
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <span class="legend-label">
                <span class="legend-color" style="background: ${item.color}"></span>
                <span>${item.genre}</span>
            </span>
            <span class="legend-value">${item.percentage}%</span>
        `;
        legendContainer.appendChild(legendItem);
    }
}

function setupEventListeners() {
    const genreButtons = document.querySelectorAll('.genre-btn');
    
    for (let i = 0; i < genreButtons.length; i++) {
        genreButtons[i].addEventListener('click', function() {
            for (let j = 0; j < genreButtons.length; j++) {
                genreButtons[j].classList.remove('active');
            }
            this.classList.add('active');
            
            generoSelecionado = this.dataset.genero;
            renderMusics();
        });
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        searchTerm = e.target.value;
        renderMusics();
    });

    const addMusicBtn = document.getElementById('addMusicBtn');
    const modal = document.getElementById('addMusicModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = modal.querySelector('.modal-overlay');

    addMusicBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    function closeModalHandler() {
        modal.classList.remove('show');
    }

    closeModal.addEventListener('click', closeModalHandler);
    modalOverlay.addEventListener('click', closeModalHandler);

    const form = document.getElementById('addMusicForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        const novaMusica = {
            id: Date.now(),
            nome: formData.get('nome'),
            album: formData.get('album'),
            artista: formData.get('artista'),
            genero: formData.get('genero'),
            duracao: formData.get('duracao'),
            ouvintes_mensais: parseInt(formData.get('ouvintes_mensais')) || 0,
            url_imagem: formData.get('url_imagem') || ''
        };

        musicas.push(novaMusica);
        saveData();
        
        renderMusics();
        calculateStats();
        renderChart();
        
        form.reset();
        closeModalHandler();
    });
}

async function init() {
    await loadData();
    renderMusics();
    calculateStats();
    renderChart();
    setupEventListeners();
}

init();