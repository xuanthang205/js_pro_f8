const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal(options = {}) {
  const { templateId, destroyOnClose = true, cssClass = [], closeMethods = ["button", "overlay", "escape"], onOpen, onClose, footer = false } = options;
  const template = $(`#${templateId}`);

  if (!template) {
    console.error(`#${templateId} không tồn tại`);
    return;
  }

  this._allowButtonClose = closeMethods.includes("button");
  this._allowBackdropClose = closeMethods.includes("overlay");
  this._allowEscapeClose = closeMethods.includes("escape");

  function getScrollbarWidth() {
    if (getScrollbarWidth.value) {
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

  this._build = () => {
    const content = template.content.cloneNode(true);

    // Create modal elements
    this._backdrop = document.createElement("div");
    this._backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    cssClass.forEach((className) => {
      if (typeof className === "string") {
        container.classList.add(className);
      }
    });

    if (this._allowButtonClose) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "modal-close";
      closeBtn.innerHTML = "&times;";

      container.append(closeBtn);

      closeBtn.onclick = () => this.close();
    }

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append content and element
    modalContent.append(content);
    container.append(modalContent);

    if (footer) {
      this._modalFooter = document.createElement("div");
      this._modalFooter.className = "modal-footer";

      if (this._setFooterContent) {
        this._modalFooter.innerHTML = this._setFooterContent;
      }

      container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
  };

  this.setFooterContent = html => {
    this._setFooterContent = html;
    if (this._modalFooter) {
      this._modalFooter.innerHTML = html;
    }
  }

  this.open = () => {
    if (!this._backdrop) {
      this._build();
    }

    setTimeout(() => {
      this._backdrop.classList.add("show");
    }, 0);

    // Attack event listeners
    if (this._allowBackdropClose) {
      this._backdrop.onclick = (e) => {
        if (e.target === this._backdrop) {
          this.close();
        }
      };
    }

    if (this._allowEscapeClose) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close();
        }
      });
    }

    // Disable scrolling
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = getScrollbarWidth() + "px";

    this._onTransitionEnd(() => {
      if (typeof onOpen === "function") onOpen();
    });

    return this._backdrop;
  };

  this._onTransitionEnd = (callback) => {
    this._backdrop.ontransitionend = (e) => {
      if (e.propertyName !== "transform") return;
      if (typeof callback === "function") callback();
    };

    this.close = (destroy = destroyOnClose) => {
      this._backdrop.classList.remove("show");
      this._onTransitionEnd(() => {
        if (this._backdrop && destroy) {
          this._backdrop.remove();
          this._backdrop = null;
          this._modalFooter = null;
        }

        // Enable scrolling
        document.body.classList.remove("no-scroll");
        document.body.style.paddingRight = "";

        if (typeof onClose === "function") onClose();
      });
    };
  };

  this.destroy = () => {
    this.close(true);
  };
}

const modal1 = new Modal({
  templateId: "modal-1",
  destroyOnClose: false,
  onOpen: () => {
    console.log("Modal 1 opened");
  },
  onClose: () => {
    console.log("Modal 1 closed");
  },
});

$("#open-modal-1").onclick = () => {
  const modalElement = modal1.open();

  // modal1.close()
};

const modal2 = new Modal({
  templateId: "modal-2",
  // closeMethods: ["button", "escape"],
  cssClass: ["class1", "class2", "class3"],
  onOpen: () => {
    console.log("Modal 2 opened");
  },
  onClose: () => {
    console.log("Modal 2 closed");
  },
});

$("#open-modal-2").onclick = () => {
  const modalElement = modal2.open();

  // modal2.close()

  const form = modalElement.querySelector("#login-form");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = {
        email: $("#email").value.trim(),
        password: $("#password").value.trim(),
      };

      console.log(formData);
    };
  }
};

const modal3 = new Modal({
  templateId: "modal-3",
  footer: true,
  onOpen: () => {
    console.log("Modal 3 opened");
  },
  onClose: () => {
    console.log("Modal 3 closed");
  },
});

$("#open-modal-3").onclick = () => {
  const modalElement = modal3.open();
};

modal3.setFooterContent(`
  <button class="modal-btn modal-btn-secondary" id="modal-cancel-btn">Hủy</button>
  <button class="modal-btn modal-btn-primary" id="modal-confirm-btn">Xác nhận</button>
`);
