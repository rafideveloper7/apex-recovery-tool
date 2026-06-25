module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        bg2: "#F7F8FC",
        bg3: "#EEF1F8",
        border: "#E0E4EF",
        text: "#1A2744",
        text2: "#4A5568",
        text3: "#8892A4",
        blue: "#2563eb",
        blue2: "#3b82f6",
        accent: "#4B7BE5",
        warn: "#E8A25A",
        danger: "#C0392B",
        green: "#27AE60",
      },
    },
  },
  plugins: [],
};