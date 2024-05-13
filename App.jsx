import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ExampleComponent from './src/components/Example';

export default function Main() {
  return (
    <View style={styles.container}>
      <Text>Ruokasovellus</Text>
      <ExampleComponent />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
