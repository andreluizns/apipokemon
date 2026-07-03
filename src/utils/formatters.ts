export function formatPokedexNumber(id: number): string {
  return `N°${String(id).padStart(3, '0')}`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// PokeAPI reports weight in hectograms and height in decimeters.
export function formatWeightKg(weightHectograms: number): string {
  return `${(weightHectograms / 10).toFixed(1).replace('.', ',')} kg`;
}

export function formatHeightM(heightDecimeters: number): string {
  return `${(heightDecimeters / 10).toFixed(1).replace('.', ',')} m`;
}
