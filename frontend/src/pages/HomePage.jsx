import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/users');
      setUsers(response.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };
  return (<div>

  </div>
  );
};

export default HomePage;
