import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Input, DatePicker, Select, Empty, Spin } from 'antd';
import MainLayout from '../../Layouts/MainLayout';
import TripCard from '../../Components/UI/TripCard';
import tripService from '../../services/tripService';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripService.getAllTrips();
        
        const now = new Date();
        const futureTrips = response.data.filter(trip => {
          const tripDate = new Date(trip.fecha);
          const tripTime = trip.hora.split(':');
          tripDate.setHours(parseInt(tripTime[0], 10));
          tripDate.setMinutes(parseInt(tripTime[1], 10));
          
          return tripDate > now;
        });
        
        setTrips(futureTrips);
        setFilteredTrips(futureTrips);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, []);
  
  useEffect(() => {
    filterTrips();
  }, [searchText, selectedDate, trips]);
  
  const filterTrips = () => {
    let filtered = [...trips];
    
    if (searchText) {
      filtered = filtered.filter(trip => 
        trip.origen.toLowerCase().includes(searchText.toLowerCase()) || 
        trip.destino.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedDate) {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      filtered = filtered.filter(trip => {
        const tripDate = new Date(trip.fecha).toISOString().split('T')[0];
        return tripDate === dateStr;
      });
    }
    
    setFilteredTrips(filtered);
  };
  
  const handleSearch = (value) => {
    setSearchText(value);
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Viajes Disponibles</Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} md={8}>
            <Search
              placeholder="Buscar por origen o destino"
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <DatePicker 
              placeholder="Filtrar por fecha"
              onChange={handleDateChange}
              style={{ width: '100%' }}
              disabledDate={current => current && current < new Date().setHours(0, 0, 0, 0)}
            />
          </Col>
        </Row>
        
        <Spin spinning={loading}>
          {filteredTrips.length > 0 ? (
            filteredTrips.map(trip => (
              <TripCard key={trip._id} trip={trip} />
            ))
          ) : (
            <Empty description="No hay viajes disponibles con los filtros seleccionados" />
          )}
        </Spin>
      </div>
    </MainLayout>
  );
};

export default TripsPage;