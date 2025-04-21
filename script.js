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
  const sections = ['info', 'disciplinas', 'notas', 'grade', 'comunicados', 'linksImportantes', 'lideranca','sistemas'];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = 'none';
  });

  const sectionToShow = document.getElementById(id);
  sectionToShow.style.display = 'block';
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
  
}
document.getElementById('searchInput').addEventListener('input', function () {
  const filtro = this.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.disciplina-card, .card-boletim, .card-sistema');
  const comunicadosBox = document.getElementById('listaComunicados');
  const comunicadosDiv = document.getElementById('comunicados');

  const msgAntiga = document.getElementById('mensagem-resultado');
  if (msgAntiga) msgAntiga.remove();

  if (filtro === '') {
    showSection('info');
    cards.forEach(card => card.style.display = 'flex');
    return;
  }

  // Navegação por palavras-chave
  if (filtro.includes('boletim')) { showSection('notas'); return; }
  if (filtro.includes('info')) { showSection('info'); return; }
  if (filtro === 'disciplina' || filtro === 'disciplinas') {
    showSection('disciplinas');
  
    // Mostra todos os cards de disciplina
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

  // Busca geral em cards
  let encontrou = false;
  cards.forEach(card => {
    const nome = card.textContent.toLowerCase();
    const mostrar = nome.includes(filtro);
    card.style.display = mostrar ? 'flex' : 'none';
    if (mostrar) encontrou = true;
  });

  if (encontrou) {
    if (document.querySelector('.disciplina-card[style*="flex"]')) {
      showSection('disciplinas');
    } else if (document.querySelector('.card-boletim[style*="flex"]')) {
      showSection('notas');
    } else if (document.querySelector('.card-sistema[style*="flex"]')) {
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

const dadosDisciplinas = {};
document.querySelectorAll('.disciplina-card').forEach(card => {
  const nome = card.textContent.trim();
  dadosDisciplinas[nome] = {
    professor: '',
    carga: '',
    material: [] // aqui vão os links das apostilas
  };

  card.addEventListener('click', () => {
    const dados = dadosDisciplinas[nome];

    document.getElementById('modalTitulo').textContent = `📘 ${nome}`;
    document.getElementById('modalProfessor').textContent = dados.professor || '—';
    document.getElementById('modalCarga').textContent = dados.carga || '—';

    const materialDiv = document.getElementById('modalMaterial');
    materialDiv.innerHTML = '';
    materialDiv.innerHTML = ''; // limpa conteúdo anterior

    if (dados.material.length > 0) {
      dados.material.forEach(link => {
        const a = document.createElement('a');
        a.href = link;
        a.textContent = '📄 Apostila';
        a.target = '_blank';
        a.style.display = 'block';
        a.style.marginBottom = '6px';
        materialDiv.appendChild(a);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = 'Nenhum material disponível.';
      materialDiv.appendChild(p);
    }
    
    // NOVO BLOCO: Exibe status da prova
    const provaStatus = document.createElement('p');
    provaStatus.textContent = '📝 Prova: Disponível após a conclusão da disciplina';
    provaStatus.style.marginTop = '10px';
    provaStatus.style.color = '#555';
    materialDiv.appendChild(provaStatus);
    

    document.getElementById('modalDisciplina').style.display = 'flex';
  });
  function fecharModal() {
    document.getElementById('modalDisciplina').style.display = 'none';
  }
   
});
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
    titulo: "📰 Início do Curso de Formação",
    data: "Maio de 2025",
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

  comunicados.forEach(c => {
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

  const container = document.getElementById("boletim-cards");
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
function exportarBoletimPDF() {
  const area = document.getElementById('notas');
  if (!area) {
    alert("Boletim não encontrado.");
    return;
  }
  
  const clone = area.cloneNode(true);
  clone.style.visibility = 'hidden';
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '1000px';
  clone.style.padding = '20px';
  clone.style.background = 'white';
  document.body.appendChild(clone);

  const opt = {
    margin: 0.5,
    filename: `Boletim_${new Date().toLocaleDateString('pt-BR')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(clone).save().then(() => {
    document.body.removeChild(clone);
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
  let todosMarcados = true;

  checkboxes.forEach((checkbox, index) => {
    if (!checkbox.checked) {
      const justificativa = document.querySelectorAll('.justificativa')[index];
      if (!justificativa.value) {
        todosMarcados = false;
      }
    }
  });

  if (todosMarcados) {
    const botao = document.getElementById('btnPresenca');
    botao.textContent = '✅ Lista Confirmada';
    botao.style.backgroundColor = '#28a745';
    botao.disabled = true;
  } else {
    mostrarAviso('Por favor, registre todas as presenças e ausências antes de confirmar a lista.');
  }
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
async function exportarBoletimPDF() {
  const area = document.getElementById('notas');
  if (!area) {
    alert("Boletim não encontrado.");
    return;
  }

  // Esconde o botão de exportação
  const menuExportar = document.getElementById('menuExportar');
  const botaoExportar = document.querySelector('.dropdown-export');
  if (botaoExportar) botaoExportar.style.display = 'none';

  await new Promise(resolve => setTimeout(resolve, 300));

  html2canvas(area, { scale: 2, useCORS: true }).then(canvas => {
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new window.jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
    pdf.save(`Boletim_EFAG_${new Date().toLocaleDateString('pt-BR')}.pdf`);

    // Exibe novamente após salvar
    if (botaoExportar) botaoExportar.style.display = 'inline-block';
    if (menuExportar) menuExportar.style.display = 'none';
  });
}
function exportarBoletimExcel() {
  const cards = document.querySelectorAll('.card-boletim');
  if (!cards.length) {
    alert("Nada para exportar.");
    return;
  }

  let csv = "Disciplina,Nota,Frequência,Situação\n";

  cards.forEach(card => {
    const nome = card.querySelector("h3")?.textContent?.trim() || '';
    const nota = card.querySelector(".detalhes p:nth-child(1) strong")?.textContent?.trim() || '';
    const freq = card.querySelector(".detalhes p:nth-child(2) strong")?.textContent?.trim() || '';
    const status = card.querySelector(".status")?.textContent?.replace("Situação: ", "").trim() || '';
    
    const linha = `"${nome.replace(/"/g, '""')}","${nota}","${freq}","${status}"\n`;
    csv += linha;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Boletim_EFAG_${new Date().toLocaleDateString('pt-BR')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function exportarBoletimExcel() {
  const cards = document.querySelectorAll('.card-boletim');
  if (!cards.length) {
    alert("Nada para exportar.");
    return;
  }

  let csv = "Disciplina,Nota,Frequência,Situação\n";

  cards.forEach(card => {
    const nome = card.querySelector("h3")?.textContent?.trim() || '';
    const nota = card.querySelector(".detalhes p:nth-child(1) strong")?.textContent?.trim() || '';
    const freq = card.querySelector(".detalhes p:nth-child(2) strong")?.textContent?.trim() || '';
    const status = card.querySelector(".status")?.textContent?.replace("Situação: ", "").trim() || '';
    
    const linha = `"${nome.replace(/"/g, '""')}","${nota}","${freq}","${status}"\n`;
    csv += linha;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Boletim_EFAG_${new Date().toLocaleDateString('pt-BR')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function mostrarAviso(mensagem) {
  const aviso = document.getElementById("notificacao");
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
