export const contatos = {
  openAddContato() {
    document.getElementById("cnt-list-screen").classList.add("hidden");
    document.getElementById("cnt-add-screen").classList.remove("hidden");

    document.getElementById("cnt-step-label").innerText = "Passo 2:";
    document.getElementById("cnt-step-text").innerText =
      "Toque nos campos para digitar o Nome e o Telefone. Depois, toque em 'Salvar' lá em cima.";
  },

  closeAddContato() {
    document.getElementById("cnt-add-screen").classList.add("hidden");
    document.getElementById("cnt-list-screen").classList.remove("hidden");
  },

  saveContato() {
    const nameInput = document.getElementById("cnt-input-name");
    const phoneInput = document.getElementById("cnt-input-phone");
    const name = nameInput.value;
    const phone = phoneInput.value;

    if (name.trim() === "" || phone.trim() === "") {
      alert("Por favor, digite pelo menos um nome e um número para salvar!");
      return;
    }
    const scrollArea = document.querySelector(".cnt-scroll-area");
    const newContactDiv = document.createElement("div");
    newContactDiv.className = "cnt-item";
    const primeiraLetra = name.trim().charAt(0).toUpperCase();
    newContactDiv.innerHTML = `
      <div class="cnt-avatar bg-gray">${primeiraLetra}</div>
      <span>${name}</span>
    `;
    scrollArea.appendChild(newContactDiv);
    alert(
      `Parabéns! Você salvou o contato de "${name}" com sucesso na sua agenda digital.`,
    );
    nameInput.value = "";
    phoneInput.value = "";
    this.closeAddContato();
    document.getElementById("cnt-step-label").innerText = "Muito bem!";
    document.getElementById("cnt-step-text").innerText =
      "O contato foi salvo e já aparece na sua agenda! No mundo real, ele também apareceria no seu WhatsApp automaticamente.";
  },
};
