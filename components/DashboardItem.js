import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
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

export default DashboardItem;