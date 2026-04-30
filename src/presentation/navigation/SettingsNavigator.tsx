import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { CategoryManagerScreen } from '../screens/settings/CategoryManagerScreen';
import { AddEditCategoryScreen } from '../screens/settings/AddEditCategoryScreen';

export type SettingsStackParams = {
  SettingsHome: undefined;
  CategoryManager: undefined;
  AddEditCategory: { categoryId: number | null };
};

const Stack = createStackNavigator<SettingsStackParams>();

type SettingsHomeProps = {
  navigation: StackNavigationProp<SettingsStackParams, 'SettingsHome'>;
};

function SettingsHomeScreen({ navigation }: SettingsHomeProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('CategoryManager')}
      >
        <Text style={styles.menuText}>🗂 Kategorien verwalten</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  menuItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuText: { fontSize: 15, color: '#111827' },
});

export function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="SettingsHome"
        component={SettingsHomeScreen}
        options={{ title: 'Einstellungen' }}
      />
      <Stack.Screen
        name="CategoryManager"
        component={CategoryManagerScreen}
        options={{ title: 'Kategorien' }}
      />
      <Stack.Screen
        name="AddEditCategory"
        component={AddEditCategoryScreen}
        options={({ route }) => ({
          title: route.params.categoryId ? 'Kategorie bearbeiten' : 'Neue Kategorie',
        })}
      />
    </Stack.Navigator>
  );
}
