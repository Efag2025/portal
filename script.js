let calendar; // variável global
let calendarioCarregado = false; // flag para renderizar só uma vez
const aulas = {
  "2025-04-18": [
    { materia: "Poder de Polícia", horario: "08:15 - 09:05" },
    { materia: "EFAG", horario: "09:05 - 09:55" },
    { materia: "Análise da decisão do STF", horario: "10:15 - 11:05" },
    { materia: "EFAG", horario: "11:05 - 11:55" },
    { materia: "Avaliação", horario: "12:55 - 13:45" },
    { materia: "EFAG", horario: "13:45 - 14:35" },
    { materia: "Avaliação", horario: "15:05 - 15:50" },
    { materia: "EFAG", horario: "15:50 - 16:40" }
  ],}
  const user = localStorage.getItem('nomeUsuario');
  // Atualiza o nome do usuário no cabeçalho
const titulo = document.getElementById('titulo-bemvindo');
if (titulo && user) {
  titulo.textContent = `Bem-vindo(a), ${user}!`;
}
function habilitarEdicao() {
  const ids = [
    'qraAluno', 'cfAluno', 'reAluno', 'pelotaoAluno',
    'emailAluno', 'nomeCompleto',
    'cpfAluno', 'dataNascimento', 'enderecoAluno',
    'telefoneAluno', 'sangueAluno'
  ];
  ids.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.disabled = false;
      campo.style.backgroundColor = "#ffffff"; // branco para edição
    }
  });

  document.getElementById('btnEditar').style.display = 'none';
  document.getElementById('btnSalvar').style.display = 'inline-block';
}


function salvarDadosAluno() {
  const user = localStorage.getItem('nomeUsuario');
  const dadosAtualizados = {
    qraAluno: document.getElementById('qraAluno').value,
    cfAluno: document.getElementById('cfAluno').value,
    reAluno: document.getElementById('reAluno').value,
    pelotaoAluno: document.getElementById('pelotaoAluno').value,
    emailAluno: document.getElementById('emailAluno').value,
    cursoAluno: document.getElementById('cursoAluno')?.value || 'Formação de Guardas Municipais',
    nomeCompleto: document.getElementById('nomeCompleto').value,
    cpfAluno: document.getElementById('cpfAluno').value,
    dataNascimento: document.getElementById('dataNascimento').value,
    enderecoAluno: document.getElementById('enderecoAluno').value,
    telefoneAluno: document.getElementById('telefoneAluno').value,
    sangueAluno: document.getElementById('sangueAluno').value
  };

  localStorage.setItem(`dados_${user}`, JSON.stringify(dadosAtualizados));
  mostrarAviso('✅ Dados salvos com sucesso!');

  const ids = Object.keys(dadosAtualizados);
  ids.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.disabled = true;
      campo.style.backgroundColor = "#f8f9fa"; // cor igual ao campo "Curso"
    }
  });
  
  
  document.getElementById('btnEditar').style.display = 'inline-block';
  document.getElementById('btnSalvar').style.display = 'none';
}

  const dados = JSON.parse(localStorage.getItem(`dados_${user}`)) || {};
  
  document.getElementById('qraAluno').value = dados.qraAluno || '';
  document.getElementById('cfAluno').value = dados.cfAluno || '';
  document.getElementById('reAluno').value = dados.reAluno || '';
  document.getElementById('emailAluno').value = dados.emailAluno || '';
  document.getElementById('cursoAluno').value = dados.cursoAluno || 'Formação de Guardas Municipais';
  document.getElementById('pelotaoAluno').value = dados.pelotaoAluno || '';
  
  document.getElementById('nomeCompleto').value = dados.nomeCompleto || '';
  document.getElementById('cpfAluno').value = dados.cpfAluno || '';
  document.getElementById('dataNascimento').value = dados.dataNascimento || '';
  document.getElementById('enderecoAluno').value = dados.enderecoAluno || '';
  document.getElementById('telefoneAluno').value = dados.telefoneAluno || '';
  document.getElementById('sangueAluno').value = dados.sangueAluno || '';
  
  
  // Atualiza pelotão na aba de liderança
const pelotao = dados.pelotaoAluno;
const exibir = document.getElementById('infoPelotao');
if (pelotao && pelotao !== '—' && exibir) {
  exibir.textContent = `(${pelotao.padStart(2, '0')}º Pelotão)`;
}

function showSection(id) {
  const sections = ['info', 'disciplinas', 'notas', 'grade', 'comunicados', 'linksImportantes', 'lideranca','sistemas', 'provas'];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = 'none';
  });

  const sectionToShow = document.getElementById(id);
  sectionToShow.style.display = 'block';
  if (id === 'disciplinas') {
    document.querySelectorAll('.disciplina-card').forEach(card => {
      const nome = card.textContent.trim();
      const dados = dadosDisciplinas[nome] || {};
      const progresso = calcularProgresso(dados.concluido, dados.carga);

      // Evita duplicar barras se já houver
      if (!card.querySelector('.progresso-mini')) {
        const container = document.createElement('div');
container.style.marginTop = '8px';

const barra = document.createElement('div');
barra.className = 'progresso-mini';
barra.innerHTML = `
  <div class="progresso-mini-barra" style="width: ${progresso}%"></div>
`;

const texto = document.createElement('small');
texto.className = 'porcentagem-texto';
texto.textContent = `${progresso}%`;

container.appendChild(barra);
container.appendChild(texto);
card.appendChild(container);

        
      }
    });
  }

  if (id === 'comunicados') {
    carregarComunicados(); // essa função preenche os comunicados
  }  
  if (id === 'notas') {
    carregarBoletim();
    setTimeout(atualizarStatusBoletim, 100); // Atualiza status após os cards aparecerem
  }
  
  if (id === 'grade' && !calendarioCarregado) {
   
  setTimeout(() => {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: new Date(),
      height: 400,
      locale: 'pt-br',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ''
      },
      dateClick: function (info) {
        document.querySelectorAll('.fc-daygrid-day').forEach(cell => {
          cell.classList.remove('data-selecionada');
        });
      
        info.dayEl.classList.add('data-selecionada');
      
        const data = info.dateStr;
        const aulasDoDia = aulas[data];
        const container = document.getElementById('aulasDoDia');
        const btnPDF = document.getElementById('baixar-pdf');
        container.innerHTML = ''; // limpa
        
        // Corrigir fuso horário corretamente
        const dataObj = new Date(`${data}T00:00:00-03:00`);
        const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const diaSemana = diasSemana[dataObj.getDay()];
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
        if (aulasDoDia && aulasDoDia.length > 0) {
          let html = `<div id="conteudo-pdf" style="text-align: center;">
  <h2 style="color:#1d3557; font-weight: 600; margin-bottom: 5px;">Aulas do Dia</h2>
  <h3 style="margin-bottom: 20px;">${diaSemana} - ${dataFormatada}</h3>
            <table style="width:100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 15px;">
              <thead>
                <tr style="background-color: #e3f2fd; color: #1d3557;">
                  <th style="padding: 10px; border: 1px solid #ccc; text-align: center;">Horário</th>
                  <th style="padding: 10px; border: 1px solid #ccc; text-align: center;">Matéria</th>
                </tr>
              </thead>
              <tbody>`;
        
          aulasDoDia.forEach(aula => {
            html += `
              <tr style="background-color: #f9fbfc;">
                <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${aula.horario}</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${aula.materia}</td>
              </tr>`;
          });
        
          html += `</tbody></table></div>`;
          container.innerHTML = html;
          btnPDF.style.display = 'inline-block';
        } else {
          container.innerHTML = `
            <div id="conteudo-pdf">
              <p style="color: #555; font-size: 16px; padding: 10px; background: #f2f2f2; border-radius: 8px; text-align: center;">
                Não há grade disponível pra esta data.
              </p>
            </div>`;
          btnPDF.style.display = 'none';
        }}
    });
    calendar.render();
    calendarioCarregado = true;
  }, 100); // delay garante que o elemento esteja visível
}

  if (id === 'grade' && calendar) {
    setTimeout(() => {
      calendar.render();
    }, 100); // Pequeno delay para garantir que o container esteja visível
  }
  

  // Se for dispositivo móvel, rola até a seção visível
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    const delay = (id === 'notas') ? 300 : 100; // tempo extra para o boletim
    setTimeout(() => {
      sectionToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay);
  }
  if (id === 'provas') {
    carregarProvas();
  }
  
}
document.getElementById('searchInput').addEventListener('input', function () {
  const filtro = this.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.disciplina-card, .card-boletim, .card-sistema');
  const comunicadosBox = document.getElementById('listaComunicados');
  const comunicadosDiv = document.getElementById('comunicados');

  const msgAntiga = document.getElementById('mensagem-resultado');
  if (msgAntiga) msgAntiga.remove();

  if (filtro === '') {
    const sections = ['info', 'disciplinas', 'notas', 'grade', 'comunicados', 'linksImportantes', 'lideranca', 'sistemas'];
    sections.forEach(sec => {
      const el = document.getElementById(sec);
      if (el) el.style.display = sec === 'info' ? 'block' : 'none';
    });

    cards.forEach(card => {
      const parentLink = card.closest('a');
      if (card.classList.contains('card-sistema') && parentLink) {
        parentLink.style.display = 'block';
        card.style.display = 'block';
      } else {
        card.style.display = 'flex';
      }
    });

    return;
  }

  // Navegação rápida
  if (filtro.includes('boletim')) { showSection('notas'); return; }
  if (filtro.includes('info')) { showSection('info'); return; }
  if (filtro === 'disciplina' || filtro === 'disciplinas') {
    showSection('disciplinas');
    document.querySelectorAll('.disciplina-card').forEach(card => {
      card.style.display = 'flex';
    });
    return;
  }
  if (filtro.includes('grade')) { showSection('grade'); return; }
  if (filtro.includes('comunicado')) { showSection('comunicados'); return; }
  if (filtro.includes('lider') || filtro.includes('presenca') || filtro.includes('relatorio')) {
    showSection('lideranca');
    return;
  }
  if (filtro.includes('sistema') || filtro.includes('sisgcm') || filtro.includes('sinesp')) {
    showSection('sistemas');
    return;
  }
  if (filtro.includes('link') || filtro.includes('prefeitura') || filtro.includes('pop') || filtro.includes('portaria')) {
    showSection('linksImportantes');
    return;
  }
  if (filtro.includes('prova')) { showSection('provas'); return; }
  if (
    filtro.includes('lider') || 
    filtro.includes('presenca') || 
    filtro.includes('relatorio') ||
    filtro.includes('área de segurança') ||
    filtro.includes('area') ||
    filtro.includes('segurança')
    
  ) {
    showSection('lideranca');
    return;
  }
  
  // Busca geral em cards
  let encontrou = false;
  cards.forEach(card => {
    const nome = card.textContent.toLowerCase();
    const mostrar = nome.includes(filtro);
    const parentLink = card.closest('a');

    if (mostrar) {
      if (card.classList.contains('disciplina-card') || card.classList.contains('card-boletim')) {
        card.style.display = 'flex';
      } else if (card.classList.contains('card-sistema') && parentLink) {
        parentLink.style.display = 'block';
        card.style.display = 'block';
      }
      encontrou = true;
    } else {
      if (card.classList.contains('card-sistema') && parentLink) {
        parentLink.style.display = 'none';
      } else {
        card.style.display = 'none';
      }
    }
  });

  if (encontrou) {
    if (document.querySelector('.disciplina-card[style*="flex"]')) {
      showSection('disciplinas');
    } else if (document.querySelector('.card-boletim[style*="flex"]')) {
      showSection('notas');
    } else if (document.querySelector('.card-sistema[style*="block"]')) {
      showSection('sistemas');
    }
    return;
  }

  // Busca nos comunicados
  const comunicadosFiltrados = comunicados.filter(c =>
    c.titulo.toLowerCase().includes(filtro) ||
    c.data.toLowerCase().includes(filtro) ||
    c.html.toLowerCase().includes(filtro)
  );

  if (comunicadosFiltrados.length > 0) {
    comunicadosBox.innerHTML = '';
    comunicadosFiltrados.forEach(c => {
      const box = document.createElement('div');
      box.style.background = '#ffffff';
      box.style.border = '1px solid #dee2e6';
      box.style.borderRadius = '10px';
      box.style.padding = '15px';
      box.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.06)';
      box.innerHTML = `
        <h3 style="color:#1d3557; margin-bottom:5px;">${c.titulo}</h3>
        <p style="color:#6c757d; font-size:14px; margin-bottom:10px;"><i class="fas fa-calendar-alt"></i> ${c.data}</p>
        <div style="font-size:15px; color:#333;">${c.html}</div>
      `;
      comunicadosBox.appendChild(box);
    });

    showSection('comunicados');
    setTimeout(() => {
      comunicadosDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return;
  }

  // Se não encontrou nada
  const sections = ['info', 'disciplinas', 'notas', 'grade', 'comunicados', 'linksImportantes', 'lideranca', 'sistemas'];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = 'none';
  });

  const msg = document.createElement('p');
  msg.id = 'mensagem-resultado';
  msg.style.fontSize = '1.1rem';
  msg.style.color = '#000';
  msg.style.marginTop = '20px';
  msg.style.textAlign = 'center';
  msg.innerHTML = `Nenhum resultado encontrado com: <strong>"${filtro}"</strong>`;
  document.querySelector('.main-content').appendChild(msg);
});

// Dados das disciplinas com estrutura completa
const dadosDisciplinas = {
  "Ambiental": { professor: "", carga: "", concluido: "", material: [] },
  "APH": { professor: "", carga: "", concluido: 0, material: [] },
  "Armamento e Tiro": { professor: "", carga: "", concluido: 0, material: [] },
  "Educação Física": { professor: "", carga: "", concluido: 0, material: [] },
  "Atos Administrativos": { professor: "", carga: "", concluido: 0, material: [] },
  "Comunicação Social": { professor: "", carga: "", concluido: 0, material: [] },
  "Corregedoria": { professor: "", carga: "", concluido: 0, material: [] },
  "Direito": { professor: "", carga: "", concluido: 0, material: [] },
  "Direitos Humanos": { professor: "", carga: "", concluido: 0, material: [] },
  "Ética": { professor: "", carga: "", concluido: 0, material: [] },
  "Funções e Atribuições da GCM": { professor: "", carga: "", concluido: 0, material: [] },
  "Gestão Integrada": { professor: "", carga: "", concluido: 0, material: [] },
  "Guard": { professor: "", carga: "", concluido: 0, material: [] },
  "Instrumentos de Menor Potencial Ofensivo": { professor: "", carga: "", concluido: 0, material: [] },
  "Inteligência": { professor: "", carga: "", concluido: 0, material: [] },
  "Invasões, Manifestações e Movimentos Sociais": { professor: "", carga: "", concluido: 0, material: [] },
  "Língua Portuguesa": { professor: "", carga: "", concluido: 0, material: [] },
  "Maria da Penha": { professor: "", carga: "", concluido: 0, material: [] },
  "Ordem Unida": { professor: "", carga: "", concluido: 0, material: [] },
  "Ouvidoria": { professor: "", carga: "", concluido: 0, material: [] },
  "Perícia": { professor: "", carga: "", concluido: 0, material: [] },
  "Psicologia": { professor: "", carga: "", concluido: 0, material: [] },
  "Relação Jurídica do Trabalho": { professor: "", carga: "", concluido: 0, material: [] },
  "Responsabilidade Funcional": { professor: "", carga: "", concluido: 0, material: [] },
  "Segurança Patrimonial": { professor: "", carga: "", concluido: 0, material: [] },
  "SESMT": { professor: "", carga: "", concluido: 0, material: [] },
  "SINESP - CAD": { professor: "", carga: "", concluido: 0, material: [] },
  "Técnicas Operacionais": { professor: "", carga: "", concluido: 0, material: [] },
  "Trânsito": { professor: "", carga: "", concluido: 0, material: [] },
  "Violência Doméstica": { professor: "", carga: "", concluido: 0, material: [] }
};

const calcularProgresso = (concluido, carga) => {
  const c = parseFloat(concluido);
  const t = parseFloat(carga);
  if (isNaN(c) || isNaN(t) || t === 0) return 0;
  return Math.min(100, Math.round((c / t) * 100));
};

document.querySelectorAll('.disciplina-card').forEach(card => {
  const nome = card.textContent.trim();

  card.addEventListener('click', () => {
    const jaAberto = card.nextElementSibling?.classList.contains('card-expandido');

    // Fecha todas as seções abertas
    document.querySelectorAll('.card-expandido').forEach(el => el.remove());

    // Se já estava aberto, não reabre
    if (jaAberto) return;

    const dados = dadosDisciplinas[nome] || {};
    const div = document.createElement('div');
    div.className = 'card-expandido';

    const materialLinks = (dados.material && dados.material.length > 0)
      ? dados.material.map(m => `<a href="${m.link}" target="_blank">${m.nome}</a>`).join('')
      : '<p style="color:#777;">Nenhum material disponível.</p>';

    const progresso = calcularProgresso(dados.concluido, dados.carga);

    div.innerHTML = `
    <p><strong>Professor:</strong> ${dados.professor || ''}</p>
    <p><strong>Carga Horária:</strong> ${dados.carga || ''}</p>
    <div><strong>Material:</strong><br>${
      (dados.material && dados.material.length > 0)
        ? dados.material.map(m => `<a href="${m.link}" target="_blank">${m.nome}</a>`).join('')
        : '<p style="color:#777;">Nenhum material disponível.</p>'
    }</div>
  `;


    card.insertAdjacentElement('afterend', div);
  });
});


function fecharModal() {
  document.getElementById('modalDisciplina').style.display = 'none';
}

document.addEventListener('click', async function (e) {
  if (e.target && e.target.id === 'baixar-pdf') {
    const original = document.getElementById('conteudo-pdf');
    if (!original) {
      alert("Nenhuma grade disponível para exportar.");
      return;
    }

    // Cria um clone visível mas invisível para o usuário
    const clone = original.cloneNode(true);
    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '800px';
    clone.style.background = 'white';
    clone.style.padding = '20px';
    clone.style.zIndex = '-1';

    document.body.appendChild(clone);

    await new Promise(resolve => setTimeout(resolve, 500)); // espera renderizar

    const opt = {
      margin: 0.5,
      filename: `Grade_${new Date().toLocaleDateString('pt-BR')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clone).save().then(() => {
      document.body.removeChild(clone);
    });
  }
});
document.addEventListener('click', async function (e) {
  if (e.target && e.target.id === 'baixar-pdf') {
    const element = document.getElementById('conteudo-pdf');
    if (!element) {
      alert("Nenhuma grade disponível para exportar.");
      return;
    }

    // Usa html2canvas para capturar a imagem
    const canvas = await html2canvas(element, { scale: 2 });

    // Converte o canvas para imagem
    const imageData = canvas.toDataURL("image/png");

    // Cria um link e simula clique para download
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `Grade_${new Date().toLocaleDateString('pt-BR')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  showSection('comunicados'); // Exibe comunicados logo ao carregar
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, 100);
  
  
});


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function logout() {
  localStorage.clear(); // limpa todos os dados salvos do aluno
  window.location.href = "login.html"; // redireciona para a tela de login
}

function abrirFormulario() {
  document.getElementById('popupContato').style.display = 'flex';
}

function fecharFormulario() {
  document.getElementById('popupContato').style.display = 'none';
}

function enviarEmail() {
  const nome = document.getElementById('contatoNome').value;
  const email = document.getElementById('contatoEmail').value;
  const mensagem = document.getElementById('contatoMensagem').value;

  const assunto = encodeURIComponent("Solicitação de Aluno - EFAG");
  const corpo = encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`);

  window.location.href = `mailto:secretaria@escola.com?subject=${assunto}&body=${corpo}`;

  fecharFormulario();
}
const comunicados = [
  {
    titulo: "Início do Curso de Formação",
    data: "21/04/2025",
    html: `
      <p>Comunicamos que em <strong>maio de 2025</strong> terá início o tão esperado <strong>Curso de Formação da Guarda Municipal</strong> na EFAG.</p>
      <p>Desejamos uma jornada de aprendizado, comprometimento e sucesso a todos os alunos.</p>
      <div style="text-align: center; margin-top: 20px;">
        <img src="comunicados.img.png" alt="Curso de Formação GCM EFAG" style="max-width: 80%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" />
      </div>
    `
  }
];


function carregarComunicados() {
  const container = document.getElementById("listaComunicados");
  container.innerHTML = '';

  comunicados.forEach((c, index) => {
    const box = document.createElement('div');
    box.classList.add('comunicado-box');

    const titulo = document.createElement('h3');
    titulo.innerHTML = `<i class="fas fa-chevron-right toggle-icon"></i>${c.titulo}`;
    titulo.style.color = '#1d3557';
    titulo.style.marginBottom = '5px';

    const data = document.createElement('p');
    data.innerHTML = `<i class="fas fa-calendar-alt"></i> ${c.data}`;
    data.style.color = '#6c757d';
    data.style.fontSize = '14px';
    data.style.marginBottom = '10px';

    const conteudo = document.createElement('div');
    conteudo.innerHTML = c.html;
    conteudo.style.fontSize = '15px';
    conteudo.style.color = '#333';
    conteudo.style.display = 'none';

    titulo.addEventListener('click', () => {
      const isVisible = conteudo.style.display === 'block';
      conteudo.style.display = isVisible ? 'none' : 'block';
      box.classList.toggle('expanded', !isVisible);
    });

    box.appendChild(titulo);
    box.appendChild(data);
    box.appendChild(conteudo);
    container.appendChild(box);
  });
}

function atualizarStatusBoletim() {
  document.querySelectorAll('.card-boletim').forEach(card => {
    const notaEl = card.querySelector('.detalhes p:nth-child(1) strong');
    const statusEl = card.querySelector('.status');

    if (!notaEl || !statusEl) return;

    const notaTexto = notaEl.textContent.trim();
    const nota = parseFloat(notaTexto.replace('%', '').replace(',', '.'));

    statusEl.classList.remove('aprovado', 'reprovado', 'analise');

    if (isNaN(nota)) {
      statusEl.textContent = "Situação: Em análise";
      statusEl.classList.add('analise');
    } else if (nota >= 70) {
      statusEl.textContent = "Situação: Aprovado";
      statusEl.classList.add('aprovado');
    } else {
      statusEl.textContent = "Situação: Reprovado";
      statusEl.classList.add('reprovado');
    }
  });
}
function carregarBoletim() {
  const disciplinas = [
    "Ambiental",
    "APH",
    "Armamento e Tiro",
    "Educação Física",
    "Atos Administrativos",
    "Comunicação Social",
    "Corregedoria",
    "Direito",
    "Direitos Humanos",
    "Ética",
    "Funções e Atribuições da GCM",
    "Gestão Integrada",
    "Guard",
    "Instrumentos de Menor Potencial Ofensivo",
    "Inteligência",
    "Invasões, Manifestações e Movimentos Sociais",
    "Língua Portuguesa",
    "Maria da Penha",
    "Ordem Unida",
    "Ouvidoria",
    "Perícia",
    "Psicologia",
    "Relação Jurídica do Trabalho",
    "Responsabilidade Funcional",
    "Segurança Patrimonial",
    "SESMT",
    "SINESP - CAD",
    "Técnicas Operacionais",
    "Trânsito",
    "Violência Doméstica"
  ];

  const container = document.getElementById("boletimCards");

  container.innerHTML = "";

  disciplinas.forEach(nome => {
    const card = document.createElement("div");
    card.className = "card-boletim";
    card.innerHTML = `
      <h3>${nome}</h3>
      <div class="detalhes">
        <p>Nota: <strong>—</strong></p>
        <p>Frequência: <strong>—</strong></p>
        <p class="status analise">Situação: Em análise</p>
      </div>
    `;
    container.appendChild(card);
  });
}

setTimeout(atualizarStatusBoletim, 100);
function baixarLinksPDF() {
  const area = document.getElementById('linksImportantes');
  if (!area) {
    alert("Seção não encontrada.");
    return;
  }

  const clone = area.cloneNode(true);
  clone.style.visibility = 'hidden';
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '900px';
  clone.style.padding = '20px';
  clone.style.background = 'white';
  document.body.appendChild(clone);

  const opt = {
    margin: 0.5,
    filename: `Links_EFAG_${new Date().toLocaleDateString('pt-BR')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(clone).save().then(() => {
    document.body.removeChild(clone);
  });
}

function confirmarPresenca() {
  const checkboxes = document.querySelectorAll('.presenca');
  const justificativas = document.querySelectorAll('.justificativa');

  let valido = true;
  let todosPreenchidos = true;

  checkboxes.forEach((checkbox, index) => {
    const justificativa = justificativas[index];

    const marcouPresenca = checkbox.checked;
    const deuJustificativa = justificativa.value !== "";

    // ❌ Caso inválido: marcou os dois
    if (marcouPresenca && deuJustificativa) {
      valido = false;
    }

    // ❌ Caso inválido: não marcou presença e não justificou
    if (!marcouPresenca && !deuJustificativa) {
      todosPreenchidos = false;
    }
  });

  if (!valido) {
    mostrarAviso("⚠️ Escolha apenas *uma opção por nome*: presença ou justificativa.");
    return;
  }

  if (!todosPreenchidos) {
    mostrarAviso("⚠️ Por favor, registre todas as presenças e ausências antes de confirmar a lista.");
    return;
  }

  // ✅ Se tudo estiver certo
  const botao = document.getElementById('btnPresenca');
  botao.textContent = '✅ Lista Confirmada';
  botao.style.backgroundColor = '#28a745';
  botao.disabled = true;
}


function enviarRecado() {
  const botao = document.getElementById('btnRecado');
  const campo = document.getElementById('mensagemRecado');
  const mensagem = campo.value.trim();
  if (mensagem) {
    botao.textContent = '📨 Recado Enviado';
    botao.style.backgroundColor = '#28a745';
    botao.disabled = true;
    campo.value = '';
  } else {
    mostrarAviso('Digite uma mensagem para enviar o recado.');

  }
}


function salvarRelatorio() {
  const botao = document.getElementById('btnRelatorio');
  const campo = document.getElementById('mensagemRelatorio');
  const texto = campo.value.trim();
  if (texto) {
    botao.textContent = '✅ Relatório Salvo';
    botao.style.backgroundColor = '#28a745';
    botao.disabled = true;
    campo.value = '';
  } else {
    mostrarAviso('Digite o conteúdo do relatório antes de salvar.');
  }
}
function toggleExportMenu() {
  const menu = document.getElementById("menuExportar");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function mostrarAviso(mensagem) {
  const aviso = document.getElementById("notificacao");
  aviso.style.color = "#dc3545"; // vermelho estilo Bootstrap
  aviso.innerHTML = mensagem; // Removido ✅ fixo
  aviso.style.display = "block";
  aviso.style.opacity = "1";

  setTimeout(() => {
    aviso.style.opacity = "0";
  }, 3000);

  setTimeout(() => {
    aviso.style.display = "none";
    aviso.style.opacity = "1";
  }, 4000);
}
function salvarDadosAluno() {
  const user = localStorage.getItem('nomeUsuario');
  const dadosAtualizados = {
    qraAluno: document.getElementById('qraAluno').value,
    cfAluno: document.getElementById('cfAluno').value,
    reAluno: document.getElementById('reAluno').value,
    pelotaoAluno: document.getElementById('pelotaoAluno').value,
    emailAluno: document.getElementById('emailAluno').value,
    cursoAluno: document.getElementById('cursoAluno').value,
    nomeCompleto: document.getElementById('nomeCompleto').value,
    cpfAluno: document.getElementById('cpfAluno').value,
    dataNascimento: document.getElementById('dataNascimento').value,
    enderecoAluno: document.getElementById('enderecoAluno').value,
    telefoneAluno: document.getElementById('telefoneAluno').value,
    sangueAluno: document.getElementById('sangueAluno').value
  };

  // Salva no localStorage
  localStorage.setItem(`dados_${user}`, JSON.stringify(dadosAtualizados));

  // DESABILITA todos os campos novamente
  const ids = Object.keys(dadosAtualizados);
  ids.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.disabled = true;
      campo.style.backgroundColor = ""; // volta ao padrão do CSS
    }
  });
  

  // Troca botões
  const btnEditar = document.getElementById('btnEditar');
  const btnSalvar = document.getElementById('btnSalvar');
  if (btnEditar && btnSalvar) {
    btnEditar.style.display = 'inline-block';
    btnSalvar.style.display = 'none';
  }

  // Exibe aviso
  mostrarAviso("✅ Informações salvas com sucesso!");
}

function abrirModalLink(tipo) {
  const titulo = document.getElementById("modalLinksTitulo");
  const lista = document.getElementById("modalLinksLista");
  lista.innerHTML = "";

  let links = [];

  if (tipo === 'documentos') {
    titulo.textContent = '📚 Documentos Oficiais';
    links = [
      { nome: "Portarias Oficiais", url: "https://portaldoservidor.guarulhos.sp.gov.br/servicos.php?serv=670" },
      { nome: "Procedimentos Operacionais Padrão (POP)", url: "https://portaldoservidor.guarulhos.sp.gov.br/servicos.php?serv=615" },
      { nome: "Legislação Municipal", url: "https://www.guarulhos.sp.gov.br/legislacao-municipal" }
    ];
  } else if (tipo === 'prefeitura') {
    titulo.textContent = '🏛️ Links da Prefeitura';
    links = [
      { nome: "Site da Prefeitura", url: "https://www.guarulhos.sp.gov.br/" },
      { nome: "Portal do Servidor", url: "https://portaldoservidor.guarulhos.sp.gov.br/" },
      { nome: "Webmail", url: "https://mail.guarulhos.sp.gov.br/static/login/" },
      { nome: "SEI", url: "https://sei.guarulhos.sp.gov.br/sip/web/login.php?sigla_orgao_sistema=PMG&sigla_sistema=SEI" }
    ];
  } else if (tipo === 'comunicacao') {
    titulo.textContent = '📞 Canais de Comunicação';
    links = [
      { nome: "Secretária de Gestão - (11) 2423-7417", url: "https://www.guarulhos.sp.gov.br/transparencia/fale-conosco" },
      { nome: "Email da Prefeitura", url: "https://portaldoservidor.guarulhos.sp.gov.br/contato.php" }
    ];
  }

  links.forEach(link => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${link.url}" target="_blank" style="color:#1d3557; text-decoration:none;">${link.nome}</a>`;
    lista.appendChild(li);
  });

  document.getElementById("modalLinks").style.display = "flex";
}

function fecharModalLink() {
  document.getElementById("modalLinks").style.display = "none";
}

async function exportarBoletimImagem() {
  const boletim = document.getElementById('boletimCards');
  if (!boletim || boletim.innerHTML.trim() === '') {
    carregarBoletim(); // Garante conteúdo antes de exportar
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  const botaoExportar = document.querySelector('.dropdown-export');
  const menuExportar = document.getElementById('menuExportar');
  const filtros = document.getElementById('filtrosBoletim');

  if (botaoExportar) botaoExportar.style.display = 'none';
  if (menuExportar) menuExportar.style.display = 'none';
  if (filtros) filtros.style.display = 'none';

  const clone = boletim.cloneNode(true);
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '1200px';
  container.style.background = 'white';
  container.style.padding = '20px';
  container.style.zIndex = '-1';
  container.style.visibility = 'hidden';

  container.appendChild(clone);
  document.body.appendChild(container);

  await new Promise(resolve => setTimeout(resolve, 600));

  const canvas = await html2canvas(container, { scale: 2, useCORS: true });
  const imageData = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageData;
  link.download = `Boletim_EFAG_${new Date().toLocaleDateString('pt-BR')}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  document.body.removeChild(container);

  if (botaoExportar) botaoExportar.style.display = 'inline-block';
  if (filtros) filtros.style.display = 'flex';
}
const provasDisponiveis = {
  "Ambiental": "",
  "APH": "",
  "Armamento e Tiro": "",
  "Educação Física": "",
  "Atos Administrativos": "",
  // ... adicione links quando quiser liberar!
};

function carregarProvas() {
  const container = document.getElementById("provasGrid");
  container.innerHTML = "";

  const provasDisponiveis = {
    "Ambiental": "",
    "APH": "",
    "Armamento e Tiro": "",
    "Educação Física": "",
    "Atos Administrativos": "",
    "Comunicação Social": "",
    "Corregedoria": "",
    "Direito": "",
    "Direitos Humanos": "",
    "Ética": "",
    "Funções e Atribuições da GCM": "",
    "Gestão Integrada": "",
    "Guard": "",
    "Instrumentos de Menor Potencial Ofensivo": "",
    "Inteligência": "",
    "Invasões, Manifestações e Movimentos Sociais": "",
    "Língua Portuguesa": "",
    "Maria da Penha": "",
    "Ordem Unida": "",
    "Ouvidoria": "",
    "Perícia": "",
    "Psicologia": "",
    "Relação Jurídica do Trabalho": "",
    "Responsabilidade Funcional": "",
    "Segurança Patrimonial": "",
    "SESMT": "",
    "SINESP - CAD": "",
    "Técnicas Operacionais": "",
    "Trânsito": "",
    "Violência Doméstica": ""
  };

  Object.entries(provasDisponiveis).forEach(([disciplina, link]) => {
    const card = document.createElement("div");
    card.className = "card-prova";

    if (link) {
      card.innerHTML = `
        <h4>${disciplina}</h4>
        <a href="${link}" target="_blank" class="status disponivel">✅ Prova disponível</a>
      `;
    } else {
      card.innerHTML = `
        <h4>${disciplina}</h4>
        <p class="status indisponivel">🔒 Prova indisponível</p>
      `;
    }

    container.appendChild(card);
  });
}
const faltasDisciplinar = {
  "A - Comportamento Social": {
    A1: "desrespeitar as normas de boas maneiras",
    A2: "uso de palavras de baixo calão",
    A3: "falta de camaradagem ou cortesia"
  },
  "B - Pontualidade": {
    B1: "chegar atrasado",
    B2: "não entregar o trabalho escolar no prazo marcado"
  },
  "C - Interesse pelo Ensino": {
    C1: "falta de interesse pelo ensino",
    C2: "trabalho escolar mal elaborado",
    C3: "não apresentar o material escolar que a aula exigir"
  },
  "D - Correção do Uniforme": {
    D1: "uniforme sujo, amarrotado ou rasgado",
    D2: "uniforme desabotoado",
    D3: "uniforme incompleto, combinação irregular de peças ou outras irregularidades"
  },
  "E - Apresentação Pessoal": {
    E1: "modo incorreto de apresentar-se aos superiores",
    E2: "mau aspecto na apresentação pessoal",
    E3: "falta de atitude"
  },
  "F - Espírito de Ordem": {
    F1: "objetos ou peças do uso diário abandonados",
    F2: "armário desarrumado",
    F3: "não preservar a limpeza das instalações"
  },
  "G - Espírito de Disciplina": {
    G1: "trabalhar mal como Chefe de Turma",
    G2: "não obedecer às ordens do Chefe de Turma",
    G3: "dificultar o comando do Chefe de Turma",
    G4: "falta de presteza no cumprimento das ordens recebidas",
    G5: "não levar ao conhecimento do superior a execução da ordem recebida",
    G6: "deixar de prestar ao superior as manifestações de respeito previstas",
    G7: "fumar em locais ou situações proibidas",
    G8: "simular doenças para não cumprir as obrigações",
    G9: "incorreções nas posições em forma",
    G10: "inobservância das prescrições regulamentares"
  },
  "H - Apresentação e Conservação": {
    H1: "equipamento ou material sujo ou mal conservado",
    H2: "abandono de equipamento ou material"
  },
  "I - Higiene e Asseio Pessoal": {
    I1: "cabelos fora dos padrões regulamentares",
    I2: "barba por fazer",
    I3: "falta de higiene pessoal"
  }
};

function renderAccordionFaltas() {
  const container = document.getElementById("accordion-faltas");
  for (const grupo in faltasDisciplinar) {
    const divGrupo = document.createElement("div");

    const titulo = document.createElement("div");
    titulo.className = "accordion-titulo";
    titulo.textContent = grupo;
    titulo.addEventListener("click", () => {
      conteudo.style.display = conteudo.style.display === "block" ? "none" : "block";
    });

    const conteudo = document.createElement("div");
    conteudo.className = "accordion-conteudo";

    for (const codigo in faltasDisciplinar[grupo]) {
      const descricao = faltasDisciplinar[grupo][codigo];
      const btn = document.createElement("button");
      btn.textContent = `${codigo} - ${descricao}`;
      btn.addEventListener("click", () => {
        // Remove seleções anteriores
        document.getElementById("codigoFaltaSelecionado")?.remove();
        const selecionadaBox = document.getElementById("infractionSelecionada");
        selecionadaBox.style.display = "block";
        selecionadaBox.textContent = `Infração selecionada: ${codigo} - ${descricao}`;
      
        // Cria campo oculto
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.id = "codigoFaltaSelecionado";
        hidden.value = `${codigo} - ${descricao}`;
        document.getElementById("accordion-faltas").appendChild(hidden);
      });
      
      conteudo.appendChild(btn);
    }

    divGrupo.appendChild(titulo);
    divGrupo.appendChild(conteudo);
    container.appendChild(divGrupo);
  }
}

function aplicarMedidaDisciplinar() {
  const qra = document.getElementById("qraDisciplina").value.trim();
  const cf = document.getElementById("cfDisciplina").value.trim();
  const pelotao = document.getElementById("pelotaoDisciplina").value.trim();
  const faltaEl = document.getElementById("codigoFaltaSelecionado");
  const observacao = document.getElementById("observacaoDisciplina").value.trim();

  if (!qra || !cf || !pelotao || !faltaEl) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Preencha QRA, CF, Pelotão e selecione uma infração.'
    });
    return;
  }

  const novaLinha = document.createElement("li");
  novaLinha.innerHTML = `
    <p><strong>Aluno:</strong> ${qra}</p>
    <p><strong>CF:</strong> ${cf}</p>
    <p><strong>Pelotão:</strong> ${pelotao}</p>
    <p><strong>Infração:</strong> ${faltaEl.value}</p>
    ${observacao ? `<p><strong>Observação:</strong> ${observacao}</p>` : ""}
    <p style="color: #6c757d; font-size: 13px;"><i class="fas fa-clock"></i> ${new Date().toLocaleString('pt-BR')}</p>
  `;

  document.getElementById("listaMedidas")?.prepend(novaLinha);

  Swal.fire({
    icon: 'success',
    title: '✅ Medida disciplinar aplicada!',
    html: `A infração <strong>${faltaEl.value}</strong> foi registrada para <strong>${qra}</strong> (CF ${cf}, Pelotão ${pelotao}).`,
    showConfirmButton: false,
    timer: 3000
  });

  // Limpar os campos
  document.getElementById("qraDisciplina").value = "";
  document.getElementById("cfDisciplina").value = "";
  document.getElementById("pelotaoDisciplina").value = "";
  faltaEl.remove();
  document.getElementById("observacaoDisciplina").value = "";
}


document.addEventListener("DOMContentLoaded", () => {
  renderAccordionFaltas();
});
document.addEventListener("DOMContentLoaded", function () {
  const medidaSelect = document.getElementById("medidaDisciplinar");
  const medidaInfo = document.getElementById("medida-selecionada");

  medidaSelect.addEventListener("change", () => {
    const selected = medidaSelect.value;
    if (selected) {
      medidaInfo.style.display = "block";
      medidaInfo.textContent = `Medida selecionada: ${selected}`;
    } else {
      medidaInfo.style.display = "none";
    }
  });
});
const aplicarBtn = document.getElementById("aplicarMedida");

aplicarBtn.addEventListener("click", () => {
  const aluno = document.getElementById("nomeAluno").value;
  const medida = document.getElementById("medidaDisciplinar").value;

  if (aluno && medida) {
    Swal.fire({
      title: "Medida Aplicada!",
      text: `A medida "${medida}" foi aplicada ao aluno ${aluno}.`,
      icon: "success",
      confirmButtonText: "OK",
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  } else {
    Swal.fire({
      title: "Erro",
      text: "Informe o aluno e selecione uma medida.",
      icon: "error"
    });
  }
});
