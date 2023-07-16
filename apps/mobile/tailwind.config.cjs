/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@leace/tailwind-config")],
  theme: {
    extend: {
      gradientColorStops: (theme) => ({
        primary: "#FF8C00",
        secondary: "#FFA500",
        danger: "#FFD700",
      }),
      colors: {
        custom: "#002642",
      },
    },
  },
};
