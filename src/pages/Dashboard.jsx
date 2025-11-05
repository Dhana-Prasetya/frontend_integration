import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import api from '../api/api';

function Dashboard() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ title: '', description: '' });
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const res = await api.get('/items', {
        headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (editId) {
        await api.put(`/items/${editId}`, form, {
            headers: { Authorization: `Bearer ${token}` },
        });
        } else {
        await api.post('/items', form, {
            headers: { Authorization: `Bearer ${token}` },
        });
        }
        setForm({ title: '', description: '' });
        setEditId(null);
        setShow(false);
        fetchData();
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        await api.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
    };

    const handleEdit = (item) => {
        setForm({ title: item.title, description: item.description });
        setEditId(item.id);
        setShow(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Dashboard</h3>
            <Button onClick={() => setShow(true)}>Tambah Data</Button>
        </div>

        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, i) => (
                <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                    <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(item)}
                    >
                    Edit
                    </Button>
                    <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                    >
                    Hapus
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>

        <Modal show={show} onHide={() => setShow(false)} centered>
            <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Data' : 'Tambah Data'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label>Judul</Form.Label>
                <Form.Control
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Batal
            </Button>
            <Button variant="primary" onClick={handleSave}>
                Simpan
            </Button>
            </Modal.Footer>
        </Modal>
        </Container>
    );
}

export default Dashboard;
