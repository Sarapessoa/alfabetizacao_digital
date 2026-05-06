import { data } from "./data.js";

export const dataHandler = {
  // Lógica de pesquisa para os Aplicativos
  searchTutoriais(query) {
    const searchTerm = query.toLowerCase().trim();
    const filteredList = data.apps.filter(
      (appItem) =>
        appItem.name.toLowerCase().includes(searchTerm) ||
        appItem.desc.toLowerCase().includes(searchTerm)
    );
    this.renderTutoriais(filteredList);
  },

  renderTutoriais(list = data.apps) {
    const container = document.getElementById("tutoriais-list");
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `<p class="text-center text-muted mt-lg" style="font-size: 16px;">Nenhum aplicativo encontrado com esse nome.</p>`;
      return;
    }

    container.innerHTML = list
      .map(
        (appItem) => `
            <div class="card card-interactive" onclick="app.openTutorial('${appItem.id}')" style="display: flex; gap: 16px; align-items: center;">
                <div class="icon-circle" style="background-color: ${appItem.color}; margin: 0; width: 50px; height: 50px;">
                    <span class="material-symbols-outlined" style="font-size: 24px;">${appItem.icon}</span>
                </div>
                <div>
                    <h3 style="font-size: 18px;">${appItem.name}</h3>
                    <div class="old-tech-badge">${appItem.oldTech}</div>
                </div>
                <span class="material-symbols-outlined" style="margin-left: auto; color: #9ca3af;">chevron_right</span>
            </div>
        `,
      )
      .join("");
  },

  generateGlossarioHTML(list) {
    return list
      .map(
        (item) => `
        <div class="card" style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 12px;">
            <div class="icon-circle" style="background-color: ${item.color}; margin: 0; width: 48px; height: 48px; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="font-size: 24px;">${item.icon}</span>
            </div>
            <div>
                <h3 style="font-size: 18px; color: #1f2937; margin-bottom: 4px;">${item.term}</h3>
                <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">${item.definition}</p>
            </div>
        </div>
    `,
      )
      .join("");
  },

  openGlossarioCategory(category) {
    if (category === "all") {
      document.getElementById("glossario-category-title").innerText =
        "Todos os Símbolos";
      const basic = data.glossario.filter((item) => item.category === "basic");
      const navigation = data.glossario.filter(
        (item) => item.category === "navigation",
      );
      const security = data.glossario.filter(
        (item) => item.category === "security",
      );
      const social = data.glossario.filter(
        (item) => item.category === "social",
      );
      let groupedHTML = "";
      const titleStyle =
        "margin: 24px 0 12px; color: #374151; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;";

      if (basic.length > 0) {
        groupedHTML += `<h4 style="${titleStyle}">Símbolos Básicos</h4>`;
        groupedHTML += this.generateGlossarioHTML(basic);
      }
      if (navigation.length > 0) {
        groupedHTML += `<h4 style="${titleStyle}">Navegação</h4>`;
        groupedHTML += this.generateGlossarioHTML(navigation);
      }
      if (security.length > 0) {
        groupedHTML += `<h4 style="${titleStyle}">Segurança e Proteção</h4>`;
        groupedHTML += this.generateGlossarioHTML(security);
      }
      if (social.length > 0) {
        groupedHTML += `<h4 style="${titleStyle}">Redes Sociais</h4>`;
        groupedHTML += this.generateGlossarioHTML(social);
      }

      document.getElementById("glossario-category-content").innerHTML =
        groupedHTML;
      document
        .getElementById("glossario-detail-view")
        .classList.remove("hidden");
    } else {
      const filteredList = data.glossario.filter(
        (item) => item.category === category,
      );
      let title = "";

      switch (category) {
        case "basic":
          title = "Símbolos Básicos";
          break;
        case "social":
          title = "Comunicação e Redes Sociais";
          break;
        case "navigation":
          title = "Navegação (Como se mover no celular)";
          break;
        case "security":
          title = "Segurança e Proteção";
          break;
        default:
          title = "Glossário";
      }

      document.getElementById("glossario-category-title").innerText = title;
      document.getElementById("glossario-category-content").innerHTML =
        this.generateGlossarioHTML(filteredList);
      document
        .getElementById("glossario-detail-view")
        .classList.remove("hidden");
    }
  },

  closeGlossarioCategory() {
    document.getElementById("glossario-detail-view").classList.add("hidden");
  },

  searchGlossario(query) {
    const searchTerm = query.toLowerCase().trim();
    const categoriesDiv = document.getElementById("glossario-categories");
    const resultsDiv = document.getElementById("glossario-search-results");

    if (searchTerm === "") {
      categoriesDiv.classList.remove("hidden");
      resultsDiv.classList.add("hidden");
      return;
    }

    const filteredList = data.glossario.filter(
      (item) =>
        item.term.toLowerCase().includes(searchTerm) ||
        item.definition.toLowerCase().includes(searchTerm),
    );

    categoriesDiv.classList.add("hidden");
    resultsDiv.classList.remove("hidden");

    resultsDiv.innerHTML =
      filteredList.length === 0
        ? `<p class="text-center text-muted mt-lg">Nenhum símbolo encontrado para "${query}".</p>`
        : this.generateGlossarioHTML(filteredList);
  },

  renderGlossario() {},

  // Lógica de pesquisa para os Golpes
  searchGolpes(query) {
    const searchTerm = query.toLowerCase().trim();
    const filteredList = data.golpes.filter(
      (golpe) =>
        golpe.name.toLowerCase().includes(searchTerm) ||
        golpe.alert.toLowerCase().includes(searchTerm)
    );
    this.renderGolpes(filteredList);
  },

  renderGolpes(list = data.golpes) {
    const container = document.getElementById("golpes-grid");
    if (!container) return;

    // Forçamos o contêiner a ser uma coluna única
    container.className = "flex-col";

    if (list.length === 0) {
      container.innerHTML = `<p class="text-center text-muted mt-lg" style="font-size: 16px;">Nenhum golpe encontrado com essa palavra.</p>`;
      return;
    }

    container.innerHTML = list
      .map(
        (golpe) => `
            <div class="card" style="padding: 0; border: 2px solid #ef4444; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 32px;">

                <div style="background-color: #ef4444; color: white; padding: 16px; display: flex; align-items: center; gap: 12px;">
                    <span class="material-symbols-outlined" style="font-size: 32px;">security_update_warning</span>
                    <h3 style="margin: 0; font-size: 20px; line-height: 1.2;">${golpe.name}</h3>
                </div>

                <div style="padding: 20px;">
                    <p style="font-size: 16px; color: #374151; margin-bottom: 20px; line-height: 1.5;">
                        <strong>Atenção:</strong> ${golpe.alert}
                    </p>

                    <div style="background-color: #fef2f2; border-left: 5px solid #ef4444; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
                        <strong style="color: #991b1b; display: flex; align-items: center; gap: 8px; font-size: 16px; margin-bottom: 12px;">
                            <span class="material-symbols-outlined">record_voice_over</span>
                            Frases suspeitas (Desconfie):
                        </strong>
                        <ul style="color: #b91c1c; font-size: 15px; padding: 0; margin: 0; list-style: none; display: flex; flex-direction: column; gap: 10px;">
                            ${golpe.exemplos.map((exemplo) => `
                                <li style="display: flex; gap: 8px; align-items: flex-start;">
                                    <span class="material-symbols-outlined" style="font-size: 20px; flex-shrink: 0;">close</span>
                                    <span style="line-height: 1.4;">${exemplo}</span>
                                </li>
                            `).join("")}
                        </ul>
                    </div>

                    <div style="background-color: #f0fdf4; border-left: 5px solid #22c55e; padding: 16px; border-radius: 6px;">
                        <strong style="color: #166534; display: flex; align-items: center; gap: 8px; font-size: 16px; margin-bottom: 12px;">
                            <span class="material-symbols-outlined">verified_user</span>
                            Como se proteger:
                        </strong>
                        <ul style="color: #15803d; font-size: 15px; padding: 0; margin: 0; list-style: none; display: flex; flex-direction: column; gap: 10px;">
                            ${golpe.tips.map((tip) => `
                                <li style="display: flex; gap: 8px; align-items: flex-start;">
                                    <span class="material-symbols-outlined" style="font-size: 20px; flex-shrink: 0;">check</span>
                                    <span style="line-height: 1.4;">${tip}</span>
                                </li>
                            `).join("")}
                        </ul>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  },

  openTutorial(appId) {
    const appData = data.apps.find((a) => a.id === appId);
    if (!appData) return;

    const header = document.getElementById("detail-header");
    header.style.backgroundColor = appData.color;
    document.getElementById("detail-title").innerText = appData.name;
    document.getElementById("detail-icon").innerHTML =
      `<span class="material-symbols-outlined" style="color: ${appData.color}">${appData.icon}</span>`;

    const content = document.getElementById("detail-content");
    content.innerHTML = `
            <div class="card mb-lg" style="border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e3a8a; margin-bottom: 8px;">Conectando ao que Você Conhece</h3>
                <p><strong>Comparação:</strong> ${appData.oldTech}</p>
                <p style="margin-top: 8px;">${appData.tutorial || "Tutorial detalhado em construção."}</p>
            </div>

            <h2 class="mb-md">Passo a Passo</h2>
            <div class="card mb-md">
                <h3 class="flex-center gap-sm mb-md">
                  <span style="background: ${appData.color}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">1</span>
                  Abra o Aplicativo
                </h3>
                <p>Procure o ícone na sua tela inicial e toque no botão abaixo para começar.</p>
            </div>

            <button
                class="btn w-full mt-md btn-large"
                style="background-color: ${appData.color}; color: white;"
                onclick="app.startAppSimulation('${appData.id}')"
            >
                <span class="material-symbols-outlined">play_arrow</span> Iniciar Simulação Prática
            </button>
        `;

    document.getElementById("tutorial-detail-view").classList.remove("hidden");
  },

  closeTutorial() {
    document.getElementById("tutorial-detail-view").classList.add("hidden");
  },
};
