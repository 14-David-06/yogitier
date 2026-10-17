import benno from "@/assets/animals/benno.png";
import diego from "@/assets/animals/diego.png";
import eddy from "@/assets/animals/eddy.png";
import emmi from "@/assets/animals/emmi.png";
import freddi from "@/assets/animals/freddi.png";
import kimi from "@/assets/animals/kimi.png";
import leo from "@/assets/animals/leo.png";
import luka from "@/assets/animals/luka.png";

import type { Animal, AnimalId } from "./types";

const MAT_PRICE = "69,95 €";

/**
 * Die YOGITIER®-Bande. Namen, Affirmationen und Farben stammen aus den
 * offiziellen YOGITIER® Gratis-Downloads (Affirmation-Memory, Bastelvorlagen)
 * und dem Shop (Kinder-Yogamatten).
 */
export const animals: Animal[] = [
  {
    id: "leo",
    name: "Leo",
    fullName: "Leo der Löwe",
    species: "Löwe",
    image: leo,
    color: "#AAE1E6",
    soft: "#E4F5F7",
    ink: "#5A3218",
    affirmation: "Ich bin mutig.",
    trait: "mutig",
    intro:
      "Leo ist der Mutigste der YOGITIER-Bande. Wenn er laut brüllt, spürt er, wie viel Kraft in ihm steckt. Und Leo weiß: Mutig sein heißt nicht, keine Angst zu haben – sondern es trotzdem zu versuchen.",
    superpower: "Mut-Brüllen: Mit dem Löwenatem pustet Leo Wut und Angst einfach weg.",
    funFact: "Das Brüllen eines Löwen kann man bis zu acht Kilometer weit hören.",
    favoritePose: "loewe",
    favoriteBreath: "loewenatem",
    mat: { title: "KINDER Yogamatte – Leo der Löwe", url: "https://yogitier.de/products/kinderyogamatte-leo-der-lowe", price: MAT_PRICE },
  },
  {
    id: "benno",
    name: "Benno",
    fullName: "Benno der Bär",
    species: "Bär",
    image: benno,
    color: "#7B9BBB",
    soft: "#E3EAF2",
    ink: "#FFFFFF",
    affirmation: "Ich bin einzigartig.",
    trait: "einzigartig",
    intro:
      "Benno ist gemütlich, warmherzig und verschenkt die besten Bärenumarmungen. Er liebt lange Spaziergänge im Wald und ruhige Abende. Benno weiß: Jeder ist anders – und das ist gut so.",
    superpower: "Kuschelkraft: Mit einer Bärenumarmung macht Benno jeden ganz ruhig.",
    funFact: "Viele Bären halten im Winter eine lange Winterruhe und leben dann von ihren Fettreserven.",
    favoritePose: "baer",
    favoriteBreath: "kuscheltier-atmung",
    mat: { title: "KINDER Yogamatte – Benno der Bär", url: "https://yogitier.de/products/kinderyogamatte-benno-das-bar", price: MAT_PRICE },
  },
  {
    id: "emmi",
    name: "Emmi",
    fullName: "Emmi das Einhorn",
    species: "Einhorn",
    image: emmi,
    color: "#BDCAE7",
    soft: "#ECEFF8",
    ink: "#5A3218",
    affirmation: "Ich bin kreativ.",
    trait: "kreativ",
    intro:
      "Emmi ist eine kleine Träumerin mit ganz viel Fantasie. Mit ihrem Regenbogen-Schweif malt sie bunte Bilder in den Himmel und erfindet die schönsten Geschichten.",
    superpower: "Fantasie-Zauber: Emmi kann sich an jeden Ort der Welt träumen.",
    funFact: "Einhörner gibt es nur in unserer Fantasie – deshalb dürfen sie so bunt sein, wie du sie dir vorstellst.",
    favoritePose: "einhorn",
    favoriteBreath: "regenbogen-atmung",
    mat: { title: "KINDER Yogamatte – Emmi das Einhorn", url: "https://yogitier.de/products/kinderyogamatte-emmi-das-einhorn", price: MAT_PRICE },
  },
  {
    id: "kimi",
    name: "Kimi",
    fullName: "Kimi die Katze",
    species: "Katze",
    image: kimi,
    color: "#FCB5B6",
    soft: "#FDE9E9",
    ink: "#5A3218",
    affirmation: "Ich bin geliebt.",
    trait: "geliebt",
    intro:
      "Kimi ist sanft, verschmust und räkelt sich gern in der Sonne. Nach dem Aufwachen macht sie immer zuerst einen großen Katzenbuckel. Kimi weiß: Sie wird geliebt – genau so, wie sie ist.",
    superpower: "Streck-Zauber: Kimi streckt sich so lang, bis alle Müdigkeit verschwindet.",
    funFact: "Katzen schlafen bis zu 16 Stunden am Tag – und strecken sich danach ausgiebig.",
    favoritePose: "katze",
    favoriteBreath: "blume-kerze",
    mat: { title: "KINDER Yogamatte – Kimi die Katze", url: "https://yogitier.de/products/kinderyogamatte-kimi-die-katze", price: MAT_PRICE },
  },
  {
    id: "luka",
    name: "Luka",
    fullName: "Luka der Leopard",
    species: "Leopard",
    image: luka,
    color: "#3B7073",
    soft: "#DDEAEA",
    ink: "#FFFFFF",
    affirmation: "Meine Gefühle sind wichtig.",
    trait: "gefühlvoll",
    intro:
      "Luka ist flink, neugierig und spürt ganz genau, wie es ihm geht. Manchmal ist er fröhlich, manchmal traurig oder wütend – und alle Gefühle dürfen da sein.",
    superpower: "Gefühls-Radar: Luka merkt sofort, wie es seinen Freunden geht.",
    funFact: "Jeder Leopard hat ein ganz eigenes Fleckenmuster – keins gleicht dem anderen.",
    favoritePose: "leopard",
    favoriteBreath: "bienen-summen",
    mat: { title: "KINDER Yogamatte – Luka der Leopard", url: "https://yogitier.de/products/kinderyogamatte-luka-der-leopard", price: MAT_PRICE },
  },
  {
    id: "diego",
    name: "Diego",
    fullName: "Diego der Dino",
    species: "Dino",
    image: diego,
    color: "#DECE74",
    soft: "#F6F0D2",
    ink: "#5A3218",
    affirmation: "Ich bin stark.",
    trait: "stark",
    intro:
      "Diego ist ein Triceratops mit drei Hörnern und einem großen Nackenschild. Er stampft gern fest auf und spürt dann, wie stark und sicher er auf seinen Beinen steht.",
    superpower: "Stampf-Stärke: Wenn Diego aufstampft, fühlt er sich groß und stark.",
    funFact: "Triceratops bedeutet „Dreihorngesicht“. Diese Dinos lebten vor rund 66 Millionen Jahren.",
    favoritePose: "dino",
    favoriteBreath: "ballon-atmung",
    mat: { title: "KINDER Yogamatte – Diego der Dino", url: "https://yogitier.de/products/kinder-yogamatte-diego-der-dino", price: MAT_PRICE },
  },
  {
    id: "eddy",
    name: "Eddy",
    fullName: "Eddy der Elefant",
    species: "Elefant",
    image: eddy,
    color: "#E3EEEE",
    soft: "#F0F6F6",
    ink: "#5A3218",
    affirmation: "Ich bin genau so, wie ich bin.",
    trait: "genau richtig",
    intro:
      "Eddy ist groß, freundlich und hat ein riesiges Herz. Mit seinem Rüssel kann er schnuppern, trinken und sogar winken. Eddy mag sich genau so, wie er ist – mit großen Ohren und allem Drum und Dran.",
    superpower: "Gedächtnis-Kraft: Eddy vergisst nie, was ihn glücklich macht.",
    funFact: "Der Rüssel eines Elefanten besteht aus zehntausenden Muskeln – damit hebt er Schweres und greift ganz Kleines.",
    favoritePose: "elefant",
    favoriteBreath: "elefanten-atmung",
    mat: { title: "KINDER Yogamatte – Eddy der Elefant", url: "https://yogitier.de/products/kinderyogamatte-eddy-der-elefant", price: MAT_PRICE },
  },
  {
    id: "freddi",
    name: "Freddi",
    fullName: "Freddi der Fuchs",
    species: "Fuchs",
    image: freddi,
    color: "#F67528",
    soft: "#FDE3D3",
    ink: "#FFFFFF",
    affirmation: "Ich glaube an mich.",
    trait: "zuversichtlich",
    intro:
      "Freddi ist schlau, aufmerksam und hat die besten Ideen. Wenn etwas schwierig ist, sagt er sich: „Ich glaube an mich!“ – und probiert es einfach noch einmal.",
    superpower: "Super-Ohren: Freddi hört sogar, wie leise eine Schneeflocke landet.",
    funFact: "Füchse hören so gut, dass sie eine Maus sogar unter dem Schnee hören können.",
    favoritePose: "fuchs",
    favoriteBreath: "finger-atmung",
  },
];

export const animalsById = Object.fromEntries(animals.map((a) => [a.id, a])) as Record<AnimalId, Animal>;

export function getAnimal(id: string): Animal | undefined {
  return animals.find((a) => a.id === id);
}
