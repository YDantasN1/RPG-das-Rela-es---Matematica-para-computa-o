function isInjective(pairs) {
  const images = pairs.map((p) => p[1]);
  return new Set(images).size === images.length;
}

function isSurjective(pairs, codomain) {
  const image = [...new Set(pairs.map((p) => p[1]))];
  return codomain.length === image.length;
}

function isBijective(pairs, codomain) {
  return isInjective(pairs) && isSurjective(pairs, codomain);
}

function hasElementWithoutImage(pairs, domain) {
  const used = pairs.map((p) => p[0]);
  return domain.some((x) => !used.includes(x));
}

function isReflexive(pairs, domain) {
  return domain.every((x) => pairs.some((p) => p[0] === x && p[1] === x));
}

function isSymmetric(pairs) {
  if (pairs.length === 0) return true;
  return pairs.every((p) => pairs.some((s) => s[0] === p[1] && s[1] === p[0]));
}

function isAntisymmetric(pairs) {
  for (const p of pairs)
    for (const s of pairs)
      if (p[0] === s[1] && p[1] === s[0] && p[0] !== p[1]) return false;
  return true;
}

function isTransitive(pairs) {
  for (const p1 of pairs)
    for (const p2 of pairs)
      if (
        p1[1] === p2[0] &&
        !pairs.some((p3) => p3[0] === p1[0] && p3[1] === p2[1])
      )
        return false;
  return true;
}

function generateWrongSets(correct) {
  const all = [1, 2, 3, 4];
  const correctStr = `{${correct.join(",")}}`;
  const options = [];
  while (options.length < 3) {
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    const temp = shuffled.slice(0, Math.floor(Math.random() * 3) + 1).sort();
    const candidate = `{${temp.join(",")}}`;
    if (candidate !== correctStr && !options.includes(candidate))
      options.push(candidate);
  }
  return options;
}

function buildEasyPairs() {
  const domain = [1, 2, 3];
  const pairs = domain.map((x) => [x, Math.floor(Math.random() * 3) + 1]);
  const isFunc = Math.random() > 0.5;
  if (!isFunc) pairs.push([1, 2]);
  return { pairs, codomain: [1, 2, 3], isFunc };
}

function buildNormalPairs() {
  const domain = [1, 2, 3],
    codomain = [1, 2, 3];
  const pairs = [];
  const count = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < count; i++) {
    const a = domain[Math.floor(Math.random() * domain.length)];
    const b = codomain[Math.floor(Math.random() * codomain.length)];
    if (!pairs.some((p) => p[0] === a && p[1] === b)) pairs.push([a, b]);
  }
  return { pairs, codomain, domain };
}

function buildHardPairs(type) {
  const domain = [1, 2, 3];
  let codomain = [1, 2, 3, 4];
  const pairs = [];
  const shouldBeTrue = Math.random() > 0.5;

  if (type === 4 || type === 5) codomain = [1, 2, 3];

  if (type === 3 && shouldBeTrue) {
    const avail = [...codomain];
    domain.forEach((x) =>
      pairs.push([
        x,
        avail.splice(Math.floor(Math.random() * avail.length), 1)[0],
      ]),
    );
  } else if (type === 6 && shouldBeTrue) {
    pairs.push([1, 1], [2, 2]);
  } else {
    domain.forEach((x) =>
      pairs.push([x, codomain[Math.floor(Math.random() * codomain.length)]]),
    );
  }

  return { pairs, codomain, domain };
}

export {
  isInjective,
  isSurjective,
  isBijective,
  hasElementWithoutImage,
  isReflexive,
  isSymmetric,
  isAntisymmetric,
  isTransitive,
  generateWrongSets,
  buildEasyPairs,
  buildNormalPairs,
  buildHardPairs,
};
