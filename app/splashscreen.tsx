import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export default function SplashScreen() { // Use PascalCase for component names
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Raleway: require('../assets/fonts/Raleway-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Simulate a delay for the splash screen (e.g., 2 seconds)
      const timer = setTimeout(() => {
        router.replace('/'); // Navigate to the next screen
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Return null or a loading indicator while fonts are loading
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Vector.png')} style={styles.image} />
      <Text style={styles.text}>ChatGPT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#343541',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  text: {
    fontFamily: 'Raleway',
    color: '#ffffff',
    fontSize: 30,
  },
  image: {
    width: 100, // Adjust the size as needed
    height: 100,
    resizeMode: 'contain',
  },
});