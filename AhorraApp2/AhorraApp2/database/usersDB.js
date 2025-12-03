import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'AHORRA_USERS';

export const saveUser = async (user) => {
  try {
    const stored = await AsyncStorage.getItem(USERS_KEY);
    const users = stored ? JSON.parse(stored) : [];
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    return false;
  }
};

export const getAllUsers = async () => {
  try {
    const stored = await AsyncStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error al leer usuarios:', error);
    return [];
  }
};
