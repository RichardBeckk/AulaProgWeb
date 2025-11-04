/* ============================================================
   📜 SCRIPT PRINCIPAL — MÃO AMIGA
   ============================================================ */

// Seletores principais
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

// SPA container (se existir)
const appContainer = document.querySelector('#app');

/* ============================================================
   🧭 MENU RESPONSIVO
   ============================================================ */
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    menuToggle.setAttribute(
      'aria-expanded',
      navMenu.classList.contains('show')
    );
  });
}

/* ============================================================
   🌙 MODO ESCURO E ALTO CONTRASTE
   ============================================================ */
const themeToggle = document.getElementById('toggle-theme');
const contrastToggle = document.getElementById('toggle-contrast');

function setTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
}

function setContrast(mode) {
  if (mode === 'high') {
    document.documentElement.setAttribute('data-contrast', 'high');
    localStorage.setItem('contrast', 'high');
  } else {
    document.documentElement.removeAttribute('data-contrast');
    localStorage.setItem('contrast', 'normal');
  }
}

// Restaurar preferências salvas
if (localStorage.getItem('theme') === 'dark') setTheme('dark');
if (localStorage.getItem('contrast') === 'high') setContrast('high');

if (themeToggle)
  themeToggle.addEventListener('click', () =>
    setTheme(localStorage.getItem('theme') === 'dark' ? 'light' : 'dark')
  );

if (contrastToggle)
  contrastToggle.addEventListener('click', () =>
    setContrast(localStorage.getItem('contrast') === 'high' ? 'normal' : 'high')
  );

/* ============================================================
   ⚙️ SISTEMA SPA (SINGLE PAGE APPLICATION)
   ============================================================ */
const routes = {
  home: 'index.html',
  projetos: 'projeto.html',
  cadastro: 'cadastro.html',
};

function navigateTo(page) {
  fetch(routes[page])
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.querySelector('main');
      if (appContainer && content) {
        appContainer.innerHTML = content.innerHTML;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    })
    .catch(() => showToast('Erro ao carregar página!', 'error'));
}

/* ============================================================
   ✅ VALIDAÇÃO DE FORMULÁRIOS
   ============================================================ */
function validateForm(form) {
  let valid = true;
  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach((input) => {
    const errorMsg = input.parentNode.querySelector('.error-msg');
    if (errorMsg) errorMsg.remove();

    if (!input.checkValidity()) {
      valid = false;
      input.classList.add('invalid');
      const span = document.createElement('span');
      span.className = 'error-msg';
      span.style.color = 'red';
      span.textContent = input.validationMessage;
      input.parentNode.appendChild(span);
    } else {
      input.classList.remove('invalid');
    }
  });

  return valid;
}

/* ============================================================
   💾 LOCALSTORAGE — CADASTRO DE VOLUNTÁRIOS
   ============================================================ */
function salvarVoluntario(dados) {
  const lista = JSON.parse(localStorage.getItem('voluntarios') || '[]');
  lista.push(dados);
  localStorage.setItem('voluntarios', JSON.stringify(lista));
  showToast('Cadastro realizado com sucesso!', 'success');
}

function carregarVoluntarios() {
  const tabela = document.getElementById('tabelaVoluntarios');
  if (!tabela) return;
  const lista = JSON.parse(localStorage.getItem('voluntarios') || '[]');

  if (lista.length === 0) {
    tabela.innerHTML = '<p>Nenhum voluntário cadastrado ainda.</p>';
    return;
  }

  let html = `
    <table border="1" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Disponibilidade</th>
        </tr>
      </thead>
      <tbody>
  `;
  lista.forEach((v) => {
    html += `
      <tr>
        <td>${v.nome}</td>
        <td>${v.email}</td>
        <td>${v.telefone}</td>
        <td>${v.disponibilidade}</td>
      </tr>`;
  });
  html += '</tbody></table>';
  tabela.innerHTML = html;
}

/* ============================================================
   💬 TOASTS E ALERTAS
   ============================================================ */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `alert ${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ============================================================
   📄 TEMPLATE DE CARDS DINÂMICOS
   ============================================================ */
function renderCards(containerId, projetos) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = projetos
    .map(
      (p) => `
    <div class="card">
      <h3>${p.titulo}</h3>
      <p>${p.descricao}</p>
      <span class="badge">${p.categoria}</span>
    </div>
  `
    )
    .join('');
}

/* ============================================================
   🧾 EVENTOS DE FORMULÁRIO
   ============================================================ */
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.matches('#formCadastro')) {
    e.preventDefault();
    if (validateForm(form)) {
      const dados = Object.fromEntries(new FormData(form));
      salvarVoluntario(dados);
      form.reset();
      carregarVoluntarios();
    } else {
      showToast('Por favor, corrija os erros antes de enviar.', 'error');
    }
  }
});

/* ============================================================
   🚀 INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  carregarVoluntarios();

  // Exemplo de SPA links
  document.querySelectorAll('a[data-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.link);
    });
  });

  // Exemplo de cards automáticos
  const projetosExemplo = [
    { titulo: 'Campanha do Agasalho', descricao: 'Ajude famílias no inverno.', categoria: 'Solidariedade' },
    { titulo: 'Apoio Escolar', descricao: 'Refôrço gratuito para crianças.', categoria: 'Educação' },
    { titulo: 'Cesta Básica', descricao: 'Distribuição de alimentos mensais.', categoria: 'Assistência' },
  ];
  renderCards('listaProjetos', projetosExemplo);
});