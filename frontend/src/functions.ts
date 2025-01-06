// Utility function to capitalize the first letter
export function capitalizeFirstLetter(string: string | null | undefined): string {
  if (!string) return ''; // Return empty string if input is null or undefined
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function truncateString(str : string, maxLength : number) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  }

export function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 2;
}


export function getCategoryId(category: string): number {
  switch (category) {
    case "organisation": return 1;
    case "doctor": return 2;
    case "student": return 3;
    default: return 2;
  }
}
  