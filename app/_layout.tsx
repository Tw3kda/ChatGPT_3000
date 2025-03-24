import { Slot, Stack, useRouter } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { SLOPE_FACTOR } from "react-native-reanimated/lib/typescript/animation/decay/utils";

export default function RootLayout() {
  return (
    <AuthProvider> 
      <Slot/>
     </AuthProvider>
  );
}

