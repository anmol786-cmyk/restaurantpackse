/**
 * Localized category names and SEO copy for /shop/category/<slug>.
 *
 * WooCommerce only holds English category names, and most categories had no
 * description, so category pages were thin (~100-250 words) and untranslated on
 * /sv, /no and /da. Copy here is written from the products actually stocked —
 * update it when the range in a category changes.
 */

export type ContentLocale = 'en' | 'sv' | 'no' | 'da';

interface CategoryCopy {
  /** One or two sentences: page header + meta description */
  intro: string;
  /** Category-specific paragraphs */
  body: string[];
  /** Short buying notes */
  points: string[];
}

interface CategoryEntry {
  name: Record<ContentLocale, string>;
  copy: Record<ContentLocale, CategoryCopy>;
}

/** Word used in category <title>s: "<name> <word> Stockholm" */
export const WHOLESALE_WORD: Record<ContentLocale, string> = {
  en: 'Wholesale',
  sv: 'grossist',
  no: 'engros',
  da: 'engros',
};

export const ORDERING_BLOCK: Record<ContentLocale, { heading: string; text: string; pointsHeading: string }> = {
  en: {
    heading: 'Ordering from Anmol Wholesale',
    pointsHeading: 'Good to know',
    text:
      'Anmol Wholesale supplies restaurants, cafés, caterers and food shops from our warehouse at Fagerstagatan 11 in Spånga, Stockholm. Order online at any time, use the quick order form for repeat purchases, or request a quote for larger volumes. We deliver with our own vehicles in the Stockholm area, ship across Sweden and Scandinavia, and you are welcome to collect ex-warehouse. Businesses can open a wholesale account and order on invoice once approved.',
  },
  sv: {
    heading: 'Beställ från Anmol Wholesale',
    pointsHeading: 'Bra att veta',
    text:
      'Anmol Wholesale levererar till restauranger, kaféer, cateringföretag och livsmedelsbutiker från vårt lager på Fagerstagatan 11 i Spånga, Stockholm. Beställ online när det passar dig, använd snabbordern för återkommande inköp eller begär en offert för större volymer. Vi kör ut med egna bilar i Stockholmsområdet, skickar över hela Sverige och Skandinavien, och du är välkommen att hämta själv på lagret. Företag kan öppna ett grossistkonto och handla mot faktura efter godkännande.',
  },
  no: {
    heading: 'Bestill fra Anmol Wholesale',
    pointsHeading: 'Greit å vite',
    text:
      'Anmol Wholesale leverer til restauranter, kafeer, cateringselskaper og matbutikker fra vårt lager i Fagerstagatan 11 i Spånga, Stockholm. Bestill på nett når det passer deg, bruk hurtigbestillingen for faste innkjøp, eller be om et tilbud på større volumer. Vi leverer med egne biler i Stockholm-området, sender til hele Sverige og Skandinavia, og du kan også hente selv på lageret. Bedrifter kan åpne en engroskonto og handle på faktura etter godkjenning.',
  },
  da: {
    heading: 'Bestil hos Anmol Wholesale',
    pointsHeading: 'Godt at vide',
    text:
      'Anmol Wholesale leverer til restauranter, caféer, cateringvirksomheder og fødevarebutikker fra vores lager på Fagerstagatan 11 i Spånga, Stockholm. Bestil online når det passer dig, brug hurtigbestillingen til faste indkøb, eller bed om et tilbud på større mængder. Vi leverer med egne biler i Stockholm-området, sender til hele Sverige og Skandinavien, og du er velkommen til selv at afhente på lageret. Virksomheder kan oprette en engroskonto og handle på faktura efter godkendelse.',
  },
};

const CARTON_NOTE: Record<ContentLocale, string> = {
  en: 'Prices are shown per unit; cased items are sold in full cartons.',
  sv: 'Priserna visas per styck; kartongvaror säljs i hela kartonger.',
  no: 'Prisene vises per stykk; kartongvarer selges i hele kartonger.',
  da: 'Priserne vises pr. stk.; kartonvarer sælges i hele kartoner.',
};

const PACK_NOTE: Record<ContentLocale, string> = {
  en: 'Prices are shown per piece; packaging is sold in full packs.',
  sv: 'Priserna visas per styck; förpackningar säljs i hela förpackningar.',
  no: 'Prisene vises per stykk; emballasje selges i hele pakker.',
  da: 'Priserne vises pr. stk.; emballage sælges i hele pakker.',
};

export const CATEGORY_CONTENT: Record<string, CategoryEntry> = {
  'food-beverage': {
    name: { en: 'Food & Beverage', sv: 'Livsmedel & drycker', no: 'Mat og drikke', da: 'Fødevarer og drikkevarer' },
    copy: {
      en: {
        intro: 'Bulk food and drinks for professional kitchens: rice, sugar, milk powder, syrups and juices in catering sizes.',
        body: [
          'This is our widest range, covering the staples a South Asian or Middle Eastern kitchen goes through every week. You will find 25 kg sacks of sugar and milk powder, basmati rice in 5 kg packs, Hamdard Rooh Afza syrup by the case and ANYTIME mango nectar for drinks menus.',
          'Every product is chosen for restaurant use, not retail shelves, so pack sizes match real kitchen consumption and storage.',
        ],
        points: ['Catering pack sizes from 5 kg to 25 kg', CARTON_NOTE.en, 'Mix food, drinks and packaging in one delivery'],
      },
      sv: {
        intro: 'Livsmedel och drycker i storpack för professionella kök: ris, socker, mjölkpulver, sirap och juice i cateringstorlekar.',
        body: [
          'Det här är vårt bredaste sortiment med baslivsmedel som ett sydasiatiskt eller mellanöstern-kök använder varje vecka. Här finns 25 kg-säckar socker och mjölkpulver, basmatiris i 5 kg-förpackningar, Hamdard Rooh Afza-sirap per kartong och ANYTIME mangonektar till drycksmenyn.',
          'Alla produkter är valda för restaurangbruk, inte butikshyllor, så förpackningsstorlekarna passar verklig förbrukning och lagring i köket.',
        ],
        points: ['Cateringstorlekar från 5 kg till 25 kg', CARTON_NOTE.sv, 'Blanda livsmedel, drycker och förpackningar i samma leverans'],
      },
      no: {
        intro: 'Mat og drikke i storpakninger for profesjonelle kjøkken: ris, sukker, melkepulver, sirup og juice i cateringstørrelser.',
        body: [
          'Dette er vårt bredeste sortiment, med basisvarer som et sørasiatisk eller midtøstlig kjøkken bruker hver uke. Her finner du 25 kg-sekker med sukker og melkepulver, basmatiris i 5 kg-pakninger, Hamdard Rooh Afza-sirup per kartong og ANYTIME mangonektar til drikkemenyen.',
          'Alle produktene er valgt for restaurantbruk, ikke butikkhyller, slik at pakningsstørrelsene passer reelt forbruk og lagring.',
        ],
        points: ['Cateringstørrelser fra 5 kg til 25 kg', CARTON_NOTE.no, 'Kombiner mat, drikke og emballasje i samme levering'],
      },
      da: {
        intro: 'Fødevarer og drikkevarer i storpakning til professionelle køkkener: ris, sukker, mælkepulver, sirup og juice i cateringstørrelser.',
        body: [
          'Dette er vores bredeste sortiment med basisvarer, som et sydasiatisk eller mellemøstligt køkken bruger hver uge. Her finder du 25 kg-sække med sukker og mælkepulver, basmatiris i 5 kg-poser, Hamdard Rooh Afza-sirup pr. karton og ANYTIME mangonektar til drikkekortet.',
          'Alle produkter er udvalgt til restaurantbrug, ikke butikshylder, så pakningsstørrelserne passer til reelt forbrug og opbevaring.',
        ],
        points: ['Cateringstørrelser fra 5 kg til 25 kg', CARTON_NOTE.da, 'Saml fødevarer, drikkevarer og emballage i én levering'],
      },
    },
  },

  'dry-goods-pantry-staples': {
    name: { en: 'Dry Goods & Pantry Staples', sv: 'Torrvaror & baslivsmedel', no: 'Tørrvarer og basisvarer', da: 'Tørvarer og basisvarer' },
    copy: {
      en: {
        intro: 'Long-life pantry staples in 25 kg sacks: granulated sugar, skimmed and whole milk powder for kitchens, bakeries and sweet shops.',
        body: [
          'Dry goods are the backbone of a busy kitchen. We stock Nordic Sugar granulated sugar and two milk powders in 25 kg bags: skimmed 1% for doughs, sauces and drinks, and whole 26% fat for richer desserts, chai and traditional sweets such as burfi and gulab jamun.',
          'Buying by the sack lowers your cost per kilo and means fewer deliveries. Store in a cool, dry place and the products keep for months.',
        ],
        points: ['25 kg sacks for high-volume use', 'Suited to bakeries, sweet shops and restaurants', 'Combine with rice, flour and oils for one delivery'],
      },
      sv: {
        intro: 'Hållbara baslivsmedel i 25 kg-säckar: strösocker samt skummjölks- och helmjölkspulver för kök, bagerier och konditorier.',
        body: [
          'Torrvaror är grunden i ett hektiskt kök. Vi har Nordic Sugar strösocker och två sorters mjölkpulver i 25 kg-säckar: skummjölk 1 % till degar, såser och drycker, och helmjölk 26 % fett till krämigare desserter, chai och traditionella sötsaker som burfi och gulab jamun.',
          'Att köpa per säck sänker kilopriset och ger färre leveranser. Förvara svalt och torrt så håller varorna i månader.',
        ],
        points: ['25 kg-säckar för stor förbrukning', 'Passar bagerier, konditorier och restauranger', 'Kombinera med ris, mjöl och oljor i samma leverans'],
      },
      no: {
        intro: 'Holdbare basisvarer i 25 kg-sekker: sukker samt skummet og hel melkepulver for kjøkken, bakerier og konditorier.',
        body: [
          'Tørrvarer er grunnmuren i et travelt kjøkken. Vi har Nordic Sugar strøsukker og to typer melkepulver i 25 kg-sekker: skummet 1 % til deig, sauser og drikke, og helmelk 26 % fett til fyldigere desserter, chai og tradisjonelle søtsaker som burfi og gulab jamun.',
          'Å kjøpe per sekk gir lavere kilopris og færre leveranser. Oppbevares tørt og kjølig, så holder varene i måneder.',
        ],
        points: ['25 kg-sekker for stort forbruk', 'Passer bakerier, konditorier og restauranter', 'Kombiner med ris, mel og oljer i samme levering'],
      },
      da: {
        intro: 'Holdbare basisvarer i 25 kg-sække: sukker samt skummet- og sødmælkspulver til køkkener, bagerier og konditorier.',
        body: [
          'Tørvarer er fundamentet i et travlt køkken. Vi fører Nordic Sugar stødt sukker og to slags mælkepulver i 25 kg-sække: skummet 1 % til dej, saucer og drikke, og sødmælk 26 % fedt til fyldigere desserter, chai og traditionelle søde sager som burfi og gulab jamun.',
          'At købe pr. sæk giver lavere kilopris og færre leverancer. Opbevares tørt og køligt, så holder varerne i måneder.',
        ],
        points: ['25 kg-sække til stort forbrug', 'Passer til bagerier, konditorier og restauranter', 'Kombinér med ris, mel og olie i samme levering'],
      },
    },
  },

  'sugar-sweeteners': {
    name: { en: 'Sugar & Sweeteners', sv: 'Socker & sötningsmedel', no: 'Sukker og søtningsmidler', da: 'Sukker og sødemidler' },
    copy: {
      en: {
        intro: 'Granulated sugar in 25 kg sacks for restaurants, bakeries and sweet shops — Nordic Sugar quality at wholesale prices.',
        body: [
          'Our Nordic Sugar 25 kg sack is fine white granulated sugar that dissolves evenly in syrups, chai, lassi and baking. It is the size most sweet shops and bakeries use as their everyday sugar, and it saves on packaging and handling compared with 1 kg bags.',
          'For glazes and confectionery that need a smoother set, see our glucose syrup in the Sweeteners & Confectionery category.',
        ],
        points: ['Nordic Sugar granulated, 25 kg', 'Ideal for syrups, mithai, baking and drinks', 'Pick up in Spånga or add to your delivery'],
      },
      sv: {
        intro: 'Strösocker i 25 kg-säckar för restauranger, bagerier och konditorier — Nordic Sugar-kvalitet till grossistpris.',
        body: [
          'Vår Nordic Sugar 25 kg är fint vitt strösocker som löser sig jämnt i sockerlag, chai, lassi och bakning. Det är storleken de flesta konditorier och bagerier använder som vardagssocker, och det sparar förpackningar och hantering jämfört med 1 kg-paket.',
          'Till glasyrer och konfektyr som behöver en mjukare struktur, se vår glukossirap under Sötningsmedel & konfektyr.',
        ],
        points: ['Nordic Sugar strösocker, 25 kg', 'Perfekt för sockerlag, mithai, bakning och drycker', 'Hämta i Spånga eller lägg till i leveransen'],
      },
      no: {
        intro: 'Strøsukker i 25 kg-sekker for restauranter, bakerier og konditorier — Nordic Sugar-kvalitet til engrospris.',
        body: [
          'Vår Nordic Sugar 25 kg er fint hvitt strøsukker som løser seg jevnt i sirup, chai, lassi og baking. Det er størrelsen de fleste konditorier og bakerier bruker som hverdagssukker, og det sparer emballasje og håndtering sammenlignet med 1 kg-pakker.',
          'Til glasur og konfekt som trenger en mykere struktur, se glukosesirupen vår under Søtningsmidler og konfekt.',
        ],
        points: ['Nordic Sugar strøsukker, 25 kg', 'Perfekt til sirup, mithai, baking og drikke', 'Hent i Spånga eller legg til i leveransen'],
      },
      da: {
        intro: 'Stødt sukker i 25 kg-sække til restauranter, bagerier og konditorier — Nordic Sugar-kvalitet til engrospris.',
        body: [
          'Vores Nordic Sugar 25 kg er fint hvidt sukker, der opløses jævnt i sirup, chai, lassi og bagning. Det er den størrelse, de fleste konditorier og bagerier bruger som hverdagssukker, og den sparer emballage og håndtering sammenlignet med 1 kg-poser.',
          'Til glasur og konfekt, der skal have en blødere struktur, se vores glukosesirup under Sødemidler og konfekt.',
        ],
        points: ['Nordic Sugar stødt sukker, 25 kg', 'Ideelt til sirup, mithai, bagning og drikke', 'Afhent i Spånga eller læg det i leverancen'],
      },
    },
  },

  rice: {
    name: { en: 'Rice', sv: 'Ris', no: 'Ris', da: 'Ris' },
    copy: {
      en: {
        intro: 'Wholesale basmati rice for restaurants in Stockholm: extra-long 1121 grain and everyday basmati in catering packs.',
        body: [
          'Rice is the base of biryani, pulao and countless curries, so grain length, aroma and consistency matter. We carry Pure Gold Extra Long 1121 basmati for dishes where long, separate grains are the point, and Ocean Pearl basmati in 5 kg packs as a reliable everyday choice.',
          'Both cook up fluffy and fragrant, hold well in hot cabinets and suit both à la carte kitchens and catering.',
        ],
        points: ['Extra-long 1121 and classic basmati', 'Restaurant pack sizes', 'Popular choice for biryani and pulao'],
      },
      sv: {
        intro: 'Basmatiris i grossistförpackning för restauranger i Stockholm: extra långkornigt 1121 och vardagsbasmati i cateringförpackningar.',
        body: [
          'Ris är basen i biryani, pulao och otaliga curryrätter, så kornlängd, doft och jämnhet spelar roll. Vi har Pure Gold Extra Long 1121 basmati för rätter där långa, separata korn är poängen, och Ocean Pearl basmati i 5 kg-förpackningar som ett pålitligt vardagsval.',
          'Båda blir luftiga och doftande, håller sig bra i värmeskåp och passar både à la carte-kök och catering.',
        ],
        points: ['Extra långkornigt 1121 och klassisk basmati', 'Restaurangstorlekar', 'Populärt val till biryani och pulao'],
      },
      no: {
        intro: 'Basmatiris i engrospakning for restauranter: ekstra langkornet 1121 og hverdagsbasmati i cateringpakninger.',
        body: [
          'Ris er grunnlaget for biryani, pulao og utallige karriretter, så kornlengde, duft og jevnhet betyr mye. Vi har Pure Gold Extra Long 1121 basmati til retter der lange, separate korn er poenget, og Ocean Pearl basmati i 5 kg-pakninger som et pålitelig hverdagsvalg.',
          'Begge blir luftige og aromatiske, holder seg godt i varmeskap og passer både à la carte-kjøkken og catering.',
        ],
        points: ['Ekstra langkornet 1121 og klassisk basmati', 'Restaurantstørrelser', 'Populært valg til biryani og pulao'],
      },
      da: {
        intro: 'Basmatiris i engrospakning til restauranter: ekstra langkornet 1121 og hverdagsbasmati i cateringpakninger.',
        body: [
          'Ris er grundlaget for biryani, pulao og utallige karryretter, så kornlængde, duft og ensartethed betyder meget. Vi fører Pure Gold Extra Long 1121 basmati til retter, hvor lange, adskilte korn er pointen, og Ocean Pearl basmati i 5 kg-poser som et pålideligt hverdagsvalg.',
          'Begge bliver luftige og aromatiske, holder sig godt i varmeskab og passer til både à la carte-køkkener og catering.',
        ],
        points: ['Ekstra langkornet 1121 og klassisk basmati', 'Restaurantstørrelser', 'Populært valg til biryani og pulao'],
      },
    },
  },

  'basmati-rice': {
    name: { en: 'Basmati Rice', sv: 'Basmatiris', no: 'Basmatiris', da: 'Basmatiris' },
    copy: {
      en: {
        intro: 'Premium basmati rice wholesale: Pure Gold Extra Long 1121 and Ocean Pearl 5 kg packs for restaurants and caterers.',
        body: [
          'Pure Gold 1121 is an extra-long grain basmati that roughly doubles in length when cooked, giving the separate, elegant grains guests expect in a biryani. Ocean Pearl is a dependable all-round basmati in 5 kg packs that is easy to store and portion.',
          'For best results, rinse until the water runs clear, soak for 20–30 minutes and cook with a measured amount of water or by the boil-and-drain method.',
        ],
        points: ['1121 extra-long grain for biryani', 'Ocean Pearl 5 kg everyday basmati', 'Consistent quality batch after batch'],
      },
      sv: {
        intro: 'Premium basmatiris i grossist: Pure Gold Extra Long 1121 och Ocean Pearl 5 kg för restauranger och catering.',
        body: [
          'Pure Gold 1121 är ett extra långkornigt basmatiris som ungefär fördubblar sin längd vid kokning och ger de separata, eleganta korn gästerna förväntar sig i en biryani. Ocean Pearl är ett pålitligt allround-basmati i 5 kg-förpackning som är lätt att lagra och portionera.',
          'Bäst resultat: skölj tills vattnet är klart, blötlägg 20–30 minuter och koka med avmätt vatten eller koka och häll av.',
        ],
        points: ['1121 extra långkornigt för biryani', 'Ocean Pearl 5 kg vardagsbasmati', 'Jämn kvalitet leverans efter leverans'],
      },
      no: {
        intro: 'Premium basmatiris engros: Pure Gold Extra Long 1121 og Ocean Pearl 5 kg for restauranter og catering.',
        body: [
          'Pure Gold 1121 er en ekstra langkornet basmati som omtrent dobler lengden når den kokes, og gir de separate, elegante kornene gjestene forventer i en biryani. Ocean Pearl er en pålitelig allround-basmati i 5 kg-pakning som er lett å lagre og porsjonere.',
          'Best resultat: skyll til vannet er klart, bløtlegg i 20–30 minutter og kok med avmålt vann eller kok og hell av.',
        ],
        points: ['1121 ekstra langkornet til biryani', 'Ocean Pearl 5 kg hverdagsbasmati', 'Jevn kvalitet levering etter levering'],
      },
      da: {
        intro: 'Premium basmatiris engros: Pure Gold Extra Long 1121 og Ocean Pearl 5 kg til restauranter og catering.',
        body: [
          'Pure Gold 1121 er en ekstra langkornet basmati, der cirka fordobler sin længde under kogning og giver de adskilte, elegante korn, gæsterne forventer i en biryani. Ocean Pearl er en pålidelig allround-basmati i 5 kg-pose, der er nem at opbevare og portionere.',
          'Bedste resultat: skyl til vandet er klart, læg i blød i 20–30 minutter og kog med afmålt vand eller kog og hæld fra.',
        ],
        points: ['1121 ekstra langkornet til biryani', 'Ocean Pearl 5 kg hverdagsbasmati', 'Ensartet kvalitet levering efter levering'],
      },
    },
  },

  juices: {
    name: { en: 'Juices', sv: 'Juice', no: 'Juice', da: 'Juice' },
    copy: {
      en: {
        intro: 'Mango nectar by the case for restaurants and cafés: ANYTIME Chaunsa mango nectar in 1 litre and 200 ml packs.',
        body: [
          'ANYTIME Mango Chaunsa Nectar is made from Chaunsa mangoes, one of the sweetest and most aromatic Pakistani varieties. The 1 litre packs work well for pouring, lassi and mocktails, while 200 ml packs suit takeaway, lunch deals and catering.',
          'Availability of imported juices varies with shipments — if a product is out of stock, contact us and we will tell you when the next delivery arrives.',
        ],
        points: ['Chaunsa mango nectar', '12 x 1 L and 24 x 200 ml cartons', CARTON_NOTE.en],
      },
      sv: {
        intro: 'Mangonektar per kartong för restauranger och kaféer: ANYTIME Chaunsa-mangonektar i 1 liter och 200 ml.',
        body: [
          'ANYTIME Mango Chaunsa Nectar görs på Chaunsa-mango, en av de sötaste och mest aromatiska pakistanska sorterna. 1-litersförpackningarna passar för servering, lassi och alkoholfria drinkar, medan 200 ml passar takeaway, luncherbjudanden och catering.',
          'Tillgången på importerad juice varierar med leveranserna — om en produkt är slut, kontakta oss så berättar vi när nästa leverans kommer.',
        ],
        points: ['Chaunsa-mangonektar', 'Kartonger med 12 x 1 L och 24 x 200 ml', CARTON_NOTE.sv],
      },
      no: {
        intro: 'Mangonektar per kartong for restauranter og kafeer: ANYTIME Chaunsa-mangonektar i 1 liter og 200 ml.',
        body: [
          'ANYTIME Mango Chaunsa Nectar lages av Chaunsa-mango, en av de søteste og mest aromatiske pakistanske sortene. 1-literspakningene passer til servering, lassi og alkoholfrie drinker, mens 200 ml passer til takeaway, lunsjtilbud og catering.',
          'Tilgangen på importert juice varierer med forsendelsene — er en vare utsolgt, kontakt oss så forteller vi når neste levering kommer.',
        ],
        points: ['Chaunsa-mangonektar', 'Kartonger med 12 x 1 L og 24 x 200 ml', CARTON_NOTE.no],
      },
      da: {
        intro: 'Mangonektar pr. karton til restauranter og caféer: ANYTIME Chaunsa-mangonektar i 1 liter og 200 ml.',
        body: [
          'ANYTIME Mango Chaunsa Nectar er lavet af Chaunsa-mango, en af de sødeste og mest aromatiske pakistanske sorter. 1-literspakningerne passer til servering, lassi og alkoholfrie drinks, mens 200 ml passer til takeaway, frokosttilbud og catering.',
          'Udvalget af importeret juice varierer med forsendelserne — er en vare udsolgt, så kontakt os, og vi fortæller, hvornår næste levering kommer.',
        ],
        points: ['Chaunsa-mangonektar', 'Kartoner med 12 x 1 L og 24 x 200 ml', CARTON_NOTE.da],
      },
    },
  },

  flours: {
    name: { en: 'Flour & Grains', sv: 'Mjöl & spannmål', no: 'Mel og korn', da: 'Mel og korn' },
    copy: {
      en: {
        intro: 'Wholesale flour for restaurants and bakeries: wheat flour type 550 in 25 kg bags and TRS gram flour (besan).',
        body: [
          'Type 550 wheat flour is a strong all-purpose flour that gives naan, paratha, pizza bases and pastries good stretch and structure. In 25 kg bags it is the economical choice for kitchens that bake every day.',
          'TRS Gram Flour (besan) is made from ground chickpeas and is essential for pakora, bhaji, kadhi and sweets such as besan ladoo. It comes in cases of 6 x 2 kg for easy storage.',
        ],
        points: ['Type 550 wheat flour, 25 kg', 'TRS besan, 6 x 2 kg case', CARTON_NOTE.en],
      },
      sv: {
        intro: 'Mjöl i grossist för restauranger och bagerier: vetemjöl typ 550 i 25 kg-säckar och TRS kikärtsmjöl (besan).',
        body: [
          'Vetemjöl typ 550 är ett starkt allroundmjöl som ger naan, paratha, pizzabottnar och bakverk bra töjbarhet och struktur. I 25 kg-säck är det det ekonomiska valet för kök som bakar varje dag.',
          'TRS Gram Flour (besan) är malda kikärtor och oumbärligt till pakora, bhaji, kadhi och sötsaker som besan ladoo. Det säljs i kartonger med 6 x 2 kg för enkel lagring.',
        ],
        points: ['Vetemjöl typ 550, 25 kg', 'TRS besan, kartong 6 x 2 kg', CARTON_NOTE.sv],
      },
      no: {
        intro: 'Mel engros for restauranter og bakerier: hvetemel type 550 i 25 kg-sekker og TRS kikertmel (besan).',
        body: [
          'Hvetemel type 550 er et sterkt allround-mel som gir naan, paratha, pizzabunner og bakverk god elastisitet og struktur. I 25 kg-sekk er det det økonomiske valget for kjøkken som baker hver dag.',
          'TRS Gram Flour (besan) er malte kikerter og uunnværlig til pakora, bhaji, kadhi og søtsaker som besan ladoo. Det selges i kartonger med 6 x 2 kg for enkel lagring.',
        ],
        points: ['Hvetemel type 550, 25 kg', 'TRS besan, kartong 6 x 2 kg', CARTON_NOTE.no],
      },
      da: {
        intro: 'Mel engros til restauranter og bagerier: hvedemel type 550 i 25 kg-sække og TRS kikærtemel (besan).',
        body: [
          'Hvedemel type 550 er et stærkt allround-mel, der giver naan, paratha, pizzabunde og bagværk god elasticitet og struktur. I 25 kg-sæk er det det økonomiske valg for køkkener, der bager hver dag.',
          'TRS Gram Flour (besan) er malede kikærter og uundværligt til pakora, bhaji, kadhi og søde sager som besan ladoo. Det sælges i kartoner med 6 x 2 kg for nem opbevaring.',
        ],
        points: ['Hvedemel type 550, 25 kg', 'TRS besan, karton 6 x 2 kg', CARTON_NOTE.da],
      },
    },
  },

  'oils-fats': {
    name: { en: 'Oils & Fats', sv: 'Oljor & fetter', no: 'Oljer og fett', da: 'Olier og fedtstoffer' },
    copy: {
      en: {
        intro: 'Cooking oil, frying oil, olive pomace oil and pure ghee in catering sizes for restaurants and takeaways.',
        body: [
          'Choose the right fat for each job: our 10 litre professional frying oil (frityrolja) is made for high-heat deep frying, the 10 litre all-purpose cooking oil (matolja) covers everyday sautéing and dressings, and KOPE olive pomace oil in 5 litre containers is a cost-effective olive oil for frying and grilling.',
          'Khanum pure ghee, sold in cases of 6 x 2 kg, adds the rich flavour that tarka, biryani, parathas and halwa need.',
        ],
        points: ['10 L frying and cooking oils', 'KOPE olive pomace oil, 5 L', CARTON_NOTE.en],
      },
      sv: {
        intro: 'Matolja, frityrolja, olivpomaceolja och ren ghee i cateringstorlekar för restauranger och takeaway.',
        body: [
          'Välj rätt fett för varje uppgift: vår 10-liters frityrolja tål hög värme vid fritering, 10-liters matoljan täcker vardaglig stekning och dressingar, och KOPE olivpomaceolja i 5-litersdunkar är en prisvärd olivolja för stekning och grillning.',
          'Khanum ren ghee, som säljs i kartonger med 6 x 2 kg, ger den fylliga smak som tarka, biryani, paratha och halwa behöver.',
        ],
        points: ['10 L frityr- och matolja', 'KOPE olivpomaceolja, 5 L', CARTON_NOTE.sv],
      },
      no: {
        intro: 'Matolje, frityrolje, olivenpomaceolje og ren ghee i cateringstørrelser for restauranter og takeaway.',
        body: [
          'Velg riktig fett til hver oppgave: vår 10-liters frityrolje tåler høy varme ved frityrsteking, 10-liters matoljen dekker vanlig steking og dressinger, og KOPE olivenpomaceolje i 5-liters kanner er en rimelig olivenolje til steking og grilling.',
          'Khanum ren ghee, som selges i kartonger med 6 x 2 kg, gir den fyldige smaken som tarka, biryani, paratha og halwa trenger.',
        ],
        points: ['10 L frityr- og matolje', 'KOPE olivenpomaceolje, 5 L', CARTON_NOTE.no],
      },
      da: {
        intro: 'Madolie, friturefedt, olivenpomaceolie og ren ghee i cateringstørrelser til restauranter og takeaway.',
        body: [
          'Vælg det rigtige fedtstof til hver opgave: vores 10-liters friturefedt tåler høj varme ved friturestegning, 10-liters madolien dækker daglig stegning og dressinger, og KOPE olivenpomaceolie i 5-liters dunke er en prisvenlig olivenolie til stegning og grill.',
          'Khanum ren ghee, som sælges i kartoner med 6 x 2 kg, giver den fyldige smag, som tarka, biryani, paratha og halwa kræver.',
        ],
        points: ['10 L friture- og madolie', 'KOPE olivenpomaceolie, 5 L', CARTON_NOTE.da],
      },
    },
  },

  'spices-flavouring': {
    name: { en: 'Spices & Flavouring', sv: 'Kryddor & smaksättning', no: 'Krydder og smakstilsetning', da: 'Krydderier og smagsgivere' },
    copy: {
      en: {
        intro: 'Bulk spices and food colours for restaurant kitchens: 5 kg turmeric powder and Rangkat food colour powder.',
        body: [
          'Spices are used in such quantities in South Asian cooking that retail jars quickly become expensive. Our 5 kg turmeric powder gives curries, rice and marinades their colour and earthy flavour at a fraction of the per-kilo price of small packs.',
          'Rangkat food colour powder in 1 kg tubs delivers the bright, consistent colour expected in biryani, tandoori dishes and sweets.',
        ],
        points: ['Turmeric powder, 5 kg', 'Rangkat food colour, 1 kg tub', 'Bulk sizes for daily kitchen use'],
      },
      sv: {
        intro: 'Kryddor och livsmedelsfärg i storpack för restaurangkök: 5 kg gurkmejapulver och Rangkat färgpulver.',
        body: [
          'I det sydasiatiska köket används kryddor i så stora mängder att butiksburkar snabbt blir dyra. Vårt 5 kg gurkmejapulver ger curry, ris och marinader färg och jordig smak till en bråkdel av kilopriset för småförpackningar.',
          'Rangkat färgpulver i 1 kg-burkar ger den klara, jämna färg som förväntas i biryani, tandoorirätter och sötsaker.',
        ],
        points: ['Gurkmejapulver, 5 kg', 'Rangkat livsmedelsfärg, 1 kg burk', 'Storpack för dagligt bruk i köket'],
      },
      no: {
        intro: 'Krydder og matfarge i storpakning for restaurantkjøkken: 5 kg gurkemeiepulver og Rangkat fargepulver.',
        body: [
          'I det sørasiatiske kjøkkenet brukes krydder i så store mengder at butikkglass fort blir dyrt. Vårt 5 kg gurkemeiepulver gir karri, ris og marinader farge og jordaktig smak til en brøkdel av kiloprisen for småpakninger.',
          'Rangkat fargepulver i 1 kg-bokser gir den klare, jevne fargen som forventes i biryani, tandooriretter og søtsaker.',
        ],
        points: ['Gurkemeiepulver, 5 kg', 'Rangkat matfarge, 1 kg boks', 'Storpakninger for daglig bruk'],
      },
      da: {
        intro: 'Krydderier og madfarve i storpakning til restaurantkøkkener: 5 kg gurkemejepulver og Rangkat farvepulver.',
        body: [
          'I det sydasiatiske køkken bruges krydderier i så store mængder, at butiksglas hurtigt bliver dyre. Vores 5 kg gurkemejepulver giver karry, ris og marinader farve og jordagtig smag til en brøkdel af kiloprisen for små pakninger.',
          'Rangkat farvepulver i 1 kg-bøtter giver den klare, ensartede farve, der forventes i biryani, tandooriretter og søde sager.',
        ],
        points: ['Gurkemejepulver, 5 kg', 'Rangkat madfarve, 1 kg bøtte', 'Storpakninger til daglig brug'],
      },
    },
  },

  spices: {
    name: { en: 'Spices', sv: 'Kryddor', no: 'Krydder', da: 'Krydderier' },
    copy: {
      en: {
        intro: 'Wholesale spices in 5 kg packs for restaurants: ground turmeric for curries, rice and marinades.',
        body: [
          'Our ground turmeric comes in 5 kg packs, sized for kitchens that cook curries, dal and rice every day. It has a deep yellow colour and warm, earthy taste, and it blends evenly into marinades and spice mixes.',
          'Keep it sealed, dry and away from light to preserve colour and aroma. Buying in bulk means one reorder instead of many small top-ups.',
        ],
        points: ['Ground turmeric, 5 kg', 'For curries, dal, rice and marinades', 'Store sealed, cool and dark'],
      },
      sv: {
        intro: 'Kryddor i grossist i 5 kg-förpackningar för restauranger: malen gurkmeja till curry, ris och marinader.',
        body: [
          'Vår malda gurkmeja kommer i 5 kg-förpackningar, anpassade för kök som lagar curry, dal och ris varje dag. Den har djupt gul färg och varm, jordig smak och blandar sig jämnt i marinader och kryddblandningar.',
          'Förvara tätt, torrt och mörkt för att bevara färg och arom. Att köpa i storpack betyder en beställning i stället för många små påfyllningar.',
        ],
        points: ['Malen gurkmeja, 5 kg', 'Till curry, dal, ris och marinader', 'Förvaras tätt, svalt och mörkt'],
      },
      no: {
        intro: 'Krydder engros i 5 kg-pakninger for restauranter: malt gurkemeie til karri, ris og marinader.',
        body: [
          'Vår malte gurkemeie kommer i 5 kg-pakninger, tilpasset kjøkken som lager karri, dal og ris hver dag. Den har dyp gul farge og varm, jordaktig smak og blander seg jevnt i marinader og krydderblandinger.',
          'Oppbevares tett, tørt og mørkt for å bevare farge og aroma. Å kjøpe i storpakning betyr én bestilling i stedet for mange små påfyll.',
        ],
        points: ['Malt gurkemeie, 5 kg', 'Til karri, dal, ris og marinader', 'Oppbevares tett, kjølig og mørkt'],
      },
      da: {
        intro: 'Krydderier engros i 5 kg-pakninger til restauranter: stødt gurkemeje til karry, ris og marinader.',
        body: [
          'Vores stødte gurkemeje kommer i 5 kg-pakninger, tilpasset køkkener, der laver karry, dal og ris hver dag. Den har dyb gul farve og varm, jordagtig smag og blander sig jævnt i marinader og krydderiblandinger.',
          'Opbevares tæt, tørt og mørkt for at bevare farve og aroma. At købe i storpakning betyder én bestilling i stedet for mange små påfyldninger.',
        ],
        points: ['Stødt gurkemeje, 5 kg', 'Til karry, dal, ris og marinader', 'Opbevares tæt, køligt og mørkt'],
      },
    },
  },

  'food-colours': {
    name: { en: 'Food Colours', sv: 'Livsmedelsfärg', no: 'Matfarge', da: 'Madfarve' },
    copy: {
      en: {
        intro: 'Food colour powder for restaurants: Rangkat in 1 kg tubs for biryani, tandoori dishes and sweets.',
        body: [
          'Rangkat food colour powder is concentrated, so a small amount gives strong, even colour. Professional kitchens use it for the orange-red of tandoori chicken and tikka, the saffron tones in biryani and pulao, and the bright colours of jalebi and other sweets.',
          'The 1 kg tub lasts a long time in normal use. Dissolve the powder in a little water or milk before adding it so it spreads evenly.',
        ],
        points: ['Rangkat food colour powder, 1 kg', 'Strong, consistent colour', 'For tandoori, biryani and mithai'],
      },
      sv: {
        intro: 'Färgpulver för restauranger: Rangkat i 1 kg-burkar till biryani, tandoorirätter och sötsaker.',
        body: [
          'Rangkat färgpulver är koncentrerat, så en liten mängd ger stark och jämn färg. Professionella kök använder det till den orangeröda färgen på tandoorikyckling och tikka, saffranstonerna i biryani och pulao samt de klara färgerna i jalebi och andra sötsaker.',
          '1 kg-burken räcker länge vid normal användning. Lös upp pulvret i lite vatten eller mjölk innan det tillsätts så fördelas färgen jämnt.',
        ],
        points: ['Rangkat färgpulver, 1 kg', 'Stark, jämn färg', 'Till tandoori, biryani och mithai'],
      },
      no: {
        intro: 'Fargepulver for restauranter: Rangkat i 1 kg-bokser til biryani, tandooriretter og søtsaker.',
        body: [
          'Rangkat fargepulver er konsentrert, så en liten mengde gir sterk og jevn farge. Profesjonelle kjøkken bruker det til den oransjerøde fargen på tandoorikylling og tikka, safrantonene i biryani og pulao og de klare fargene i jalebi og andre søtsaker.',
          '1 kg-boksen varer lenge ved normal bruk. Løs opp pulveret i litt vann eller melk før det tilsettes, så fordeles fargen jevnt.',
        ],
        points: ['Rangkat fargepulver, 1 kg', 'Sterk, jevn farge', 'Til tandoori, biryani og mithai'],
      },
      da: {
        intro: 'Farvepulver til restauranter: Rangkat i 1 kg-bøtter til biryani, tandooriretter og søde sager.',
        body: [
          'Rangkat farvepulver er koncentreret, så en lille mængde giver stærk og jævn farve. Professionelle køkkener bruger det til den orangerøde farve på tandoorikylling og tikka, safrantonerne i biryani og pulao og de klare farver i jalebi og andre søde sager.',
          '1 kg-bøtten holder længe ved normal brug. Opløs pulveret i lidt vand eller mælk, før det tilsættes, så farven fordeles jævnt.',
        ],
        points: ['Rangkat farvepulver, 1 kg', 'Stærk, ensartet farve', 'Til tandoori, biryani og mithai'],
      },
    },
  },

  'bakery-leavening-agents': {
    name: { en: 'Bakery & Leavening Agents', sv: 'Bakning & jäsmedel', no: 'Baking og hevemidler', da: 'Bagning og hævemidler' },
    copy: {
      en: {
        intro: "Bakery ingredients for professional use: baker's ammonia (hjorthornsalt) in 2 kg tubs.",
        body: [
          "Baker's ammonia, known in Sweden as hjorthornsalt, is the traditional Scandinavian leavening agent for crisp, dry biscuits such as drömmar. It gives a lighter, crunchier texture than baking powder in thin, dry bakes.",
          'Our 2 kg tub suits bakeries and sweet shops that bake in batches. Use it in recipes designed for it, keep the lid tightly closed and store it cool and dry.',
        ],
        points: ["Baker's ammonia (hjorthornsalt), 2 kg", 'For crisp biscuits and cookies', 'Keep tightly sealed'],
      },
      sv: {
        intro: 'Bageriingredienser för professionellt bruk: hjorthornsalt i 2 kg-burkar.',
        body: [
          'Hjorthornsalt är det traditionella jäsmedlet för spröda, torra kakor som drömmar. Det ger en luftigare och krispigare struktur än bakpulver i tunna, torra bakverk.',
          'Vår 2 kg-burk passar bagerier och konditorier som bakar i omgångar. Använd det i recept avsedda för hjorthornsalt, håll locket väl stängt och förvara svalt och torrt.',
        ],
        points: ['Hjorthornsalt, 2 kg', 'För spröda kakor och småkakor', 'Förvaras väl tillslutet'],
      },
      no: {
        intro: 'Bakeriingredienser for profesjonelt bruk: hjortetakksalt i 2 kg-bokser.',
        body: [
          'Hjortetakksalt er det tradisjonelle hevemiddelet for sprø, tørre kaker som drømmekaker. Det gir en luftigere og sprøere struktur enn bakepulver i tynne, tørre bakverk.',
          'Vår 2 kg-boks passer bakerier og konditorier som baker i omganger. Bruk det i oppskrifter laget for hjortetakksalt, hold lokket godt lukket og oppbevar kjølig og tørt.',
        ],
        points: ['Hjortetakksalt, 2 kg', 'For sprø kaker og småkaker', 'Oppbevares godt lukket'],
      },
      da: {
        intro: 'Bageriingredienser til professionelt brug: hjortetaksalt i 2 kg-bøtter.',
        body: [
          'Hjortetaksalt er det traditionelle hævemiddel til sprøde, tørre kager som drømmekager. Det giver en luftigere og sprødere struktur end bagepulver i tynde, tørre bagværk.',
          'Vores 2 kg-bøtte passer til bagerier og konditorier, der bager i portioner. Brug det i opskrifter beregnet til hjortetaksalt, hold låget tæt lukket og opbevar køligt og tørt.',
        ],
        points: ['Hjortetaksalt, 2 kg', 'Til sprøde kager og småkager', 'Opbevares tæt lukket'],
      },
    },
  },

  'sweeteners-confectionery': {
    name: { en: 'Sweeteners & Confectionery', sv: 'Sötningsmedel & konfektyr', no: 'Søtningsmidler og konfekt', da: 'Sødemidler og konfekt' },
    copy: {
      en: {
        intro: 'Confectionery ingredients in bulk: glucose syrup 40 DE in 12.5 kg tubs for sweet shops, bakeries and ice cream makers.',
        body: [
          'Glucose syrup (glykos) prevents sugar from crystallising, keeps sweets soft and gives glazes, fillings and ice cream a smooth texture. 40 DE is a versatile grade used in candy, fudge, jams, mithai syrups and frozen desserts.',
          'The 12.5 kg tub is a practical size for production kitchens. Warm it slightly to make it easier to pour and measure.',
        ],
        points: ['Glucose syrup 40 DE, 12.5 kg', 'Stops crystallisation, adds shine', 'For sweets, glazes and ice cream'],
      },
      sv: {
        intro: 'Konfektyringredienser i storpack: glukossirap 40 DE i 12,5 kg-hinkar för konditorier, bagerier och glassmakare.',
        body: [
          'Glukossirap (glykos) hindrar socker från att kristallisera, håller godis mjukt och ger glasyrer, fyllningar och glass en len struktur. 40 DE är en mångsidig kvalitet som används i godis, kola, sylt, mithai-sockerlag och frysta desserter.',
          '12,5 kg-hinken är en praktisk storlek för produktionskök. Värm den lätt så blir sirapen enklare att hälla och mäta.',
        ],
        points: ['Glukossirap 40 DE, 12,5 kg', 'Hindrar kristallisering och ger glans', 'Till godis, glasyr och glass'],
      },
      no: {
        intro: 'Konfektingredienser i storpakning: glukosesirup 40 DE i 12,5 kg-spann for konditorier, bakerier og iskremprodusenter.',
        body: [
          'Glukosesirup hindrer sukker i å krystallisere, holder godteri mykt og gir glasur, fyll og iskrem en glatt struktur. 40 DE er en allsidig kvalitet som brukes i godteri, karamell, syltetøy, mithai-sirup og frosne desserter.',
          '12,5 kg-spannet er en praktisk størrelse for produksjonskjøkken. Varm det lett, så blir sirupen enklere å helle og måle.',
        ],
        points: ['Glukosesirup 40 DE, 12,5 kg', 'Hindrer krystallisering og gir glans', 'Til godteri, glasur og iskrem'],
      },
      da: {
        intro: 'Konfektingredienser i storpakning: glukosesirup 40 DE i 12,5 kg-spande til konditorier, bagerier og isproducenter.',
        body: [
          'Glukosesirup forhindrer sukker i at krystallisere, holder slik blødt og giver glasur, fyld og is en glat struktur. 40 DE er en alsidig kvalitet, der bruges i slik, karamel, marmelade, mithai-sirup og frosne desserter.',
          '12,5 kg-spanden er en praktisk størrelse til produktionskøkkener. Varm den let op, så bliver siruppen nemmere at hælde og afmåle.',
        ],
        points: ['Glukosesirup 40 DE, 12,5 kg', 'Forhindrer krystallisering og giver glans', 'Til slik, glasur og is'],
      },
    },
  },

  'fruit-specialty-ingredients': {
    name: { en: 'Fruit & Specialty Ingredients', sv: 'Frukt & specialingredienser', no: 'Frukt og spesialingredienser', da: 'Frugt og specialingredienser' },
    copy: {
      en: {
        intro: 'Specialty fruit ingredients for restaurants and cafés: Lazzat Kesar mango pulp in cases of 6 x 850 g.',
        body: [
          'Kesar mango pulp is made from the saffron-coloured Kesar mango, prized for its sweet, intense flavour. It gives a consistent result all year round in mango lassi, shakes, kulfi, desserts, cheesecakes and cocktails, with no peeling or seasonal price swings.',
          'The 850 g tins are easy to portion and store, and a case of six suits cafés, restaurants and caterers alike.',
        ],
        points: ['Lazzat Kesar mango pulp', '6 x 850 g case', CARTON_NOTE.en],
      },
      sv: {
        intro: 'Fruktspecialiteter för restauranger och kaféer: Lazzat Kesar-mangopuré i kartonger med 6 x 850 g.',
        body: [
          'Kesar-mangopuré görs av den saffransfärgade Kesar-mangon, känd för sin söta och intensiva smak. Den ger ett jämnt resultat året runt i mangolassi, shakes, kulfi, desserter, cheesecake och drinkar, utan skalning eller säsongsvariationer i pris.',
          'Burkarna på 850 g är lätta att portionera och lagra, och en kartong med sex passar kaféer, restauranger och catering.',
        ],
        points: ['Lazzat Kesar-mangopuré', 'Kartong 6 x 850 g', CARTON_NOTE.sv],
      },
      no: {
        intro: 'Fruktspesialiteter for restauranter og kafeer: Lazzat Kesar-mangopuré i kartonger med 6 x 850 g.',
        body: [
          'Kesar-mangopuré lages av den safranfargede Kesar-mangoen, kjent for sin søte og intense smak. Den gir et jevnt resultat året rundt i mangolassi, shakes, kulfi, desserter, ostekake og drinker, uten skrelling eller sesongsvingninger i pris.',
          'Boksene på 850 g er enkle å porsjonere og lagre, og en kartong med seks passer kafeer, restauranter og catering.',
        ],
        points: ['Lazzat Kesar-mangopuré', 'Kartong 6 x 850 g', CARTON_NOTE.no],
      },
      da: {
        intro: 'Frugtspecialiteter til restauranter og caféer: Lazzat Kesar-mangopuré i kartoner med 6 x 850 g.',
        body: [
          'Kesar-mangopuré er lavet af den safranfarvede Kesar-mango, kendt for sin søde og intense smag. Den giver et ensartet resultat året rundt i mangolassi, shakes, kulfi, desserter, cheesecake og drinks, uden skrælning eller sæsonudsving i prisen.',
          'Dåserne på 850 g er nemme at portionere og opbevare, og en karton med seks passer til caféer, restauranter og catering.',
        ],
        points: ['Lazzat Kesar-mangopuré', 'Karton 6 x 850 g', CARTON_NOTE.da],
      },
    },
  },

  'dry-fruits': {
    name: { en: 'Dry Fruits', sv: 'Torkad frukt', no: 'Tørket frukt', da: 'Tørret frugt' },
    copy: {
      en: {
        intro: 'Dried fruit wholesale for restaurants, cafés and shops: premium Jordanian Medjool dates in 12-pack sets.',
        body: [
          'Dried fruit is central to South Asian and Middle Eastern hospitality — served with tea, used in desserts and especially in demand during Ramadan and Eid. Our range starts with Class 1 Jordanian Medjool dates: large, soft and naturally sweet.',
          'Medjool dates work as they are on a dessert plate, chopped into salads and baking, or blended into shakes and energy balls.',
        ],
        points: ['Class 1 Jordanian Medjool dates', 'Sold as a 12-pack set', 'Peak demand around Ramadan — order early'],
      },
      sv: {
        intro: 'Torkad frukt i grossist för restauranger, kaféer och butiker: premium jordanska Medjool-dadlar i 12-pack.',
        body: [
          'Torkad frukt är central i sydasiatisk och mellanöstersk gästfrihet — serveras till te, används i desserter och efterfrågas särskilt under ramadan och eid. Vårt sortiment börjar med jordanska Medjool-dadlar klass 1: stora, mjuka och naturligt söta.',
          'Medjool-dadlar fungerar som de är på ett dessertfat, hackade i sallader och bakning eller mixade i shakes och energibollar.',
        ],
        points: ['Jordanska Medjool-dadlar klass 1', 'Säljs som 12-pack', 'Stor efterfrågan kring ramadan — beställ i god tid'],
      },
      no: {
        intro: 'Tørket frukt engros for restauranter, kafeer og butikker: premium jordanske Medjool-dadler i 12-pakning.',
        body: [
          'Tørket frukt er sentralt i sørasiatisk og midtøstlig gjestfrihet — serveres til te, brukes i desserter og er særlig etterspurt under ramadan og eid. Sortimentet vårt starter med jordanske Medjool-dadler klasse 1: store, myke og naturlig søte.',
          'Medjool-dadler fungerer som de er på et dessertfat, hakket i salater og baking eller blandet i shakes og energikuler.',
        ],
        points: ['Jordanske Medjool-dadler klasse 1', 'Selges som 12-pakning', 'Stor etterspørsel rundt ramadan — bestill i god tid'],
      },
      da: {
        intro: 'Tørret frugt engros til restauranter, caféer og butikker: premium jordanske Medjool-dadler i 12-pakning.',
        body: [
          'Tørret frugt er centralt i sydasiatisk og mellemøstlig gæstfrihed — serveres til te, bruges i desserter og er især efterspurgt under ramadan og eid. Vores sortiment starter med jordanske Medjool-dadler klasse 1: store, bløde og naturligt søde.',
          'Medjool-dadler fungerer som de er på et dessertfad, hakket i salater og bagværk eller blendet i shakes og energikugler.',
        ],
        points: ['Jordanske Medjool-dadler klasse 1', 'Sælges som 12-pakning', 'Stor efterspørgsel omkring ramadan — bestil i god tid'],
      },
    },
  },

  dates: {
    name: { en: 'Dates', sv: 'Dadlar', no: 'Dadler', da: 'Dadler' },
    copy: {
      en: {
        intro: 'Wholesale Medjool dates: Class 1 Jordanian Medjool in 12-pack sets for restaurants, cafés and shops.',
        body: [
          'Medjool is the largest and most prized date variety, with a soft, caramel-like flesh. Our Class 1 Jordanian Medjool dates are graded for size and appearance, so they look as good on a serving plate as they taste.',
          'Restaurants serve them with coffee and at iftar, cafés use them in shakes and baking, and shops sell the packs directly. Store cool, or chilled for longer shelf life.',
        ],
        points: ['Class 1 Jordanian Medjool', '12-pack set', 'Popular for iftar, Eid and gifting'],
      },
      sv: {
        intro: 'Medjool-dadlar i grossist: jordanska Medjool klass 1 i 12-pack för restauranger, kaféer och butiker.',
        body: [
          'Medjool är den största och mest uppskattade dadelsorten, med mjukt fruktkött som påminner om kola. Våra jordanska Medjool-dadlar klass 1 är sorterade efter storlek och utseende, så de ser lika bra ut på ett serveringsfat som de smakar.',
          'Restauranger serverar dem till kaffe och vid iftar, kaféer använder dem i shakes och bakning, och butiker säljer förpackningarna direkt. Förvara svalt, eller i kylen för längre hållbarhet.',
        ],
        points: ['Jordanska Medjool klass 1', '12-pack', 'Populära till iftar, eid och som gåva'],
      },
      no: {
        intro: 'Medjool-dadler engros: jordanske Medjool klasse 1 i 12-pakning for restauranter, kafeer og butikker.',
        body: [
          'Medjool er den største og mest ettertraktede dadelsorten, med mykt fruktkjøtt som minner om karamell. Våre jordanske Medjool-dadler klasse 1 er sortert etter størrelse og utseende, så de ser like bra ut på et serveringsfat som de smaker.',
          'Restauranter serverer dem til kaffe og ved iftar, kafeer bruker dem i shakes og baking, og butikker selger pakningene direkte. Oppbevares kjølig, eller i kjøleskap for lengre holdbarhet.',
        ],
        points: ['Jordanske Medjool klasse 1', '12-pakning', 'Populære til iftar, eid og som gave'],
      },
      da: {
        intro: 'Medjool-dadler engros: jordanske Medjool klasse 1 i 12-pakning til restauranter, caféer og butikker.',
        body: [
          'Medjool er den største og mest eftertragtede dadelsort med blødt frugtkød, der minder om karamel. Vores jordanske Medjool-dadler klasse 1 er sorteret efter størrelse og udseende, så de ser lige så godt ud på et serveringsfad, som de smager.',
          'Restauranter serverer dem til kaffe og ved iftar, caféer bruger dem i shakes og bagværk, og butikker sælger pakningerne direkte. Opbevares køligt, eller på køl for længere holdbarhed.',
        ],
        points: ['Jordanske Medjool klasse 1', '12-pakning', 'Populære til iftar, eid og som gave'],
      },
    },
  },

  electronics: {
    name: { en: 'Electronics', sv: 'Elektronik', no: 'Elektronikk', da: 'Elektronik' },
    copy: {
      en: {
        intro: 'Practical electrical equipment for restaurants and shops: mini electric tandoor ovens and 16-inch AC/DC stand fans.',
        body: [
          'Our mini electric tandoor brings tandoor-style naan, kulcha and tikka to kitchens that cannot install a charcoal or gas tandoor. It runs on standard power, heats up quickly and needs no charcoal or chimney. Volume pricing is available when you order several.',
          'The 16-inch AC/DC stand fan runs on mains power or a battery, which makes it useful in hot kitchens, market stalls, outdoor catering and during power cuts.',
        ],
        points: ['Mini electric tandoor oven', '16-inch AC/DC stand fan', 'Volume pricing on tandoors'],
      },
      sv: {
        intro: 'Praktisk elutrustning för restauranger och butiker: elektriska minitandoorugnar och 16-tums AC/DC-golvfläktar.',
        body: [
          'Vår elektriska minitandoor ger tandoorstil på naan, kulcha och tikka i kök som inte kan installera en kol- eller gastandoor. Den drivs med vanlig el, blir snabbt varm och behöver varken kol eller skorsten. Mängdpris finns vid köp av flera.',
          '16-tums AC/DC-golvfläkten går på nätström eller batteri, vilket gör den användbar i varma kök, marknadsstånd, utomhuscatering och vid strömavbrott.',
        ],
        points: ['Elektrisk minitandoor', '16-tums AC/DC-golvfläkt', 'Mängdpris på tandoorugnar'],
      },
      no: {
        intro: 'Praktisk elektrisk utstyr for restauranter og butikker: elektriske minitandoorovner og 16-tommers AC/DC-gulvvifter.',
        body: [
          'Vår elektriske minitandoor gir tandoorstil på naan, kulcha og tikka i kjøkken som ikke kan installere en kull- eller gasstandoor. Den går på vanlig strøm, blir raskt varm og trenger verken kull eller pipe. Mengderabatt gis ved kjøp av flere.',
          '16-tommers AC/DC-gulvviften går på strømnettet eller batteri, noe som gjør den nyttig i varme kjøkken, markedsboder, utendørs catering og ved strømbrudd.',
        ],
        points: ['Elektrisk minitandoor', '16-tommers AC/DC-gulvvifte', 'Mengderabatt på tandoorovner'],
      },
      da: {
        intro: 'Praktisk elektrisk udstyr til restauranter og butikker: elektriske minitandoorovne og 16-tommer AC/DC-standventilatorer.',
        body: [
          'Vores elektriske minitandoor giver tandoorstil på naan, kulcha og tikka i køkkener, der ikke kan installere en kul- eller gastandoor. Den kører på almindelig strøm, bliver hurtigt varm og kræver hverken kul eller skorsten. Mængderabat gives ved køb af flere.',
          '16-tommer AC/DC-standventilatoren kører på lysnettet eller batteri, hvilket gør den nyttig i varme køkkener, markedsboder, udendørs catering og ved strømafbrydelser.',
        ],
        points: ['Elektrisk minitandoor', '16-tommer AC/DC-standventilator', 'Mængderabat på tandoorovne'],
      },
    },
  },

  'tandoor-oven': {
    name: { en: 'Tandoor Oven', sv: 'Tandoorugn', no: 'Tandoorovn', da: 'Tandoorovn' },
    copy: {
      en: {
        intro: 'Electric tandoor ovens for restaurants in Sweden: the mini electric tandoor for naan, kulcha and tikka without charcoal.',
        body: [
          'A traditional clay tandoor needs charcoal or gas, a chimney and fire-safety approval. The mini electric tandoor gives you the high, dry heat for naan, kulcha, roti and tikka in a compact unit that plugs into standard power — ideal for restaurants, food trucks, caterers and home-based businesses.',
          'Read our guide comparing electric and charcoal tandoors on the blog, or contact us for advice on choosing the right setup for your kitchen.',
        ],
        points: ['No charcoal, gas or chimney needed', 'Compact, plugs into standard power', 'Volume pricing for multiple units'],
      },
      sv: {
        intro: 'Elektriska tandoorugnar för restauranger i Sverige: elektrisk minitandoor för naan, kulcha och tikka utan kol.',
        body: [
          'En traditionell lertandoor kräver kol eller gas, skorsten och brandskyddsgodkännande. Den elektriska minitandoorn ger den höga, torra värme som naan, kulcha, roti och tikka behöver i en kompakt enhet som kopplas in i vanligt eluttag — perfekt för restauranger, foodtrucks, catering och mindre företag.',
          'Läs vår guide om elektrisk kontra koleldad tandoor på bloggen, eller kontakta oss för råd om rätt lösning för ditt kök.',
        ],
        points: ['Inget kol, gas eller skorsten behövs', 'Kompakt, för vanligt eluttag', 'Mängdpris vid köp av flera'],
      },
      no: {
        intro: 'Elektriske tandoorovner for restauranter: elektrisk minitandoor for naan, kulcha og tikka uten kull.',
        body: [
          'En tradisjonell leirtandoor krever kull eller gass, pipe og brannsikkerhetsgodkjenning. Den elektriske minitandooren gir den høye, tørre varmen naan, kulcha, roti og tikka trenger, i en kompakt enhet som kobles til vanlig stikkontakt — perfekt for restauranter, matvogner, catering og mindre bedrifter.',
          'Les guiden vår om elektrisk kontra kullfyrt tandoor på bloggen, eller kontakt oss for råd om riktig løsning for kjøkkenet ditt.',
        ],
        points: ['Ikke behov for kull, gass eller pipe', 'Kompakt, for vanlig stikkontakt', 'Mengderabatt ved kjøp av flere'],
      },
      da: {
        intro: 'Elektriske tandoorovne til restauranter: elektrisk minitandoor til naan, kulcha og tikka uden kul.',
        body: [
          'En traditionel lertandoor kræver kul eller gas, skorsten og brandsikkerhedsgodkendelse. Den elektriske minitandoor giver den høje, tørre varme, som naan, kulcha, roti og tikka kræver, i en kompakt enhed, der sættes i en almindelig stikkontakt — ideel til restauranter, foodtrucks, catering og mindre virksomheder.',
          'Læs vores guide om elektrisk kontra kulfyret tandoor på bloggen, eller kontakt os for råd om den rigtige løsning til dit køkken.',
        ],
        points: ['Ingen kul, gas eller skorsten nødvendig', 'Kompakt, til almindelig stikkontakt', 'Mængderabat ved køb af flere'],
      },
    },
  },

  packing: {
    name: { en: 'Packaging', sv: 'Förpackningar', no: 'Emballasje', da: 'Emballage' },
    copy: {
      en: {
        intro: 'Takeaway and food packaging for restaurants, sweet shops and caterers: containers, dressing cups, bags, sweet boxes and kitchen roll.',
        body: [
          'Good packaging keeps food hot, prevents leaks and presents your brand well. Our range covers microwaveable black containers with lids, 50 ml dressing cups for sauces and raita, clear plastic and brown paper carrier bags, gold-foil Celebration sweet boxes for mithai, and large kitchen rolls for the back of house.',
          'Everything is sold in trade packs sized for daily service, so you reorder less often and pay less per piece.',
        ],
        points: [PACK_NOTE.en, 'Containers, cups, bags and sweet boxes', 'Combine with food orders in one delivery'],
      },
      sv: {
        intro: 'Takeaway- och livsmedelsförpackningar för restauranger, konditorier och catering: lådor, dressingkoppar, kassar, godisaskar och torkrulle.',
        body: [
          'Bra förpackningar håller maten varm, förhindrar läckage och visar upp ditt varumärke. Sortimentet omfattar mikrovågssäkra svarta lådor med lock, 50 ml dressingkoppar för såser och raita, genomskinliga plastkassar och bruna papperskassar, guldfoliepräglade Celebration-askar för mithai samt stora torkrullar till köket.',
          'Allt säljs i grossistförpackningar anpassade för daglig drift, så du beställer mer sällan och betalar mindre per styck.',
        ],
        points: [PACK_NOTE.sv, 'Lådor, koppar, kassar och godisaskar', 'Kombinera med livsmedel i samma leverans'],
      },
      no: {
        intro: 'Takeaway- og matemballasje for restauranter, konditorier og catering: bokser, dressingbegre, poser, søtsakesker og tørkeruller.',
        body: [
          'God emballasje holder maten varm, hindrer lekkasje og viser frem merkevaren din. Sortimentet omfatter mikrobølgesikre svarte bokser med lokk, 50 ml dressingbegre til sauser og raita, gjennomsiktige plastposer og brune papirposer, gullfolierte Celebration-esker til mithai og store tørkeruller til kjøkkenet.',
          'Alt selges i engrospakninger tilpasset daglig drift, så du bestiller sjeldnere og betaler mindre per stykk.',
        ],
        points: [PACK_NOTE.no, 'Bokser, begre, poser og søtsakesker', 'Kombiner med mat i samme levering'],
      },
      da: {
        intro: 'Takeaway- og fødevareemballage til restauranter, konditorier og catering: bakker, dressingbægre, poser, slikæsker og køkkenruller.',
        body: [
          'God emballage holder maden varm, forhindrer lækager og præsenterer dit brand godt. Sortimentet omfatter mikroovnsegnede sorte bakker med låg, 50 ml dressingbægre til saucer og raita, klare plastposer og brune papirposer, guldfolierede Celebration-æsker til mithai og store køkkenruller til køkkenet.',
          'Alt sælges i engrospakninger tilpasset daglig drift, så du bestiller sjældnere og betaler mindre pr. stk.',
        ],
        points: [PACK_NOTE.da, 'Bakker, bægre, poser og slikæsker', 'Kombinér med fødevarer i samme levering'],
      },
    },
  },

  'food-containers': {
    name: { en: 'Food Containers', sv: 'Matlådor', no: 'Matbokser', da: 'Madbakker' },
    copy: {
      en: {
        intro: 'Takeaway food containers wholesale: microwaveable black containers with lids and 50 ml dressing cups.',
        body: [
          'MICROFORM black microwaveable containers (650 ml, 250 per pack) are made from polypropylene, so customers can reheat food in them, and the lids seal well for delivery. Use them for curries, rice dishes and meal prep.',
          'Transparent 50 ml dressing cups with lids (100 per pack) are sized for sauces, chutneys, raita and dips that travel alongside the main dish.',
        ],
        points: ['650 ml microwaveable PP containers, 250 per pack', '50 ml dressing cups with lids, 100 per pack', PACK_NOTE.en],
      },
      sv: {
        intro: 'Matlådor för takeaway i grossist: mikrovågssäkra svarta lådor med lock och 50 ml dressingkoppar.',
        body: [
          'MICROFORM svarta mikrovågssäkra lådor (650 ml, 250 per förpackning) är gjorda av polypropen så att kunderna kan värma maten i dem, och locken sluter tätt vid leverans. Använd dem till curry, risrätter och matlådor.',
          'Genomskinliga 50 ml dressingkoppar med lock (100 per förpackning) passar för såser, chutney, raita och dippar som följer med huvudrätten.',
        ],
        points: ['650 ml mikrovågssäkra PP-lådor, 250 per förpackning', '50 ml dressingkoppar med lock, 100 per förpackning', PACK_NOTE.sv],
      },
      no: {
        intro: 'Matbokser for takeaway engros: mikrobølgesikre svarte bokser med lokk og 50 ml dressingbegre.',
        body: [
          'MICROFORM svarte mikrobølgesikre bokser (650 ml, 250 per pakke) er laget av polypropylen slik at kundene kan varme maten i dem, og lokkene lukker tett under levering. Bruk dem til karri, risretter og matpakker.',
          'Gjennomsiktige 50 ml dressingbegre med lokk (100 per pakke) passer til sauser, chutney, raita og dipp som følger med hovedretten.',
        ],
        points: ['650 ml mikrobølgesikre PP-bokser, 250 per pakke', '50 ml dressingbegre med lokk, 100 per pakke', PACK_NOTE.no],
      },
      da: {
        intro: 'Madbakker til takeaway engros: mikroovnsegnede sorte bakker med låg og 50 ml dressingbægre.',
        body: [
          'MICROFORM sorte mikroovnsegnede bakker (650 ml, 250 pr. pakke) er lavet af polypropylen, så kunderne kan genopvarme maden i dem, og lågene lukker tæt under levering. Brug dem til karry, risretter og madpakker.',
          'Klare 50 ml dressingbægre med låg (100 pr. pakke) passer til saucer, chutney, raita og dip, der følger med hovedretten.',
        ],
        points: ['650 ml mikroovnsegnede PP-bakker, 250 pr. pakke', '50 ml dressingbægre med låg, 100 pr. pakke', PACK_NOTE.da],
      },
    },
  },

  'kraft-paper': {
    name: { en: 'Kraft Paper', sv: 'Kraftpapper', no: 'Kraftpapir', da: 'Kraftpapir' },
    copy: {
      en: {
        intro: 'Brown kraft paper carrier bags wholesale: 11 litre bags with flat handles, 250 per pack.',
        body: [
          'Brown kraft paper bags are a sturdy, plastic-free option for takeaway, bakeries and shops. The 11 litre size fits several food containers or a box of sweets, and the flat paper handles make bags easy to carry and stack.',
          'Many customers prefer paper over plastic, and the plain brown finish works with stickers or stamps if you want to add your logo.',
        ],
        points: ['11 L brown paper carrier bags', '250 bags per pack', PACK_NOTE.en],
      },
      sv: {
        intro: 'Bruna papperskassar av kraftpapper i grossist: 11-liters kassar med platta handtag, 250 per förpackning.',
        body: [
          'Bruna kraftpapperskassar är ett stadigt, plastfritt alternativ för takeaway, bagerier och butiker. 11-litersstorleken rymmer flera matlådor eller en ask sötsaker, och de platta pappershandtagen gör kassarna lätta att bära och stapla.',
          'Många kunder föredrar papper framför plast, och den enkla bruna ytan fungerar bra med etiketter eller stämplar om du vill lägga till din logga.',
        ],
        points: ['11 L bruna papperskassar', '250 kassar per förpackning', PACK_NOTE.sv],
      },
      no: {
        intro: 'Brune papirposer av kraftpapir engros: 11-liters poser med flate hanker, 250 per pakke.',
        body: [
          'Brune kraftpapirposer er et solid, plastfritt alternativ for takeaway, bakerier og butikker. 11-litersstørrelsen rommer flere matbokser eller en eske søtsaker, og de flate papirhankene gjør posene enkle å bære og stable.',
          'Mange kunder foretrekker papir fremfor plast, og den enkle brune overflaten fungerer godt med klistremerker eller stempler hvis du vil legge til logoen din.',
        ],
        points: ['11 L brune papirposer', '250 poser per pakke', PACK_NOTE.no],
      },
      da: {
        intro: 'Brune papirposer af kraftpapir engros: 11-liters poser med flade hanke, 250 pr. pakke.',
        body: [
          'Brune kraftpapirposer er et solidt, plastfrit alternativ til takeaway, bagerier og butikker. 11-litersstørrelsen rummer flere madbakker eller en æske søde sager, og de flade papirhanke gør poserne nemme at bære og stable.',
          'Mange kunder foretrækker papir frem for plast, og den enkle brune overflade fungerer godt med klistermærker eller stempler, hvis du vil tilføje dit logo.',
        ],
        points: ['11 L brune papirposer', '250 poser pr. pakke', PACK_NOTE.da],
      },
    },
  },

  'shopping-bags': {
    name: { en: 'Shopping Bags', sv: 'Bärkassar', no: 'Bæreposer', da: 'Bæreposer' },
    copy: {
      en: {
        intro: 'Clear plastic carrier bags wholesale: heavy-duty 45 x 55 cm bags, 800 per pack, for shops and takeaways.',
        body: [
          'These clear 45 x 55 cm carrier bags are strong enough for heavy grocery and takeaway orders, and the transparent material lets staff and customers check the contents at a glance. They suit grocery stores, market stalls, butchers and restaurants with busy takeaway counters.',
          'At 800 bags per pack, one order covers weeks of trade at a low cost per bag.',
        ],
        points: ['Clear plastic bags, 45 x 55 cm', '800 bags per pack', PACK_NOTE.en],
      },
      sv: {
        intro: 'Genomskinliga plastkassar i grossist: kraftiga kassar 45 x 55 cm, 800 per förpackning, för butiker och takeaway.',
        body: [
          'De genomskinliga kassarna i 45 x 55 cm är starka nog för tunga livsmedels- och takeawaybeställningar, och det klara materialet gör att personal och kunder ser innehållet direkt. De passar livsmedelsbutiker, marknadsstånd, slakterier och restauranger med livlig takeaway.',
          'Med 800 kassar per förpackning räcker en beställning i flera veckor till lågt pris per kasse.',
        ],
        points: ['Genomskinliga plastkassar, 45 x 55 cm', '800 kassar per förpackning', PACK_NOTE.sv],
      },
      no: {
        intro: 'Gjennomsiktige plastposer engros: kraftige poser 45 x 55 cm, 800 per pakke, for butikker og takeaway.',
        body: [
          'De gjennomsiktige posene i 45 x 55 cm er sterke nok for tunge dagligvare- og takeawaybestillinger, og det klare materialet gjør at ansatte og kunder ser innholdet med en gang. De passer dagligvarebutikker, markedsboder, slaktere og restauranter med travel takeaway.',
          'Med 800 poser per pakke dekker én bestilling flere uker med lav pris per pose.',
        ],
        points: ['Gjennomsiktige plastposer, 45 x 55 cm', '800 poser per pakke', PACK_NOTE.no],
      },
      da: {
        intro: 'Klare plastposer engros: kraftige poser 45 x 55 cm, 800 pr. pakke, til butikker og takeaway.',
        body: [
          'De klare poser i 45 x 55 cm er stærke nok til tunge dagligvare- og takeawayordrer, og det gennemsigtige materiale gør, at personale og kunder kan se indholdet med det samme. De passer til dagligvarebutikker, markedsboder, slagtere og restauranter med travl takeaway.',
          'Med 800 poser pr. pakke dækker én bestilling flere uger til en lav pris pr. pose.',
        ],
        points: ['Klare plastposer, 45 x 55 cm', '800 poser pr. pakke', PACK_NOTE.da],
      },
    },
  },

  'sweet-boxes': {
    name: { en: 'Sweet Boxes', sv: 'Godisaskar', no: 'Søtsakesker', da: 'Slikæsker' },
    copy: {
      en: {
        intro: "Mithai and sweet boxes wholesale: 'Celebration' gold-foil boxes with a window in 500 g and 1 kg sizes, 50 per pack.",
        body: [
          "The 'Celebration' sweet box is made from food-grade paperboard with an elegant gold-foil design and a clear window that shows off barfi, ladoo, jalebi and other mithai.",
          'Boxes are delivered flat to save storage space and fold up in seconds. Choose 500 g or 1 kg capacity — both are especially popular for Eid, Diwali, weddings and corporate gifts.',
        ],
        points: ['500 g and 1 kg sizes', '50 boxes per pack, delivered flat', PACK_NOTE.en],
      },
      sv: {
        intro: "Askar för mithai och sötsaker i grossist: 'Celebration' med guldfolie och fönster i 500 g och 1 kg, 50 per förpackning.",
        body: [
          "'Celebration'-asken är gjord av livsmedelsgodkänd kartong med elegant guldfoliedesign och ett genomskinligt fönster som visar upp barfi, ladoo, jalebi och annan mithai.",
          'Askarna levereras platta för att spara lagerutrymme och viks ihop på några sekunder. Välj 500 g eller 1 kg — båda är särskilt populära till eid, diwali, bröllop och företagsgåvor.',
        ],
        points: ['500 g och 1 kg', '50 askar per förpackning, levereras platta', PACK_NOTE.sv],
      },
      no: {
        intro: "Esker for mithai og søtsaker engros: 'Celebration' med gullfolie og vindu i 500 g og 1 kg, 50 per pakke.",
        body: [
          "'Celebration'-esken er laget av mattrygg kartong med elegant gullfoliedesign og et gjennomsiktig vindu som viser frem barfi, ladoo, jalebi og annen mithai.",
          'Eskene leveres flate for å spare lagerplass og brettes sammen på sekunder. Velg 500 g eller 1 kg — begge er særlig populære til eid, diwali, bryllup og firmagaver.',
        ],
        points: ['500 g og 1 kg', '50 esker per pakke, leveres flate', PACK_NOTE.no],
      },
      da: {
        intro: "Æsker til mithai og søde sager engros: 'Celebration' med guldfolie og vindue i 500 g og 1 kg, 50 pr. pakke.",
        body: [
          "'Celebration'-æsken er lavet af fødevaregodkendt karton med elegant guldfoliedesign og et klart vindue, der viser barfi, ladoo, jalebi og anden mithai frem.",
          'Æskerne leveres flade for at spare lagerplads og foldes på få sekunder. Vælg 500 g eller 1 kg — begge er særligt populære til eid, diwali, bryllupper og firmagaver.',
        ],
        points: ['500 g og 1 kg', '50 æsker pr. pakke, leveres flade', PACK_NOTE.da],
      },
    },
  },
};

function asLocale(locale: string): ContentLocale {
  return (['en', 'sv', 'no', 'da'] as const).includes(locale as ContentLocale) ? (locale as ContentLocale) : 'en';
}

/** Localized category name, falling back to the WooCommerce name */
export function categoryName(slug: string, locale: string, fallback: string): string {
  return CATEGORY_CONTENT[slug]?.name[asLocale(locale)] ?? fallback;
}

/** Localized copy for a category, or null when none has been written */
export function categoryCopy(slug: string, locale: string): CategoryCopy | null {
  return CATEGORY_CONTENT[slug]?.copy[asLocale(locale)] ?? null;
}

export { asLocale as toContentLocale };
