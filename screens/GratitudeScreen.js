import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  // Your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GratitudeGrid = ({ entries }) => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  return (
    <View style={tw`flex-row flex-wrap justify-between p-4`}>
      {days.map((date, index) => {
        const hasEntry = entries.some(entry => 
          new Date(entry.timestamp.toDate()).toDateString() === date.toDateString()
        );
        
        return (
          <View
            key={index}
            style={[
              tw`w-8 h-8 m-1 rounded-sm`,
              { backgroundColor: hasEntry ? '#D3C4A5' : '#F5E8C7' }
            ]}
          />
        );
      })}
    </View>
  );
};

export default function GratitudeScreen({ navigation }) {
  const [gratitudeText, setGratitudeText] = useState('');
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    fetchEntries();
    // Set up navigation header
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`ml-4`}
        >
          <Feather name="arrow-left" size={24} color="#D3C4A5" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchEntries = async () => {
    try {
      const q = query(
        collection(db, 'gratitude'),
        where('userId', '==', 'mock-user'),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async () => {
    if (gratitudeText.length < 5) {
      Alert.alert('Too Short', 'Please enter at least 5 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'gratitude'), {
        text: gratitudeText,
        timestamp: new Date(),
        userId: 'mock-user'
      });
      setGratitudeText('');
      setIsUnlocked(true);
      fetchEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
      Alert.alert('Error', 'Failed to save your gratitude entry.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <LinearGradient
        colors={['#1A1A1A', '#F5E8C7']}
        style={tw`flex-1`}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={tw`flex-1 p-6 justify-center`}>
          <Text style={tw`text-[#D3C4A5] text-2xl font-bold mb-2 text-center`}>
            Unlock Your Gratitude
          </Text>
          <Text style={tw`text-[#D3C4A5] text-base mb-6 text-center`}>
            Share what you're grateful for to unlock your history
          </Text>
          
          <TextInput
            style={tw`bg-[#1A1A1A]/20 p-4 rounded-xl text-[#D3C4A5] text-lg mb-4`}
            placeholder="Enter your gratitude..."
            placeholderTextColor="#D3C4A5"
            value={gratitudeText}
            onChangeText={setGratitudeText}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={tw`bg-[#D3C4A5] p-4 rounded-xl`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={tw`text-[#1A1A1A] text-center text-lg font-medium`}>
              {isLoading ? 'Saving...' : 'Unlock History'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1A1A1A', '#F5E8C7']}
      style={tw`flex-1`}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={tw`flex-1 p-6`}>
        <View style={tw`mb-8`}>
          <Text style={tw`text-[#D3C4A5] text-2xl font-bold mb-2`}>
            What are you grateful for?
          </Text>
          <Text style={tw`text-[#D3C4A5] text-base mb-4`}>
            Share your gratitude (minimum 5 characters)
          </Text>
          
          <TextInput
            style={tw`bg-[#1A1A1A]/20 p-4 rounded-xl text-[#D3C4A5] text-lg`}
            placeholder="Enter your gratitude..."
            placeholderTextColor="#D3C4A5"
            value={gratitudeText}
            onChangeText={setGratitudeText}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={tw`bg-[#D3C4A5] p-4 rounded-xl mt-4`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={tw`text-[#1A1A1A] text-center text-lg font-medium`}>
              {isLoading ? 'Saving...' : 'Save Gratitude'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tw`mt-8`}>
          <Text style={tw`text-[#D3C4A5] text-xl font-bold mb-4`}>
            Your Gratitude History
          </Text>
          <GratitudeGrid entries={entries} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
} 