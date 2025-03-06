import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../utils/colors';

export default function PaymentScreen2() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appNameText}>Dawn</Text>
        <Text style={styles.subtitleText}>Start your day mindfully ✨</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: colors.lightWarm,
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 8,
  },
  appNameText: {
    color: colors.lightWarm,
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitleText: {
    color: colors.warmAccent,
    fontSize: 18,
    fontWeight: '400',
  },
}); 