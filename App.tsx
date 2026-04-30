import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { initializeDatabase } from './src/data/db/migrations/initialize';
import { seedDefaultCategories } from './src/data/db/migrations/seed';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeDatabase();
    seedDefaultCategories();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <RootNavigator />;
}
