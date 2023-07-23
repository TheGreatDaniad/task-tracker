import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
export interface Props {
  title?: string;
  description?: string;
  setShow?: (show: boolean) => void;
  initShow?: boolean;
  handleConfirm?: () => void;
}

export default function CustomModal({
  title,
  description,
  initShow,
  handleConfirm,
  setShow,
}: Props) {
  //@ts-ignore
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={initShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{description}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            className=""
            onClick={() => {
              //@ts-ignore
              handleConfirm();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
