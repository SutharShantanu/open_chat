import { extendTheme } from "@chakra-ui/react";

const chakraTheme = extendTheme({
    colors: {
        heading: "#1F2937", // Dark gray for headings
        paragraph: "#4B5563", // Medium gray for paragraphs
        primary: "#3B82F6", // Blue for primary buttons and links
        secondary: "#10B981", // Green for secondary actions
        background: "#F9FAFB", // Light gray for background
        E5E7EB: "#E5E7EB", // Light gray for borders and dividers
        danger: "#EF4444", // Red for error or warning
        "tw-white": "#F8F8F8", // White for text or backgrounds
        "tw-black": "#333333", // Black for text or backgrounds
        primaryHover : "#93bbfd", // Blue for primary buttons and links for hover
    },
});

export default chakraTheme;
