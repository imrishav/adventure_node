export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaW1yaXNoYXYiLCJhIjoiY2s5aXJrczkzMDVpbTNkcXM0dzEycHFudCJ9.T8vbFOV2XWM0JvZRz89PXQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/imrishav/ck9iy0o2v0aes1imat695ws2q',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((log) => {
    //adding marker,
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(log.coordinates)
      .addTo(map);

    //Add Popup

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(log.coordinates)
      .setHTML(`<p>Day ${log.day}: ${log.description}</p>`)
      .addTo(map);

    //Extends map bounds
    bounds.extend(log.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  });
};
