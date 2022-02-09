import React, { useEffect, useRef, useState } from "react";
import styles from "../../scss/layout/modal.module.scss";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { setShowModal } from "../../store/actions/userAction";

function mapStateToProps({ userReducer }) {
  return {
    showModal: userReducer.showModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowModal: () => dispatch(setShowModal(false)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Modal);

function Modal({ showModal, setShowModal, children }) {
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

  const modalContent = showModal ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper} tabIndex={-1} ref={modalWrapperRef}>
        <div className={styles.modal}>
          <div className={styles.close}>
            <a href="#" onClick={setShowModal}>
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
