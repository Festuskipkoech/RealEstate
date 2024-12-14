// app/_layout.jsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from 'react-native';


export default function Layout() {
  return (
    <>
    <StatusBar
      barStyle="dark-content" 
      backgroundColor="#ffffff" 
      translucent={false}/>
      <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="+not-found"
        options={{
          title: "Oops!",
          presentation: "modal",
        }}
      />

      </Stack>
      
    
    </>
  );
}
