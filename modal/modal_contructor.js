const $ = document.querySelector.bind(document);
// .bind(document) tạo 1 hàm mới với this là document -> $ tương ứng với document.querySelector (có this là document)
const $$ = document.querySelectorAll.bind(document);

function Modal() {
  function getScrollbarWidth() {
    if(getScrollbarWidth.value) {
      return getScrollbarWidth.value;
    }

    const div = document.createElement("div");
    Object.assign(div.style, {
      overflow: "scroll",
      position: "absolute",
      top: "-9999px",
    });
    document.body.appendChild(div);
    const scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    getScrollbarWidth.value = scrollbarWidth;

    return scrollbarWidth;
  }

  this.openModal = (options = {}) => {
    const { templateId, allowBackdropClose = true } = options;
    const template = $(`#${templateId}`);

    if (!template) {
      console.error(`#${templateId} not found.`);
      return;
    }

    const content = template.content.cloneNode(true);

    // Create nodal elements
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "&times;";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-modalContent";

    // Append content and elements
    modalContent.appendChild(content);
    container.append(closeBtn, modalContent);
    backdrop.appendChild(container);
    document.body.appendChild(backdrop);

    setTimeout(() => {
      backdrop.classList.add("show");
    }, 0);

    // Attach event listeners
    closeBtn.onclick = () => this.closeModal(backdrop);

    backdrop.onclick = (e) => {
      if (e.target === backdrop && allowBackdropClose) {
        this.closeModal(backdrop);
      }
    };

    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    };

    // Disable scroll when modal is open
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = `${getScrollbarWidth()}px`;

    return backdrop;
  };

  this.closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    modalElement.ontransitionend = () => {
      modalElement.remove();

      // Enable scroll when modal is closed
      document.body.classList.remove("no-scroll");
      document.body.style.paddingRight = "";
    };
  };
}

const modal = new Modal();

// modal.openModal("<h1>Hello World!</h1>");

$("#open-modal-1").onclick = function () {
  modal.openModal({
    templateId: "modal-1",
  });
};

$("#open-modal-2").onclick = function () {
  const modalElement = modal.openModal({
    templateId: "modal-2",
    allowBackdropClose: false,
  });

  const form = modalElement.querySelector("#login-form");
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();
      const data = {
        email: $("#email").value.trim(),
        password: $("#password").value.trim(),
      };
      console.log(data);
    };
  }
};

// $("#open-modal-3").onclick = function () {
//   modal.openModal("<h1>Hello World!</h1><p>This is a simple modal 3.</p>");
// }
