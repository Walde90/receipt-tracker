import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OcrScreen } from '../screens/receipts/OcrScreen';

export type ReceiptsStackParams = {
  ReceiptsHome: undefined;
};

const Stack = createStackNavigator<ReceiptsStackParams>();

export function ReceiptsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="ReceiptsHome" component={OcrScreen} options={{ title: 'Bon scannen' }} />
    </Stack.Navigator>
  );
}
