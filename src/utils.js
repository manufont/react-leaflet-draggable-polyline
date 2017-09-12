export const flatten = array => 
  Array.prototype.concat.apply([], array);

const sqr = x => x * x;

const distance = (a, b) => sqr(a[0] - b[0]) + sqr(a[1] - b[1]);

const closestOfSegment = (p, v, w) => {
  const l2 = distance(v, w);
  if (l2 === 0) return v;
  const t =
    ((p[0]-v[0])*(w[0]-v[0]) + (p[1]-v[1])*(w[1]-v[1])) / l2;
  if (t < 0) return v;
  if (t > 1) return w;
  return [
    v[0] + t * (w[0] - v[0]),
    v[1] + t * (w[1] - v[1])
  ];
};

export const snapToPolyline = (latlng, positions) => {
  let minDistance = Number.MAX_VALUE;
  let closest = null;
  for (let i = 0, len = positions.length-1; i < len; ++i) {
    let p = closestOfSegment(latlng, positions[i], positions[i+1]);
    let d = distance(latlng, p);
    if (d < minDistance) {
      closest = p;
      minDistance = d;
    }
  }
  return closest;
};

export const closestIndexOfPolyline = (latlng, positions) => {
  let minDistance = Number.MAX_VALUE;
  let closestIndex = null;
  for (let i = 0, len = positions.length-1; i < len; ++i) {
    let p = closestOfSegment(latlng, positions[i], positions[i+1]);
    let d = distance(latlng, p);
    if (d < minDistance) {
      closestIndex = i;
      minDistance = d;
    }
  }
  return closestIndex;
};

export const toArrayLatLng = latLng => [latLng.lat, latLng.lng];

export const toObjLatLng = latLng => L.latLng(latLng[0], latLng[1]);

export const objectWithoutProperties = (obj, keys) => {
  const target = {};
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }
  }
  return target;
};