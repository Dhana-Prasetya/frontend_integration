import React, { Fragment, useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import api from '../api/api';

const ModalCreate = ({ show, handleClose, item, onSaved }) => {
    const onClose = handleClose || (() => {});

    const [saveImage, setSaveImage]  = useState(null); // State to hold uploaded image file
    const [data, setData] = useState({ // State to hold form data
        name: "",
        stock: "",
        price: "",
        description: "",
    });

    const handleUpload = (e) => {
        const uploader = e.target.files[0];
        setSaveImage(uploader);
    }

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    // Prefill form when editing
    useEffect(() => {
        if (item) {
            setData({
                name: item.name || item.title || "",
                stock: item.stock || "",
                price: item.price || "",
                description: item.description || "",
            });
        } else {
            setData({ name: "", stock: "", price: "", description: "" });
            setSaveImage(null);
        }
    }, [item, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("stock", data.stock);
        formData.append("price", data.price);
        if (saveImage) formData.append("photo", saveImage);
        formData.append("description", data.description);

        try {
            if (item && item.id) {
                // Edit existing
                await api.put(`/products/${item.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert('Produk berhasil diperbarui!');
            } else {
                // Create new
                await api.post('/products', formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert('Produk berhasil ditambahkan!');
            }
            if (typeof onSaved === 'function') onSaved();
            onClose();
        } catch (err) {
            console.error('save error', err);
            alert('Operasi gagal. Periksa konsol untuk detail.');
        }
    };

    return (
        <Fragment>
            <Modal show={show} onHide={onClose} animation={false}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Modal.Header closeButton>
                        <Modal.Title>{item ? 'Edit Produk' : 'Tambah Produk'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            className="form-control mt-3"
                            type="text"
                            placeholder="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                        />
                        <input
                            className="form-control mt-3"
                            type="text"
                            placeholder="stock"
                            name="stock"
                            value={data.stock}
                            onChange={handleChange}
                        />
                        <input
                            className="form-control mt-3"
                            type="text"
                            placeholder="price"
                            name="price"
                            value={data.price}
                            onChange={handleChange}
                        />
                        <input
                            className="form-control mt-3"
                            type="file"
                            placeholder="photo"
                            name="photo"
                            onChange={handleUpload}
                        />
                        <input
                            className="form-control mt-3"
                            type="text"
                            placeholder="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary">
                            {item ? 'Simpan' : 'Buat'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </Fragment>
    );
}

export default ModalCreate
