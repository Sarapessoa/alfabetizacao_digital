export const instagram = {
  igToggleLike(icon) {
    const countSpan = document.getElementById("ig-like-count");
    let count = parseInt(countSpan.innerText);
    if (icon.style.color !== "rgb(237, 73, 86)") {
      icon.style.color = "#ed4956";
      icon.style.fontVariationSettings = "'FILL' 1";
      countSpan.innerText = count + 1;

      document.getElementById("ig-step-label").innerText = "Muito bem!";
      document.getElementById("ig-step-text").innerText =
        "O coração ficou vermelho! Isso significa que você curtiu a foto. A pessoa receberá um aviso de que você gostou.";
    } else {
      icon.style.color = "";
      icon.style.fontVariationSettings = "'FILL' 0";
      countSpan.innerText = count - 1;
    }
  },

  igOpenComments() {
    document.getElementById("ig-home-screen").classList.add("hidden");
    document.getElementById("ig-comments-screen").classList.remove("hidden");

    document.getElementById("ig-step-label").innerText = "Passo 2:";
    document.getElementById("ig-step-text").innerText =
      "Este é o espaço de Comentários (o balão de fala). É aqui que todos deixam recados públicos para a foto.";
  },

  igCloseComments() {
    document.getElementById("ig-comments-screen").classList.add("hidden");
    document.getElementById("ig-home-screen").classList.remove("hidden");

    document.getElementById("ig-step-label").innerText = "Passo 1:";
    document.getElementById("ig-step-text").innerText =
      "Bem-vindo ao Instagram! Role para baixo para ver a foto ou toque no Coração para curtir.";
  },

  igFakeShare() {
    alert(
      "O 'Aviãozinho de Papel' serve para Compartilhar. Ao clicar nele, você pode enviar esta foto em particular para alguém (no WhatsApp ou no próprio Instagram).",
    );
  },

  igFakeStory(nome) {
    alert(
      `Estas bolinhas no topo são os 'Stories'. São fotos ou vídeos rápidos de ${nome} que desaparecem sozinhos depois de 24 horas!`,
    );
  },

  igFakeTypeComment() {
    alert(
      "No mundo real, tocar aqui abriria o teclado do seu celular para você digitar um elogio ou recado.",
    );
  },
  igOpenReels() {
    document.getElementById("ig-home-screen").classList.add("hidden");
    document.getElementById("ig-comments-screen").classList.add("hidden");
    document.getElementById("ig-profile-screen").classList.add("hidden");
    document.getElementById("ig-reels-screen").classList.remove("hidden");
    document.getElementById("ig-step-label").innerText = "Passo 3:";
    document.getElementById("ig-step-text").innerText =
      "Estes são os Reels (vídeos curtos). Os botões de curtir e comentar ficam aqui na direita, em cima do vídeo.";
  },

  igCloseReels() {
    document.getElementById("ig-reels-screen").classList.add("hidden");
    document.getElementById("ig-home-screen").classList.remove("hidden");

    document.getElementById("ig-step-label").innerText = "Passo 1:";
    document.getElementById("ig-step-text").innerText =
      "Você voltou para o Início. Aqui você vê as fotos de quem você segue.";
  },
  igOpenProfile() {
    document.getElementById("ig-home-screen").classList.add("hidden");
    document.getElementById("ig-reels-screen").classList.add("hidden");
    document.getElementById("ig-comments-screen").classList.add("hidden");
    document.getElementById("ig-profile-screen").classList.remove("hidden");
    document.getElementById("ig-step-label").innerText = "Sua Página:";
    document.getElementById("ig-step-text").innerText =
      "Este é o seu Perfil. Aqui ficam as fotos que VOCÊ postou. O 'Grid' (quadradinhos) mostra tudo organizado.";
  },

  igCloseProfile() {
    document.getElementById("ig-profile-screen").classList.add("hidden");
    document.getElementById("ig-home-screen").classList.remove("hidden");

    document.getElementById("ig-step-label").innerText = "Passo 1:";
    document.getElementById("ig-step-text").innerText =
      "Você voltou para a página inicial para ver as fotos dos outros.";
  },
};
