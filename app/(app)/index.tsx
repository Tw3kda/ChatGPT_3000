import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard screen
    router.push("/dashboard");
  }, []);

  return null; // Render nothing (or a loading indicator)
}