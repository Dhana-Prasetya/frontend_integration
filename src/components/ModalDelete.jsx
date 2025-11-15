import React, { Fragment, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import api from '../api/api';

const ModalDelete = ({ id, name, onDeleted }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            await api.delete(`/products/${id}`);
            alert('Delete successful');
            setShow(false);
            if (typeof onDeleted === 'function') onDeleted();
        } catch (err) {
            console.error('delete failed', err);
            alert('Delete failed');
            setShow(false);
        }
    };

    return (
        <Fragment>
            <button
                className="btn btn-danger"
                style={{ marginRight: "10px" }}
                onClick={handleShow}
            >
                Delete Product
            </button>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are sure want to delete product '{name}'?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default ModalDelete