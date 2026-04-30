import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BudgetScreen } from '../screens/budget/BudgetScreen';
import { AddBudgetEntryScreen } from '../screens/budget/AddBudgetEntryScreen';

export type BudgetStackParams = {
  BudgetHome: undefined;
  AddBudgetEntry: undefined;
};

const Stack = createStackNavigator<BudgetStackParams>();

export function BudgetNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="BudgetHome" component={BudgetScreen} options={{ title: 'Budget' }} />
      <Stack.Screen
        name="AddBudgetEntry"
        component={AddBudgetEntryScreen}
        options={{ title: 'Neuer Eintrag' }}
      />
    </Stack.Navigator>
  );
}
