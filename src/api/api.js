import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hp-api.onrender.com',
});

export const getCharacters = async () => {
  try {
    const response = await api.get('/api/characters');
    return response.data;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

export const getStudents = async () => {
  try {
    const response = await api.get('/api/characters/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStaff = async () => {
  try {
    const response = await api.get('/api/characters/staff');
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

export const getSpells = async () => {
  try {
    const response = await api.get('/api/spells');
    return response.data;
  } catch (error) {
    console.error('Error fetching spells:', error);
    throw error;
  }
};