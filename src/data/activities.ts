import type { Activity, DayMeals } from '@/types';

export const activities: Record<number, Activity[]> = {
  1: [
    { lat:34.4272, lng:135.2441, title:"Kansai International Airport",     time:"Afternoon",  type:"transit",    desc:"Renzo Piano's artificial island terminal. Customs and bags clear smoothly, then straight to the Haruka Limited Express platform for the 75-minute non-stop glide to Kyoto." , duration:"~1.5 hrs"},
    { lat:34.9875, lng:135.7726, title:"Hyatt Regency Kyoto",              time:"05:30 PM",   type:"hotel",      desc:"In Shichijo at the southern edge of Higashiyama — cedar wood accents, paper lanterns, and serene bamboo gardens. Settle in, unpack for 7 nights, and begin the journey." , duration:"check-in"},
    { lat:35.0050, lng:135.7655, title:"Obanzai Dinner, Higashiyama",      time:"08:00 PM",   type:"restaurant", desc:"Kyoto's traditional home cooking — small handcrafted dishes of pickled mountain vegetables, simmered seasonal tofu, grilled river fish, and sweet tamago in lacquerware. The perfect restorative first meal in Japan." , duration:"~2 hrs"},
  ],
  2: [
    { lat:34.9880, lng:135.7732, title:"Sanjusangen-do",                   time:"09:30 AM",   type:"museum",     desc:"A 120-metre wooden hall containing 1,001 gilded Kannon statues in serried ranks — each face carved with distinct expression between the 12th and 13th centuries. Three minutes walk from the hotel. No photography inside ensures complete, reverent silence." , duration:"~1.5 hrs"},
    { lat:34.9990, lng:135.7790, title:"Higashiyama — Sannen-zaka & Ninenzaka", time:"02:00 PM", type:"nature",   desc:"The historic stone-paved lanes climbing through Higashiyama's preservation district — wooden machiya townhouses, traditional ceramic shops, and the iconic Yasaka Pagoda framed overhead. Stop for fresh matcha soft-serve." , duration:"~2 hrs"},
    { lat:34.9671, lng:135.7727, title:"Fushimi Inari Taisha",             time:"05:00 PM",   type:"museum",     desc:"Ten thousand vermillion torii gates winding up the sacred slopes of Mt. Inari. While the lower paths are bustling, the upper mountain stations empty out at dusk. The summit is silent, lantern-lit, and mystical." , duration:"~2 hrs"},
  ],
  3: [
    { lat:35.0270, lng:135.7982, title:"Ginkaku-ji Silver Pavilion",       time:"09:00 AM",   type:"museum",     desc:"The iconic Zen temple in eastern Kyoto. The kogetsudai sand cone is meticulously raked to reflect moonlight, and the shaded moss gardens climbing the hillside provide stunning vistas over the city." , duration:"~1.5 hrs"},
    { lat:35.0180, lng:135.7930, title:"Philosopher's Path",               time:"10:45 AM",   type:"nature",     desc:"Two kilometres of tranquil canal path lined with cherry trees and hydrangeas between the Silver Pavilion and Nanzen-ji, named for philosopher Nishida Kitaro who walked it in meditation daily." , duration:"~45 min"},
    { lat:35.0116, lng:135.7937, title:"Nanzen-ji Temple & Aqueduct",      time:"01:00 PM",   type:"museum",     desc:"A grand Zen complex whose grounds feature a dramatic 1890 red-brick Roman aqueduct — an unexpected architectural juxtaposition enveloped by ancient pine trees and moss." , optional:true, duration:"~1 hr"},
    { lat:35.0160, lng:135.7829, title:"Heian Shrine & Okazaki Garden",    time:"02:30 PM",   type:"museum",     desc:"33,000 square metres of strolling garden behind Heian Shrine with a covered wooden bridge over the koi pond. In late spring and early June, irises and wisteria are in full bloom." , duration:"~1.5 hrs"},
    { lat:35.0116, lng:135.7915, title:"Yudofu at Junsei",                 time:"07:00 PM",   type:"restaurant", desc:"Kyoto silken tofu gently simmered in kombu dashi broth inside Nanzen-ji's historic garden. Dipped in toasted sesame sauce and fresh ginger, it is pure culinary elegance." , duration:"~1.5 hrs"},
    { lat:35.0050, lng:135.7695, title:"Pontocho Alley",                    time:"09:00 PM",   type:"restaurant", desc:"A lantern-lit pedestrian alley running parallel to the Kamo River. Find a narrow bar with a kamo-gawa river terrace, order local cold sake, and listen to the water flow." , duration:"~1.5 hrs"},
  ],
  4: [
    { lat:35.0345, lng:135.7186, title:"Ryoan-ji Zen Garden",              time:"08:30 AM",   type:"museum",     desc:"Fifteen stones placed in a sea of raked white gravel. From any vantage point on the wooden veranda, at least one stone remains hidden from sight. A 500-year-old masterpiece of Zen contemplation." , duration:"~1.5 hrs"},
    { lat:35.0394, lng:135.7292, title:"Kinkaku-ji Golden Pavilion",       time:"10:15 AM",   type:"museum",     desc:"The top two floors covered in pure gold leaf, reflected across the Kyoko-chi mirror pond. Breathtaking in the morning sunlight." , duration:"~45 min"},
    { lat:35.0556, lng:135.7441, title:"Daitoku-ji Sub-temples",           time:"11:30 AM",   type:"museum",     desc:"The great walled Zen monastery complex of northern Kyoto — 23 sub-temples with extraordinary dry landscape gardens that most tourists overlook. Walk slowly and embrace the quiet." , duration:"~2 hrs"},
    { lat:35.0050, lng:135.7655, title:"Nishiki Market",                   time:"02:00 PM",   type:"shop",       desc:"Five blocks of Kyoto's 400-year-old market — tamagoyaki skewers, freshly pressed sesame oils, yuba tofu sheets, and artisan culinary knives." , duration:"~1.5 hrs"},
    { lat:35.0061, lng:135.7700, title:"Pontocho — Afternoon Sake",         time:"05:00 PM",   type:"restaurant", desc:"Relax with a tasting flight of local Kyoto Fushimi junmai daiginjo sake before dinner." , duration:"~1 hr"},
    { lat:35.0050, lng:135.7687, title:"Kaiseki at Nakamura",              time:"07:00 PM",   type:"restaurant", desc:"Founded in 1716 near Nishiki. 3-star culinary mastery across twelve courses highlighting seasonal hamo (pike conger) and Kyoto heirloom vegetables in a historic wooden machiya." , duration:"~2.5 hrs"},
  ],
  5: [
    { lat:34.9875, lng:135.7388, title:"Takagamine Tea Ceremony, Hyatt",   time:"10:00 AM",   type:"restaurant", desc:"A private tea ceremony at the hotel's traditional tea pavilion — stone-ground matcha whisked in heirloom raku pottery, seasonal wagashi sweets, and meditative silence." , duration:"~1.5 hrs"},
    { lat:35.0050, lng:135.7655, title:"Nishiki Market Artisan Crawl",     time:"01:00 PM",   type:"shop",       desc:"Explore the traditional lacquerware, handmade ceramics, and tea purveyors surrounding the historic market quarter." , duration:"~1.5 hrs"},
    { lat:34.9875, lng:135.7726, title:"Traditional Kyoto Shiatsu Massage, RIRAKU", time:"03:30 PM", type:"nature", desc:"Traditional Japanese Shiatsu acupressure at Hyatt's award-winning RIRAKU Spa in Higashiyama. Deep meridian finger-pressure release tailored to alleviate walking fatigue, using warm camellia oils and heated herbal pillows. Restorative and deeply grounding." , duration:"~1.5 hrs"},
    { lat:35.0037, lng:135.7765, title:"Gion Evening Walk",               time:"06:30 PM",   type:"nature",     desc:"The stone-paved lanes behind Yasaka Shrine and along the Shirakawa canal as lanterns flicker on and geiko and maiko hurry to evening appointments." , duration:"~1 hr"},
    { lat:35.0074, lng:135.7730, title:"Kappo Dinner, Gion",              time:"08:00 PM",   type:"restaurant", desc:"An intimate 8-seat hinoki counter in Gion where the master chef prepares seasonal delicacies in front of you — grilled Omi wagyu, sashimi, and clear dashi consommé." , duration:"~2.5 hrs"},
  ],
  6: [
    { lat:35.0171, lng:135.6711, title:"Tenryu-ji Garden, Arashiyama",     time:"09:00 AM",   type:"museum",     desc:"Completed in 1345, incorporating the Arashiyama mountains as borrowed scenery. The Sogenchi pond has remained untouched for seven centuries." , duration:"~1.5 hrs"},
    { lat:35.0168, lng:135.6716, title:"Arashiyama Bamboo Grove",          time:"10:30 AM",   type:"nature",     desc:"Towering green bamboo culms swaying in the mountain breeze, filtering the morning sunlight." , duration:"~30 min"},
    { lat:35.0323, lng:135.6746, title:"Sagano Romantic Train",            time:"12:30 PM",   type:"transit",    desc:"An open-air retro train winding along the scenic Hozukyo river gorge through dense green cedar mountains." , duration:"~45 min"},
    { lat:35.0175, lng:135.6680, title:"Okochi Sanso Villa & Garden",      time:"02:00 PM",   type:"museum",     desc:"The serene estate of silent-film icon Denjiro Okochi, offering panoramic views over Kyoto and the Oi River. Includes matcha in the tea garden." , duration:"~1.5 hrs"},
    { lat:34.9875, lng:135.7726, title:"Clay-Pot Crab Dinner, Hyatt",      time:"07:30 PM",   type:"restaurant", desc:"Fresh sweet Matsuba crab steamed in a cedar clay donabe pot with fragrant dashi broth, served with chilled sake." , duration:"~2 hrs"},
  ],
  7: [
    { lat:35.0142, lng:135.7484, title:"Nijo Castle",                      time:"09:30 AM",   type:"museum",     desc:"The Tokugawa shogun's Kyoto palace — famous for 'nightingale floors' engineered to chirp like birds underfoot to detect intruders, and grand gold-leaf wall murals." , duration:"~1.5 hrs"},
    { lat:35.0254, lng:135.7620, title:"Kyoto Imperial Palace Grounds",    time:"12:30 PM",   type:"nature",     desc:"Vast gravel paths between centuries-old pines and peaceful pond gardens surrounding the ancient imperial residence." , optional:true, duration:"~1.5 hrs"},
    { lat:34.9453, lng:135.7700, title:"Fushimi Sake District",             time:"03:00 PM",   type:"nature",     desc:"Canals lined with weeping willows and traditional white-walled sake kura breweries. Visit the Gekkeikan Okura museum and enjoy fresh brewery tastings." , duration:"~2 hrs"},
    { lat:35.0074, lng:135.7759, title:"Farewell Kaiseki, Kikunoi Honten", time:"08:00 PM",   type:"restaurant", desc:"The capstone culinary feast of Kyoto. 3 Michelin stars in Gion — seventeen sublime courses honoring peak seasonal ingredients with unmatched hospitality." , duration:"~3 hrs"},
  ],
  8: [
    { lat:34.9855, lng:135.7588, title:"Kyoto → Osaka Express",            time:"11:00 AM",   type:"transit",    desc:"A fast 15-minute JR express ride from Kyoto Station into Osaka. The historic quiet gives way to the neon energy of the Kansai metropolis." , duration:"~20 min"},
    { lat:34.7042, lng:135.4960, title:"Conrad Osaka",                     time:"01:00 PM",   type:"hotel",      desc:"Hilton's architectural flagship towering 58 floors above Nakanoshima island, offering sweeping 360-degree skyline and river views." , duration:"check-in"},
    { lat:34.6920, lng:135.5029, title:"Nakanoshima Riverside Walk",         time:"03:30 PM",   type:"nature",     desc:"Stroll the river promenades surrounding the Conrad, watching boats glide beneath the bridges at sunset." , duration:"~1 hr"},
    { lat:34.6508, lng:135.5062, title:"Kushikatsu Daruma, Shinsekai",     time:"07:30 PM",   type:"restaurant", desc:"Crispy golden panko-battered skewers of pork, lotus root, and quail eggs in the retro neon heart of Shinsekai. Strict no-double-dipping rule enforced." , duration:"~1.5 hrs"},
  ],
  9: [
    { lat:34.7775, lng:135.2417, title:"Rokko Kokusai Golf Club",            time:"08:30 AM",   type:"nature",     desc:"18 holes on the ridge of Mount Rokko overlooking Osaka Bay. Semi-private championship layout with full caddie service and cool mountain breezes." , duration:"~5 hrs"},
    { lat:34.6979, lng:135.1845, title:"Kobe Kitano District",            time:"05:30 PM",   type:"nature",     desc:"Stroll the historic hillside foreign settlement above Sannomiya and grab a warm pork bun in Chinatown." , duration:"~30 min"},
    { lat:34.6908, lng:135.1950, title:"Kobe Beef Teppanyaki, Misono",    time:"07:00 PM",   type:"restaurant", desc:"The original teppanyaki restaurant, open since 1945. Melt-in-your-mouth certified A5 Tajima Kobe beef seared tableside on iron." , duration:"~2 hrs"},
  ],
  10: [
    { lat:34.8856, lng:135.6648, title:"Suntory Yamazaki Distillery",      time:"10:00 AM",   type:"museum",     desc:"Japan's birthplace of whisky, founded in 1923. VIP tour and premium tasting of rare aged single malts in the library room." , duration:"~2.5 hrs"},
    { lat:34.6659, lng:135.5067, title:"Kuromon Ichiba Market",            time:"02:00 PM",   type:"shop",       desc:"Osaka's energetic kitchen — grilled giant scallops, uni over rice, and fresh seasonal fruit from hundreds of covered stalls." , duration:"~1.5 hrs"},
    { lat:34.6712, lng:135.5084, title:"Okonomiyaki at Fukutaro",          time:"07:30 PM",   type:"restaurant", desc:"Savory Japanese cabbage pancake griddled with pork belly, mountain yam, and dancing bonito flakes at the counter." , duration:"~1.5 hrs"},
  ],
  11: [
    { lat:34.6895, lng:135.8398, title:"Nara: Todai-ji & Deer Park",       time:"08:30 AM",   type:"nature",     desc:"Meet the 1,200 free-roaming sika deer who bow for crackers, and marvel at Todai-ji's colossal 15-meter bronze Daibutsu Buddha." , duration:"~4 hrs"},
    { lat:34.6687, lng:135.5014, title:"Dotonbori Canal Walk",             time:"07:30 PM",   type:"nature",     desc:"Walk the neon canal under the Glico Running Man and giant mechanical crab signs, soaking in the quintessential Osaka evening vibe." , duration:"~1.5 hrs"},
  ],
  12: [
    { lat:34.6873, lng:135.5262, title:"Osaka Castle & Nishinomaru Garden",time:"09:30 AM",   type:"museum",     desc:"The grand stone ramparts and surrounding moat gardens built by Toyotomi Hideyoshi." , optional:true, duration:"~2 hrs"},
    { lat:34.6740, lng:135.4993, title:"Amerika-mura, Shinsaibashi", time:"01:30 PM", type:"shop", desc:"Osaka's vibrant youth and vintage quarter — explore authentic vintage denim, streetwear boutiques, and indie record stores." , duration:"~1.5 hrs"},
    { lat:34.6693, lng:135.5007, title:"Takoyaki at Wanaka, Shinsaibashi", time:"03:30 PM",   type:"restaurant", desc:"Crispy exterior, molten creamy interior octopus balls topped with savory sauce and bonito flakes since 1933." , duration:"~30 min"},
    { lat:34.7197, lng:135.3612, title:"Hanshin Tigers at Koshien Stadium",  time:"06:00 PM",   type:"nature",     desc:"The cathedral of Japanese baseball since 1924. Experience coordinated brass fan sections, singing, and electrifying atmosphere." , duration:"~3.5 hrs"},
  ],
  13: [
    { lat:35.2553, lng:139.1572, title:"Shin-Osaka → Odawara Shinkansen",   time:"10:30 AM",   type:"transit",    desc:"Hikari Bullet Train eastward past Mount Fuji to Odawara, followed by the scenic mountain railway up into Hakone." , duration:"~2.5 hrs"},
    { lat:35.2466, lng:139.0671, title:"Gora Kadan",                      time:"03:00 PM",   type:"hotel",      desc:"Former imperial summer villa in the Hakone mountains — private hot spring baths, manicured moss gardens, and pure serenity." , duration:"check-in"},
    { lat:35.2466, lng:139.0671, title:"In-Room Traditional Shiatsu Massage", time:"05:00 PM", type:"nature", desc:"Authentic Japanese Shiatsu acupressure massage performed in-room on tatami after your private outdoor onsen soak. Master practitioner works pressure points along the spine, shoulders, and legs, releasing all travel tension before dinner." , duration:"~1 hr"},
    { lat:35.2466, lng:139.0671, title:"Kaiseki Dinner, Gora Kadan",          time:"07:30 PM",   type:"restaurant", desc:"Twelve exquisite seasonal courses delivered to your room on ancestral lacquerware, highlighting mountain forage and ocean delicacies." , duration:"~2.5 hrs"},
  ],
  14: [
    { lat:35.2466, lng:139.0671, title:"Morning Onsen, Gora Kadan",          time:"07:30 AM",   type:"nature",     desc:"Soak in the steaming outdoor cedar bath at dawn as morning mist drifts across the Hakone valley." , duration:"~1 hr"},
    { lat:35.2495, lng:139.0226, title:"Owakudani Volcanic Vents",         time:"10:30 AM",   type:"nature",     desc:"Ride the Hakone Ropeway over steaming sulfuric crater vents with dramatic views of Mount Fuji on clear mornings." , duration:"~2 hrs"},
    { lat:35.2467, lng:139.0898, title:"Hakone Open-Air Museum",           time:"02:00 PM",   type:"museum",     desc:"Sculpture park across 17 mountain acres featuring masterworks by Picasso, Henry Moore, and walk-in stained glass towers." , duration:"~2.5 hrs"},
    { lat:35.2466, lng:139.0671, title:"Kaiseki Dinner, Gora Kadan",          time:"07:30 PM",   type:"restaurant", desc:"Second night's bespoke kaiseki menu, featuring fresh seasonal seafood and local wagyu beef." , duration:"~2.5 hrs"},
  ],
  15: [
    { lat:35.2439, lng:139.1074, title:"Odakyu Romancecar → Tokyo",        time:"10:30 AM",   type:"transit",    desc:"Reserved-seat express train descending through the Tama valley straight into Shinjuku / Tokyo." , duration:"~1.5 hrs"},
    { lat:35.6717, lng:139.7645, title:"Hyatt Centric Ginza Tokyo",        time:"01:30 PM",   type:"hotel",      desc:"Chic lifestyle hotel on Ginza's Namiki-dori, surrounded by world-class dining, boutiques, and galleries." , duration:"check-in"},
    { lat:35.6718, lng:139.7653, title:"Sushi Counter, Ginza",             time:"08:00 PM",   type:"restaurant", desc:"An intimate 8-seat hinoki counter omakase feast in Ginza, savoring the day's peak catches from Toyosu." , duration:"~2 hrs"},
  ],
  16: [
    { lat:35.6964, lng:139.5706, title:"Studio Ghibli Museum, Mitaka",    time:"12:00 PM",   type:"museum",     desc:"Hayao Miyazaki's whimsical museum featuring original animation cels, sketches, and an exclusive short film." , duration:"~2 hrs"},
    { lat:35.6766, lng:139.7097, title:"Meiji Jingu Gyoen",               time:"03:00 PM",   type:"nature",     desc:"The tranquil inner forested sanctuary of Meiji Shrine, with blooming iris ponds and cedar pathways." , optional:true, duration:"~1 hr"},
    { lat:35.6757, lng:139.7631, title:"Yurakucho Izakaya Row",           time:"07:00 PM",   type:"restaurant", desc:"Atmospheric yakitori grills and cold draft beers under the elevated Yamanote railway arches." , duration:"~2 hrs"},
    { lat:35.6709, lng:139.7657, title:"Bar High Five, Ginza",              time:"09:30 PM",   type:"restaurant", desc:"World-renowned master mixologist Hidetsugu Ueno's intimate cocktail lounge. Bespoke, surgical drink craft." , duration:"~1.5 hrs"},
  ],
  17: [
    { lat:35.6825, lng:139.7791, title:"Arashio Stable — Sumo Morning Practice", time:"07:30 AM",   type:"museum",     desc:"Watch massive sumo rikishi train up close during morning keiko practice through the street-level viewing gallery." , duration:"~2 hrs"},
    { lat:35.7023, lng:139.7715, title:"Akihabara Electric Town",          time:"10:30 AM",   type:"shop",       desc:"Multi-floor retro electronics, gaming arcades, and collector stores in Tokyo's anime and tech capital." , duration:"~2 hrs"},
    { lat:35.6941, lng:139.7735, title:"Kanda Yabu Soba",               time:"01:00 PM",   type:"restaurant", desc:"Handcrafted buckwheat soba noodles in a historic 1880 wooden teahouse." , duration:"~1 hr"},
    { lat:35.7164, lng:139.7845, title:"Kappabashi Knife Street",          time:"02:30 PM",   type:"shop",       desc:"Tokyo's legendary chef and knife district — find handcrafted Japanese Damascus kitchen blades." , duration:"~1.5 hrs"},
    { lat:35.7118, lng:139.7958, title:"Tempura Daikokuya, Asakusa",       time:"06:30 PM",   type:"restaurant", desc:"Classic Edo-style sesame oil tempura bowls served since 1887 near Senso-ji temple." , duration:"~1.5 hrs"},
    { lat:35.6814, lng:139.7673, title:"Cotton Club, Marunouchi",              time:"09:00 PM",   type:"restaurant", desc:"Sophisticated supper club jazz lounge beneath the Marunouchi skyline." , optional:true, duration:"~2 hrs"},
  ],
  18: [
    { lat:35.6698, lng:139.7662, title:"Seiko Museum Ginza",               time:"10:00 AM",   type:"museum",     desc:"Six floors celebrating Japanese horology, from ancient pendulum clocks to Grand Seiko mechanical tourbillons." , duration:"~1.5 hrs"},
    { lat:35.6715, lng:139.7636, title:"Omurice at Rengatei, Ginza",      time:"12:00 PM",   type:"restaurant", desc:"The Meiji-era birthplace of Japanese omurice (est. 1900), served with rich demi-glace sauce." , duration:"~1 hr"},
    { lat:35.6922, lng:139.7006, title:"Komehyo Shinjuku — Vintage Watches", time:"02:30 PM", type:"shop", desc:"Premier authenticated vintage luxury and rare Grand Seiko Japanese market timepieces." , duration:"~1.5 hrs"},
    { lat:35.8948, lng:139.6309, title:"Radiohead — Live at Saitama Super Arena", time:"06:00 PM",   type:"museum",     desc:"Radiohead's headline June 2027 arena tour at Saitama Super Arena. 30 minutes direct from Tokyo/Ginza via JR Ueno-Tokyo Line. 37,000 capacity with peerless acoustics. Doors 17:30, show 19:00. The ultimate musical highlight of the honeymoon." , duration:"~4 hrs"},
    { lat:35.6717, lng:139.7645, title:"Post-Concert Ramen & Highballs, Ginza", time:"10:30 PM",   type:"restaurant", desc:"Celebrate the show with steaming midnight ramen bowls and cold Suntory highballs in Ginza." , duration:"~1 hr"},
  ],
  19: [
    { lat:35.6621, lng:139.7161, title:"Nezu Museum Gardens",              time:"09:30 AM",   type:"museum",     desc:"Stroll the serene bamboo and iris gardens of Aoyama for a final peaceful Tokyo morning." , duration:"~1.5 hrs"},
    { lat:35.6595, lng:139.7004, title:"Shibuya Scramble Crossing",   time:"11:30 AM",   type:"nature",     desc:"Experience the iconic intersection one final time before lunch." , duration:"~30 min"},
    { lat:35.6914, lng:139.7003, title:"Japanese Curry at Nakamura-ya, Shinjuku", time:"01:00 PM", type:"restaurant", desc:"Historic 1927 Indo-Japanese spiced curry and short-grain rice." , duration:"~1 hr"},
    { lat:35.5494, lng:139.7798, title:"Haneda International Airport",     time:"04:30 PM",   type:"transit",    desc:"Direct Keikyu line train to Haneda Terminal 3. Relax in the departure lounge before your flight home." , duration:"~2 hrs"},
  ],
};

export const haikus: Record<number, string[]> = {
  1:  ["Old water meets new\nwhere the river bends, a bridge\nKyoto reflects", "Worn tatami holds\ncedar shadows breathe soft light\narrive, then be still"],
  2:  ["A thousand figures\neach gilded face knows the prayer\nsilence fills the hall", "Vermillion gates climb\nthe mountain mist holds the dusk\nfoxes guard the stone"],
  3:  ["Sand cone waits for moon\nthe pavilion ungilded\nsilver needs no proof", "Stones beside water\ncherry boughs bend to the stream\nwalk slowly, think less"],
  4:  ["Fifteen stones remain\nno one agrees what they mean\nthat is the whole point", "Dashi, then lacquer\nthe recipe three hundred years\nflavor without haste"],
  5:  ["Bamboo fills the cup\nthe whisk turns froth into art\nquiet follows you", "Press the aching line\nwarm camellia oil soothes\ntension turns to air"],
  6:  ["Green columns rise straight\nlight dissolves to jade above\nno sound, only stalk", "Snow crab meets the clay\nsteam lifts the lid, rice below\nthis is the whole meal"],
  7:  ["Nightingale floor sings\nwarning under silent feet\nshogun sleeps in peace", "Seventeen courses\nKikunoi crowns the long night\nKyoto says farewell"],
  8:  ["Fifteen minutes west\nthe ancient quiet dissolves\nOsaka laughs loud", "Light floods the canal\nthe crab sign spins above all\npanko hits the oil"],
  9:  ["Bay beneath the ridge\niron club cuts through clean air\nmorning on the green", "Sizzle on the iron\nmarbled beef dissolves like cream\nKobe in the dark"],
  10: ["Three rivers converge\noak remembers what spring said\nsip slowly, one dram", "Cabbage meets the heat\nbonito dances above\niron griddle sings"],
  11: ["Deer bow for the grain\nfifteen meters cast in bronze\nNara holds the past", "Neon doubles deep\nreflections on the dark stream\nmidnight in Namba"],
  12: ["Granite moats stand high\nHideyoshi's dream in stone\nwind across the wall", "Trumpets blow the chant\nthirty thousand roar as one\nKoshien comes alive"],
  13: ["The train folds upward\ncedar ravines grip the rail\nthe mountain yields first", "Mineral waters steam\nhands release the weary spine\npeace on mountain mats"],
  14: ["Sulfur splits the air\nFuji ghosted in the west\nearth is still working", "Bronze figures stand still\npeaks do not know their own names\nboth belong to sky"],
  15: ["Romancecar glides fast\nmountains thin to tower grids\nTokyo begins", "Hinoki counter\nsea urchin shines under light\nfirst bite of the capital"],
  16: ["Pencil sketches dream\ncolors leap from cell to sky\nMiyazaki smiles", "Hidetsugu pours\nthree drinks balanced to the grain\nsilence between sips"],
  17: ["Giants collide hard\nsand sprays in the early light\nancient ritual", "Ten thousand sharp blades\nhand-forged iron holds the edge\ncraft passed down through blood"],
  18: ["Steel dome shakes with sound\nthirty thousand hold their breath\nthe guitars ignite", "Rails hum through the dark\nSaitama lights blur behind\nringing in the ears"],
  19: ["One last garden path\nlanterns fade against the glass\nTokyo bids farewell", "The gate opens last\nclouds unravel in the sky\ncarry what you learned"]
};

export const _H5 = [
  "old stone steps breathe moss","cedar shadows fall","salt dissolves the day",
  "bronze figures stand still","the sea arrives raw","cold iron waits here",
  "light floods the canal","bamboo fills the cup","the train folds backward",
  "green columns rise straight","three rivers converge","worn tatami holds",
  "pine boughs brush the path","lanterns glow at dusk","ink dries on thin wax",
  "jade hills rise and fall","crisp wind off the ridge","clouds unravel slow",
  "silence fills the gate","petals meet the stream","mist erases roads",
];

export const _H7 = [
  "neon signs blur into signs","ando left no more","the forest breathes deep",
  "stone lanterns emerge from leaves","raked stone, clear stream, cedar shade",
  "the whisk turns froth into art","the actor's mask holds the lake",
  "peaks do not know their own names","dashi, then lacquer, then tea",
  "the pendulum marks the year","each gear a piece of the hour",
  "panko sizzles in the oil","two towers share one open sky",
  "tatami glows at twilight","a thousand-year calm descends",
  "the pavilion never speaks","moss does the quiet talking",
  "cherry boughs bend to the stream","froth holds the mountain's shadow",
  "salt, char, and the long cold night","walk slowly through the bamboo",
];

export const _H5b = [
  "Tokyo begins","hold it, feel the edge","breathe in, then release",
  "still water, still trade","Osaka laughs loud","arrive, then be still",
  "carry what you learned","the mountain yields first","this is the whole meal",
  "no sound, only stalk","time assembles still","sip slowly, one dram",
  "sleep in the station","moss keeps the secret","quiet follows you",
  "both belong to sky","walk, then walk again","nothing is explained",
];

export function _genHaiku(seed: string): string {
  const h = (arr: string[], s: number) => arr[Math.abs(s) % arr.length];
  const code = seed.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
  return `${h(_H5, code)}\n${h(_H7, code + 3)}\n${h(_H5b, code + 7)}`;
}

export const meals: Record<number, DayMeals> = {
  1:  { breakfast: { text: "In transit — flight into Kansai International Airport", booked: false }, lunch: { text: "Haruka train bento or airport soba counter", booked: false }, dinner: { text: "Higashiyama Obanzai · small seasonal plates and local Kyoto vegetables", booked: true  } },
  2:  { breakfast: { text: "Hyatt Regency breakfast · fresh matcha, seasonal fruit, and Japanese traditional set", booked: false }, lunch: { text: "Soba near Kiyomizu-dera · cold buckwheat noodles with mountain vegetables", booked: false }, dinner: { text: "Fushimi Izakaya · grilled river fish and local sake after the sunset shrine hike", booked: false } },
  3:  { breakfast: { text: "Inoda Coffee Honten · legendary 1940 kissaten, flannel drip coffee and toast", booked: false }, lunch: { text: "Yudofu at Junsei · simmered silken tofu in the historic Nanzen-ji temple garden", booked: true  }, dinner: { text: "Pontocho riverside dining · terrace seating over the Kamo River", booked: false } },
  4:  { breakfast: { text: "Sarasa Nishijin · café in a converted 1920s public bathhouse with heritage tiles", booked: false }, lunch: { text: "Nishiki Market street food · tamagoyaki, fresh yuba, and dashi skewers", booked: false }, dinner: { text: "Kaiseki at Nakamura · 300-year-old culinary institution (est. 1716)", booked: true  } },
  5:  { breakfast: { text: "Tou-Suiro Kyoto · delicate tofu breakfast near the river", booked: false }, lunch: { text: "Gion café · wagashi sweets and cold green tea after your morning tea ceremony", booked: false }, dinner: { text: "Kappo Gion · intimate 8-seat counter feast with master chef", booked: true  } },
  6:  { breakfast: { text: "Hyatt Regency morning set · fresh dashi broth, grilled salmon, and steamed rice", booked: false }, lunch: { text: "Arashiyama riverside noodle shop · view of Togetsukyo Bridge", booked: false }, dinner: { text: "Clay-Pot Matsuba Crab · donabe steamed crab over heirloom rice at the hotel", booked: true  } },
  7:  { breakfast: { text: "Traditional Higashiyama tea house breakfast", booked: false }, lunch: { text: "Fushimi sake brewery tavern · chicken yakitori and fresh unpasteurized sake", booked: false }, dinner: { text: "Kikunoi Honten · 3-Michelin-star grand farewell kaiseki banquet", booked: true  } },
  8:  { breakfast: { text: "Farewell Kyoto breakfast at hotel", booked: false }, lunch: { text: "Nakanoshima riverside café at the Conrad", booked: false }, dinner: { text: "Kushikatsu Daruma Shinsekai · original 1929 crispy panko skewers", booked: true  } },
  9:  { breakfast: { text: "Conrad Osaka 58th-floor breakfast buffet", booked: false }, lunch: { text: "Rokko Mountain clubhouse lunch overlooking Osaka Bay", booked: false }, dinner: { text: "Kobe Beef Teppanyaki at Misono · certified A5 Tajima beef seared tableside", booked: true  } },
  10: { breakfast: { text: "Artisan bakery in Umeda", booked: false }, lunch: { text: "Kuromon Market seafood stalls · fresh uni, tuna, and grilled scallops", booked: false }, dinner: { text: "Okonomiyaki at Fukutaro · savory griddled cabbage pancake with pork belly", booked: false } },
  11: { breakfast: { text: "Morning coffee & pastries at Conrad", booked: false }, lunch: { text: "Nara park teahouse · traditional persimmon-leaf sushi (kaki-no-ha zushi)", booked: false }, dinner: { text: "Dotonbori street food crawl · gyoza, crab legs, and local draft beer", booked: false } },
  12: { breakfast: { text: "Conrad Osaka lounge breakfast", booked: false }, lunch: { text: "Takoyaki at Wanaka · piping hot octopus balls with dancing bonito flakes", booked: false }, dinner: { text: "Koshien Stadium bento boxes & Hanshin-branded beer at the baseball game", booked: false } },
  13: { breakfast: { text: "Ekiben on the Shinkansen speeding past Mount Fuji", booked: false }, lunch: { text: "Hakone-Yumoto buckwheat soba upon mountain arrival", booked: false }, dinner: { text: "Gora Kadan in-room Kaiseki banquet · twelve courses served on ancestral lacquerware", booked: true  } },
  14: { breakfast: { text: "Gora Kadan traditional ryokan breakfast in-room", booked: true  }, lunch: { text: "Owakudani black eggs & volcanic spring ramen", booked: false }, dinner: { text: "Gora Kadan second evening bespoke mountain kaiseki", booked: true  } },
  15: { breakfast: { text: "Bakery & Table Hakone terrace breakfast overlooking Lake Ashi", booked: false }, lunch: { text: "Shinjuku ramen bar upon Tokyo arrival", booked: false }, dinner: { text: "Ginza Hinoki Counter Sushi · seasonal omakase nigiri", booked: true  } },
  16: { breakfast: { text: "Kimuraya Honten Ginza (est. 1869) · warm red bean anpan", booked: false }, lunch: { text: "Maisen Tonkatsu Aoyama · crispy pork cutlet in converted bathhouse", booked: false }, dinner: { text: "Yurakucho Izakaya Row yakitori & Bar High Five bespoke cocktails", booked: true  } },
  17: { breakfast: { text: "Shiseido Parlour Ginza · rooftop coffee and eggs", booked: false }, lunch: { text: "Kanda Yabu Soba (1880) · cold zarusoba with heritage dipping sauce", booked: false }, dinner: { text: "Tempura Daikokuya Asakusa (1887) · dark sesame oil tempura", booked: true  } },
  18: { breakfast: { text: "Shinjuku Isetan B2 gourmet food hall pastries", booked: false }, lunch: { text: "Rengatei Ginza (1900) · the original Japanese omurice", booked: false }, dinner: { text: "Pre/Post-Radiohead concert food · Saitama arena stalls & midnight Ginza ramen", booked: false } },
  19: { breakfast: { text: "Tsukiji Outer Market · tamagoyaki and sea urchin breakfast", booked: false }, lunch: { text: "Nakamura-ya Shinjuku (1927) · foundational Indo-Japanese curry", booked: false }, dinner: { text: "Haneda International Airport lounge before flight home", booked: false } },
};

export const dayMeta: Record<number, { title: string; lodging: string }> = {
  1:  { title: "Day 1: Arrival into the Ancient Capital",             lodging: "Hyatt Regency Kyoto" },
  2:  { title: "Day 2: Thousand Buddhas & the Vermillion Gates",       lodging: "Hyatt Regency Kyoto" },
  3:  { title: "Day 3: Silver Pavilion & Philosopher's Walk",          lodging: "Hyatt Regency Kyoto" },
  4:  { title: "Day 4: Zen Rocks, Gold & 300-Year Kaiseki",            lodging: "Hyatt Regency Kyoto" },
  5:  { title: "Day 5: Whisked Matcha, Shiatsu & Gion Dusk",           lodging: "Hyatt Regency Kyoto" },
  6:  { title: "Day 6: Arashiyama Bamboo & Jade Gorge",                lodging: "Hyatt Regency Kyoto" },
  7:  { title: "Day 7: Imperial Seat & 3-Star Kikunoi Feast",          lodging: "Hyatt Regency Kyoto" },
  8:  { title: "Day 8: Westward to the City of Water",                 lodging: "Conrad Osaka" },
  9:  { title: "Day 9: Bayview Golf & Certified Kobe Beef",            lodging: "Conrad Osaka" },
  10: { title: "Day 10: Whisky Valley & Griddled Iron",                lodging: "Conrad Osaka" },
  11: { title: "Day 11: Ancient Nara & the Glico Neon",                lodging: "Conrad Osaka" },
  12: { title: "Day 12: Osaka Fortress & Koshien Stadium",             lodging: "Conrad Osaka" },
  13: { title: "Day 13: Mountain Mist, Onsen & Ryokan Shiatsu",        lodging: "Gora Kadan" },
  14: { title: "Day 14: Volcanic Vents & Open-Air Sculpture",          lodging: "Gora Kadan" },
  15: { title: "Day 15: Descent into the Ginza Grid",                  lodging: "Hyatt Centric Ginza" },
  16: { title: "Day 16: Ghibli, Shrines & World-Class Cocktails",       lodging: "Hyatt Centric Ginza" },
  17: { title: "Day 17: Sumo at Dawn, Knives & Shitamachi Jazz",        lodging: "Hyatt Centric Ginza" },
  18: { title: "Day 18: Vintage Shinjuku & Radiohead in Saitama",      lodging: "Hyatt Centric Ginza" },
  19: { title: "Day 19: Bamboo Gardens, Scramble & Departure",         lodging: "Departure Outbound" },
};
