import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import tw from 'twrnc';

export default function GratitudeScreen({ navigation }) {
  const [gratitudeText, setGratitudeText] = useState('');
  const [entries, setEntries] = useState([]);
  const userId = "mock-user";

  const fetchEntries = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const q = query(
        collection(db, 'gratitudeEntries'),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo))
      );
      const querySnapshot = await getDocs(q);
      const fetchedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Error fetching gratitude entries:', error.message);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const saveGratitude = async () => {
    if (gratitudeText.length < 5) {
      Alert.alert('Error', 'Gratitude entry must be at least 5 characters long.');
      return;
    }
    try {
      console.log('Saving entry:', gratitudeText);
      const docRef = await addDoc(collection(db, 'gratitudeEntries'), {
        text: gratitudeText,
        timestamp: Timestamp.fromDate(new Date()),
        userId: userId
      });
      console.log('Entry saved successfully, docRef:', docRef.id);
      setGratitudeText('');
      Alert.alert('Success', 'Gratitude entry saved!');
      await fetchEntries();
      setTimeout(() => navigation.navigate('DashboardScreen'), 100);
    } catch (error) {
      console.error('Error saving gratitude entry:', error.message);
      Alert.alert('Error', `Failed to save gratitude entry: ${error.message}`);
    }
  };

  const generateGrid = () => {
    const grid = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const hasEntry = entries.some(entry => 
        entry.timestamp.toISOString().split('T')[0] === dateStr
      );
      grid.push({
        date: dateStr,
        hasEntry,
        isInRange: true
      });
    }

    const firstDayOfWeek = startDate.getDay();
    const paddingBefore = firstDayOfWeek;
    const paddingAfter = 35 - (paddingBefore + 30);
    const paddedGrid = [];

    for (let i = 0; i < paddingBefore; i++) {
      paddedGrid.push({
        date: '',
        hasEntry: false,
        isInRange: false
      });
    }

    paddedGrid.push(...grid);

    for (let i = 0; i < paddingAfter; i++) {
      paddedGrid.push({
        date: '',
        hasEntry: false,
        isInRange: false
      });
    }

    return paddedGrid;
  };

  const gridData = generateGrid();
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={tw`flex-1 bg-[#F5E8C7] p-6`}>
      <TouchableOpacity
        style={tw`mb-6`}
        onPress={() => navigation.navigate('DashboardScreen')}
      >
        <Text style={tw`text-[#1A1A1A] text-lg`}>← Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={tw`text-[#1A1A1A] text-2xl font-bold mb-4`}>Log Your Gratitude</Text>
      <TextInput
        style={tw`bg-white rounded-xl p-4 mb-4 text-[#1A1A1A] text-base border border-[#D3C4A5]`}
        placeholder="What are you grateful for today?"
        placeholderTextColor="#D3C4A5"
        value={gratitudeText}
        onChangeText={setGratitudeText}
        multiline
      />
      <TouchableOpacity
        style={tw`bg-[#D3C4A5] p-4 rounded-xl mb-6`}
        onPress={saveGratitude}
      >
        <Text style={tw`text-[#1A1A1A] text-center text-lg font-medium`}>Save Gratitude</Text>
      </TouchableOpacity>

      <Text style={tw`text-[#1A1A1A] text-xl font-bold mb-2`}>Past 30 Days</Text>
      <View style={tw`flex-row justify-between mb-2`}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={tw`text-[#1A1A1A] text-sm font-bold w-[14%] text-center`}>
            {day}
          </Text>
        ))}
      </View>
      <View style={tw`flex-row flex-wrap justify-between`}>
        {gridData.map((day, index) => (
          <View
            key={index}
            style={tw`w-[14%] h-10 mb-2 rounded ${day.isInRange ? (day.hasEntry ? 'bg-[#D3C4A5]' : 'bg-[#F5E8C7]') : 'bg-gray-200'} border border-[#D3C4A5] flex items-center justify-center`}
          >
            {day.isInRange && (
              <Text style={tw`text-[#1A1A1A] text-xs`}>
                {new Date(day.date).getDate()}
              </Text>
            )}
          </View>
        ))}
      </View>

      <Text style={tw`text-[#1A1A1A] text-xl font-bold mt-4 mb-2`}>Your Gratitude Entries</Text>
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={tw`bg-white rounded-xl p-4 mb-2 border border-[#D3C4A5]`}>
            <Text style={tw`text-[#1A1A1A] text-sm`}>
              {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
            </Text>
            <Text style={tw`text-[#1A1A1A] text-base`}>{item.text}</Text>
          </View>
        )}
        style={tw`flex-1`}
      />
    </View>
  );
}