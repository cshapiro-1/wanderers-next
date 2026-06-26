export const restaurantPrices: Record<string, number> = {
  'Pontocho — Afternoon Sake': 25,
  'Sushi Counter, Ginza': 250,            // top Ginza omakase ¥35k–45k/pp
  'Bar High Five, Ginza': 55,             // 3 cocktails/pp ¥6k–9k at top-tier bar
  'Yurakucho Izakaya Row': 35,            // yakitori + beer ¥4k–6k
  'Kanda Yabu Soba': 20,                  // soba lunch ¥1,800–3,000
  'Cotton Club, Marunouchi': 55,          // ticket + table charge ¥6k–8k/pp
  'Tempura Daikokuya, Asakusa': 28,       // Edo tempura set ¥3,500–4,500
  'Omurice at Rengatei, Ginza': 22,       // hashed beef + omurice ¥2,200–3,500
  'Omoide Yokocho': 35,                   // yakitori counter, 2 hrs ¥4k–6k
  'Kabukicho & Golden Gai': 25,           // bar covers + drinks ¥3k–5k
  'Midnight Ramen, Shinjuku': 12,         // late ramen ¥1,200–1,600
  'Tsukiji Outer Market': 22,             // market stall breakfast ¥2k–3.5k
  'Shinjuku Jazz Kissa': 22,              // cover charge + 2 drinks ¥2.5k–4k
  'Gyoza Standing Bar, Shinjuku-sanchome': 14, // 3 rounds + beer ¥1.5k–2.5k
  'Japanese Curry at Nakamura-ya, Shinjuku': 20, // classic curry set ¥2,000–3,000
  'Kaiseki Dinner, Gora Kadan': 0,        // included in ryokan rate
  'Asaba Kaiseki & Noh Stage': 0,         // included in ryokan rate
  'Kushikatsu Daruma, Shinsekai': 22,     // skewer set ¥3,000–3,500
  'Kobe Beef Teppanyaki, Misono': 150,    // sirloin course ¥20k–30k/pp
  'Okonomiyaki at Fukutaro': 22,          // Osaka-style set ¥2,500–3,500
  'Takoyaki at Wanaka, Shinsaibashi': 8,  // one serving ¥800–1,200
  'Takoyaki at Kukuru, Dotonbori': 8,
  'Obanzai Dinner, Higashiyama': 42,      // obanzai multi-course ¥5k–8k
  'Yudofu at Junsei': 45,                 // tofu course ¥5,500–8,000
  'Kaiseki at Nakamura': 165,             // 1716 kaiseki ¥22k–30k/pp
  'Takagamine Tea Ceremony, Roku': 55,    // private ceremony ¥6k–10k
  'Kappo Dinner, Gion': 180,              // intimate kappo ¥25k–35k/pp
  'Clay-Pot Crab Dinner, Hyatt': 115,     // Roku Kyoto in-house ¥15k–20k
  'Clay-Pot Crab Dinner, Roku': 115,
  'Farewell Kaiseki, Kikunoi Honten': 185, // 3-star kaiseki ¥25k–35k/pp
  'Farewell Kaiseki, Kyoto': 185,
  'Shiseido Parlour Ginza': 28,           // café breakfast ¥3k–4k
  'Endo Sushi near Osaka Fish Market': 45, // market counter ¥5k–8k
  'Kichisen Kyoto': 280,                  // Japan's most revered kaiseki ¥40k+/pp
  'Hyotei Kyoto': 160,                    // 3-star morning tea kaiseki ¥22k–30k
  'Kappo Dinner, Gion — Clay-Pot': 115,
  'Kikunoi Roan': 95,                     // branch of 3-star Kikunoi ¥12k–18k
};

export const restaurantNotes: Record<string, string> = {
  'Asaba Kaiseki & Noh Stage': 'Included in ryokan rate',
  'Kaiseki Dinner, Gora Kadan': 'Included in Gora Kadan rate',
};

export const activityPrices: Record<string, number> = {
  'Shinjuku Gyoen National Garden': 3,
  'Nakanoshima Riverside Walk': 0,
  'Rokko Kokusai Golf Club': 175,
  'Kasuga Taisha Shrine': 3,
  'Naramachi': 0,
  'Sanjusangen-do': 4,
  'Higashiyama — Sannen-zaka & Ninenzaka': 0,
  'Heian Shrine & Okazaki Garden': 4,
  'Pontocho Alley': 0,
  'Okochi Sanso Villa & Garden': 7,
  'Fushimi Sake District': 15,
  'Meiji Jingu Gyoen': 4,              // ¥500 inner garden fee
  'Nezu Museum Gardens': 9,            // ¥1,300 admission = ~$9
  'Seiko Museum Ginza': 0,
  'Yasukuni Shrine & Yushukan': 6,       // ¥1,000 Yushukan entry = $7
  'GIGO Akihabara — Arcade': 15,          // ¥2,000 coins + games ~$15
  'Kabukicho Pachinko — Walk-Through': 0,  // free to walk in
  'Nekorobi Cat Café, Asakusa': 12,      // ¥1,500 entry + drink ~$12
  'Kappabashi Knife Street': 0,
  'Senso-ji Temple, Asakusa': 0,
  'Hamarikyu Gardens': 2,              // ¥300 = $2
  'Tsukiji Outer Market': 0,
  'Tokyo Tower': 8,                    // Main Deck ¥1,200 = $8
  'Kawana Golf Course, Oshima': 175,   // ¥23k–28k with caddie, avg $175
  'Shuzenji Bamboo Forest': 0,
  'Jogasaki Coast': 0,
  'Mishima → Shin-Osaka Shinkansen': 65, // reserved ¥9,750 = $65
  'Osaka Castle & Nishinomaru Garden': 5, // ¥600 castle + ¥200 garden = $5
  'Dotonbori Canal Walk': 0,
  'Suntory Yamazaki Distillery': 40,   // premium tasting ¥6,000 = $40
  'Church of the Light, Ibaraki': 5,   // ¥700 admission = $5
  'Umeda Sky Building': 10,            // ¥1,500 = $10
  'Kuromon Ichiba Market': 0,
  'Shin-Osaka → Kyoto Shinkansen': 10, // ¥1,420 reserved = $10
  'Fushimi Inari Taisha': 0,
  'Ryoan-ji Zen Garden': 4,            // ¥600 = $4
  'Kinkaku-ji Golden Pavilion': 7,     // raised to ¥1,000 (2023) = $7
  'Arashiyama Bamboo Grove': 0,
  'Ginkaku-ji Silver Pavilion': 7,     // raised to ¥1,000 (2024) = $7
  "Philosopher's Path": 0,
  'Nanzen-ji Temple & Aqueduct': 0,
  'Nishiki Market': 0,
  'Gion Evening Walk': 0,
  'Tenryu-ji Garden, Arashiyama': 5,   // garden ¥500; with temple ¥1,000
  'Sagano Romantic Train': 6,          // ¥880 one-way = $6
  'Nijo Castle': 9,                    // ¥1,300 = $9
  'Imperial Palace East Gardens': 0,
  'Kyoto → KIX Haruka Express': 24,    // ¥3,600 reserved = $24
  'Kansai International Airport': 0,
};
