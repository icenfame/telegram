export function getAvatarTitle(...titles) {
  const res = [];

  for (const title of titles) {
    res.push(/\p{Emoji}/u.test(title) ? title.slice(0, 2) : title?.[0]);
  }

  return res.join("");
}
