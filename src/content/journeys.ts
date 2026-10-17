import type { Journey, JourneyTheme } from "./types";

export const journeyThemes: Record<JourneyTheme, { from: string; to: string; accent: string; card: string }> = {
  wolken: { from: "#E7E2F8", to: "#FBE3E6", accent: "#A99BF0", card: "#E7E2F8" },
  wald: { from: "#DCEBD0", to: "#F3F7E8", accent: "#6E9A63", card: "#DCEBD0" },
  meer: { from: "#D6E6F5", to: "#E9F6F7", accent: "#5F97C4", card: "#D6E6F5" },
  sonne: { from: "#FBEBC4", to: "#FDF6E3", accent: "#E8961E", card: "#FBEBC4" },
  schnee: { from: "#E3EEF7", to: "#F7F3FB", accent: "#8AA7C9", card: "#E3EEF7" },
};

/** Fantasiereisen – zum Vorlesen oder Anhören mit der Vorlesestimme. */
export const journeys: Journey[] = [
  {
    slug: "wolkenreise",
    title: "Die Wolkenreise",
    host: "emmi",
    theme: "wolken",
    purpose: "Zum Träumen",
    description: "Schweb mit Emmi auf einer weichen Wolke über Wiesen und Wälder.",
    paragraphs: [
      "Mach es dir ganz bequem. Leg dich hin oder setz dich gemütlich auf deine Matte.",
      "Schließ deine Augen, wenn du magst. Atme einmal tief ein … und langsam wieder aus.",
      "Stell dir vor, neben dir landet eine kleine, weiche Wolke. Sie ist weiß und flauschig wie Zuckerwatte.",
      "Vorsichtig kletterst du hinauf. Die Wolke ist warm und trägt dich ganz sicher.",
      "Langsam schwebt ihr nach oben. Unter dir werden die Häuser ganz klein, und die Bäume sehen aus wie grüne Tupfen.",
      "Neben dir fliegt Emmi das Einhorn. Ihr Regenbogen-Schweif glitzert in der Sonne.",
      "Ihr schwebt über eine Blumenwiese. Es duftet nach Sommer, und die Sonne wärmt dein Gesicht.",
      "Mit jedem Atemzug wird deine Wolke ein kleines bisschen weicher – und du wirst ganz ruhig.",
      "Emmi flüstert dir zu: Du darfst träumen. Du darfst groß sein.",
      "Jetzt sinkt deine Wolke langsam wieder nach unten … ganz sanft … bis sie dich zurück auf deine Matte bringt.",
      "Beweg langsam deine Finger und Zehen. Streck dich wie eine Katze.",
      "Und wenn du bereit bist, öffne langsam deine Augen. Willkommen zurück!",
    ],
  },
  {
    slug: "zauberwald",
    title: "Im Zauberwald",
    host: "benno",
    theme: "wald",
    purpose: "Wenn du traurig bist",
    description: "Ein ruhiger Spaziergang mit Benno durch den grünen Zauberwald.",
    paragraphs: [
      "Mach es dir gemütlich und schließ die Augen. Atme tief ein … und wieder aus.",
      "Stell dir vor, du stehst am Rand eines großen, grünen Waldes. Die Sonne blinzelt durch die Blätter.",
      "Unter deinen Füßen ist weiches Moos. Es fühlt sich an wie ein warmer Teppich.",
      "Da kommt Benno der Bär angetapst. Er lächelt dich an und nimmt dich mit auf einen Spaziergang.",
      "Ihr hört die Vögel singen. Ein kleiner Bach plätschert leise vor sich hin.",
      "Benno zeigt dir seinen Lieblingsbaum. Er ist riesig und uralt. Du legst deine Hände an die Rinde und spürst, wie stark er ist.",
      "Benno sagt: Jeder Baum ist anders – und jeder ist wunderschön. Genau wie du.",
      "Ihr setzt euch auf eine kleine Lichtung. Ein Schmetterling landet ganz sanft auf deiner Hand.",
      "Du atmest den frischen Duft des Waldes ein … und alles Schwere atmest du aus.",
      "Langsam geht ihr zurück zum Waldrand. Benno umarmt dich zum Abschied ganz fest.",
      "Spür wieder deine Matte unter dir. Beweg deine Hände und Füße.",
      "Öffne langsam die Augen. Du hast ein bisschen Waldruhe mitgebracht.",
    ],
  },
  {
    slug: "am-meer",
    title: "Am Meer mit Eddy",
    host: "eddy",
    theme: "meer",
    purpose: "Zum Durchatmen",
    description: "Atme mit den Wellen und sammle mit Eddy Muscheln am Strand.",
    paragraphs: [
      "Leg dich bequem hin und schließ deine Augen.",
      "Stell dir vor, du liegst an einem warmen Sandstrand. Der Sand ist weich und kitzelt an deinen Füßen.",
      "Du hörst das Meer: Die Wellen rollen heran … und ziehen sich wieder zurück.",
      "Atme mit den Wellen: Wenn die Welle kommt, atmest du ein. Wenn sie geht, atmest du aus.",
      "Eddy der Elefant kommt vorbei. Mit seinem Rüssel spritzt er kühle Wassertropfen in die Luft – sie glitzern wie kleine Diamanten.",
      "Ihr sammelt gemeinsam Muscheln. Eine ist ganz rosa und glatt. Du hältst sie an dein Ohr und hörst das Meer rauschen.",
      "Eddy sagt: Ich mag mich genau so, wie ich bin. Und dich mag ich auch genau so, wie du bist.",
      "Die Sonne wärmt deinen Bauch. Du fühlst dich leicht und froh.",
      "Langsam verabschiedest du dich vom Meer. Die Wellen rauschen dir leise hinterher.",
      "Spür wieder deine Matte. Atme tief ein und streck dich.",
      "Öffne langsam die Augen. Schön, dass du da bist!",
    ],
  },
  {
    slug: "sonnenplatz",
    title: "Leos Sonnenplatz",
    host: "leo",
    theme: "sonne",
    purpose: "Für mehr Mut",
    description: "Tank auf Leos Lieblingsplatz goldenes Licht und ganz viel Mut.",
    paragraphs: [
      "Setz oder leg dich bequem hin. Schließ die Augen und atme tief ein … und aus.",
      "Stell dir eine weite, goldene Wiese vor. Das Gras ist hoch und warm von der Sonne.",
      "Mittendrin liegt ein großer, flacher Stein. Das ist Leos Lieblingsplatz.",
      "Leo der Löwe liegt dort und sonnt sich. Als er dich sieht, rückt er ein Stück zur Seite: Komm, setz dich zu mir!",
      "Die Sonne scheint auf dich. Spür, wie die Wärme in deinen Bauch fließt – wie ein kleines, goldenes Licht.",
      "Mit jedem Atemzug wird dein Licht ein bisschen größer und heller.",
      "Leo sagt: Dieses Licht ist dein Mut. Es ist immer in dir – auch wenn du es mal nicht spürst.",
      "Denk an etwas, das dir ein bisschen schwerfällt. Stell dir vor, wie dein goldenes Licht dich dabei begleitet.",
      "Leise sagst du in Gedanken: Ich bin mutig. Ich schaffe das.",
      "Leo brummt zufrieden. Er weiß: Du kannst immer wieder zu seinem Sonnenplatz zurückkommen.",
      "Nimm dein goldenes Licht mit. Beweg langsam deine Finger und Zehen.",
      "Und öffne die Augen, wenn du bereit bist.",
    ],
  },
  {
    slug: "schneeflocke",
    title: "Die kleine Schneeflocke",
    host: "kimi",
    theme: "schnee",
    purpose: "Winterruhe",
    winter: true,
    description: "Tanz als kleine Schneeflocke durch die stille Winternacht.",
    paragraphs: [
      "Kuschel dich in eine warme Decke und schließ deine Augen.",
      "Stell dir vor, du bist eine kleine Schneeflocke hoch oben in einer weißen Winterwolke.",
      "Ganz leise löst du dich und fängst an zu tanzen. Du drehst dich langsam im Kreis … und schwebst nach unten.",
      "Unter dir siehst du ein kleines Dorf. Die Fenster leuchten warm, und aus den Schornsteinen steigt Rauch.",
      "Es duftet nach Zimt und frisch gebackenen Plätzchen.",
      "Kimi die Katze sitzt am Fenster und schaut dir zu. Sie schnurrt ganz leise.",
      "Sanft landest du auf einem Tannenzweig. Alles um dich herum ist still und weich.",
      "Atme ein – kühle, frische Winterluft. Atme aus – und alles in dir wird ruhig.",
      "Kimi flüstert: Du bist geliebt. Ganz egal, wie dein Tag heute war.",
      "Langsam kommst du zurück in dein warmes Zimmer. Spür die Decke um dich herum.",
      "Beweg deine Finger und Zehen. Und öffne langsam die Augen.",
    ],
  },
];

export function getJourney(slug: string): Journey | undefined {
  return journeys.find((j) => j.slug === slug);
}

/** grobe Dauer: ca. 2,3 Wörter pro Sekunde + Pausen */
export function journeyMinutes(j: Journey): number {
  const words = j.paragraphs.join(" ").split(/\s+/).length;
  return Math.max(2, Math.round((words / 2.3 + j.paragraphs.length * 3) / 60));
}
