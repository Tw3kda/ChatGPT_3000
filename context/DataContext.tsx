import { createContext, useState } from "react";
import { db } from "@/utils/FirebaseConfig";  // ✅ Ensure this is correctly initialized
import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore"; // ✅ Use full SDK

// Define Chat Type
interface Chat {
    id: string;
    title: string;
    messages: Message[];
    created_at: Date;
}

interface Message {
    text: string;
    sender: string;
    timestamp: Date;
}

interface DataContextProps {
    chats: Chat[];
    createChat: (userId: string, text: string, messages: Message[]) => Promise<string | undefined>;
    updateChat: (id: string, messages: Message[]) => Promise<void>;
    getChats: (userId: string) => Promise<void>;  // ✅ Ensure userId is required
}

// Create Context
export const DataContext = createContext({} as DataContextProps);

// DataProvider Component
export const DataProvider = ({ children }: any) => {
    const [chats, setChats] = useState<Chat[]>([]);

    const createChat = async (userId: string, text: string, messages: Message[]) => {
        try {
            if (!userId) throw new Error("No user ID provided");

            const userRef = doc(db, "Users", userId);  // ✅ Correct user reference
            const conversationsRef = collection(userRef, "Conversations");  // ✅ Correct nested collection

            const title = text.split(" ").slice(0, 5).join(" ");
            const created_at = new Date();

            const response = await addDoc(conversationsRef, {  // ✅ Correct collection reference
                title,
                created_at,
                messages
            });

            // Update state
            setChats(prevChats => [...prevChats, { id: response.id, title, messages, created_at }]);

            return response.id;
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    const updateChat = async (chatId: string, messages: Message[]) => {
        try {
            const chatRef = doc(db, "chats", chatId);
            await updateDoc(chatRef, { messages });

            // Update state
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === chatId ? { ...chat, messages } : chat
                )
            );
        } catch (error) {
            console.error("Error updating chat:", error);
        }
    };

    const getChats = async (userId: string) => {
        try {
            if (!userId) throw new Error("No user ID provided");

            const conversationsRef = collection(db, "Users", userId, "Conversations");  // ✅ Correct path
            const querySnapshot = await getDocs(conversationsRef);

            const newChats = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chat[];

            setChats(newChats);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    return (
        <DataContext.Provider value={{ chats, createChat, updateChat, getChats }}>
            {children}
        </DataContext.Provider>
    );
};
