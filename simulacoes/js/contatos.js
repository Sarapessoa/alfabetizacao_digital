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
    const name = document.getElementById("cnt-input-name").value;
    const phone = document.getElementById("cnt-input-phone").value;

    if (name.trim() === "" || phone.trim() === "") {
      alert("Por favor, digite pelo menos um nome e um número para salvar!");
      return;
    }

    alert(
      `Parabéns! Você salvou o contato de "${name}" com sucesso na sua agenda digital.`,
    );

    document.getElementById("cnt-input-name").value = "";
    document.getElementById("cnt-input-phone").value = "";
    this.closeAddContato();

    document.getElementById("cnt-step-label").innerText = "Muito bem!";
    document.getElementById("cnt-step-text").innerText =
      "O contato foi salvo. No mundo real, ele já apareceria no seu WhatsApp automaticamente!";
  },
};
