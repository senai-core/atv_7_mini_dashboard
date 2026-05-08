// =========================================================================
// Dados/Estado
// =========================================================================

const STORAGE_KEY = 'mulberry_state';

const ESTADO_INICIAL = {
    profile: { name: 'Visitante', avatarUrl: '' },
    musicas: [
        { id: 1, nome: 'Tempo Ruim - A Arte do Insulto', album: 'Matanza', artista: 'Matanza', genero: 'Countrycore', duracao: '2:43', ouvintes_mensais: 15420, url_imagem: 'https://i.scdn.co/image/ab67616d0000b27380d9d6384f5052b35e88966b' },
        { id: 2, nome: 'Rust - Stronger Than Death', album: 'Black Label Society', artista: 'Black Label Society', genero: 'Heavy Metal', duracao: '6:08', ouvintes_mensais: 28350, url_imagem: 'https://picsum.photos/seed/blacklabel/300/300' },
        { id: 3, nome: 'Ainda Bem - O Que Você Quer Saber de Verdade', album: 'Marisa Monte', artista: 'Marisa Monte', genero: 'MPB', duracao: '3:35', ouvintes_mensais: 89200, url_imagem: 'https://picsum.photos/seed/marisa/300/300' },
        { id: 4, nome: 'Little Wing - Axis: Bold As Love', album: 'Jimi Hendrix', artista: 'Jimi Hendrix', genero: 'Blues', duracao: '2:25', ouvintes_mensais: 456700, url_imagem: 'https://picsum.photos/seed/hendrix/300/300' },
        { id: 5, nome: 'Domingas - Jorge Ben', album: 'Jorge Ben', artista: 'Jorge Ben Jor', genero: 'MPB', duracao: '3:31', ouvintes_mensais: 128900, url_imagem: 'https://picsum.photos/seed/jorgeben/300/300' },
        { id: 6, nome: "10's - The Great Southern Trendkill", album: 'Pantera', artista: 'Pantera', genero: 'Groove Metal', duracao: '4:50', ouvintes_mensais: 67800, url_imagem: 'https://picsum.photos/seed/pantera/300/300' },
        { id: 7, nome: 'One Last Breath - Weathered', album: 'Creed', artista: 'Creed', genero: 'Grunge', duracao: '3:58', ouvintes_mensais: 345600, url_imagem: 'https://picsum.photos/seed/creed/300/300' },
        { id: 8, nome: 'Black - Ten', album: 'Pearl Jam', artista: 'Pearl Jam', genero: 'Grunge', duracao: '5:42', ouvintes_mensais: 512400, url_imagem: 'https://picsum.photos/seed/pearljam/300/300' },
    ],
};

const PALETA_GRAFICO = [
    'rgba(216, 180, 254, 0.85)',
    'rgba(168, 85, 247, 0.85)',
    'rgba(147, 51, 234, 0.85)',
    'rgba(126, 31, 159, 0.85)',
    'rgba(111, 45, 189, 0.85)',
    'rgba(91, 33, 182, 0.85)',
    'rgba(76, 29, 149, 0.85)',
    'rgba(236, 72, 153, 0.85)',
];

let musicas = [];
let profile = { ...ESTADO_INICIAL.profile };
let generoSelecionado = 'todos';
let termoBusca = '';
let chart = null;

// =========================================================================
// Lógica
// =========================================================================

function carregarEstado() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            return {
                musicas: Array.isArray(parsed.musicas) ? parsed.musicas : [],
                profile: parsed.profile && typeof parsed.profile === 'object'
                    ? parsed.profile
                    : { ...ESTADO_INICIAL.profile },
            };
        } catch (err) {
            console.warn('Estado em localStorage corrompido, usando seed inicial.', err);
        }
    }
    return {
        musicas: ESTADO_INICIAL.musicas.map((m) => ({ ...m })),
        profile: { ...ESTADO_INICIAL.profile },
    };
}

function persistir() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ musicas, profile }));
}

function filtrar() {
    let resultado = musicas;

    if (generoSelecionado !== 'todos') {
        const filtrado = [];
        for (let i = 0; i < resultado.length; i++) {
            if (resultado[i].genero === generoSelecionado) {
                filtrado.push(resultado[i]);
            }
        }
        resultado = filtrado;
    }

    if (termoBusca) {
        const termo = termoBusca.toLowerCase();
        const filtrado = [];
        for (let i = 0; i < resultado.length; i++) {
            const m = resultado[i];
            if (
                m.nome.toLowerCase().includes(termo) ||
                m.artista.toLowerCase().includes(termo) ||
                m.genero.toLowerCase().includes(termo)
            ) {
                filtrado.push(m);
            }
        }
        resultado = filtrado;
    }

    return resultado;
}

function calcularIndicadores() {
    let totalSegundos = 0;
    let totalOuvintes = 0;

    for (let i = 0; i < musicas.length; i++) {
        const m = musicas[i];
        const partes = m.duracao.split(':');
        totalSegundos += parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
        totalOuvintes += m.ouvintes_mensais || 0;
    }

    return {
        total: musicas.length,
        duracaoFormatada: formatarDuracao(totalSegundos),
        ouvintes: totalOuvintes,
    };
}

function formatarDuracao(totalSegundos) {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
}

function gerarDadosGrafico() {
    const contagens = {};
    for (let i = 0; i < musicas.length; i++) {
        const g = musicas[i].genero;
        contagens[g] = (contagens[g] || 0) + 1;
    }

    const total = musicas.length || 1;
    const itens = [];
    let i = 0;
    for (const genero in contagens) {
        itens.push({
            genero,
            count: contagens[genero],
            percentual: ((contagens[genero] / total) * 100).toFixed(1),
            cor: PALETA_GRAFICO[i % PALETA_GRAFICO.length],
        });
        i++;
    }
    return itens;
}

function listarGeneros() {
    const set = new Set();
    for (let i = 0; i < musicas.length; i++) {
        set.add(musicas[i].genero);
    }
    return ['todos', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
}

// =========================================================================
// Interface
// =========================================================================

function renderizarTudo() {
    renderizarCards();
    renderizarIndicadores();
    renderizarGrafico();
    renderizarOpcoesFiltro();
    renderizarPerfil();
}

function renderizarCards() {
    const grid = document.getElementById('musicGrid');
    grid.replaceChildren();

    const lista = filtrar();

    if (lista.length === 0) {
        const vazio = document.createElement('div');
        vazio.className = 'empty-state';
        vazio.textContent = 'Nenhuma música encontrada';
        grid.appendChild(vazio);
        return;
    }

    for (let i = 0; i < lista.length; i++) {
        grid.appendChild(criarCard(lista[i]));
    }
}

function criarCard(musica) {
    const card = document.createElement('article');
    card.className = 'music-card';

    const placeholder = document.createElement('div');
    placeholder.className = 'album-cover-placeholder';
    placeholder.appendChild(criarIconePlaceholder());

    if (musica.url_imagem) {
        const img = document.createElement('img');
        img.src = musica.url_imagem;
        img.alt = musica.album;
        img.className = 'album-cover';
        img.addEventListener('error', () => {
            img.remove();
            placeholder.style.display = 'flex';
        });
        placeholder.style.display = 'none';
        card.appendChild(img);
    }
    card.appendChild(placeholder);

    const titulo = document.createElement('h3');
    titulo.className = 'music-title';
    titulo.textContent = musica.nome;
    card.appendChild(titulo);

    const artista = document.createElement('p');
    artista.className = 'music-artist';
    artista.textContent = musica.artista;
    card.appendChild(artista);

    const genero = document.createElement('p');
    genero.className = 'music-genre';
    genero.textContent = musica.genero;
    card.appendChild(genero);

    const duracaoBox = document.createElement('div');
    duracaoBox.className = 'music-duration';
    duracaoBox.appendChild(criarIconeRelogio());
    const duracaoText = document.createElement('span');
    duracaoText.textContent = musica.duracao;
    duracaoBox.appendChild(duracaoText);
    card.appendChild(duracaoBox);

    return card;
}

function criarIconePlaceholder() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.182l2.109-.602A9.062 9.062 0 0 1 12 21.75a9.062 9.062 0 0 1-6-2.108m0-12.553v3.75a2.25 2.25 0 0 0 1.632 2.163l1.32.377a1.803 1.803 0 0 0 .99-3.182l-2.109-.602A9.062 9.062 0 0 0 12 2.25a9.062 9.062 0 0 0 6 2.108');
    svg.appendChild(path);
    return svg;
}

function criarIconeRelogio() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z');
    svg.appendChild(path);
    return svg;
}

function renderizarIndicadores() {
    const ind = calcularIndicadores();
    document.getElementById('totalMusics').textContent = ind.total;
    document.getElementById('totalDuration').textContent = ind.duracaoFormatada;
    document.getElementById('totalListeners').textContent = ind.ouvintes.toLocaleString('pt-BR');
}

function renderizarGrafico() {
    const canvas = document.getElementById('genreChart');
    const ctx = canvas.getContext('2d');
    const dados = gerarDadosGrafico();

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dados.map((d) => d.genero),
            datasets: [{
                data: dados.map((d) => d.count),
                backgroundColor: dados.map((d) => d.cor),
                borderColor: 'rgba(168, 85, 247, 0.5)',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            plugins: { legend: { display: false } },
        },
    });

    const legenda = document.getElementById('chartLegend');
    legenda.replaceChildren();
    for (let i = 0; i < dados.length; i++) {
        legenda.appendChild(criarLegendaItem(dados[i]));
    }
}

function criarLegendaItem(item) {
    const wrapper = document.createElement('div');
    wrapper.className = 'legend-item';

    const labelBox = document.createElement('span');
    labelBox.className = 'legend-label';

    const dot = document.createElement('span');
    dot.className = 'legend-color';
    dot.style.background = item.cor;
    labelBox.appendChild(dot);

    const text = document.createElement('span');
    text.textContent = item.genero;
    labelBox.appendChild(text);
    wrapper.appendChild(labelBox);

    const value = document.createElement('span');
    value.className = 'legend-value';
    value.textContent = `${item.percentual}%`;
    wrapper.appendChild(value);

    return wrapper;
}

function renderizarOpcoesFiltro() {
    const dd = document.getElementById('filterDropdown');
    dd.replaceChildren();
    const generos = listarGeneros();
    for (let i = 0; i < generos.length; i++) {
        const g = generos[i];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-option';
        if (g === generoSelecionado) btn.classList.add('active');
        btn.textContent = g === 'todos' ? 'Todos' : g;
        btn.dataset.genero = g;
        btn.addEventListener('click', () => {
            generoSelecionado = g;
            renderizarCards();
            renderizarOpcoesFiltro();
            fecharFilterDropdown();
        });
        dd.appendChild(btn);
    }
}

function abrirFilterDropdown() {
    document.getElementById('filterDropdown').classList.add('show');
    document.getElementById('filterBtn').setAttribute('aria-expanded', 'true');
}

function fecharFilterDropdown() {
    document.getElementById('filterDropdown').classList.remove('show');
    document.getElementById('filterBtn').setAttribute('aria-expanded', 'false');
}

function renderizarPerfil() {
    const img = document.getElementById('profileAvatar');
    const fb = document.getElementById('profileAvatarFallback');
    const nameEl = document.getElementById('profileNameDisplay');
    if (profile.avatarUrl) {
        img.src = profile.avatarUrl;
        img.hidden = false;
        fb.hidden = true;
    } else {
        img.removeAttribute('src');
        img.hidden = true;
        fb.hidden = false;
    }
    if (nameEl) {
        nameEl.textContent = profile.name && profile.name.trim() ? profile.name : 'você';
    }
}

function preencherFormProfile() {
    document.getElementById('pName').value = profile.name;
    document.getElementById('pAvatar').value = profile.avatarUrl;
    atualizarPreviewProfile(profile.avatarUrl);
}

function atualizarPreviewProfile(url) {
    const img = document.getElementById('profilePreviewImg');
    const fb = document.getElementById('profilePreviewFallback');
    if (url) {
        img.src = url;
        img.hidden = false;
        fb.hidden = true;
    } else {
        img.removeAttribute('src');
        img.hidden = true;
        fb.hidden = false;
    }
}

function abrirModal(id) {
    document.getElementById(id).classList.add('show');
}

function fecharModal(id) {
    document.getElementById(id).classList.remove('show');
}

function configurarModal(modalId, openBtnId, closeBtnId) {
    const modal = document.getElementById(modalId);
    document.getElementById(openBtnId).addEventListener('click', () => abrirModal(modalId));
    document.getElementById(closeBtnId).addEventListener('click', () => fecharModal(modalId));
    modal.querySelector('.modal-overlay').addEventListener('click', () => fecharModal(modalId));
}

function configurarEventos() {
    // Filter dropdown
    document.getElementById('filterBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        const dd = document.getElementById('filterDropdown');
        if (dd.classList.contains('show')) fecharFilterDropdown();
        else abrirFilterDropdown();
    });
    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('.filter-wrapper');
        if (wrapper && !wrapper.contains(e.target)) fecharFilterDropdown();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharFilterDropdown();
            fecharModal('addMusicModal');
            fecharModal('profileModal');
        }
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        termoBusca = e.target.value;
        renderizarCards();
    });

    // Add-music modal
    configurarModal('addMusicModal', 'addMusicBtn', 'closeAddMusic');
    document.getElementById('addMusicForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const nova = {
            id: Date.now(),
            nome: data.get('nome'),
            album: data.get('album'),
            artista: data.get('artista'),
            genero: data.get('genero'),
            duracao: data.get('duracao'),
            ouvintes_mensais: parseInt(data.get('ouvintes_mensais'), 10) || 0,
            url_imagem: data.get('url_imagem') || '',
        };
        musicas.push(nova);
        persistir();
        renderizarTudo();
        form.reset();
        fecharModal('addMusicModal');
    });

    // Profile modal
    configurarModal('profileModal', 'profileBtn', 'closeProfileModal');
    document.getElementById('profileBtn').addEventListener('click', preencherFormProfile);
    document.getElementById('pAvatar').addEventListener('input', (e) => {
        atualizarPreviewProfile(e.target.value);
    });
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        profile = {
            name: data.get('name'),
            avatarUrl: data.get('avatarUrl') || '',
        };
        persistir();
        renderizarPerfil();
        fecharModal('profileModal');
    });
}

function init() {
    const estado = carregarEstado();
    musicas = estado.musicas;
    profile = estado.profile;
    renderizarTudo();
    configurarEventos();
}

init();
