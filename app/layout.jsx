"use client";

import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/app/components/Navbar";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";

export default function RootLayout ({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <SessionProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ChakraProvider>
                <Analytics />
                <Navbar />
                <Box pt="60px" bgColor="gray.100">
                  {children}
                </Box>
              </ChakraProvider>
            </PersistGate>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
