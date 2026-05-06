export const galeria = {
  takePhoto() {
    const flash = document.getElementById("gal-flash-effect");
    flash.classList.remove("hidden");

    setTimeout(() => {
      flash.classList.add("hidden");
    }, 150);

    document.getElementById("gal-step-label").innerText = "Muito bem!";
    document.getElementById("gal-step-text").innerText =
      "Você tirou uma foto! Agora toque na imagem pequenininha no canto esquerdo para ver a Galeria.";
  },

  switchCamera() {
    alert("Simulando a troca entre a câmera da frente (selfie) e a de trás!");
  },

  goToGallery() {
    document.getElementById("gal-camera-screen").classList.add("hidden");
    document.getElementById("gal-main-header").classList.remove("hidden");
    document.getElementById("gal-albums-screen").classList.remove("hidden");

    document.getElementById("gal-step-label").innerText = "Passo 2:";
    document.getElementById("gal-step-text").innerText =
      "Bem-vindo à Galeria! Aqui ficam suas fotos. Toque em um álbum para abri-lo.";
  },

  backToCamera() {
    document.getElementById("gal-albums-screen").classList.add("hidden");
    document.getElementById("gal-main-header").classList.add("hidden");
    document.getElementById("gal-camera-screen").classList.remove("hidden");

    document.getElementById("gal-step-label").innerText = "Passo 1:";
    document.getElementById("gal-step-text").innerText =
      "Você está na Câmera! Toque no botão redondo para tirar uma foto, ou no quadradinho à esquerda para abrir a Galeria.";
  },

  openGaleriaAlbum(albumName) {
    document.getElementById("gal-albums-screen").classList.add("hidden");
    document.getElementById("gal-photos-screen").classList.remove("hidden");
    document.getElementById("gal-album-title").innerText = albumName;

    document.getElementById("gal-step-label").innerText = "Passo 3:";
    document.getElementById("gal-step-text").innerText =
      "Estas são as fotos deste álbum. Toque em uma foto para abri-la maior.";
  },

  closeGaleriaAlbum() {
    document.getElementById("gal-photos-screen").classList.add("hidden");
    document.getElementById("gal-albums-screen").classList.remove("hidden");

    document.getElementById("gal-step-label").innerText = "Passo 2:";
    document.getElementById("gal-step-text").innerText =
      "Bem-vindo à Galeria! Aqui ficam suas fotos. Toque em um álbum para abri-lo.";
  },

  openGaleriaPhoto() {
    document.getElementById("gal-photos-screen").classList.add("hidden");
    document.getElementById("gal-main-header").classList.add("hidden");
    document.getElementById("gal-fullscreen-screen").classList.remove("hidden");

    document.getElementById("gal-step-label").innerText = "Passo 4:";
    document.getElementById("gal-step-text").innerText =
      "Você abriu a foto! Tente explorar os botões de Compartilhar ou Apagar abaixo.";
  },

  closeGaleriaPhoto() {
    document.getElementById("gal-fullscreen-screen").classList.add("hidden");
    document.getElementById("gal-main-header").classList.remove("hidden");
    document.getElementById("gal-photos-screen").classList.remove("hidden");

    document.getElementById("gal-step-label").innerText = "Passo 3:";
    document.getElementById("gal-step-text").innerText =
      "Estas são as fotos deste álbum. Toque em uma foto para abri-la maior.";
  },

  galeriaAction(action) {
    if (action === "Apagar") {
      alert(
        "No mundo real, tocar na lixeira apagaria a foto. Em alguns celulares, ela vai para uma lixeira onde pode ser recuperada em até 30 dias.",
      );
    } else if (action === "Compartilhar") {
      alert(
        "Compartilhar abriria seus contatos do WhatsApp ou E-mail para você enviar esta foto para alguém.",
      );
    } else if (action === "Editar") {
      alert(
        "Aqui você poderia cortar a foto, deixá-la mais clara ou aplicar filtros!",
      );
    }
  },
};
