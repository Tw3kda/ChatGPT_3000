import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Image, Animated, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router'; // Use Expo Router's useRouter

const { width } = Dimensions.get('window');

export default function Welcome() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null); // Explicitly type the ref
    const router = useRouter(); // Initialize Expo Router

    const [fontsLoaded] = useFonts({
        Raleway: require('../assets/fonts/Raleway-SemiBold.ttf'),
    });

    const welcomeMessages = [
        {
            id: '1',
            icon: <Fontisto name="day-sunny" size={25} color="white" />,
            title: "Examples",
            texts: [
                "“Explain quantum computing in simple terms”",
                "“Got any creative ideas for a 10-year-old’s birthday?”",
                "“How do I make an HTTP request in JavaScript?”"
            ]
        },
        {
            id: '2',
            icon: <Ionicons name="flash-outline" size={25} color="white" />,
            title: "Capabilities",
            texts: [
                "Remembers what user said earlier in the conversation",
                "Allows user to provide follow-up corrections",
                "Trained to decline inappropriate requests"
            ]
        },
        {
            id: '3',
            icon: <AntDesign name="warning" size={25} color="white" />,
            title: "Limitations",
            texts: [
                "May occasionally generate incorrect information",
                "May occasionally produce harmful instructions or biased content",
                "Limited knowledge of world and events after 2021"
            ]
        }
    ];

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const handleNext = () => {
        if (activeIndex < welcomeMessages.length - 1) {
            // Check if flatListRef.current is not null
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: activeIndex + 1 });
                setActiveIndex(activeIndex + 1);
            }
        } else {
            // Navigate to the next screen using Expo Router
            router.push('./(app)'); // Replace '/next-screen' with your actual route
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/images/Vector.png')} style={styles.image} />
                <Text style={styles.welcome}> Welcome to ChatGPT</Text>
                <Text style={styles.welcomeText}> Ask anything, get your answer</Text>
                
                <FlatList
                    ref={flatListRef}
                    data={welcomeMessages}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / width);
                        setActiveIndex(index);
                    }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            {item.icon}
                            <Text style={styles.title}>{item.title}</Text>
                            {item.texts.map((text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                                <Text key={index} style={styles.text}>{text}</Text>
                            ))}
                        </View>
                    )}
                />

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {welcomeMessages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.line,
                                { backgroundColor: index <= activeIndex ? '#2AD0CA' : '#666' }
                            ]}
                        />
                    ))}
                    
                </View>

                <TouchableOpacity onPress={handleNext}>
                    <Text style={styles.button}>
                        {activeIndex < welcomeMessages.length - 1 ? "Next" : "Get Started"}
                    </Text>
                </TouchableOpacity>

                {/* Next Button */}
                
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#343541",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Raleway",
        color: "#ffffff",
        gap: 15,
        fontSize: 30,
    },
    card: {
        width,
        height: "85%",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 0,
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        color: 'white', 
        marginBottom: 40,
    },
    textContainer: {
        borderColor: 'white',
        padding: 10,
        marginVertical: 5,
    },
    text: {
        width: "90%",
        height: "18%",
        paddingTop: 15,
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: "#FFFFFF1A",
    },
    image: {
        marginTop: 25,
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    welcome: {
        fontFamily: "Raleway",
        color: "white",
        textAlign: "center",
        fontSize: 35
    },
    welcomeText: {
        fontFamily: "Raleway",
        color: "white",
        textAlign: "center",
        fontSize: 15,
        marginBottom: 30
    },
    progressContainer: {
        bottom: 75,
        flexDirection: "row",
        marginBottom: 0,
    },
    line: {
        width: 30,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 5,
    },
    button: {
        color: 'white', // Button text color
        fontSize: 18,
        fontFamily: 'Raleway',
        fontWeight: 'bold',
        backgroundColor: '#10A37F',
        padding: 10,
        borderRadius: 10,
        bottom: 35,
    },
});