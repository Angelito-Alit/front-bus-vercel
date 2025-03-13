import React, { useState, useEffect } from 'react';
import { Table, Typography, Tag, Input, DatePicker, Button, Popconfirm, message } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../Layouts/MainLayout';
import ticketService from '../../services/ticketService';

const { Title } = Typography;

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  
  useEffect(() => {
    fetchTickets();
  }, []);
  
  const fetchTickets = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      message.error('Error al cargar los boletos');
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const resetFilters = () => {
    setSearchText('');
    setSelectedDate(null);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pagado':
        return 'green';
      case 'reservado':
        return 'blue';
      case 'cancelado':
        return 'red';
      default:
        return 'default';
    }
  };
  
  const filteredTickets = tickets.filter(ticket => {
    let matchesSearch = true;
    let matchesDate = true;
    
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      matchesSearch = 
        ticket.codigo.toLowerCase().includes(searchLower) ||
        ticket.usuario?.nombre?.toLowerCase().includes(searchLower) ||
        ticket.usuario?.email?.toLowerCase().includes(searchLower) ||
        ticket.ruta?.origen?.toLowerCase().includes(searchLower) ||
        ticket.ruta?.destino?.toLowerCase().includes(searchLower);
    }
    
    if (selectedDate) {
      const ticketDate = new Date(ticket.fechaCompra).toDateString();
      const filterDate = selectedDate.toDate().toDateString();
      matchesDate = ticketDate === filterDate;
    }
    
    return matchesSearch && matchesDate;
  });
  
  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
    },
    {
      title: 'Cliente',
      key: 'usuario',
      render: (_, record) => (
        <span>{record.usuario?.nombre || 'N/A'}</span>
      ),
    },
    {
      title: 'Viaje',
      key: 'ruta',
      render: (_, record) => (
        <span>{record.ruta?.origen} - {record.ruta?.destino}</span>
      ),
    },
    {
      title: 'Fecha Viaje',
      key: 'fechaViaje',
      render: (_, record) => (
        <span>{record.ruta?.fecha ? new Date(record.ruta.fecha).toLocaleDateString() : 'N/A'}</span>
      ),
    },
    {
      title: 'Asiento',
      dataIndex: 'asiento',
      key: 'asiento',
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (_, record) => (
        <Tag color={getStatusColor(record.estado)}>
          {record.estado}
        </Tag>
      ),
    },
    {
      title: 'Fecha Compra',
      key: 'fechaCompra',
      render: (_, record) => (
        <span>{new Date(record.fechaCompra).toLocaleDateString()}</span>
      ),
    }
  ];
  
  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Gestión de Boletos</Title>
        
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
          <Input
            placeholder="Buscar por código, cliente o ruta"
            value={searchText}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <DatePicker
            placeholder="Filtrar por fecha"
            onChange={handleDateChange}
            value={selectedDate}
          />
          <Button onClick={resetFilters}>Resetear Filtros</Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={filteredTickets} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </MainLayout>
  );
};

export default AdminTickets;