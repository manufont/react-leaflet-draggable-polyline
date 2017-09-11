export const flatten = function(array){
  return Array.prototype.concat.apply([], array);
};

const minBy = function(lambda, array) {
  const mapped = array.map(lambda);
  return array[mapped.indexOf(Math.min(...mapped))];
};

const sqr = x => x * x;

const distance = (a, b) => sqr(a[0] - b[0]) + sqr(a[1] - b[1]);

const closestOfSegment = (p, v, w) => {
  const l2 = distance(v, w);
  if (l2 === 0) return v;
  const t =
    ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  if (t < 0) return v;
  if (t > 1) return w;
  return [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])];
};

const closestIndexOfPolyline = (latlng, positions) => {
  var minDistance = Number.MAX_VALUE;
  var indexOfClosest = 0;
  for (var i = 0; i < positions.length; ++i) {
    let d = distance(latlng, positions[i]);
    if (d < minDistance) {
      minDistance = d;
      indexOfClosest = i;
    }
  }
  return indexOfClosest;
};

export const closestOfPolyline = (latlng, positions) => {
  return positions[closestIndexOfPolyline(latlng, positions)];
};

export const snapToPolyline = (latlng, positions) => {
  const indexOfClosest = closestIndexOfPolyline(latlng, positions);
  const closest = positions[indexOfClosest];

  return minBy(
    point => distance(latlng, point),
    [indexOfClosest - 1, indexOfClosest + 1]
      .map(index => positions[index])
      .filter(point => point !== undefined)
      .map(point => closestOfSegment(latlng, closest, point))
  );
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