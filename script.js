const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const reservaForm = document.getElementById('reservaForm');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

function activateImageFallback(containerSelector, imageSelector, loadedClass = 'has-image') {
  document.querySelectorAll(containerSelector).forEach(container => {
    const img = container.querySelector(imageSelector);
    if (!img) return;

    const onLoad = () => container.classList.add(loadedClass);
    const onError = () => container.classList.remove(loadedClass);

    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onError, { once: true });
    }
  });
}

activateImageFallback('.brand-logo-wrap', '.brand-logo-image');
activateImageFallback('.ps5-real-wrap', '.ps5-real-image');
activateImageFallback('.lux-cover', '.official-cover');

const gamesCarousel = document.getElementById('gamesCarousel');
const gamesPrev = document.getElementById('gamesPrev');
const gamesNext = document.getElementById('gamesNext');

if (gamesCarousel) {
  const cardWidth = () => {
    const firstCard = gamesCarousel.querySelector('.lux-game-card');
    return firstCard ? firstCard.getBoundingClientRect().width + 24 : 320;
  };

  if (gamesPrev) {
    gamesPrev.addEventListener('click', (e) => {
      e.preventDefault();
      gamesCarousel.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
  }

  if (gamesNext) {
    gamesNext.addEventListener('click', (e) => {
      e.preventDefault();
      gamesCarousel.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });
  }

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  gamesCarousel.addEventListener('mousedown', (e) => {
    isDown = true;
    gamesCarousel.classList.add('dragging');
    startX = e.pageX - gamesCarousel.offsetLeft;
    scrollLeft = gamesCarousel.scrollLeft;
  });

  ['mouseleave', 'mouseup'].forEach(evt => {
    gamesCarousel.addEventListener(evt, () => {
      isDown = false;
      gamesCarousel.classList.remove('dragging');
    });
  });

  gamesCarousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - gamesCarousel.offsetLeft;
    const walk = (x - startX) * 1.2;
    gamesCarousel.scrollLeft = scrollLeft - walk;
  });
}

function maskPhone(value) {
  return value.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function maskCPF(value) {
  return value.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskCEP(value) {
  return value.replace(/\D/g, '').slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

[['telefone', maskPhone], ['whatsapp', maskPhone], ['cpf', maskCPF], ['cep', maskCEP]].forEach(([id, formatter]) => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', () => {
      input.value = formatter(input.value);
      updateSummary();
    });
  }
});

function updateSummary() {
  const panel = document.getElementById('resumoReserva');
  if (!panel) return;
  const nome = document.getElementById('nome')?.value || '—';
  const dataReserva = document.getElementById('dataReserva')?.value || '—';
  const tipoLocacao = document.getElementById('tipoLocacao')?.value || '—';
  const manetes = document.getElementById('manetes')?.value || '—';
  const retirada = document.getElementById('retirada')?.value || '—';
  panel.innerHTML = `
    <h3>Resumo da solicitação</h3>
    <div class="summary-list">
      <div><strong>Nome:</strong> ${nome}</div>
      <div><strong>Data:</strong> ${dataReserva}</div>
      <div><strong>Tipo:</strong> ${tipoLocacao}</div>
      <div><strong>Manetes:</strong> ${manetes}</div>
      <div><strong>Recebimento:</strong> ${retirada}</div>
    </div>
  `;
}

if (reservaForm) {
  reservaForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', updateSummary);
    field.addEventListener('change', updateSummary);
  });

  updateSummary();

  reservaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(reservaForm);
    const mensagem = [
      'Olá! Quero fazer uma reserva do PS5.',
      '',
      '📌 DADOS PESSOAIS',
      `Nome: ${data.get('nome') || ''}`,
      `Telefone: ${data.get('telefone') || ''}`,
      `WhatsApp: ${data.get('whatsapp') || ''}`,
      `CPF: ${data.get('cpf') || ''}`,
      `Nascimento: ${data.get('nascimento') || ''}`,
      '',
      '🏠 ENDEREÇO',
      `CEP: ${data.get('cep') || ''}`,
      `Cidade: ${data.get('cidade') || ''}`,
      `Rua/Avenida: ${data.get('rua') || ''}`,
      `Número: ${data.get('numero') || ''}`,
      `Bairro: ${data.get('bairro') || ''}`,
      `Complemento: ${data.get('complemento') || 'Não informado'}`,
      '',
      '🎮 DETALHES DA RESERVA',
      `Tipo de locação: ${data.get('tipoLocacao') || ''}`,
      `Quantidade de manetes: ${data.get('manetes') || ''}`,
      `Data desejada: ${data.get('dataReserva') || ''}`,
      `Horário desejado: ${data.get('horaReserva') || ''}`,
      `Forma de recebimento: ${data.get('retirada') || ''}`,
      `Forma de pagamento: ${data.get('pagamento') || ''}`,
      `Jogos desejados: ${data.get('jogos') || 'Não informado'}`,
      `Observações: ${data.get('observacoes') || 'Nenhuma'}`
    ].join('\n');

    const url = `https://wa.me/5533999296276?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  });
}
