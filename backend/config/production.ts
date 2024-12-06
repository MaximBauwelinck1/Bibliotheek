export default {
  log: {
    level: 'info',
    disabled: false,
  },
  auth: {
    maxDelay:5000,
    jwt:{
      expirationInterval: 60 * 60,
    },
  },
  port: 9000,
};
  