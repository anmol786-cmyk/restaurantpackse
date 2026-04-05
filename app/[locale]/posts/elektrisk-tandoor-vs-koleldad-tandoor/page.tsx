import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Section, Container, Article, Prose } from '@/components/craft';
import { SchemaScript } from '@/lib/schema/schema-script';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, XCircle, ShoppingCart, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

const POST_URL    = 'https://restaurantpack.se/posts/elektrisk-tandoor-vs-koleldad-tandoor';
const PRODUCT_URL = 'https://restaurantpack.se/product/mini-electric-tandoor-oven';
const IMAGE_URL   = 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/front-graphics.png';

export const metadata: Metadata = {
  title: 'Elektrisk Tandoor vs. Koleldad Tandoor – Vilket passar din restaurang?',
  description:
    'Funderar du på att köpa en tandoor till din restaurang? Vi jämför elektrisk och koleldad tandoor – brandkrav, driftkostnad, underhåll och smak. Se vilket alternativ som passar bäst för svenska restauranger.',
  alternates: {
    canonical: POST_URL,
    languages: {
      en:          'https://restaurantpack.se/posts/elektrisk-tandoor-vs-koleldad-tandoor',
      sv:          'https://restaurantpack.se/sv/posts/elektrisk-tandoor-vs-koleldad-tandoor',
      no:          'https://restaurantpack.se/no/posts/elektrisk-tandoor-vs-koleldad-tandoor',
      da:          'https://restaurantpack.se/da/posts/elektrisk-tandoor-vs-koleldad-tandoor',
      'x-default': 'https://restaurantpack.se/posts/elektrisk-tandoor-vs-koleldad-tandoor',
    },
  },
  openGraph: {
    title: 'Elektrisk Tandoor vs. Koleldad Tandoor – Vilket passar din restaurang?',
    description:
      'Komplett jämförelse av elektrisk och koleldad tandoor för restauranger i Sverige. Brandkrav, kostnader, underhåll och produktrekommendation.',
    type: 'article',
    url: POST_URL,
    images: [{ url: IMAGE_URL, width: 1200, height: 630, alt: 'Anmol Electric Tandoor Oven' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elektrisk Tandoor vs. Koleldad Tandoor',
    description: 'Komplett jämförelse för svenska restauranger.',
    images: [IMAGE_URL],
  },
};

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': POST_URL,
  headline: 'Elektrisk Tandoor vs. Koleldad Tandoor – Vilket passar din restaurang?',
  description:
    'Komplett jämförelse av elektrisk och koleldad tandoor för restauranger i Sverige. Brandkrav, driftkostnad, underhåll och smak.',
  url: POST_URL,
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
  inLanguage: 'sv',
  image: { '@type': 'ImageObject', url: IMAGE_URL, width: 1200, height: 630 },
  author: {
    '@type': 'Organization',
    name: 'Anmol Wholesale',
    url: 'https://restaurantpack.se',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Anmol Wholesale',
    url: 'https://restaurantpack.se',
    logo: {
      '@type': 'ImageObject',
      url: 'https://crm.restaurantpack.se/wp-content/uploads/2025/03/ANMOL-WHOLESALE-1.png',
    },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': POST_URL },
  keywords: 'elektrisk tandoor, tandoor ugn restaurang, koleldad tandoor, anmol tandoor, köksutrustning restaurang',
  articleSection: 'Köksutrustning',
  about: { '@type': 'Product', name: 'Anmol Electric Tandoor Oven', url: PRODUCT_URL },
};

const comparisonRows = [
  ['Brandtillstånd',       '✅ Krävs ej',            '❌ Obligatoriskt i Sverige'],
  ['Ventilationskrav',     '✅ Standard köksventilation', '❌ Specialinstallation krävs'],
  ['Uppvärmningstid',      '✅ 10–15 min',            '❌ 45–90 min'],
  ['Driftkostnad/mån',     '✅ 300–800 kr (el)',       '❌ 3 000–8 000 kr (kol)'],
  ['Temperaturkontroll',   '✅ Precis termostat',      '⚠️ Kräver erfarenhet'],
  ['Rengöring',            '✅ Enkel',                 '❌ Daglig askrensning'],
  ['Passar stadslokaler',  '✅ Ja',                    '❌ Ofta ej tillåtet'],
  ['Smak',                 '⚠️ Mycket bra',            '✅ Traditionell röksmak'],
  ['Mångsidighet',         '✅ Naan, pizza, roti…',   '⚠️ Primärt tandoorigrillt'],
];

const specs = [
  ['Modell',         'S01001'],
  ['Effekt',         '2100W / 220–240V, 50–60Hz'],
  ['Yttre mått',     '40 × 35 × 22 cm'],
  ['Inre mått',      '30,5 × 28 × 17 cm'],
  ['Bakplåt',        '27,5 × 26 cm'],
  ['Uppvärmningstid','10–15 min'],
  ['Lucka',          '90° med värmetåligt glas'],
  ['Tillverkare',    'Anmol AB, Sverige'],
];

export default function ElektriskTandoorPage() {
  return (
    <Section>
      <SchemaScript id="blog-post-schema" schema={blogSchema} />

      <Container>

        {/* ── Post header ── */}
        <Prose className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="text-xs uppercase tracking-widest">
              <Tag className="h-3 w-3 mr-1" />Köksutrustning
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />6 april 2026
            </span>
            <span className="text-xs text-muted-foreground">· av Anmol Wholesale</span>
          </div>
          <h1 className="!mt-0">
            Elektrisk Tandoor vs. Koleldad Tandoor – Vilket passar din restaurang?
          </h1>
        </Prose>

        {/* ── Featured image ── */}
        <div className="relative h-64 md:h-[440px] w-full overflow-hidden rounded-2xl border bg-accent/10 mb-10">
          <Image
            src={IMAGE_URL}
            alt="Anmol Electric Tandoor Oven – Elektrisk tandoor för restaurang och storkök"
            fill
            className="object-contain p-6 md:p-12"
            priority
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>

        {/* ── Article: intro + koleldad + elektrisk ── */}
        <Article className="max-w-3xl mb-0">

          <p className="text-lg leading-relaxed text-muted-foreground">
            En tandoor är hjärtat i varje indiskt, pakistanskt eller mellanösternkök. Den
            karakteristiska rökiga smaken av nanbröd, tikka och kebab är svår att
            efterlikna med vanliga ugnar. Men när du ska välja tandoor till din restaurang
            ställs du inför ett viktigt val:{' '}
            <strong>elektrisk eller koleldad?</strong>
          </p>
          <p>
            I den här guiden går vi igenom allt du behöver veta – från brandkrav och
            ventilationskrav i Sverige till driftkostnad och smak – så att du kan fatta
            rätt beslut för din verksamhet.
          </p>

          <h2>Vad är en tandoor?</h2>
          <p>
            En tandoor är en cylindrisk ugn, traditionellt tillverkad av lera, som når
            temperaturer på 300–480 °C. Den extrema hettan skapar den distinkta ytan och
            smaken som gör nanbröd, rotis och tandoorigrillade rätter unika. Tandooren
            används inom indiskt, pakistanskt, afghanskt, persiskt och idag även i
            moderna fusionrestauranger.
          </p>

          <h2>Koleldad Tandoor – Det traditionella valet</h2>
          <p>
            Den koleldade tandooren är det ursprungliga alternativet och används fortfarande
            i många restauranger världen över. Det finns goda skäl till det – men också
            tydliga begränsningar, särskilt i en svensk stadsmiljö.
          </p>

          <h3>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              Fördelar med koleldad tandoor
            </span>
          </h3>
          <ul>
            <li><strong>Autentisk röksmak</strong> – Träkol ger en djupare, mer komplex rökig arom som är svår att fullt ut replikera</li>
            <li><strong>Extremt hög temperatur</strong> – Når upp till 480 °C med snabb tillagning och karaktäristisk koling</li>
            <li><strong>Låg inköpskostnad</strong> – Traditionella lermodeller är ofta billigare att köpa in</li>
            <li><strong>Kulturell autenticitet</strong> – Många gäster och kockar föredrar det traditionella hantverket</li>
          </ul>

          <h3>
            <span className="inline-flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              Nackdelar med koleldad tandoor
            </span>
          </h3>
          <ul>
            <li><strong>Brandtillstånd krävs</strong> – I Sverige kräver öppen eld i restaurangmiljö tillstånd från räddningstjänsten</li>
            <li><strong>Kraftig ventilation obligatorisk</strong> – Boverkets byggregler kräver professionell frånluftanläggning för rök och koldioxid</li>
            <li><strong>Uppvärmningstid 45–90 min</strong> – Kolet måste tändas och nå rätt temperatur innan servering kan börja</li>
            <li><strong>Hög driftkostnad</strong> – Träkol kostar 3 000–8 000 kr per månad för en aktiv restaurang</li>
            <li><strong>Svår att reglera</strong> – Temperaturen varierar och kräver erfaren personal</li>
            <li><strong>Daglig askrensning</strong> – Tidskrävande underhåll av aska och lera</li>
            <li><strong>Ej lämplig för stadslokaler</strong> – Många hyresvärdar tillåter inte öppen eld i köket</li>
          </ul>

          <h2>Elektrisk Tandoor – Det moderna alternativet</h2>
          <p>
            Den elektriska tandooren har blivit det självklara valet för restauranger i
            Europa. Tekniken har mognat enormt och moderna modeller levererar resultat som
            ligger mycket nära det traditionella, med en rad praktiska fördelar.
          </p>

          <h3>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              Fördelar med elektrisk tandoor
            </span>
          </h3>
          <ul>
            <li><strong>Inga brandtillstånd</strong> – Fungerar som vilken vanlig restaurangutrustning som helst</li>
            <li><strong>Minimal ventilation</strong> – Kräver ingen specialinstallation av frånluft för rök</li>
            <li><strong>Snabb uppvärmning</strong> – Redo att använda på 10–15 minuter</li>
            <li><strong>Precis temperaturkontroll</strong> – Termostat gör det enkelt för all kökspersonal</li>
            <li><strong>Lägre driftkostnad</strong> – El är billigare och mer förutsägbart än träkol</li>
            <li><strong>Enkel rengöring</strong> – Inget kol, ingen aska, ingen lerreparation</li>
            <li><strong>Fungerar i alla lokaler</strong> – Passar i stadskök, foodtrucks, cateringkök och butiker</li>
            <li><strong>Mångsidig</strong> – Baka naan, pizza, lahmacun, manakish, roti och chapati i samma ugn</li>
          </ul>

          <h3>
            <span className="inline-flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              Nackdelar med elektrisk tandoor
            </span>
          </h3>
          <ul>
            <li><strong>Saknar kolrök</strong> – Den traditionella träkolsaromen kan inte fullt replikeras</li>
            <li><strong>Lägre maxtemperatur</strong> – De flesta modeller når 300–400 °C, något under koleldad</li>
            <li><strong>Kräver eluttag</strong> – 2100W (standard 230 V räcker)</li>
          </ul>

          <h2>Jämförelsetabell – Elektrisk vs. Koleldad</h2>
        </Article>

        {/* ── Comparison table — outside Article to avoid prose link styles ── */}
        <div className="max-w-3xl overflow-x-auto rounded-xl border my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold border-b border-r">Faktor</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-r">⚡ Elektrisk</th>
                <th className="text-left px-4 py-3 font-semibold border-b">🔥 Koleldad</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([factor, electric, coal], i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium border-r">{factor}</td>
                  <td className="px-4 py-3 border-r">{electric}</td>
                  <td className="px-4 py-3">{coal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Article: Swedish fire rules ── */}
        <Article className="max-w-3xl mt-0 mb-0">
          <h2>Svenska brandkrav – Varför elektrisk är det praktiska valet</h2>
          <p>
            För restauranger i Sverige, särskilt i städer som Stockholm, Göteborg och
            Malmö, ställer räddningstjänsten och Boverkets byggregler hårda krav på
            öppen eld i kommersiella kök:
          </p>
          <ul>
            <li>Tillstånd krävs enligt <strong>Lag (2010:1011) om brandfarliga och explosiva varor</strong></li>
            <li>Automatiskt brandlarm och sprinklersystem kan bli obligatoriska</li>
            <li>Köksfläkt med fettfilter och brandsläckningssystem ovanför öppen eld</li>
            <li>Många hyresvärdar förbjuder helt öppen eld i lokalen</li>
          </ul>
          <p>
            En elektrisk tandoor kräver <strong>ingen av dessa tillstånd eller
            installationer</strong>. Du pluggar in, värmer upp och börjar baka.
          </p>

          <h2>Produktspotlight: Anmol Electric Tandoor Oven</h2>
        </Article>

        {/* ── Product card — outside Article ── */}
        <div className="max-w-3xl rounded-2xl border bg-card overflow-hidden my-6">
          <div className="grid md:grid-cols-2">
            <div className="relative h-56 md:h-full min-h-[220px] bg-accent/10 flex items-center justify-center p-6">
              <Image
                src={IMAGE_URL}
                alt="Anmol Electric Tandoor Oven S01001"
                width={340}
                height={280}
                className="object-contain max-h-48"
              />
            </div>
            <div className="p-6 md:p-8 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Tillverkad av Anmol AB, Sverige
                </span>
                <h3 className="text-xl font-bold mt-1">Anmol Electric Tandoor Oven</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Konstruerad efter tysk standard, anpassad för europeiska kök och
                  godkänd för daglig kommersiell användning.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {specs.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {[
                  'Non-stick toppvärmare – perfekt för roti & chapati',
                  '90° lucka med värmetåligt glas',
                  'Stålkropp – robust och lätt att rengöra',
                  'Inga brandtillstånd krävs',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={PRODUCT_URL}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-5 py-2.5 rounded-lg font-semibold text-sm w-full"
              >
                <ShoppingCart className="h-4 w-4" />
                Se pris &amp; köp Anmol Electric Tandoor
              </a>
            </div>
          </div>
        </div>

        {/* ── Article: what you can cook ── */}
        <Article className="max-w-3xl mt-0 mb-0">
          <h3>Vad du kan laga</h3>
          <ul>
            <li>🫓 <strong>Naan &amp; Kulcha</strong> – fluffiga med perfekt koling</li>
            <li>🫓 <strong>Roti &amp; Chapati</strong> – direkt på det inbyggda non-stick värmedelementet på toppen</li>
            <li>🍕 <strong>Pizza &amp; Lahmacun</strong> – krispig botten på under 5 minuter</li>
            <li>🫓 <strong>Manakish &amp; Pide</strong> – perfekt för mellanösternkök</li>
          </ul>

          <h2>Vår rekommendation</h2>
          <p>
            För <strong>de allra flesta restauranger i Sverige</strong> är den elektriska
            tandooren det smartare valet – inte på grund av kompromiss, utan på grund av
            praktikalitet. Du slipper brandtillstånd, tunga ventilationsinstallationer
            och höga kolkostnader. Du får en ugn som är redo på 15 minuter, kostar en
            bråkdel att driva och fungerar i alla typer av lokaler.
          </p>
          <p>
            Den koleldade tandooren har sin plats i stora restauranger med dedikerade kök
            och befintliga ventilationssystem. Men för nya restauranger, cateringkök,
            foodtrucks eller restauranger i stadslägenheter är elektrisk det självklara
            valet.
          </p>
        </Article>

        {/* ── CTA banner — outside Article ── */}
        <div className="max-w-3xl rounded-2xl bg-primary/5 border border-primary/20 p-6 md:p-8 my-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-bold text-lg">Redo att beställa?</p>
            <p className="text-sm text-muted-foreground mt-1">
              B2B-pris tillgängligt för restauranger, cateringföretag och återförsäljare.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={PRODUCT_URL}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-5 py-2.5 rounded-lg font-semibold text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Köp nu
            </a>
            <Link
              href="/wholesale/register"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 transition-colors px-5 py-2.5 rounded-lg font-semibold text-sm"
            >
              Grossistkonto
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Article: FAQ + footer note ── */}
        <Article className="max-w-3xl mt-0">

          <h2>Vanliga frågor om elektrisk tandoor</h2>

          <h3>Kan man baka autentiskt naan i en elektrisk tandoor?</h3>
          <p>
            Ja. Moderna elektriska tandoorer når 300–400 °C, vilket räcker för att skapa
            de karakteristiska bubblorna och den lätta kolingen som naan är känt för.
            Smaken är 90–95% av en koleldad – tillräckligt bra för att tillfredsställa
            även kräsna gäster.
          </p>

          <h3>Behöver man tillstånd för en elektrisk tandoor i Sverige?</h3>
          <p>
            Nej. En elektrisk tandoor behandlas som vanlig köksutrustning och kräver inga
            särskilda tillstånd. Kontrollera alltid med din hyresvärd och lokala
            räddningstjänst för specifika lokalkrav.
          </p>

          <h3>Hur länge håller en elektrisk tandoor?</h3>
          <p>
            Med normalt underhåll håller en välbyggd elektrisk tandoor 5–10 år i
            kommersiellt bruk. Anmol Electric Tandoor är tillverkad av stål och konstruerad
            för daglig användning.
          </p>

          <h3>Kan jag köpa elektrisk tandoor som grossist?</h3>
          <p>
            Ja. Anmol Wholesale erbjuder B2B-priser för restauranger, cateringföretag och
            återförsäljare. <Link href="/wholesale/register">Ansök om grossistkonto</Link>{' '}
            eller <Link href="/contact">kontakta oss för offert</Link>.
          </p>

          <hr />

          <p className="text-sm text-muted-foreground">
            <em>
              Anmol Wholesale är Sveriges ledande B2B-grossist för restaurangprodukter
              med indisk och pakistansk inriktning. Vi är tillverkare av Anmol Electric
              Tandoor och levererar till restauranger, cateringföretag och
              livsmedelsbutiker i hela Sverige och Skandinavien.{' '}
              <Link href="/wholesale">Läs mer om vårt grossisterbjudande →</Link>
            </em>
          </p>

        </Article>

      </Container>
    </Section>
  );
}
