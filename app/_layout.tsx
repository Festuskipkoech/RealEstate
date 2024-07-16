import React, { useState } from "react";
import { Slot, Stack } from "expo-router";
import FirstPage from "./FirstPage"; 

export default function Layout() {
  const [isFirstPage, setIsFirstPage] = useState(true);

  const handleFirstPage = () => {
    setIsFirstPage(false);
  };

  if (isFirstPage) {
    return <FirstPage onContinueAsGuest={handleFirstPage} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
