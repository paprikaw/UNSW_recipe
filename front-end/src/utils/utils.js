// Remove emoji from the string
export function getRidOfEmoji(name) {
  return name.split(' ').slice(1).join(' ');
}
