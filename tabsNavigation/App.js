import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importación de screens
import Home from './screens/home';
import Profile from './screens/profile';
import Settings from './screens/settings';
import DetalleUsuario from './screens/DetalleUsuario';  // ← IMPORTANTE

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = (route, color) => {
  let iconName;

  if (route.name === 'home') {
    iconName = 'home-outline';
  } else if (route.name === 'profile') {
    iconName = 'person-outline';
  } else if (route.name === 'settings') {
    iconName = 'settings-outline';
  }

  return <Ionicons name={iconName} size={24} color={color} />;
};

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName='home'
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#000',
          height: 90,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#000',
          height: 80,
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor: 'yellow',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color }) => screenOptions(route, color),
      })}
    >
      <Tab.Screen name="home" component={Home} />
      <Tab.Screen name="profile" component={Profile} />
      <Tab.Screen name="settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tabs dentro del Stack */}
        <Stack.Screen 
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />

        {/* Pantalla secundaria */}
        <Stack.Screen 
          name="DetalleUsuario"
          component={DetalleUsuario}
          options={{ title: 'Detalle del Usuario' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
