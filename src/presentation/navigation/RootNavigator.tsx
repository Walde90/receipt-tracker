import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SettingsNavigator } from './SettingsNavigator';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, color: '#6B7280' }}>{name}</Text>
    </View>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#6B7280',
        }}
      >
        <Tab.Screen name="Dashboard" options={{ title: 'Dashboard', tabBarLabel: 'Dashboard' }}>
          {() => <PlaceholderScreen name="Dashboard" />}
        </Tab.Screen>
        <Tab.Screen name="Receipts" options={{ title: 'Belege', tabBarLabel: 'Belege' }}>
          {() => <PlaceholderScreen name="Belege" />}
        </Tab.Screen>
        <Tab.Screen name="Budget" options={{ title: 'Budget', tabBarLabel: 'Budget' }}>
          {() => <PlaceholderScreen name="Budget" />}
        </Tab.Screen>
        <Tab.Screen name="Reports" options={{ title: 'Auswertungen', tabBarLabel: 'Auswertungen' }}>
          {() => <PlaceholderScreen name="Auswertungen" />}
        </Tab.Screen>
        <Tab.Screen
          name="Settings"
          options={{ title: 'Einstellungen', tabBarLabel: 'Einstellungen' }}
          component={SettingsNavigator}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
