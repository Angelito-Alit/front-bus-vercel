import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, InputNumber, Select, message, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import MainLayout from '../../Layouts/MainLayout';
import tripService from '../../services/tripService';
import busService from '../../services/busService';

const { Title } = Typography;
const { Option } = Select;

const AdminRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRouteId, setEditingRouteId] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [routesResponse, busesResponse] = await Promise.all([
        tripService.getAllTrips(),
        busService.getAllBuses()
      ]);
      
      setRoutes(routesResponse.data);
      setBuses(busesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Error al cargar los datos');
      setLoading(false);
    }
  };
  
  const showModal = (route = null) => {
    if (route) {
      setEditingRouteId(route._id);
      form.setFieldsValue({
        origen: route.origen,
        destino: route.destino,
        fecha: moment(route.fecha),
        hora: route.hora ? moment(route.hora, 'HH:mm') : null,
        precio: route.precio,
        busId: route.bus._id
      });
    } else {
      setEditingRouteId(null);
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
      
      const routeData = {
        origen: values.origen,
        destino: values.destino,
        fecha: values.fecha.format('YYYY-MM-DD'),
        hora: values.hora.format('HH:mm'),
        precio: values.precio,
        busId: values.busId
      };
      
      if (editingRouteId) {
        await tripService.updateTrip(editingRouteId, routeData);
        message.success('Ruta actualizada correctamente');
      } else {
        await tripService.createTrip(routeData);
        message.success('Ruta creada correctamente');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error('Error saving route:', error);
      message.error('Error al guardar la ruta');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await tripService.deleteTrip(id);
      message.success('Ruta eliminada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error deleting route:', error);
      message.error('Error al eliminar la ruta');
    }
  };
  
  const columns = [
    {
      title: 'Origen',
      dataIndex: 'origen',
      key: 'origen',
    },
    {
      title: 'Destino',
      dataIndex: 'destino',
      key: 'destino',
    },
    {
      title: 'Fecha',
      key: 'fecha',
      render: (_, record) => new Date(record.fecha).toLocaleDateString(),
    },
    {
      title: 'Hora',
      dataIndex: 'hora',
      key: 'hora',
    },
    {
      title: 'Precio',
      key: 'precio',
      render: (_, record) => `$${record.precio}`,
    },
    {
      title: 'Autobús',
      key: 'bus',
      render: (_, record) => record.bus?.numeroUnidad || 'N/A',
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
            title="¿Estás seguro de eliminar esta ruta?"
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
          <Title level={2}>Gestión de Rutas</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{ backgroundColor: '#004D61', borderColor: '#004D61' }}
          >
            Nueva Ruta
          </Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={routes} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
        
        <Modal
          title={editingRouteId ? "Editar Ruta" : "Nueva Ruta"}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText={editingRouteId ? "Actualizar" : "Crear"}
          cancelText="Cancelar"
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="origen"
              label="Origen"
              rules={[{ required: true, message: 'Por favor ingresa el origen' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="destino"
              label="Destino"
              rules={[{ required: true, message: 'Por favor ingresa el destino' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fecha"
              label="Fecha"
              rules={[{ required: true, message: 'Por favor selecciona la fecha' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="hora"
              label="Hora"
              rules={[{ required: true, message: 'Por favor selecciona la hora' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="precio"
              label="Precio"
              rules={[{ required: true, message: 'Por favor ingresa el precio' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="busId"
              label="Autobús"
              rules={[{ required: true, message: 'Por favor selecciona un autobús' }]}
            >
              <Select placeholder="Selecciona un autobús">
                {buses.map(bus => (
                  <Option key={bus._id} value={bus._id}>
                    {bus.numeroUnidad} - Capacidad: {bus.capacidad}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminRoutes;