import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importamos las Screens (todas en minúsculas)
import Home from './screens/home';
import Profile from './screens/profile';
import Settings from './screens/settings';

const Tab = createBottomTabNavigator();

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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='home'  // ← corregido, en minúsculas
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
    </NavigationContainer>
  );
}
