/* eslint-disable @stylistic/max-len */
import type { Prisma} from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import config from 'config';

const prisma = new PrismaClient(); 
const AANTAL_KOPIEËN_P_BOEK : number = Number(config.get<number>('kopieen'));
let res1 : boolean = true;
let res2 : boolean = true;
let res3 : boolean = true;

const boeken = [
  { id: '83f13cbe-4133-4ac8-931f-153074e30743', ISBN: '9780060850524', titel: 'Brave New World', genre: 'Dystopisch',            publicatie_datum: new Date('1932-09-01T00:00:00.000Z'), taal: 'Engels', paginas: 311, vrije_kopieen:4, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A dystopian novel set in a futuristic World State.', cover_uri: 'https://media.s-bol.com/Rw73j1xDn94R/5Q8JK5v/547x840.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'c1bdbf66-b1e5-4f01-9f16-e6e5b4e46c8e' },
  { id: '769bc105-e65e-497e-9780-df9d6b774486', ISBN: '9780062316097', titel: 'Fahrenheit 451', genre: 'Dystopisch',             publicatie_datum: new Date('1953-10-19T00:00:00.000Z'), taal: 'Engels', paginas: 158, vrije_kopieen: 3, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A dystopian novel about a future where books are banned.', cover_uri: 'https://media.s-bol.com/q9zZDYj46RBk/pG2j5r/546x840.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '2b4b0c1e-0e48-41c5-94f1-1c0c2a21507d' },
  { id: 'e15ff31f-3fcb-419c-bfef-4cbba0f77b37', ISBN: '9780451526533', titel: 'The Grapes of Wrath', genre: 'Fictie',          publicatie_datum: new Date('1939-04-14T00:00:00.000Z'), taal: 'Engels', paginas: 464, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about the struggles of a family during the Great Depression.', cover_uri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/The_Grapes_of_Wrath_%281939_1st_ed_cover%29.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'fa13b021-6da2-487e-92e0-8e444b6114f4' },
  { id: '14c7b399-0e0d-4339-b90d-29aa0bc44f42', ISBN: '9780316769488', titel: 'The Catcher in the Rye', genre: 'Fictie',       publicatie_datum: new Date('1951-07-16T00:00:00.000Z'), taal: 'Engels', paginas: 277, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A story about teenage rebellion and angst.', cover_uri: 'https://m.media-amazon.com/images/I/91fQEUwFMyL.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '1c4f276e-17a8-469e-b6b4-42d3d6d9b22d' },
  { id: 'f84c5f6e-0834-43e4-bc5e-052cf0ab93e7', ISBN: '9780452290225', titel: 'The Handmaid\'s Tale', genre: 'Dystopisch',       publicatie_datum: new Date('1985-04-17T00:00:00.000Z'), taal: 'Engels', paginas: 311, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A dystopian novel set in a totalitarian society.', cover_uri: 'https://m.media-amazon.com/images/I/61su39k8NUL._AC_UF1000,1000_QL80_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'e3025978-0e8d-42b0-8b3c-5d17560e29cd' },
  { id: '32edc71b-34c0-4114-b0c7-34cabece4200', ISBN: '9780307387412', titel: 'The Road', genre: 'Post-apocalyptisch',            publicatie_datum: new Date('2006-09-26T00:00:00.000Z'), taal: 'Engels', paginas: 287, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A harrowing tale of survival in a post-apocalyptic world.', cover_uri: 'https://m.media-amazon.com/images/I/41GuWgTvzoL._AC_SY780_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'c8a3cda4-4b3e-4bfc-982f-9f48c99da5f7' },
  { id: '823bf0a2-4f85-4ebd-8738-f56fbcce66c0', ISBN: '9780062457738', titel: 'Beloved', genre: 'Fictie',           publicatie_datum: new Date('1987-09-16T00:00:00.000Z'), taal: 'Engels', paginas: 324, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about the legacy of slavery and its effects.', cover_uri: 'https://media.s-bol.com/BQ2j47Z37G5N/p8gRng2/784x1200.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '7d6c79e2-1769-4bb0-a96d-39993bace7e6' },
  { id: '25ecf8c8-4452-43a6-bdc2-ef5ae8d3270d', ISBN: '9780061120084', titel: 'Life of Pi', genre: 'Aventuur',                 publicatie_datum: new Date('2001-09-11T00:00:00.000Z'), taal: 'Engels', paginas: 319, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about a boy stranded on a lifeboat with a Bengal tiger.', cover_uri: 'https://cdn.kobo.com/book-images/3e1e653a-a321-4122-b009-e6daba32966e/353/569/90/False/life-of-pi-11.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'a6d1e97a-bfc8-4828-9b2e-e09e7c82e96d' },
  { id: '94d1a3e7-cd53-4f57-bc26-2037446495b5', ISBN: '9780345803481', titel: 'The Goldfinch', genre: 'Fictie',       publicatie_datum: new Date('2013-09-13T00:00:00.000Z'), taal: 'Engels', paginas: 771, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about a boy whose life is turned upside down after a tragedy.', cover_uri: 'https://m.media-amazon.com/images/I/413DgSnVBdL._AC_SY780_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'f658c442-fd1f-45b3-91d8-56e1e2d070f3' },
  { id: 'c90f8f4e-2e0e-43d0-9738-6d9fa02891b9', ISBN: '9781524751165', titel: 'The Night Circus', genre: 'Fantasie',             publicatie_datum: new Date('2013-09-13T00:00:00.000Z'), taal: 'Engels', paginas: 387, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A magical competition between two young illusionists.', cover_uri: 'https://cdn.kobo.com/book-images/ebd620dd-420e-4e9f-820c-c24b91401d97/353/569/90/False/the-night-circus-2.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'ec185be2-55f2-4cb5-8aeb-3f1d9d54650b' },
  { id: 'c0956cb3-7a51-4718-a00b-b3d1c0e414c5', ISBN: '9780452290256', titel: 'Circe', genre: 'Fantasie',                        publicatie_datum: new Date('2018-04-10T00:00:00.000Z'), taal: 'Engels', paginas: 393, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A retelling of the story of Circe, the witch from Homer\'s Odyssey.', cover_uri: 'https://cdn.kobo.com/book-images/ab4cf5a3-99a8-4dda-8558-b162a3b0f1ee/353/569/90/False/circe-1-new-york-times-bestseller-1.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '7d6c79e2-1769-4bb0-a96d-39993bace7e6' },
  { id: 'c41a94f7-b8c2-47eb-a885-df39f3a25b84', ISBN: '9780062225580', titel: 'The Silent Patient', genre: 'Thriller', publicatie_datum: new Date('2019-02-05T00:00:00.000Z'), taal: 'Engels', paginas: 368, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A psychological thriller about a woman who stops speaking.', cover_uri: 'https://m.media-amazon.com/images/I/81y9uCHoxrL.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '6a54c4a2-e1a7-4b46-bc6e-96af3bb6019a'},
  { id: '3fd374ae-6ed9-4e83-9818-d2d48b22d3d1', ISBN: '9780451524935', titel: 'War and Peace', genre: 'Fictie',     publicatie_datum: new Date('1869-01-01T00:00:00.000Z'), taal: 'Russisch', paginas: 1225, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'An epic novel about the impact of the Napoleonic Wars.', cover_uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwxIf--zUtIsNgDGRfg3-ZMAP36AmZOqlD_A&s', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '6fe8d9cb-d214-4749-b5f3-b4e3ff51bc53' },
  { id: '83784dc5-619c-4c25-b4a1-02b2a4ebc3b5', ISBN: '9780142437247', titel: 'Jane Eyre', genre: 'Romantiek',                    publicatie_datum: new Date('1847-10-16T00:00:00.000Z'), taal: 'Engels', paginas: 500, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A story about an orphaned girl finding love and independence.', cover_uri: 'https://m.media-amazon.com/images/I/81pwJjgcwwL._AC_UF1000,1000_QL80_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'e55a74aa-23ba-44be-9478-905209d6d520' },
  { id: 'd167dd47-4771-4a69-b300-237fd5f96cf4', ISBN: '9780451531381', titel: 'Around the World in Eighty Days', genre: 'Aventuur', publicatie_datum: new Date('1873-01-01T00:00:00.000Z'), taal: 'Frans', paginas: 260, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A classic adventure novel about Phileas Fogg.', cover_uri: 'https://media.s-bol.com/mWW9o9058KWE/Z6r03lJ/543x840.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'da5d1dff-e67f-45d1-a4c7-e17224fd84d5' },
  { id: '0d488f91-fc88-4b86-8c87-81d062c39161', ISBN: '9780151010264', titel: 'To the Lighthouse', genre: 'Fictie',   publicatie_datum: new Date('1927-04-01T00:00:00.000Z'), taal: 'Engels', paginas: 209, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel that explores the complexities of human relationships.', cover_uri: 'https://cdn.kobo.com/book-images/44a61bb8-c82b-47b5-b669-975f49cf9e64/353/569/90/False/to-the-lighthouse-125.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '1d605373-bd2d-490b-9179-f4f0e58846e5' },
  
  { id: '7faebd97-b4c7-42fa-8e0c-5e473ef90f85', ISBN: '9780140439014', titel: 'Middlemarch', genre: 'Fictie',       publicatie_datum: new Date('1871-01-01T00:00:00.000Z'), taal: 'Engels', paginas: 880, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A study of provincial life in Victorian England.', cover_uri: 'https://m.media-amazon.com/images/I/81V+uoQjj1L._AC_UF1000,1000_QL80_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '6fe8d9cb-d214-4749-b5f3-b4e3ff51bc53' },
  { id: '4b8e09b3-6e1b-4e1c-aef3-63ff0830e68f', ISBN: '9780143039403', titel: 'The Picture of Dorian Gray', genre: 'Fictie', publicatie_datum: new Date('1890-01-01T00:00:00.000Z'), taal: 'Engels', paginas: 272, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about a man who remains eternally young while his portrait ages.', cover_uri: 'https://media.s-bol.com/mlwERDK38Xp/536x840.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '1b4c0f82-2e1f-4c5c-b13c-88d1a5469efb' },
  { id: '517e20e6-2b1c-44ab-beb3-5dc504f34d93', ISBN: '9780143111812', titel: 'The Alchemist', genre: 'Aventuur',              publicatie_datum: new Date('1988-05-01T00:00:00.000Z'), taal: 'Portugees', paginas: 208, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A young shepherd named Santiago pursues his personal legend.', cover_uri: 'https://cdn.standaardboekhandel.be/product/9789029544757/front-medium-2151891644.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'da831f66-26a0-4265-81ab-cba53f6038a4' },
  { id: '8f47b12b-f58e-4fa8-b3b8-e3707ae3c1dc', ISBN: '9780452284239', titel: 'The Kite Runner', genre: 'Fictie',   publicatie_datum: new Date('2003-05-29T00:00:00.000Z'), taal: 'Engels', paginas: 371, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A story about friendship and redemption set against the backdrop of a changing Afghanistan.', cover_uri: 'https://static.fnac-static.com/multimedia/Images/FR/NR/2c/bb/73/7584556/1507-1/tsp20230313162452/The-kite-runner.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '7d6c79e2-1769-4bb0-a96d-39993bace7e6' },
  { id: 'a25e0c2f-e539-43a6-bf85-2d83d282ba7a', ISBN: '9780064407664', titel: 'The Giver', genre: 'Dystopisch',                  publicatie_datum: new Date('1993-04-26T00:00:00.000Z'), taal: 'Engels', paginas: 179, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about a society devoid of emotion.', cover_uri: 'https://cdn.kobo.com/book-images/11642f28-71d9-438e-a653-a6710b3179a4/1200/1200/False/the-giver-5.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'f0e8b66a-d20a-4f2b-a96e-4604f9b8de7e' },
  { id: '79ae1c74-2e58-4901-833c-7c4db69be5cb', ISBN: '9780743273565', titel: 'The Fault in Our Stars', genre: 'Romantiek',   publicatie_datum: new Date('2012-01-10T00:00:00.000Z'), taal: 'Engels', paginas: 313, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about love and illness among teenagers.', cover_uri: 'https://media.s-bol.com/1Qzlk3DvK23o/2xkzlVK/549x840.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'c63ab17a-48c2-4810-8773-32078cbda8e4' },
  { id: '8e659f88-e743-46b2-93b3-3774d79ae708', ISBN: '9780064407688', titel: 'Holes', genre: 'Aventuur',                      publicatie_datum: new Date('1998-05-21T00:00:00.000Z'), taal: 'Engels', paginas: 233, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A story about a boy sent to a juvenile detention camp.', cover_uri: 'https://media.s-bol.com/mn6kPwK4n1Qp/vPZ52r/550x809.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '5cd4f8de-5764-4a99-9010-2a7bc72ed9e4' },
  { id: '949b4f8f-f8ff-486f-a320-5e3b7096f674', ISBN: '9780452290255', titel: 'Educated', genre: 'Memoir',                      publicatie_datum: new Date('2018-02-20T00:00:00.000Z'), taal: 'Engels', paginas: 334, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A memoir about a woman who grows up in a strict and abusive household in rural Idaho.', cover_uri: 'https://m.media-amazon.com/images/I/41GE5-l2ptL._AC_SY780_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'a5e89d64-b7e6-41c0-9cb4-9c94700546b7' },
  { id: '84b51ee1-8a96-4c1b-bc1e-b1e97b1c8c90', ISBN: '9780452290378', titel: 'Becoming', genre: 'Memoir',                      publicatie_datum: new Date('2018-11-13T00:00:00.000Z'), taal: 'Engels', paginas: 448, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A memoir by Michelle Obama.', cover_uri: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528206996i/38746485.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'b1e4e7a5-5c98-4a9d-a7d8-bba8e9b9f5f3' },
  { id: 'c19f0cc8-1be1-44ed-b07f-7b596ba80f62', ISBN: '9780525564185', titel: 'Where the Crawdads Sing', genre: 'Fictie', publicatie_datum: new Date('2018-08-14T00:00:00.000Z'), taal: 'Engels', paginas: 368, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A coming-of-age mystery set in the marshes of North Carolina.', cover_uri: 'https://cdn.standaardboekhandel.be/product/9781472154668/front-medium-438473811.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'f2e42d69-0f1f-47a6-90a4-1e6f0c33756e' },
  { id: '2ae1fbc2-04a3-493f-b83f-f58836d733af', ISBN: '9780679603100', titel: 'A Tale of Two Cities', genre: 'Fictie', publicatie_datum: new Date('1859-04-30T00:00:00.000Z'), taal: 'Engels', paginas: 489, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel set before and during the French Revolution.', cover_uri: 'https://m.media-amazon.com/images/I/81nmItWccYL._AC_UF1000,1000_QL80_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'e6a5f8c2-f67d-4b73-bd9e-7cde93e84868' },
  { id: 'af0e0380-b57f-41ea-9a3d-6938994574b1', ISBN: '9780446310789', titel: 'The Old Man and the Sea', genre: 'Fictie', publicatie_datum: new Date('1952-09-01T00:00:00.000Z'), taal: 'Engels', paginas: 127, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A story about an old fisherman and his struggle with a marlin.', cover_uri: 'https://cdn.kobo.com/book-images/7a7e773d-b4a5-405e-b2d2-f7eb290eda93/353/569/90/False/the-old-man-and-the-sea-69.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'a0c23d90-48b4-4efb-8a34-7ab7a4bb1b96' },
  { id: 'dbd7b9ab-1e3b-46b5-b53b-baf30e3f5f4f', ISBN: '9780140449182', titel: 'Crime and Punishment', genre: 'Fictie', publicatie_datum: new Date('1866-01-01T00:00:00.000Z'), taal: 'Russisch', paginas: 430, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about morality and the consequences of crime.', cover_uri: 'https://cdn.kobo.com/book-images/fd843459-3520-49f9-a18e-907940466cf7/1200/1200/False/crime-and-punishment-270.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '0e9c38ed-14bc-4c5d-9e95-8de69e5f29a6' },
  { id: '1770a4d5-b5f6-4ac0-9823-bc71eaf5c733', ISBN: '9780571081783', titel: 'The Bell Jar', genre: 'Fictie',                 publicatie_datum: new Date('1963-01-01T00:00:00.000Z'), taal: 'Engels', paginas: 288, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel that explores the struggles of a young woman.', cover_uri: 'https://m.media-amazon.com/images/I/41MSk1PGEdL._AC_SY580_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '3e57ab6e-d588-493b-b55b-150640c5c5bc' },
  { id: 'b3b7dc1b-62cf-4bba-802b-8c798a20f9b3', ISBN: '9780143128537', titel: 'Little Fires Everywhere', genre: 'Fictie', publicatie_datum: new Date('2017-09-12T00:00:00.000Z'), taal: 'Engels', paginas: 350, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A novel about the intertwined lives of two families in suburban Ohio.', cover_uri: 'https://m.media-amazon.com/images/I/81AjiGx9xLL._AC_UF1000,1000_QL80_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: 'f3e8e5c0-5c8d-4c9d-bb2e-0f66c3fc7c60' },
  { id: '9f9fc0be-e005-4fd6-8c43-59274e4d6cb0', ISBN: '9780553573420', titel: 'The Hitchhiker\'s Guide to the Galaxy', genre: 'Science Fiction', publicatie_datum: new Date('1979-10-12T00:00:00.000Z'), taal: 'Engels', paginas: 224, vrije_kopieen: AANTAL_KOPIEËN_P_BOEK, totale_kopieen: AANTAL_KOPIEËN_P_BOEK, beschrijving: 'A humorous take on space travel and life in the universe.', cover_uri: 'https://m.media-amazon.com/images/I/51t6CoO269L._AC_SY780_.jpg', aangemaakt: '2024-01-01T12:00:00Z', upgedate: '2024-01-01T12:00:00Z', auteur_id: '68f8d5cb-cc1c-4e6f-8736-9a94294bdf6e' },

];

function geefRandomInformBoekKopie(): string{
  const getal = Math.floor(Math.random() * 11);
  if (getal <=1){
    return 'Voorzijde lichtjes beschadigd.';
  } else if(getal <=2){
    return 'Geschreven in boek.';
  } else if(getal <=3){
    return 'bevat losse paginas\'';
  } else{
    return 'perfecte conditie';
  }

}
async function main() {
  const boek_kopieen : Prisma.BoekKopieCreateManyInput[] = [];
  const boek_kopieen_res : string[] = []; 
  boeken.forEach((b) =>{
    for (let i = 0; i < b.totale_kopieen; i++) {
      boek_kopieen.push(
        ({
          id:randomUUID(),
          boek_id:b.id,
          status:'beschikbaar',
          extra_informatie: geefRandomInformBoekKopie(),
          aangemaakt: new Date(),
          upgedate: new Date(),
        }),
      );
    }
  });

  // om 3 kopieen te veranderen naar status gereserveerd
  boek_kopieen.forEach((b) =>{
    if(b.boek_id == '83f13cbe-4133-4ac8-931f-153074e30743' && res1){
      res1 = false;
      b.status = 'gereserveerd';
      boek_kopieen_res.push(b.id?b.id:'onmogelijk');
    } else if (b.boek_id == '769bc105-e65e-497e-9780-df9d6b774486' && res2){
      res2 = false;
      b.status = 'gereserveerd';
      boek_kopieen_res.push(b.id?b.id:'onmogelijk');
    } else if (b.boek_id == '769bc105-e65e-497e-9780-df9d6b774486' && res3){
      res3 = false;
      b.status = 'gereserveerd';
      boek_kopieen_res.push(b.id?b.id:'onmogelijk');
    }
  });
  await prisma.auteur.createMany({
    data: [
      { id: 'a1d3c945-e59a-4a78-8677-0d8d66e40091', voornaam: 'Gabriel', achternaam: 'Garcia Marquez', geboortedatum: new Date('1927-03-06T00:00:00.000Z'), nationaliteit: 'Colombian', biografie: 'Known for One Hundred Years of Solitude.' },
      { id: 'c1bdbf66-b1e5-4f01-9f16-e6e5b4e46c8e', voornaam: 'George', achternaam: 'Orwell', geboortedatum: new Date('1903-06-25T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Famous for dystopian novels like 1984.' },
      { id: '6d8f9e60-1b69-4748-8355-4f3e3b1d8e4b', voornaam: 'Jane', achternaam: 'Austen', geboortedatum: new Date('1775-12-16T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for her novels on romantic fiction.' },
      { id: 'fa13b021-6da2-487e-92e0-8e444b6114f4', voornaam: 'Mark', achternaam: 'Twain', geboortedatum: new Date('1835-11-30T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Famous for The Adventures of Tom Sawyer and Huckleberry Finn.' },
      { id: '0ed7b6b0-1903-4bcd-bf89-8c89c11f0f29', voornaam: 'F. Scott', achternaam: 'Fitzgerald', geboortedatum: new Date('1896-09-24T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for The Great Gatsby.' },
      { id: '6c66f80a-1fef-469c-8ee7-eef073e5e20b', voornaam: 'Ernest', achternaam: 'Hemingway', geboortedatum: new Date('1899-07-21T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Famous for works like The Old Man and the Sea.' },
      { id: '7d6c79e2-1769-4bb0-a96d-39993bace7e6', voornaam: 'J.K.', achternaam: 'Rowling', geboortedatum: new Date('1965-07-31T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for the Harry Potter series.' },
      { id: 'a6d1e97a-bfc8-4828-9b2e-e09e7c82e96d', voornaam: 'J.R.R.', achternaam: 'Tolkien', geboortedatum: new Date('1892-09-12T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for The Lord of the Rings.' },
      { id: '3f9cb5da-b7d5-4646-b476-4717f8822a46', voornaam: 'Stephen', achternaam: 'King', geboortedatum: new Date('1947-09-21T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Famous for horror novels like It and The Shining.' },
      { id: '917c22a8-48b8-44f4-95b4-8f3943456c5c', voornaam: 'Agatha', achternaam: 'Christie', geboortedatum: new Date('1890-09-15T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for her detective novels featuring Hercule Poirot.' },
      { id: '2b4b0c1e-0e48-41c5-94f1-1c0c2a21507d', voornaam: 'Ray', achternaam: 'Bradbury', geboortedatum: new Date('1920-08-22T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for The Martian Chronicles.' },
      { id: '4b2a6597-b375-4b0d-8a38-e3c85cf2e9c5', voornaam: 'Isaac', achternaam: 'Asimov', geboortedatum: new Date('1920-01-02T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for his works on science fiction and popular science.' },
      { id: 'e3025978-0e8d-42b0-8b3c-5d17560e29cd', voornaam: 'Margaret', achternaam: 'Atwood', geboortedatum: new Date('1939-11-18T00:00:00.000Z'), nationaliteit: 'Canadian', biografie: 'Known for The Handmaid\'s Tale.' },
      { id: 'ec185be2-55f2-4cb5-8aeb-3f1d9d54650b', voornaam: 'Chimamanda', achternaam: 'Ngozi Adichie', geboortedatum: new Date('1977-09-15T00:00:00.000Z'), nationaliteit: 'Nigerian', biografie: 'Known for Half of a Yellow Sun.' },
      { id: 'c8a3cda4-4b3e-4bfc-982f-9f48c99da5f7', voornaam: 'Cormac', achternaam: 'McCarthy', geboortedatum: new Date('1933-07-20T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for The Road.' },
      { id: '64a1f33c-44ef-4db2-8e35-8cc3d291dd47', voornaam: 'Harper', achternaam: 'Lee', geboortedatum: new Date('1926-04-28T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for To Kill a Mockingbird.' },
      { id: '6fe8d9cb-d214-4749-b5f3-b4e3ff51bc53', voornaam: 'Leo', achternaam: 'Tolstoy', geboortedatum: new Date('1828-09-09T00:00:00.000Z'), nationaliteit: 'Russian', biografie: 'Known for War and Peace.' },
      { id: 'e55a74aa-23ba-44be-9478-905209d6d520', voornaam: 'Charlotte', achternaam: 'Bronte', geboortedatum: new Date('1816-04-21T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for Jane Eyre.' },
      { id: 'da5d1dff-e67f-45d1-a4c7-e17224fd84d5', voornaam: 'Jules', achternaam: 'Verne', geboortedatum: new Date('1828-02-08T00:00:00.000Z'), nationaliteit: 'French', biografie: 'Pioneer of science fiction.' },
      { id: '1d605373-bd2d-490b-9179-f4f0e58846e5', voornaam: 'Virginia', achternaam: 'Woolf', geboortedatum: new Date('1882-01-25T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for Mrs. Dalloway and To the Lighthouse.' },
      { id: 'da831f66-26a0-4265-81ab-cba53f6038a4', voornaam: 'Gabriel', achternaam: 'Garcia Marquez', geboortedatum: new Date('1927-03-06T00:00:00.000Z'), nationaliteit: 'Colombian', biografie: 'Known for magical realism.' },
      { id: '8b234e4c-8e04-451e-8a46-befbfe6f49b0', voornaam: 'Herman', achternaam: 'Melville', geboortedatum: new Date('1819-08-01T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for Moby-Dick.' },
      { id: 'bf220fa2-6f2e-4c7e-97c2-46da94b0f907', voornaam: 'Dante', achternaam: 'Alighieri', geboortedatum: new Date('1265-06-01T00:00:00.000Z'), nationaliteit: 'Italian', biografie: 'Famous for The Divine Comedy.' },
      { id: '0e9c38ed-14bc-4c5d-9e95-8de69e5f29a6', voornaam: 'Franz', achternaam: 'Kafka', geboortedatum: new Date('1883-07-03T00:00:00.000Z'), nationaliteit: 'Austrian', biografie: 'Known for The Metamorphosis.' },
      { id: '8f3884ff-66d3-484f-b495-52b63d2ac14b', voornaam: 'Kurt', achternaam: 'Vonnegut', geboortedatum: new Date('1922-11-11T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for Slaughterhouse-Five.' },
      { id: '1e9e2f70-4088-496f-8f7e-bf0a02f7081f', voornaam: 'Salman', achternaam: 'Rushdie', geboortedatum: new Date('1947-06-19T00:00:00.000Z'), nationaliteit: 'British-Indian', biografie: 'Known for Midnight\'s Children.' },
      { id: 'c63ab17a-48c2-4810-8773-32078cbda8e4', voornaam: 'Zadie', achternaam: 'Smith', geboortedatum: new Date('1975-10-25T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for White Teeth.' },
      { id: '6f73cc81-4c5c-404e-9641-3de6018057f3', voornaam: 'Toni', achternaam: 'Morrison', geboortedatum: new Date('1931-02-18T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for Beloved.' },
      { id: '59e81bb5-17d8-4fb0-91e4-3cfd3c0c03f2', voornaam: 'John', achternaam: 'Grisham', geboortedatum: new Date('1955-02-08T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for legal thrillers.' },
      { id: '1bc55870-c057-46e8-bd61-b9aa09517c00', voornaam: 'C.S.', achternaam: 'Lewis', geboortedatum: new Date('1898-11-29T00:00:00.000Z'), nationaliteit: 'British', biografie: 'Known for The Chronicles of Narnia.' },
      { id: '5cd4f8de-5764-4a99-9010-2a7bc72ed9e4', voornaam: 'Philip', achternaam: 'K. Dick', geboortedatum: new Date('1928-12-16T00:00:00.000Z'), nationaliteit: 'American', biografie: 'Known for Do Androids Dream of Electric Sheep?' },
      { 
        id: 'e6a5f8c2-f67d-4b73-bd9e-7cde93e84868', 
        voornaam: 'Charles', 
        achternaam: 'Dickens', 
        geboortedatum: new Date('1812-02-07T00:00:00.000Z'), 
        nationaliteit: 'British', 
        biografie: 'A prolific English novelist, Dickens is known for his vivid characters and depictions of Victorian society. His famous works include A Christmas Carol, Great Expectations, and Oliver Twist.',
      },
      { 
        id: 'b1e4e7a5-5c98-4a9d-a7d8-bba8e9b9f5f3', 
        voornaam: 'Michelle', 
        achternaam: 'Obama', 
        geboortedatum: new Date('1964-01-17T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Michelle Obama is an American attorney and author who served as the First Lady of the United States from 2009 to 2017. She is known for her advocacy on education, healthy eating, and military families, as well as her best-selling memoir, Becoming.',
      },{ 
        id: 'a5e89d64-b7e6-41c0-9cb4-9c94700546b7', 
        voornaam: 'Tara', 
        achternaam: 'Westover', 
        geboortedatum: new Date('1986-09-27T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Tara Westover is an American author and historian best known for her memoir, Educated, which chronicles her experiences growing up in a strict and abusive household in rural Idaho and her quest for knowledge that ultimately leads her to earn a PhD from Cambridge University.',
      },
      { 
        id: 'f3e8e5c0-5c8d-4c9d-bb2e-0f66c3fc7c60', 
        voornaam: 'Celeste', 
        achternaam: 'Ng', 
        geboortedatum: new Date('1980-07-30T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Celeste Ng is an American author known for her novels Everything I Never Told You and Little Fires Everywhere. Her works often explore themes of family, race, and identity, reflecting her experiences as a second-generation Chinese American.',
      },
      { 
        id: '3e57ab6e-d588-493b-b55b-150640c5c5bc', 
        voornaam: 'Sylvia', 
        achternaam: 'Plath', 
        geboortedatum: new Date('1932-10-27T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Sylvia Plath was an American poet, novelist, and short-story writer known for her confessional style of writing. Her most famous works include The Bell Jar and her poetry collections Ariel and The Colossus. Plath’s work explores themes of identity, mental illness, and the complexities of womanhood.',
      },
      { 
        id: '1c4f276e-17a8-469e-b6b4-42d3d6d9b22d', 
        voornaam: 'Jerome David', 
        achternaam: 'Salinger', 
        geboortedatum: new Date('1919-01-01T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'J.D. Salinger was an American author best known for his novel The Catcher in the Rye, which has become a classic of American literature. Salinger’s work often explores themes of teenage angst and alienation. He was known for his reclusive nature, having withdrawn from public life after the success of his first novel.',
      },
      { 
        id: 'f0e8b66a-d20a-4f2b-a96e-4604f9b8de7e', 
        voornaam: 'Lois', 
        achternaam: 'Lowry', 
        geboortedatum: new Date('1937-03-20T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Lois Lowry is an American author known for her children’s and young adult literature. She has won numerous awards, including two Newbery Medals for her books Number the Stars and The Giver. Lowry’s works often explore themes of memory, individuality, and the complexities of human experience.',
      },
      { 
        id: 'f658c442-fd1f-45b3-91d8-56e1e2d070f3', 
        voornaam: 'Donna', 
        achternaam: 'Tartt', 
        geboortedatum: new Date('1963-09-23T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Donna Tartt is an American author best known for her novels The Secret History, The Little Friend, and The Goldfinch, which won the Pulitzer Prize for Fiction in 2014. Tartt’s works often delve into themes of obsession, morality, and the impact of the past on the present.',
      },
      { 
        id: '68f8d5cb-cc1c-4e6f-8736-9a94294bdf6e', 
        voornaam: 'Douglas', 
        achternaam: 'Adams', 
        geboortedatum: new Date('1952-03-11T00:00:00.000Z'), 
        nationaliteit: 'British', 
        biografie: 'Douglas Adams was a British author, humorist, and dramatist best known for his science fiction series The Hitchhiker\'s Guide to the Galaxy. His works are renowned for their wit, philosophical insights, and commentary on life, technology, and the absurdity of existence.',
      },
      { 
        id: 'a0c23d90-48b4-4efb-8a34-7ab7a4bb1b96', 
        voornaam: 'Ernest', 
        achternaam: 'Hemingway', 
        geboortedatum: new Date('1899-07-21T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Ernest Hemingway was an American novelist, short story writer, and journalist. He is known for his succinct and economical prose style and his adventurous life, which greatly influenced his writing. His notable works include The Old Man and the Sea, A Farewell to Arms, and For Whom the Bell Tolls.',
      },
      { 
        id: '1b4c0f82-2e1f-4c5c-b13c-88d1a5469efb', 
        voornaam: 'Oscar', 
        achternaam: 'Wilde', 
        geboortedatum: new Date('1854-10-16T00:00:00.000Z'), 
        nationaliteit: 'Irish', 
        biografie: 'Oscar Wilde was an Irish poet and playwright known for his flamboyant style, wit, and social critique. He gained fame for his works including The Picture of Dorian Gray and The Importance of Being Earnest. Wilde was a prominent figure in the late Victorian era, celebrated for his biting humor and critique of social norms.',
      },
      { 
        id: '6a54c4a2-e1a7-4b46-bc6e-96af3bb6019a', 
        voornaam: 'Alex', 
        achternaam: 'Michaelides', 
        geboortedatum: new Date('1977-02-04T00:00:00.000Z'), 
        nationaliteit: 'Cypriot', 
        biografie: 'Alex Michaelides is a Cypriot author known for his psychological thrillers, particularly his debut novel, The Silent Patient, which became an international bestseller. He has a background in screenwriting, which influences his narrative style and character development in his novels.',
      },
      { 
        id: 'f2e42d69-0f1f-47a6-90a4-1e6f0c33756e', 
        voornaam: 'Delia', 
        achternaam: 'Owens', 
        geboortedatum: new Date('1949-04-04T00:00:00.000Z'), 
        nationaliteit: 'American', 
        biografie: 'Delia Owens is an American author and wildlife scientist, best known for her debut novel, Where the Crawdads Sing, which has garnered critical acclaim and commercial success. With a background in natural science, her writing often incorporates themes of nature and human connection to the wild.',
      },
    ],
  });
    
  await prisma.boek.createMany({
    data:  boeken,
  });

  await prisma.boekKopie.createMany({
    data: boek_kopieen,
  });

  await prisma.gebruiker.createMany({
    data: [
      {
        id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
        voornaam: 'John',
        achternaam: 'Doe',
        geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
        email: 'john.doe@example.com',
        rol: 'user',
        hashed_password: 'hashedpassword123',
        salt: 'randomsaltvalue',
      },
      {
        id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
        voornaam: 'Jane',
        achternaam: 'Smith',
        geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
        email: 'jane.smith@example.com',
        rol: 'admin',
        hashed_password: 'hashedpassword456',
        salt: 'anotherrandomsaltvalue',
      }],
  });
   
  const boekId_kopie1 : string= boek_kopieen_res[0]?boek_kopieen_res[0]:'onmogelijk';
  const boekId_kopie2 : string= boek_kopieen_res[1]?boek_kopieen_res[1]:'onmogelijk';
  const boekId_kopie3 : string= boek_kopieen_res[2]?boek_kopieen_res[2]:'onmogelijk';
  await prisma.reservatie.createMany({
    data: [
      {
        id: '44b6af06-67c2-415b-9c82-46c5b1dd1296',
        boek_kopie_id: boekId_kopie1,
        gebruiker_id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
        startdatum: '2024-02-01T12:00:00Z',
        einddatum: '2024-02-15T12:00:00Z',
        status: 'actief',
      },
      {
        id: '39726655-4a76-404f-9c0a-684f7bed5248',
        boek_kopie_id: boekId_kopie2,
        gebruiker_id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
        startdatum: '2024-02-10T12:00:00Z',
        einddatum: '2024-02-20T12:00:00Z',
        status: 'actief',
      },
      {
        id: '519441d9-0f90-4f90-a44b-0a7ede6a1979',
        boek_kopie_id: boekId_kopie3,
        gebruiker_id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
        startdatum: '2024-02-10T12:00:00Z',
        einddatum: '2024-02-20T12:00:00Z',
        status: 'actief',
      }],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
