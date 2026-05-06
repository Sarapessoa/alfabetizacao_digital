export const configuracoes = {
  openConfigScreen(screenId) {
    document.getElementById("cfg-main-screen").classList.add("hidden");
    document.getElementById("cfg-back-btn").classList.remove("hidden");

    if (screenId === 'wifi') {
      document.getElementById("cfg-wifi-screen").classList.remove("hidden");
      document.getElementById("cfg-main-title").innerText = "Wi-Fi";
      document.getElementById("cfg-step-label").innerText = "Wi-Fi:";
      document.getElementById("cfg-step-text").innerText = "Toque no botão azul para ligar/desligar, ou toque numa rede para conectar.";
    } else if (screenId === 'font') {
      document.getElementById("cfg-font-screen").classList.remove("hidden");
      document.getElementById("cfg-main-title").innerText = "Tamanho da Fonte";
      document.getElementById("cfg-step-label").innerText = "Visor:";
      document.getElementById("cfg-step-text").innerText = "Arraste a bolinha na barra para ver a letra do texto aumentar ou diminuir.";
    }
  },

  backToConfigMain() {
    document.getElementById("cfg-wifi-screen").classList.add("hidden");
    document.getElementById("cfg-font-screen").classList.add("hidden");
    
    document.getElementById("cfg-main-screen").classList.remove("hidden");
    document.getElementById("cfg-back-btn").classList.add("hidden");
    document.getElementById("cfg-main-title").innerText = "Configurações";

    document.getElementById("cfg-step-label").innerText = "Passo 1:";
    document.getElementById("cfg-step-text").innerText = "Você está nas Configurações. Escolha 'Wi-Fi' para ver a internet, ou 'Visor' para mudar a letra.";
  },

  toggleWifi(checkbox) {
    const networksDiv = document.getElementById("cfg-wifi-networks");
    if (checkbox.checked) {
      networksDiv.style.opacity = "1";
      networksDiv.style.pointerEvents = "auto";
      document.getElementById("cfg-step-text").innerText = "Você ligou o Wi-Fi! Agora o celular pode achar redes de internet próximas.";
    } else {
      networksDiv.style.opacity = "0.3";
      networksDiv.style.pointerEvents = "none";
      document.getElementById("cfg-step-text").innerText = "Você desligou o Wi-Fi. O celular não vai gastar bateria procurando redes, mas você ficará sem internet se não tiver 4G.";
    }
  },

  connectWifi(networkName) {
    alert(`No mundo real, se você tocar em "${networkName}", o celular pedirá a senha da rede (se tiver um cadeado) ou conectará direto.`);
  },

  changeFontSize(value) {
    const previewText = document.getElementById("cfg-preview-text");
    previewText.style.fontSize = value + "px";
    
    if (value >= 22) {
      document.getElementById("cfg-step-text").innerText = "Ótimo! Viu como o texto no quadro acima ficou muito mais fácil de ler?";
    }
  },

  fakeConfigAction(action) {
    alert(`A seção de ${action} ainda está em construção na nossa simulação!`);
  }
};