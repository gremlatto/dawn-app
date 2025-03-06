import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const DashboardItem = ({ icon, title, value, isVisible = true }) => {
  if (!isVisible) return null;
  return (
    <View style={tw`flex-row items-center p-4 bg-[#1A1A1A]/20 rounded-xl mb-4`}>
      <Feather name={icon} size={24} color="#D3C4A5" />
      <View style={tw`ml-4`}>
        <Text style={tw`text-[#D3C4A5] text-lg font-medium`}>{title}</Text>
        <Text style={tw`text-[#D3C4A5] text-base`}>{value}</Text>
      </View>
    </View>
  );
};

const SunMoonIcon = () => {
  const [isDay, setIsDay] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsDay(hour >= 6 && hour < 18);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={tw`items-center justify-center w-24 h-24 mb-8`}>
      <Feather 
        name={isDay ? 'sun' : 'moon'} 
        size={64} 
        color="#D3C4A5" 
      />
    </View>
  );
};

export default function DashboardScreen({ navigation }) {
  const [visibleItems, setVisibleItems] = useState({
    time: true,
    weather: true,
    social: true,
    calendar: true,
    goals: true
  });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Load visibility preferences
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem('dashboardPreferences');
        if (stored) {
          setVisibleItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadPreferences();

    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const mockData = {
    time: currentTime,
    weather: 'Sunny, 72°F',
    social: '↑ New',
    calendar: '10 AM - Alex',
    goals: 'Weekly: Run 5 miles'
  };

  return (
    <LinearGradient
      colors={['#1A1A1A', '#F5E8C7']}
      style={tw`flex-1`}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`p-6`}
      >
        <View style={tw`items-center justify-center mt-12`}>
          <SunMoonIcon />
        </View>

        <DashboardItem 
          icon="clock" 
          title="Time" 
          value={mockData.time}
          isVisible={visibleItems.time}
        />
        <DashboardItem 
          icon="cloud" 
          title="Weather" 
          value={mockData.weather}
          isVisible={visibleItems.weather}
        />
        <DashboardItem 
          icon="bell" 
          title="Social" 
          value={mockData.social}
          isVisible={visibleItems.social}
        />
        <DashboardItem 
          icon="calendar" 
          title="Calendar" 
          value={mockData.calendar}
          isVisible={visibleItems.calendar}
        />
        <DashboardItem 
          icon="target" 
          title="Goals" 
          value={mockData.goals}
          isVisible={visibleItems.goals}
        />

        <TouchableOpacity
          style={tw`bg-[#D3C4A5] p-4 rounded-xl mt-6`}
          onPress={() => navigation.navigate('Gratitude')}
        >
          <Text style={tw`text-[#1A1A1A] text-center text-lg font-medium`}>
            Log Gratitude
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
} 