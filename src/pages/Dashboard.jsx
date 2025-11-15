import React, { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import api from '../api/api';
import ModalCreate from '../components/ModalCreate';
import ModalDelete from '../components/ModalDelete';

function Dashboard() {
    const [items, setItems] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const res = await api.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
        });

        const payload = res && res.data;
        let list = [];
        if (Array.isArray(payload)) {
            list = payload;
        } else if (payload) {
            if (Array.isArray(payload.data)) list = payload.data;
            else if (Array.isArray(payload.products)) list = payload.products;
        }

        if (!Array.isArray(list)) {
            // Fallback: coerce to empty array and log unexpected payload for debugging
            console.warn('Unexpected /products response shape, expected array. Response:', res.data);
            list = [];
        }

        setItems(list);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setShowCreate(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Dashboard</h3>
                <Button onClick={() => { setEditItem(null); setShowCreate(true); }}>Tambah Data</Button>
            </div>

            <ModalCreate
                show={showCreate}
                handleClose={() => setShowCreate(false)}
                item={editItem}
                onSaved={() => { setShowCreate(false); fetchData(); }}
            />

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
                        <ModalDelete
                            id={item.id}
                            name={item.name || item.title}
                            onDeleted={fetchData}
                        />
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {/* Creation/edit modal handled by ModalCreate component above */}
        </Container>
    );
}

export default Dashboard;
