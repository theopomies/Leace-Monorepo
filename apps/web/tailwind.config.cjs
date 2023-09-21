/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@leace/tailwind-config")],
  theme: {
    extend: {
      keyframes: {
        animated_gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },

        curtain: {
          "0%": {
            "column-gap": "110vw",
          },
          "100%": {
            gap: "2rem",
          },
        },
      },
      backgroundSize: {
        "300%": "300%",
      },
      animation: {
        gradient: "animated_gradient 6s ease infinite alternate",
        curtain: "0.5s curtain cubic-bezier(.86,0,.07,1) 1s both",
      },
    },
  },
};
