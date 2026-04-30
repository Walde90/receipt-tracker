import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ name }: { name: string }) {
  const { View, Text } = require('react-native');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{name}</Text>
    </View>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" children={() => <PlaceholderScreen name="Dashboard" />} />
        <Tab.Screen name="Receipts" children={() => <PlaceholderScreen name="Belege" />} />
        <Tab.Screen name="Budget" children={() => <PlaceholderScreen name="Budget" />} />
        <Tab.Screen name="Reports" children={() => <PlaceholderScreen name="Auswertungen" />} />
        <Tab.Screen name="Settings" children={() => <PlaceholderScreen name="Einstellungen" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
