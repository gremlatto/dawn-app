import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import tw from 'twrnc';

export default function GratitudeScreen({ navigation }) {
  const [gratitudeText, setGratitudeText] = useState('');
  const [entries, setEntries] = useState([]);
  const userId = "mock-user"; // Mock user ID

  // Function to fetch entries from Firestore
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
      console.log('Fetched entries:', fetchedEntries);
    } catch (error) {
      console.error('Error fetching gratitude entries:', error.message);
    }
  };

  // Fetch entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Save gratitude entry to Firestore and re-fetch entries
  const saveGratitude = async () => {
    if (gratitudeText.length < 5) {
      Alert.alert('Error', 'Gratitude entry must be at least 5 characters long.');
      console.log('Entry too short:', gratitudeText);
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
      // Re-fetch entries to update the grid
      await fetchEntries();
      setTimeout(() => navigation.navigate('DashboardScreen'), 100);
    } catch (error) {
      console.error('Error saving gratitude entry:', error.message);
      Alert.alert('Error', `Failed to save gratitude entry: ${error.message}`);
    }
  };

  // Generate 30-day grid
  const generateGrid = () => {
    const grid = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasEntry = entries.some(entry => 
        entry.timestamp.toISOString().split('T')[0] === dateStr
      );
      grid.push({
        date: dateStr,
        hasEntry
      });
    }
    return grid;
  };

  const gridData = generateGrid();

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

      <Text style={tw`text-[#1A1A1A] text-xl font-bold mb-4`}>Past 30 Days</Text>
      <ScrollView horizontal>
        <View style={tw`flex-row flex-wrap`}>
          {gridData.map((day, index) => (
            <View
              key={index}
              style={tw`w-8 h-8 m-1 rounded ${day.hasEntry ? 'bg-[#D3C4A5]' : 'bg-[#F5E8C7]'} border border-[#D3C4A5]`}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}