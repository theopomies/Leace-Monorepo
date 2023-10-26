/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@leace/tailwind-config")],
  theme: {
    extend: {
      backgroundColor: {
        landing:
          "linear-gradient(rgba(35, 25, 23, .48), rgba(35, 25, 23, .48))",
        interior:
          "linear-gradient(rgba(35, 25, 23, .48), rgba(35, 25, 23, .48))",
        church: "linear-gradient(rgba(35, 25, 23, .48), rgba(35, 25, 23, .48))",
      },
      gradientColorStops: (theme) => ({
        primary: "#FF8C00",
        secondary: "#FFA500",
        danger: "#FFD700",
      }),
      colors: {
        custom: "#002642",
        test: "bg-gradient-to-r from-red-300 to-green-300",
        navy: "#10316B",
      },
    },
  },
};
