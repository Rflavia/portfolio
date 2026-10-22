const menu = document.querySelector('.new-menu');
const nav = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
    menu.focus();
  }
});
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('.project[data-area]')];
const brasiliaViews = {
  todos: {
    image: 'assets/previews/brasilia.png',
    alt: 'Página inicial do Brasília em Ar, com ilustração da capital e acesso às condições',
    category: 'DADOS + DESENVOLVIMENTO',
    summary: 'Clima e qualidade do ar em uma interface própria, com dados de APIs públicas. O projeto apresenta a temperatura ao longo do dia e investiga a relação entre umidade e partículas no ar nos últimos 30 dias completos, com tratamento de lacunas, médias diárias e correlação de Pearson.',
    tags: ['React', 'TypeScript', 'APIs', 'Recharts', 'Análise exploratória'],
  },
  dados: {
    image: 'assets/previews/brasilia-analise.png',
    alt: 'Análise exploratória do Brasília em Ar: gráfico de dispersão entre médias diárias de umidade e PM2.5, com correlação de Pearson e interpretação do resultado',
    category: 'ANÁLISE EXPLORATÓRIA DE DADOS',
    summary: 'Dias mais secos também apresentam mais partículas no ar? A análise cruza estimativas de umidade e PM2.5 dos últimos 30 dias completos. O tratamento preserva valores ausentes, exige 24 registros válidos por dia e alinha as duas séries por data antes de calcular médias e correlação de Pearson. O gráfico e a interpretação acompanham o resultado do período, sem presumir causalidade.',
    tags: ['APIs públicas', 'Tratamento de dados', 'Médias diárias', 'Pearson', 'Visualização'],
  },
  code: {
    image: 'assets/previews/brasilia.png',
    alt: 'Página inicial do Brasília em Ar, com identidade visual própria e navegação para as condições',
    category: 'DESENVOLVIMENTO WEB + INTEGRAÇÃO DE APIS',
    summary: 'Uma aplicação web com identidade visual própria, páginas de apresentação e condições, e gráficos interativos. A API da aplicação reúne Open-Meteo e CAMS, valida as respostas e utiliza cache. A interface trata carregamento e falhas parciais, conectando os dados à experiência de navegação.',
    tags: ['React', 'TypeScript', 'TanStack Start', 'React Query', 'Recharts', 'Zod'],
  },
};
function filterProjects(area) {
  const selected = ['dados', 'code'].includes(area) ? area : 'todos';
  const brasilia = document.querySelector('#brasilia');
  if (brasilia) {
    const view = brasiliaViews[selected];
    const image = brasilia.querySelector('.project-visual img');
    image.src = view.image;
    image.alt = view.alt;
    brasilia.querySelector('[data-project-summary]').textContent = view.summary;
    brasilia.querySelector('[data-project-category]').textContent = view.category;
    const tags = brasilia.querySelector('.project-tags');
    tags.replaceChildren(...view.tags.map((text) => {
      const tag = document.createElement('span');
      tag.textContent = text;
      return tag;
    }));
  }
  const accidentsImage = document.querySelector('#acidentes .project-visual img');
  if (accidentsImage) {
    accidentsImage.src = selected === 'dados' ? 'assets/previews/acidentes-boxplot.png' : 'assets/previews/acidentes.png';
    accidentsImage.alt = selected === 'dados'
      ? 'Boxplot da distribuição da quantidade mensal de acidentes entre as cinco regiões do Brasil'
      : 'Dashboard da análise de acidentes no Brasil';
  }
  const order = selected === 'code'
    ? ['brasilia', 'apple', 'clinica', 'etl', 'acidentes']
    : ['brasilia', 'etl', 'acidentes', 'clinica', 'apple'];
  const list = document.querySelector('.portfolio-list');
  if (list) order.forEach((id) => list.append(document.getElementById(id)));
  let count = 0;
  projects.forEach((project) => {
    const visible = selected === 'todos' || project.dataset.area.split(' ').includes(selected);
    project.hidden = !visible;
    if (visible) count++;
  });
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === selected)));
  const label = document.querySelector('.filter-count');
  if (label) label.textContent = `${count} projeto${count === 1 ? '' : 's'}`;
}
filters.forEach((button) => button.addEventListener('click', () => {
  filterProjects(button.dataset.filter);
  const url = new URL(window.location.href);
  url.searchParams.set('area', button.dataset.filter);
  url.hash = '';
  try { history.replaceState(null, '', url); } catch { /* A prévia também funciona ao abrir o arquivo local. */ }
}));
if (filters.length) filterProjects(new URLSearchParams(location.search).get('area'));

// Mouse and keyboard reveal each complete portrait; touch uses explicit controls.
const hero = document.querySelector('.split-inner');
const portraitChoices = [...document.querySelectorAll('[data-portrait-choice]')];
function showPortrait(mode) {
  if (!hero) return;
  hero.dataset.portraitMode = mode;
  portraitChoices.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.portraitChoice === mode)));
}
if (hero) {
  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || !matchMedia('(hover: hover)').matches) return;
    const bounds = hero.getBoundingClientRect();
    showPortrait(event.clientX < bounds.left + bounds.width / 2 ? 'dados' : 'code');
  });
  hero.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') showPortrait('split');
  });
  hero.querySelector('.data-side').addEventListener('focus', () => showPortrait('dados'));
  hero.querySelector('.code-side').addEventListener('focus', () => showPortrait('code'));
  hero.addEventListener('focusout', (event) => {
    if (!hero.contains(event.relatedTarget)) showPortrait('split');
  });
}
portraitChoices.forEach((button) => button.addEventListener('click', () => showPortrait(button.dataset.portraitChoice)));
