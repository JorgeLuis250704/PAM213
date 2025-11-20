// ProfileStack.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/profile';
import DetalleUsuario from '../screens/DetalleUsuario';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profile"
        component={Profile}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen 
        name="DetalleUsuario"
        component={DetalleUsuario}
        options={{ title: 'Detalle Usuario' }}
      />
    </Stack.Navigator>
  );
}
