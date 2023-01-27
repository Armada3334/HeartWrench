import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SamsungHealth from 'react-native-samsung-health';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    SamsungHealth.initialize();
  }, []);

  const startSending = async () => {
    setIsSending(true);
    const heartRateSubscription = SamsungHealth.subscribe({
      dataType: 'com.samsung.shealth.heart_rate',
      start: new Date(),
      end: new Date(),
      onData: async data => {
        const heartRate = data[0].heart_rate;
        const db = firestore();
        await db.collection('heartrate').add({
          heartRate,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });
  };

  const stopSending = () => {
    setIsSending(false);
    SamsungHealth.unsubscribe();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={isSending ? stopSending : startSending}>
        <Text style={styles.buttonText}>{isSending ? 'Stop' : 'Start'}</Text>
</TouchableOpacity>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
},
button: {
backgroundColor: 'blue',
padding: 10,
borderRadius: 5,
},
buttonText: {
color: 'white',
fontWeight: 'bold',
},
});

export default App;