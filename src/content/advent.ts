import type { AnimalId } from "./types";

export type AdventKind = "yoga" | "atmen" | "affirmation" | "dankbarkeit" | "kreativ" | "reise" | "spiel" | "fest";

export type AdventDoor = {
  day: number;
  kind: AdventKind;
  title: string;
  text: string;
  animal?: AnimalId;
  link?: { label: string; href: string };
  /** externer Link (z. B. Bastelvorlage) – nur über das Eltern-Gate */
  external?: { label: string; href: string };
};

export const adventKindLabel: Record<AdventKind, string> = {
  yoga: "Yoga-Übung",
  atmen: "Atemübung",
  affirmation: "Mutmacher-Satz",
  dankbarkeit: "Dankbarkeit",
  kreativ: "Kreativ-Idee",
  reise: "Fantasiereise",
  spiel: "Spiel",
  fest: "Weihnachten",
};

export const adventDoors: AdventDoor[] = [
  { day: 1, kind: "affirmation", animal: "leo", title: "Ich bin mutig.", text: "Sag den Satz dreimal laut – jedes Mal ein bisschen lauter. Und dann brüll wie Leo!" },
  { day: 2, kind: "yoga", title: "Der Tannenbaum", text: "Steh heute wie ein Tannenbaum: Wie lange schaffst du es, ganz still zu stehen?", link: { label: "Zur Übung", href: "/yoga/uebungen/tannenbaum" } },
  { day: 3, kind: "dankbarkeit", title: "Danke sagen", text: "Wofür bist du heute dankbar? Erzähl es deiner Familie beim Abendessen." },
  { day: 4, kind: "atmen", animal: "kimi", title: "Blume & Kerze", text: "Riech an einer Blume und puste ganz langsam eine Kerze aus – erst in Gedanken, dann gemeinsam mit einem Erwachsenen an einer echten Kerze.", link: { label: "Atemübung starten", href: "/meditation/atmen/blume-kerze" } },
  { day: 5, kind: "kreativ", title: "Lieblingsmoment", text: "Mal deinen schönsten Moment aus diesem Jahr und schenk das Bild einem lieben Menschen." },
  { day: 6, kind: "yoga", title: "Nikolaus-Rentier", text: "Heute ist Nikolaus! Galoppier wie ein Rentier durchs Zimmer – und bei „Stopp“ frierst du ein.", link: { label: "Zur Übung", href: "/yoga/uebungen/rentier" } },
  { day: 7, kind: "reise", animal: "kimi", title: "Die kleine Schneeflocke", text: "Kuschel dich heute Abend ein und hör die Reise der kleinen Schneeflocke.", link: { label: "Reise starten", href: "/meditation/reise/schneeflocke" } },
  { day: 8, kind: "spiel", title: "Affirmation-Memo", text: "Spiel eine Runde Memo. Welches Tier findest du zuerst?", link: { label: "Zum Memo", href: "/memo" } },
  { day: 9, kind: "affirmation", animal: "kimi", title: "Ich bin geliebt.", text: "Schenk heute jemandem eine dicke Umarmung – einfach so." },
  { day: 10, kind: "yoga", title: "Der Schneemann", text: "Bau einen dicken Schneemann – und lass ihn langsam in der Sonne schmelzen.", link: { label: "Zur Übung", href: "/yoga/uebungen/schneemann" } },
  { day: 11, kind: "dankbarkeit", title: "Ein Danke verschenken", text: "Denk an einen Menschen, der dir hilft. Wie kannst du heute Danke sagen?" },
  { day: 12, kind: "atmen", animal: "luka", title: "Bienen-Summen", text: "Summ ein Weihnachtslied wie eine kleine Biene – ganz ohne Worte. Erkennt jemand das Lied?", link: { label: "Atemübung starten", href: "/meditation/atmen/bienen-summen" } },
  {
    day: 13,
    kind: "kreativ",
    title: "Masken basteln",
    text: "Bastel dir eine Maske der YOGITIER-Bande und spiel dein Lieblingstier.",
    external: { label: "Bastelvorlage (PDF)", href: "https://cdn.shopify.com/s/files/1/0758/1106/2089/files/yogitier_Masken_sw.pdf?v=1750242917" },
  },
  { day: 14, kind: "yoga", title: "Der Weihnachtsstern", text: "Mach dich ganz groß und leuchte wie der Stern auf der Spitze des Baumes!", link: { label: "Zur Übung", href: "/yoga/uebungen/stern" } },
  { day: 15, kind: "affirmation", animal: "diego", title: "Ich bin stark.", text: "Was hast du schon ganz alleine geschafft? Erzähl es Diego!" },
  { day: 16, kind: "spiel", title: "Yoga-Würfel", text: "Würfle dir drei Yoga-Übungen und mach sie nacheinander.", link: { label: "Zum Würfel", href: "/yoga/wuerfel" } },
  { day: 17, kind: "dankbarkeit", title: "Drei schöne Dinge", text: "Mal oder schreib drei Dinge in dein Tagebuch, die dich heute froh gemacht haben.", link: { label: "Zum Tagebuch", href: "/tagebuch" } },
  { day: 18, kind: "atmen", animal: "benno", title: "Kuscheltier-Fahrstuhl", text: "Nimm dein Kuscheltier mit ins Bett und lass es auf deinem Bauch Fahrstuhl fahren.", link: { label: "Atemübung starten", href: "/meditation/atmen/kuscheltier-atmung" } },
  { day: 19, kind: "yoga", title: "Das Geschenk", text: "Mach dich klein wie ein Geschenk – und pack dich ganz langsam wieder aus.", link: { label: "Zur Übung", href: "/yoga/uebungen/paeckchen" } },
  { day: 20, kind: "affirmation", animal: "emmi", title: "Ich bin kreativ.", text: "Erfinde mit Emmi eine eigene Weihnachtsgeschichte und erzähl sie heute Abend." },
  { day: 21, kind: "kreativ", title: "Winter-Spaziergang", text: "Geh achtsam spazieren: Was hörst, siehst und riechst du draußen im Winter?" },
  { day: 22, kind: "yoga", title: "Der Schneeengel", text: "Leg dich hin und mach einen Schneeengel – ganz langsam, im Takt deines Atems.", link: { label: "Zur Übung", href: "/yoga/uebungen/schneeengel" } },
  { day: 23, kind: "atmen", animal: "diego", title: "Weihnachts-Ballon", text: "Blas in deinem Bauch einen großen Weihnachtsballon auf – und lass die Luft ganz langsam raus.", link: { label: "Atemübung starten", href: "/meditation/atmen/ballon-atmung" } },
  { day: 24, kind: "fest", animal: "kimi", title: "Frohe Weihnachten!", text: "Heute macht ihr das Weihnachts-Yoga mit der ganzen Familie. Ich bin froh, dass wir uns haben.", link: { label: "Weihnachts-Yoga starten", href: "/yoga/stunde/weihnachts-yoga" } },
];

/** feste, „zufällig“ wirkende Anordnung der Türchen */
export const adventOrder = [7, 18, 3, 12, 22, 1, 15, 9, 24, 5, 20, 11, 2, 14, 19, 6, 23, 10, 16, 4, 13, 21, 8, 17];

export const adventColors = ["#FBE3E6", "#E7E2F8", "#FBEBC4", "#DCEBD0", "#E3EEF7", "#FBF1BE", "#EFE2D4", "#FDE3D3"];
