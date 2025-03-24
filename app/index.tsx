import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard screen
    const timer = setTimeout(() => {
      router.replace('/login'); // Navigate to the next screen
    }, 2000);
  }, []);

  return null; // Render nothing (or a loading indicator)
}