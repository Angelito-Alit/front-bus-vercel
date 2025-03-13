import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../Layouts/MainLayout';
import busService from '../../services/busService';

const { Title } = Typography;

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBusId, setEditingBusId] = useState(null);
  
  useEffect(() => {
    fetchBuses();
  }, []);
  
  const fetchBuses = async () => {
    try {
      const response = await busService.getAllBuses();
      setBuses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching buses:', error);
      message.error('Error al cargar los autobuses');
      setLoading(false);
    }
  };
  
  const showModal = (bus = null) => {
    if (bus) {
      setEditingBusId(bus._id);
      form.setFieldsValue({
        numeroPlaca: bus.numeroPlaca,
        numeroUnidad: bus.numeroUnidad,
        capacidad: bus.capacidad
      });
    } else {
      setEditingBusId(null);
      form.resetFields();
    }
    setModalVisible(true);
  };
  
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingBusId) {
        await busService.updateBus(editingBusId, values);
        message.success('Autobús actualizado correctamente');
      } else {
        await busService.createBus(values);
        message.success('Autobús creado correctamente');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchBuses();
    } catch (error) {
      console.error('Error saving bus:', error);
      message.error('Error al guardar el autobús');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await busService.deleteBus(id);
      message.success('Autobús eliminado correctamente');
      fetchBuses();
    } catch (error) {
      console.error('Error deleting bus:', error);
      message.error('Error al eliminar el autobús');
    }
  };
  
  const columns = [
    {
      title: 'Número de Placa',
      dataIndex: 'numeroPlaca',
      key: 'numeroPlaca',
    },
    {
      title: 'Número de Unidad',
      dataIndex: 'numeroUnidad',
      key: 'numeroUnidad',
    },
    {
      title: 'Capacidad',
      dataIndex: 'capacidad',
      key: 'capacidad',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            style={{ marginRight: '8px' }}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este autobús?"
            onConfirm={() => handleDelete(record._id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];
  
  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={2}>Gestión de Autobuses</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{ backgroundColor: '#004D61', borderColor: '#004D61' }}
          >
            Nuevo Autobús
          </Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={buses} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
        
        <Modal
          title={editingBusId ? "Editar Autobús" : "Nuevo Autobús"}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText={editingBusId ? "Actualizar" : "Crear"}
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="numeroPlaca"
              label="Número de Placa"
              rules={[{ required: true, message: 'Por favor ingresa el número de placa' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="numeroUnidad"
              label="Número de Unidad"
              rules={[{ required: true, message: 'Por favor ingresa el número de unidad' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="capacidad"
              label="Capacidad"
              rules={[{ required: true, message: 'Por favor ingresa la capacidad' }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminBuses;