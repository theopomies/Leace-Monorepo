import mixpanel from "mixpanel-browser";

const token = "deec9b35aa5faaf668d776383d5b8f38";

mixpanel.init(token, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

export default mixpanel;
