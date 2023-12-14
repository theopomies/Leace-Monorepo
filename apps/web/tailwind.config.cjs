/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@leace/tailwind-config")],
  theme: {
    fontFamily: {
      display: ["Questrial", "sans-serif"],
      body: ["Inter", "sans-serif"],
    },
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
      dropShadow: {
        like: "0px 5px 5px rgba(99, 222, 154, 0.7)",
        dislike: "0px 5px 5px rgba(255, 106, 79, 0.7)",
        rewind: "0px 5px 5px rgba(247, 211, 50, 0.7)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
