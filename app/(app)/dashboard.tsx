import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { router, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { getFirestore, collection, doc, deleteDoc, onSnapshot, query, orderBy, getDocs } from "firebase/firestore";
import SplashScreen from "../splashscreen";


export default function Dashboard() {
  const { user } = useAuth();
  const auth = getAuth();
  const { chats, createChat, getChats } = useContext(DataContext);
  const db = getFirestore();
  const [chatTitles, setChatTitles] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return; // Asegurar que el usuario está autenticado antes de continuar
    setIsLoading(true); // Activar SplashScreen solo si no hay datos
  
    getChats(user.uid).then(() => {
      setIsLoading(false); // Desactivar SplashScreen cuando los datos estén listos
    }).catch(error => {
      console.error("Error loading chats:", error);
      setIsLoading(false); // Asegurar que se desactiva incluso en caso de error
    });
  
  }, [user]);

  useEffect(() => {
    if (user) {
      getChats(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (!user || chats.length === 0) return;
  
    const unsubscribes: (() => void)[] = [];
  
    chats.forEach((chat) => {
      const chatRef = doc(db, `Users/${user.uid}/Conversations/${chat.id}`);
  
      const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data();
          const messages = chatData.messages || []; // Accede al campo `messages`
  
          // Filtrar solo los mensajes enviados por "Me"
          const sentByMeMessages = messages.filter((msg: { sender_by: string; }) => msg.sender_by === "Me");
  
          if (sentByMeMessages.length > 0) {
            const lastMessage = sentByMeMessages[sentByMeMessages.length - 1]; // Último mensaje enviado por "Me"
            console.log(`Último mensaje en chat ${chat.id} enviado por "Me":`, lastMessage);
  
            setChatTitles((prevTitles) => ({
              ...prevTitles,
              [chat.id]: lastMessage.text, // Mostrar el texto del último mensaje enviado por "Me"
            }));
          } else {
            console.log(`No hay mensajes enviados por "Me" en chat ${chat.id}.`);
            setChatTitles((prevTitles) => ({
              ...prevTitles,
              [chat.id]: "No messages sent by Me",
            }));
          }
        } else {
          console.log(`Chat ${chat.id} no existe.`);
        }
      });
  
      unsubscribes.push(unsubscribe);
    });
  
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [chats]);

const handleStartChat = async () => {
    if (!user) return;

    setIsLoading(true); // Activar SplashScreen
    try {
      const newChatId = await createChat(user.uid, "", []);
      if (newChatId) {
        router.push({
          pathname: "/chat",
          params: { chatId: newChatId, userId: user.uid },
        });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Desactivar SplashScreen después de 2 segundos
      }, 2000);
    }
  };

  const handleOpenChat = (chatId: string) => {
    if (!user) return;

    setIsLoading(true); // Activar SplashScreen
    setTimeout(() => {
      setIsLoading(false); // Desactivar SplashScreen después de 2 segundos
      router.push({
        pathname: "/chat",
        params: { chatId, userId: user.uid },
      });
    }, 2000);
  };

  const handleDeleteAllChats = async () => {
    if (!user) return;

    Alert.alert("Confirm Delete", "Are you sure you want to delete all chats?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true); // Activar SplashScreen
          try {
            const chatsRef = collection(db, `Users/${user.uid}/Conversations`);
            const querySnapshot = await getDocs(chatsRef);

            await Promise.all(
              querySnapshot.docs.map(async (docSnap) => {
                await deleteDoc(doc(db, `Users/${user.uid}/Conversations/${docSnap.id}`));
              })
            );

            setChatTitles({});
            await getChats(user.uid);

            Alert.alert("Success", "All chats have been deleted.");
          } catch (error) {
            console.error("Error deleting chats:", error);
            Alert.alert("Error", "Could not delete chats.");
          } finally {
            setTimeout(() => {
              setIsLoading(false); // Desactivar SplashScreen después de 2 segundos
            }, 2000);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
     // Activar SplashScreen
    try {
      console.log("Logging out...");
      await signOut(auth);
      
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      
         // Desactivar SplashScreen después de 2 segundos
        router.dismissAll();
        router.replace("/login");
      
    }
  };

  const router = useRouter();
  if (isLoading) {
      return <SplashScreen />; 
    }

  return (
      <View style={{ flex: 1, backgroundColor: "#202123", paddingVertical: 20, paddingHorizontal: 15 }}>
          {/* Sección superior con "New Chat" */}
          <TouchableOpacity
              onPress={handleStartChat}
              style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  backgroundColor: "#343541",
                  borderRadius: 8,
                  marginBottom: 20,
              }}
          >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>New Chat</Text>
          </TouchableOpacity>

          {/* Lista de chats previos */}
          <ScrollView style={{ flex: 1 }}>
              {chats.map((chat) => (
                  <TouchableOpacity
                      key={chat.id}
                      onPress={() => handleOpenChat(chat.id)}
                      style={{
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: "#343541",
                          marginBottom: 10,
                      }}
                  >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                          {chatTitles[chat.id] || "Unnamed Chat"}
                      </Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>

          {/* Opciones del menú en la parte inferior */}
          <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={handleDeleteAllChats} style={styles.menuItem}>
                  <Text style={styles.menuText}>Clear conversations</Text>
              </TouchableOpacity>


              
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.menuItem, { flexDirection: "row", justifyContent: "space-between" }]}
        >
          <Text style={[styles.menuText, { color: "#f56565" }]}>Logout</Text>
        </TouchableOpacity>
          </View>
      </View>
  );

  
}

const styles = {
  menuItem: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#343541",
      marginBottom: 10,
  },
  menuText: {
      color: "white",
      fontSize: 16,
  },
  newBadge: {
      backgroundColor: "yellow",
      color: "black",
      fontSize: 12,
      fontWeight: "bold",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
  },
};