import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "../../scss/layout/modal.module.scss";

export default function Modal({ show, onClose, children }) {
  const modalWrapperRef = useRef();

  const closeHandler = (event) => {
    event.preventDefault();
    onClose();
  };

  const backDropHandler = (event) => {
    console.log(event.target);
    // console.log(event.currentTarget);
    console.log(modalWrapperRef.current);
    if (!modalWrapperRef?.current?.contains(event.target)) {
      event.preventDefault();
      onClose();
    }
  };

  // useEffect(() => {
  //   console.log("컴포넌트 생성!");
  //   // return () => console.log("컴포넌트 삭제!");
  //   // setIsBrowser(true);
  //   window.addEventListener("click", backDropHandler);
  //   return () => {
  //     window.removeEventListener("click", backDropHandler);
  //     console.log("컴포넌트 삭제!");
  //   };
  // }, []);

  const modalContent = show ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper} tabIndex={-1} ref={modalWrapperRef}>
        <div className={styles.modal}>
          <div className={styles.close}>
            <a href="#" onClick={closeHandler}>
              [ X ]
            </a>
          </div>
          <div className={styles.modalBody}>{children}</div>
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
