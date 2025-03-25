/**
 * KANASTRA OFFICIAL - SITE INTERATIVO
 * Controles: Cards interativos, WhatsApp integration, Acessibilidade
 * @version 2.0
 */
(function() {
  // ============ CONFIGURAÇÕES ============
  const CONFIG = {
    whatsapp: {
      number: '5511999999999', // Substitua pelo número real
      defaultMessage: 'Quero falar com a banda Kanastra sobre:'
    },
    cardContent: {
      music: [
        'Truco - Nova música!',
        'Rainha Vermelha - Single',
        'Ás de Copas - Em breve',
        'Blefe - Acústico'
      ],
      shows: [
        'São Paulo - 15/03 - Lollapalooza',
        'Rio de Janeiro - 22/03 - Circo Voador',
        'Belo Horizonte - 29/03 - Autódromo',
        'Curitiba - 05/04 - Opera de Arame'
      ],
      shirts: [
        'Camiseta Truco - Edição Limitada',
        'Camiseta Tour 2025',
        'Regata Rainha Vermelha',
        'Moletom Kanastra'
      ],
      mugs: [
        'Caneca Truco',
        'Caneca Tour 2025',
        'Caneca Rainha Vermelha',
        'Kit Especial Colecionador'
      ]
    },
    modalTitles: {
      music: '🎵 Música Revelada!',
      shows: '🎪 Show Revelado!',
      shirts: '👕 Produto Revelado!',
      mugs: '🎁 Item Revelado!'
    }
  };

  // ============ ELEMENTOS DOM ============
  const DOM = {
    body: document.body,
    modal: new bootstrap.Modal('#contentModal'),
    modalElements: {
      body: document.querySelector('.modal-body'),
      title: document.querySelector('.modal-title')
    },
    navbar: document.querySelector('.navbar'),
    cards: document.querySelectorAll('.playing-card')
  };

  // ============ FUNÇÕES PRINCIPAIS ============

  /**
   * Controla o flip das cartas interativas
   * @param {HTMLElement} card Elemento da carta clicada
   * @param {string} type Tipo de conteúdo (music|shows|shirts|mugs)
   */
  const flipCard = (card, type) => {
    if (!card || !CONFIG.cardContent[type]) return;

    card.classList.add('flipped');
    const content = getRandomContent(type);
    
    setTimeout(() => {
      showModal(content, CONFIG.modalTitles[type]);
      setupModalClose(card);
    }, 500);
  };

  /**
   * Exibe modal com conteúdo dinâmico
   * @param {string} content Conteúdo para exibir
   * @param {string} title Título do modal
   */
  const showModal = (content, title) => {
    if (!DOM.modalElements.body || !DOM.modalElements.title) return;

    DOM.modalElements.title.textContent = title || 'Surpresa!';
    DOM.modalElements.body.innerHTML = `
      <div class="text-center">
        <h3 class="mb-4">${content}</h3>
        <button class="btn btn-danger" 
                onclick="window.open('https://wa.me/${CONFIG.whatsapp.number}?text=Quero%20saber%20mais%20sobre%20${encodeURIComponent(content)}', '_blank')">
          Saiba Mais
        </button>
      </div>
    `;
    
    DOM.modal.show();
  };

  /**
   * Configura o reset do card quando modal fecha
   * @param {HTMLElement} card Elemento da carta
   */
  const setupModalClose = (card) => {
    const resetCard = () => {
      card.classList.remove('flipped');
      DOM.modal._element.removeEventListener('hidden.bs.modal', resetCard);
    };
    DOM.modal._element.addEventListener('hidden.bs.modal', resetCard, { once: true });
  };

  /**
   * Obtém conteúdo aleatório para os cards
   * @param {string} type Tipo de conteúdo
   * @returns {string} Item aleatório
   */
  const getRandomContent = (type) => {
    const items = CONFIG.cardContent[type];
    return items[Math.floor(Math.random() * items.length)];
  };

  // ============ ACESSIBILIDADE ============

  /**
   * Alterna entre temas claro/escuro
   */
  const toggleTheme = () => {
    DOM.body.dataset.theme = DOM.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('kanastra-theme', DOM.body.dataset.theme);
  };

  /**
   * Alterna modo de alto contraste
   */
  const toggleContrast = () => {
    DOM.body.dataset.contrast = DOM.body.dataset.contrast === 'high' ? 'normal' : 'high';
    localStorage.setItem('kanastra-contrast', DOM.body.dataset.contrast);
  };

  // ============ EVENTOS E INICIALIZAÇÃO ============

  /**
   * Configura smooth scroll para links âncora
   */
  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  /**
   * Efeito de navbar no scroll
   */
  const setupNavbarEffect = () => {
    if (!DOM.navbar) return;

    window.addEventListener('scroll', () => {
      DOM.navbar.style.background = window.scrollY > 100 
        ? 'rgba(26, 26, 26, 0.95)' 
        : 'var(--black-matte)';
    });
  };

  /**
   * Carrega preferências salvas
   */
  const loadPreferences = () => {
    const savedTheme = localStorage.getItem('kanastra-theme');
    const savedContrast = localStorage.getItem('kanastra-contrast');
    
    if (savedTheme) DOM.body.dataset.theme = savedTheme;
    if (savedContrast) DOM.body.dataset.contrast = savedContrast;
  };

  /**
   * Configura eventos dos cards
   */
  const setupCards = () => {
    DOM.cards.forEach(card => {
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const type = card.getAttribute('onclick').match(/flipCard\(this, '(\w+)'/)[1];
          flipCard(card, type);
        }
      });
    });
  };

  // ============ INICIALIZAÇÃO ============
  document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    setupSmoothScroll();
    setupNavbarEffect();
    setupCards();
  });

  // ============ EXPORT FUNCTIONS ============
  window.flipCard = flipCard;
  window.toggleTheme = toggleTheme;
  window.toggleContrast = toggleContrast;

})();