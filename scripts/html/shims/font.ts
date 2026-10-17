// Ersatz für `next/font/google`: Die Schrift kommt in der HTML-Version aus dem CSS des Next-Builds.
type FontOptions = { variable?: string; subsets?: string[]; display?: string; weight?: string | string[] };

const font = (family: string) => (options: FontOptions = {}) => {
  void options;
  return { className: "", variable: "", style: { fontFamily: family } };
};

export const Quicksand = font("Quicksand");
