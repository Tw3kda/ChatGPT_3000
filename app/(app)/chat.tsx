import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { APIResponse } from "../../interfaces/Responses";
import { Message } from '../../interfaces/AppInterfaces';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from '@/utils/FirebaseConfig';

export default function Chat() {


    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { chatId: chatIdParam, userId: userIdParam } = useLocalSearchParams();

// Ensure they are strings, or default to an empty string
const chatId = Array.isArray(chatIdParam) ? chatIdParam[0] : chatIdParam ?? "";
const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam ?? "";

console.log("chatId:", chatId);
console.log("userId:", userId);

useEffect(() => {
    if (!chatId || !userId) return;

    const chatRef = doc(db, "Users", userId, "Conversations", chatId);

    // Listen for real-time updates
    const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data?.messages) {
                setMessages(data.messages);
            }
        }
    });

    return () => unsubscribe(); // Cleanup when leaving chat
}, [chatId, userId]);

    const getResponse = async (chatId: string, userId: string) => {
        if (inputText.trim() === "") return;

        const userMessage: Message = { sender_by: "Me", text: inputText, date: new Date() };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputText("");

        try {
            setIsLoading(true);

            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBJYm5bSrJPal3W2Ch-repnFwzBBkNE39s", {
                method: "POST",
                body: JSON.stringify({
                    "contents": [{ "parts": [{ "text": userMessage.text }] }]
                })
            });

            const data: APIResponse = await response.json();
            console.log({ data });

            const botMessage: Message = { sender_by: "Bot", text: data?.candidates[0]?.content?.parts[0]?.text || "No response received", date: new Date() };
            setMessages(prevMessages => [...prevMessages, botMessage]);


            if (!chatId || !userId) {
                console.error("chatId or userId is missing");
                return;
            }

            // 🔥 Update Firestore with new messages
            const chatRef = doc(db, "Users", userId, "Conversations", chatId);
            await updateDoc(chatRef, {
                messages: arrayUnion(userMessage, botMessage)
            });

        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <View style={styles.scrollContainer}>
                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                            {messages.length === 0 ? (
                                <Text style={styles.chatPlaceholder}>Ask anything, get your answer</Text>
                            ) : (
                                messages.map((msg, index) => (
                                    <View 
                                        key={index} 
                                        style={[
                                            styles.chatBubble, 
                                            msg.sender_by === "Me" ? styles.chatBubbleUser : styles.chatBubbleBot
                                        ]}
                                    >
                                        <Text style={msg.sender_by === "Me" ? styles.chatUser : styles.chatBot}>
                                            {msg.text}
                                        </Text>
                                    </View>
                                ))
                            )}
                            {isLoading && <Text style={styles.loadingText}>Está cargando...</Text>}
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
    
            <View style={styles.sendMessage}>
                <TextInput
                    style={styles.inputField}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#aaaaaa"
                />
                <TouchableOpacity onPress={() => getResponse(String(chatId), String(userId))} style={styles.sendButton}>
                    <Image source={require('../../assets/images/send.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
    
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#343541",
        alignItems: "center",
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    scrollViewContent: {
        flexGrow: 1,
        width: "100%",
        paddingHorizontal: 15,
    },
    sendMessage: {
        width: "90%",
        height: 50,
        borderWidth: 2,
        borderColor: "#FFFFFF52",
        borderRadius: 10,
        backgroundColor: "#FFFFFF1A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    sendButton: {
        padding: 3,
        marginRight: 5,
        backgroundColor: "#10A37F",
        borderRadius: 4,
    },
    inputField: {
        flex: 1,
        height: "100%",
        color: "#ffffff",
    },
    chatBot: {
        borderWidth: 2,
        borderColor: "#FFFFFF52",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#2E2F38",
        color: "#ffffff",
        maxWidth: "80%",
    },
    chatUser: {
        borderWidth: 2,
        borderColor: "#FFFFFF52",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#10A37F",
        color: "#ffffff",
        maxWidth: "80%",
    },
    chatBubble: {
        width: "100%",
        marginVertical: 5,
    },
    chatBubbleUser: {
        alignSelf: "flex-end",
    },
    chatBubbleBot: {
        alignSelf: "flex-start",
    },
    chatPlaceholder: {
        color: "#aaaaaa",
        textAlign: "center",
        marginTop: 20,
    },
    loadingText: {
        color: "#ffcc00",
        textAlign: "center",
        marginTop: 10,
    },
});
