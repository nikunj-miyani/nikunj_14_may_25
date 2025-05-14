import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/homeScreen/HomeScreen';
import DisabledScreen from './screens/disabledScreen/DisabledScreen';

export type RootStackParamList = {
  Home: {isLoad?: boolean};
  Disabled: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Disabled" component={DisabledScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
