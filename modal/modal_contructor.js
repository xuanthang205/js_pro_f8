const $ = document.querySelector.bind(document);
// .bind(document) tạo 1 hàm mới với this là document -> $ tương ứng với document.querySelector (có this là document)
const $$ = document.querySelectorAll.bind(document);

function Modal(options = {}) {
  const { templateId, destroyOnclose = true, closeMethods = ["button", "overlay", "escape"], cssClass = [], onOpen, onClose, footer = false } = options;
  const template = $(`#${templateId}`);

  if (!template) {
    console.error(`#${templateId} not found.`);
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

    // Create nodal elements
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
    modalContent.className = "modal-modalContent";

    // Append content and elements
    modalContent.appendChild(content);
    container.append(modalContent);

    if(footer) {
      const modalFooter = document.createElement("div");
      modalFooter.className = "modal-footer";
      modalFooter.innerHTML = "Footer content";
      container.append(modalFooter)
    }

    this._backdrop.appendChild(container);
    document.body.appendChild(this._backdrop);
  };

  this.open = () => {
    if (!this._backdrop) {
      this._build();
    }

    setTimeout(() => {
      this._backdrop.classList.add("show");
    }, 0);

    // Attach event listeners
    if (this._allowBackdropClose) {
      this._backdrop.onclick = (e) => {
        if (e.target === this._backdrop) {
          this.close();
        }
      };
    }

    if (this._allowEscapeClose) {
      document.onkeydown = (e) => {
        if (e.key === "Escape") {
          this.close();
        }
      };
    }

    // Disable scroll when modal is open
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = `${getScrollbarWidth()}px`;

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
  };

  this.close = (destroy = destroyOnclose) => {
    this._backdrop.classList.remove("show");

    this._onTransitionEnd(() => {
      if (this._backdrop && destroy) {
        this._backdrop.remove();
        this._backdrop = null;
      }

      // Enable scroll when modal is closed
      document.body.classList.remove("no-scroll");
      document.body.style.paddingRight = "";

      if (typeof onClose === "function") onClose();
    });
  };

  this.destroy = () => {
    this.close(true);
  };
}

const modal1 = new Modal({
  templateId: "modal-1",
  destroyOnclose: false,
  onOpen: () => {
    console.log("Modal 1 opened");
  },
  onClose: () => {
    console.log("Modal 1 closed");
  },
});

$("#open-modal-1").onclick = function () {
  const modalElement = modal1.open();
};

const modal2 = new Modal({
  templateId: "modal-2",
  closeMethods: ["button", "escape"],
  destroyOnclose: false,
  cssClass: ["cl1", "cl2"],
  onOpen: () => {
    console.log("Modal 2 opened");
  },
  onClose: () => {
    console.log("Modal 2 closed");
  },
  footer: true,
});

$("#open-modal-2").onclick = function () {
  const modalElement = modal2.open();
};
