import { TRPCError } from "@trpc/server";

export interface StringProps {
  check: (string | undefined)[];
}

const bannedWords: string[] = [
  "arnaque",
  "scam",
  "frauduleux",
  "fraude",
  "faux",
  "pas fiable",
  "dépôt à l'avance",
  "dépôt de garantie",
  "caution",
  "location à court terme",
  "loyer bas",
  "loyer trop beau pour être vrai",
  "fausse annonce",
  "propriétaire fictif",
  "courtier fictif",
  "agent immobilier fictif",
  "pas de photos ou photos floues",
  "pas de visite",
  "pas de contrat de location",
  "demande de renseignements personnels ou financiers",
  "paiement en espèces uniquement",
  "mandat postal ou Western Union",
  "offre spéciale limitée dans le temps",
  "propriété non disponible pour la visite",
  "propriété en vente à un prix très bas",
  "propriété avec un titre de propriété douteux ou illégal",
  "demandes inhabituelles pour les frais de location ou de gestion",
  "demande de virement bancaire à un compte étranger",
  "garantie de crédit ou de prêt hypothécaire instantanée",
  "proposition d'investissement immobilier avec des rendements très élevés",
];

export const filterStrings = ({ check }: StringProps) => {
  for (const str of check) {
    if (!str) return;
    for (const expression of bannedWords) {
      if (str.toLowerCase().includes(expression.toLowerCase()))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot use banned pattern and words to avoid scam",
        });
    }
  }
  return;
};

const BannedMailExp: RegExp[] = [
  /(^|[\W\s])(?=.{0,20}(paypal|apple|google|yahoo|amazon|outlook))(?=.*?@)/gi,
  /(^|[\W\s])(?=.{0,20}(secure|confirm|verify|login|support|help))(?=.*?@)/gi,
  /(^|[\W\s])(?=.{0,20}(admin|service|billing|account|payment))(?=.*?@)/gi,
  /(^|[\W\s])(?=.{0,20}(scam|fraud|phishing))(?=.*?@)/gi,
  /(^|[\W\s])(?=.{0,20}(hack|attack|breach|compromise))(?=.*?@)/gi,
  /(^|[\W\s])(?=.{0,20}(urgent|important|notice|action))(?=.*?@)/gi,
];

export const filterMail = ({ check }: StringProps) => {
  for (const email of check) {
    if (!email) return;
    for (const pattern of BannedMailExp) {
      if (pattern.test(email.toLowerCase()))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot use banned pattern and words to avoid scam",
        });
    }
  }
  return;
};

const fraudulentCountries = [
  "Nigeria",
  "Ghana",
  "Côte d'Ivoire",
  "Cameroon",
  "Senegal",
  "Benin",
  "Togo",
  "Sierra Leone",
  "Liberia",
  "South Africa",
  "Kenya",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Zimbabwe",
  "Zambia",
  "Mauritius",
  "Morocco",
  "Egypt",
  "Philippines",
];

export const checkLocation = ({ check }: StringProps) => {
  for (const location of check) {
    if (!location) return;
    for (const country of fraudulentCountries) {
      if (location.toLowerCase().includes(country.toLowerCase())) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your from a banned timezone",
        });
      }
    }
  }

  return;
};
