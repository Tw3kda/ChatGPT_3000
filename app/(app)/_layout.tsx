import { router, Stack } from 'expo-router';
import { Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

import { DataProvider } from "../../context/DataContext";

export default function layout() {


  return (
    <DataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: true,
            title: "",
            headerStyle: { backgroundColor: "#343541" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
            headerShadowVisible: false,
            contentStyle: { borderTopColor: "grey", borderTopWidth: 2 },
            //headerLeft: () =>
            headerRight: () => (
              <Image
                source={require("../../assets/images/Vector.png")}
                style={{ width: 24, height: 24, marginRight: 15 }}
              />
            ),
          }}
        />


      </Stack>

    </DataProvider>



  );
}
