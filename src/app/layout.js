import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/app/components/Navbar";
import { Box, ChakraProvider } from "@chakra-ui/react";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <ChakraProvider>
            <Analytics />
            <Navbar />
            <Box pt="60px" bgColor="gray.100">
              {children}
            </Box>
          </ChakraProvider>
        </Providers>
      </body>
    </html>
  );
}