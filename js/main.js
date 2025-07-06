const getList = async () => {
  let url = 'http://127.0.0.1:5000/evento/todos';
  fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then((data) => {
    data.eventos.forEach(item => insertList(item.id, item.nome, item.data))
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

getList()

const clearList = () => {
  var table = document.getElementById('myTable');
  for (var i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
  document.getElementById("visualizar-evento").style.display = "none";
  document.getElementById("visualizar-form").style.display = "block";
}

const insertButton = (parent, id) => {
  const buttons = [
    {
      title: "Visualizar",
      icon: "img/icons/eye-svgrepo-com.svg",
      class: "btn-visualizar",
      action: () => viewEvento(id)
    },
    {
      title: "Editar",
      icon: "img/icons/pencil-svgrepo-com.svg",
      class: "btn-editar",
      action: () => editEvento(id)
    },
    {
      title: "Excluir",
      icon: "img/icons/alt-tag-svgrepo-com.svg",
      class: "btn-excluir",
      action: () => deleteEvento(id)
    }
  ];

  const container = document.createElement("div");
  container.className = "action-buttons";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.gap = "8px";

  buttons.forEach(({ title, icon, class: className, action }) => {
    const button = document.createElement("button");
    button.title = title;
    button.className = className;
    button.style.border = "none";
    button.style.background = "transparent";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.padding = "4px";

    const img = document.createElement("img");
    img.src = icon;
    img.alt = title;
    img.style.width = "20px";
    img.style.height = "20px";

    button.appendChild(img);
    button.onclick = action;
    container.appendChild(button);
  });

  parent.appendChild(container);
};

const insertList = (id, nome, data) => {
  var item = [id, nome, data]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1), id);
}

let eventoEmEdicao = null;
let exibirEvento = false;

const formatarDataParaInput =(dataBR) => {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes}-${dia}`;
}

const fillUpForm = (evento) => {
  document.getElementById("nome").value = evento.nome;
  document.getElementById("data").value = formatarDataParaInput(evento.data);
  document.getElementById("bairro").value = evento.endereco.bairro;
  document.getElementById("cep").value = evento.endereco.cep;
  document.getElementById("cidade").value = evento.endereco.cidade;
  document.getElementById("complemento").value = evento.endereco.complemento;
  document.getElementById("estado").value = evento.endereco.estado;
  document.getElementById("logradouro").value = evento.endereco.logradouro;
  document.getElementById("numero").value = evento.endereco.numero;
  document.getElementById("altimetria").value = evento.trajeto.altimetria;
  document.getElementById("nivel_dificuldade").value = evento.trajeto.nivel_dificuldade;
  document.getElementById("rota_imagem_link").value = evento.trajeto.rota_imagem_link;
  document.getElementById("nome_trajeto").value = evento.trajeto.nome;

  eventoEmEdicao = evento;
}

const ClearForm = () => {
  document.getElementById("form-evento").reset();
  eventoEmEdicao = null;
}

const addEvento = (event) => {
  event.preventDefault();

  const payload = makePayload();
  let url = 'http://127.0.0.1:5000/evento';
  let method = 'POST';

  if (eventoEmEdicao && eventoEmEdicao.id) {
    url = `http://127.0.0.1:5000/evento/${eventoEmEdicao.id}`;
    method = 'PUT';
  }

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Sucesso:", data);
    eventoEmEdicao = null;
    document.getElementById("form-evento").reset();
    clearList();
    getList();
  })
  .catch(error => {
    console.error("Erro:", error);
  });
};

const makePayload = () => {
  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const bairro = document.getElementById("bairro").value;
  const cep = document.getElementById("cep").value;
  const cidade = document.getElementById("cidade").value;
  const complemento = document.getElementById("complemento").value;
  const estado = document.getElementById("estado").value;
  const logradouro = document.getElementById("logradouro").value;
  const numero = document.getElementById("numero").value;
  const altimetria = document.getElementById("altimetria").value;
  const nivelDificuldade = document.getElementById("nivel_dificuldade").value;
  const rotaImagemLink = document.getElementById("rota_imagem_link").value;
  const nomeTrajeto = document.getElementById("nome_trajeto").value;
  return {
    nome: nome,
    data: data,
    endereco: {
      bairro: bairro,
      cep: cep,
      cidade: cidade,
      complemento: complemento,
      estado: estado,
      logradouro: logradouro,
      numero: numero
    },
    trajeto: {
      altimetria: altimetria,
      nivel_dificuldade: nivelDificuldade,
      nome: nomeTrajeto,
      rota_imagem_link: rotaImagemLink
    }
  }
}

const editEvento = (id) => {
  fetch(`http://127.0.0.1:5000/evento/${id}`)
    .then(res => res.json())
    .then(evento => {
      fillUpForm(evento);
    })
    .catch(err => console.error("Erro ao carregar evento:", err));
    showForm()
}

const preencherDadosEvento = (data) => {
  const eventoHtml = document.getElementById("visualizar-evento");

  eventoHtml.innerHTML = `
    <h3>${data.nome}</h3>
    <p><strong>Data:</strong> ${data.data}</p>

    <h4>Local</h4>
    <p><strong>Endereço: </strong>${data.endereco.logradouro}, ${data.endereco.numero}, 
    ${data.endereco.bairro} - ${data.endereco.cidade}/${data.endereco.estado}</p>
    <p><strong>CEP: </strong> ${data.endereco.cep}</p>
    <p><strong>Complemento: </strong> ${data.endereco.complemento}</p>

    <h4>Trajeto</h4>
    <p><strong>Nome do trajeto:</strong> ${data.trajeto.nome}</p>
    <p><strong>Altimetria:</strong> ${data.trajeto.altimetria} metros</p>
    <p><strong>Nível de dificuldade:</strong> ${data.trajeto.nivel_dificuldade}</p>
    <img src="${data.trajeto.rota_imagem_link}" alt="Imagem do trajeto" style="max-width: 100%; height: auto; border: 1px solid #ccc; margin-top: 5px;">
  `;
};

const viewEvento = (id) => {
  fetch(`http://127.0.0.1:5000/evento/${id}`)
    .then(res => res.json())
    .then(evento => {
      preencherDadosEvento(evento);
    })
    .catch(err => console.error("Erro ao carregar evento:", err));
    document.getElementById("visualizar-evento").style.display = "block";
    document.getElementById("visualizar-form").style.display = "none";
}

const deleteEvento = (id) => {
  fetch(`http://127.0.0.1:5000/evento/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    console.log("Sucesso:", data);
    clearList();
    getList();
  })
  .catch(error => {
    console.error("Erro:", error);
  });
}

const showForm = () => {
  document.getElementById("visualizar-form").style.display = "block";
  document.getElementById("visualizar-evento").style.display = "none";
  ClearForm();
}