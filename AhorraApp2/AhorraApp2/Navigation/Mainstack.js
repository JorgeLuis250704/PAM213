import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={Tabs} />
    </Stack.Navigator>
  );
}