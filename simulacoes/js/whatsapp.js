export const whatsapp = {
  openWppChat(contactName) {
    document.getElementById("wpp-home-screen").classList.add("hidden");
    document.getElementById("wpp-chat-screen").classList.remove("hidden");

    document.getElementById("wpp-chat-name").innerText = contactName;
    const avatar = document.getElementById("wpp-chat-avatar");
    avatar.className = "wpp-avatar-small";
    if (contactName === "Filho") avatar.classList.add("bg-blue");
    else if (contactName === "Grupo da Família")
      avatar.classList.add("bg-green");
    else avatar.classList.add("bg-gray");
    const history = document.getElementById("wpp-chat-history");
    history.innerHTML = `
      <div class="wpp-bubble-received">
        Oi! Que bom falar com você.
        <span class="wpp-msg-time">Agora</span>
      </div>
    `;

    document.getElementById("wpp-step-label").innerText = "Passo 2:";
    document.getElementById("wpp-step-text").innerText =
      "Você abriu a conversa! Toque na barra branca lá embaixo, digite um 'Oi' e aperte a setinha verde para enviar.";

    const input = document.getElementById("wpp-message-input");
    input.addEventListener("input", this.toggleWppSendIcon);
  },

  closeWppChat() {
    document.getElementById("wpp-chat-screen").classList.add("hidden");
    document.getElementById("wpp-home-screen").classList.remove("hidden");

    document.getElementById("wpp-step-label").innerText = "Passo 1:";
    document.getElementById("wpp-step-text").innerText =
      "Esta é a sua lista de conversas e contatos. Toque no 'Filho' para abrir a conversa com ele.";
  },

  toggleWppSendIcon(e) {
    const icon = document.getElementById("wpp-send-icon");
    if (e.target.value.trim().length > 0) {
      icon.innerText = "send";
    } else {
      icon.innerText = "mic";
    }
  },

  checkWppEnter(event) {
    if (event.key === "Enter") {
      this.sendWppMessage();
    }
  },

  sendWppMessage() {
    const input = document.getElementById("wpp-message-input");
    const text = input.value.trim();

    if (text === "") {
      alert(
        "No mundo real, segurar este botão gravaria uma mensagem de áudio!",
      );
      return;
    }

    const history = document.getElementById("wpp-chat-history");

    const bubble = document.createElement("div");
    bubble.className = "wpp-bubble-sent";
    bubble.innerHTML = `
      ${text}
      <span class="wpp-msg-time">Agora <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">done_all</span></span>
    `;
    history.appendChild(bubble);
    input.value = "";
    this.toggleWppSendIcon({ target: input });
    history.scrollTop = history.scrollHeight;

    document.getElementById("wpp-step-label").innerText = "Parabéns!";
    document.getElementById("wpp-step-text").innerText =
      "Você enviou a mensagem! O balão verde é sempre o que você escreve, o branco é o que a pessoa te manda.";
  },

  wppAttachment() {
    alert(
      "O botão de Clipe serve para enviar algo que já está no celular, como uma foto da sua Galeria ou um Contato para a outra pessoa.",
    );
  },
  openWppCamera() {
    document.getElementById("wpp-camera-screen").classList.remove("hidden");
    document.getElementById("wpp-step-label").innerText = "Passo 3:";
    document.getElementById("wpp-step-text").innerText =
      "Você abriu a Câmera pelo WhatsApp! Toque no botão branco grande para tirar uma foto do seu dia.";
  },

  closeWppCamera() {
    document.getElementById("wpp-camera-screen").classList.add("hidden");
    document.getElementById("wpp-step-label").innerText = "Passo 2:";
    document.getElementById("wpp-step-text").innerText =
      "Você voltou para a conversa. Experimente tocar na Câmera novamente!";
  },

  takeWppPhoto() {
    this.closeWppCamera();
    const history = document.getElementById("wpp-chat-history");
    const bubble = document.createElement("div");
    bubble.className = "wpp-bubble-sent";
    bubble.style.padding = "4px";
    bubble.innerHTML = `
      <img src="https://picsum.photos/id/1025/200/200" style="border-radius: 8px; max-width: 100%; display: block; margin-bottom: 4px;">
      <span class="wpp-msg-time" style="margin: 0 4px 4px 0;">Agora <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">done_all</span></span>
    `;
    history.appendChild(bubble);
    history.scrollTop = history.scrollHeight;

    document.getElementById("wpp-step-label").innerText = "Fantástico!";
    document.getElementById("wpp-step-text").innerText =
      "Você acabou de tirar uma foto e enviar diretamente para o contato. Viu como os aplicativos trabalham juntos?";
  },
};
