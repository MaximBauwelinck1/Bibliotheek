export default{
  cors: {
    origins: ['http://localhost:5173','https://frontendweb-2425-maximbauwelinck1-1.onrender.com'], 
    maxAge: 3 * 60 * 60, 
  },
  auth:{
    jwt: {
      audience: 'bibliotheek.hogent.be',
      issuer: 'bibliotheek.hogent.be',
      expirationInterval: 60 * 60, 
      secret:
          'DitIsEenVeelTeMoelijkeSecretOmGeradenTeWorden124fuohzfdhsudfsuig8§TF8GZYGZF182F7ZVY',
    },
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
  },
};