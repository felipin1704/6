document.addEventListener("DOMContentLoaded", () => {
  iniciarAnimacoes();
  configurarFormularioReserva();
});

function iniciarAnimacoes() {
  const itens = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || !itens.length) {
    itens.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  itens.forEach((item) => observer.observe(item));
}

function configurarFormularioReserva() {
  const reservaForm = document.getElementById("reservaForm");
  if (!reservaForm) return;

  const telefone = document.getElementById("telefone");
  const whatsapp = document.getElementById("whatsapp");
  const cpf = document.getElementById("cpf");
  const cep = document.getElementById("cep");
  const dataReserva = document.getElementById("dataReserva");

  if (dataReserva) {
    dataReserva.min = hojeISO();
  }

  telefone?.addEventListener("input", () => {
    telefone.value = formatPhone(telefone.value);
    atualizarResumoReserva();
  });

  whatsapp?.addEventListener("input", () => {
    whatsapp.value = formatPhone(whatsapp.value);
    atualizarResumoReserva();
  });

  cpf?.addEventListener("input", () => {
    cpf.value = formatCPF(cpf.value);
  });

  cep?.addEventListener("input", () => {
    cep.value = formatCEP(cep.value);
  });

  const camposResumo = [
    "nome",
    "whatsapp",
    "dataReserva",
    "horaReserva",
    "tipoLocacao",
    "manetes",
    "retirada",
    "pagamento"
  ];

  camposResumo.forEach((id) => {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.addEventListener("input", atualizarResumoReserva);
    campo.addEventListener("change", atualizarResumoReserva);
  });

  reservaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const numeroDestino = "5533999296276";

    const nome = getValue("nome");
    const telefoneValor = getValue("telefone");
    const whatsappValor = getValue("whatsapp");
    const cpfValor = getValue("cpf");
    const nascimento = getValue("nascimento");
    const cepValor = getValue("cep");
    const cidade = getValue("cidade");
    const rua = getValue("rua");
    const numero = getValue("numero");
    const bairro = getValue("bairro");
    const complemento = getValue("complemento");
    const dataDesejada = getValue("dataReserva");
    const horaDesejada = getValue("horaReserva");
    const tipoLocacao = getValue("tipoLocacao");
    const manetes = getValue("manetes");
    const retirada = getValue("retirada");
    const pagamento = getValue("pagamento");
    const observacoes = getValue("observacoes");

    const mensagem = `*NOVA SOLICITAÇÃO DE RESERVA - JOFEL PLAY LOCAÇÕES*

*Nome completo:* ${nome}
*Telefone:* ${telefoneValor}
*WhatsApp:* ${whatsappValor}
*CPF:* ${cpfValor}
*Data de nascimento:* ${formatDateBR(nascimento)}

*CEP:* ${cepValor}
*Cidade:* ${cidade}
*Rua:* ${rua}
*Número:* ${numero}
*Bairro:* ${bairro}
*Complemento:* ${complemento || "Não informado"}

*Data desejada:* ${formatDateBR(dataDesejada)}
*Horário desejado:* ${horaDesejada}
*Tipo de locação:* ${tipoLocacao}
*Quantidade de manetes:* ${manetes}
*Forma de recebimento:* ${retirada}
*Forma de pagamento:* ${pagamento}
*Observações:* ${observacoes || "Nenhuma"}

Essa reserva ainda precisa ser analisada e confirmada pela JOFEL PLAY.`;

    const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;

    let successBox = document.querySelector(".success-message");

    if (!successBox) {
      successBox = document.createElement("div");
      successBox.className = "success-message";
      reservaForm.appendChild(successBox);
    }

    successBox.innerHTML = `
      Solicitação preparada com sucesso.<br><br>
      <strong>Você será redirecionado para o WhatsApp para finalizar o envio.</strong><br>
      Sua reserva ainda será analisada e confirmada pela JOFEL PLAY.
    `;

    window.open(url, "_blank");

    setTimeout(() => {
      reservaForm.reset();
      if (dataReserva) {
        dataReserva.min = hojeISO();
      }
      atualizarResumoReserva();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  });

  atualizarResumoReserva();
}

function atualizarResumoReserva() {
  const resumo = document.getElementById("resumoReserva");
  if (!resumo) return;

  const nome = getValue("nome");
  const whatsapp = getValue("whatsapp");
  const dataReserva = getValue("dataReserva");
  const horaReserva = getValue("horaReserva");
  const tipoLocacao = getValue("tipoLocacao");
  const manetes = getValue("manetes");
  const retirada = getValue("retirada");
  const pagamento = getValue("pagamento");

  if (!nome && !dataReserva && !tipoLocacao) {
    resumo.innerHTML = `
      <h3>Resumo da solicitação</h3>
      <p>Preencha os campos acima para visualizar um resumo antes de enviar.</p>
    `;
    return;
  }

  resumo.innerHTML = `
    <h3>Resumo da solicitação</h3>
    <p><strong>Cliente:</strong> ${nome || "Não informado"}</p>
    <p><strong>WhatsApp:</strong> ${whatsapp || "Não informado"}</p>
    <p><strong>Data desejada:</strong> ${dataReserva ? formatDateBR(dataReserva) : "Não informada"}</p>
    <p><strong>Horário:</strong> ${horaReserva || "Não informado"}</p>
    <p><strong>Tipo de locação:</strong> ${tipoLocacao || "Não informado"}</p>
    <p><strong>Quantidade de manetes:</strong> ${manetes || "Não informado"}</p>
    <p><strong>Forma de recebimento:</strong> ${retirada || "Não informado"}</p>
    <p><strong>Forma de pagamento:</strong> ${pagamento || "Não informado"}</p>
  `;
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function hojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatPhone(value) {
  value = value.replace(/\D/g, "").slice(0, 11);

  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return value;
}

function formatCPF(value) {
  value = value.replace(/\D/g, "").slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
}

function formatCEP(value) {
  value = value.replace(/\D/g, "").slice(0, 8);
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value;
}

function formatDateBR(date) {
  if (!date) return "Não informado";
  const [ano, mes, dia] = date.split("-");
  return `${dia}/${mes}/${ano}`;
}
function configurarCarrosselJogos() {
  const track = document.getElementById("gamesTrack");
  if (!track) return;

  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  const getStep = () => {
    const firstCard = track.querySelector(".game-poster-card");
    if (!firstCard) return 260;
    const styles = window.getComputedStyle(track);
    const gap = parseInt(styles.columnGap || styles.gap || 18, 10);
    return firstCard.offsetWidth + gap;
  };

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -getStep() * 2, behavior: "smooth" });
  });

  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: getStep() * 2, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarCarrosselJogos();
});
