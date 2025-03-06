import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export default function PaymentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Dawn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.lightWarm,
    fontSize: 24,
    fontWeight: '600',
  },
}); 