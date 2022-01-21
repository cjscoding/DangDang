import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "../../scss/layout/modal.module.scss";

export default function Modal({ show, onClose, children }) {
  // const [isBrowser, setIsBrowser] = useState(true);
  const modalWrapperRef = useRef();
  const modalOverlayRef = useRef();

  const closeHandler = (event) => {
    event.preventDefault();
    onClose();
  };

  const backDropHandler = (event) => {
    console.log(event.target);
    console.log(event.currentTarget);
    console.log(modalWrapperRef.current);
    if (modalWrapperRef?.current?.contains(event.target)) {
      event.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    // setIsBrowser(true);
    // window.addEventListener("click", backDropHandler);
    // return () => {
    //   window.removeEventListener("click", backDropHandler);
    // };
  }, []);

  const modalContent = show ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper} tabIndex={-1} ref={modalWrapperRef}>
        <div className={styles.modal}>
          <div className="modal-header">
            <a href="#" onClick={closeHandler}>
              [ 닫기버튼 ]
            </a>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  ) : null;

  if (typeof window !== "undefined") {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else return null;
}
