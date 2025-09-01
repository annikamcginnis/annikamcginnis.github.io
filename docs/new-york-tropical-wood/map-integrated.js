// Mapbox access token
mapboxgl.accessToken = "__MAPBOX_TOKEN__";

// Global variables
let map = null;
let currentWijmaAnimation = null;
let worldRotationInterval = null;
let activeChapterName = '';
let worldRotationId = null;
let outlineAnimationId = null;
let currentOutlineAnimation = null;
let wijmaAnimationId = null;
 
// Initialize the map
function initializeMap() {
    if (map) return; // Already initialized 
    
    console.log('Initializing map...');
    
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-40, 15],
        zoom: 2.7,
        bearing: 0,
        pitch: 0,
        projection: 'globe'
    });

    // Disable all zooming and rotation, but allow panning
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.keyboard.disable();

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());
    
    console.log('Map created, waiting for load event...');
    
    // Map load event - add layers and set initial chapter
    map.on('load', () => {
        console.log('Map loaded, adding data sources and layers');
        console.log('Map object:', map);
        console.log('Map style loaded:', map.isStyleLoaded());
        
        // Add the vector sources
        map.addSource('staticLayer1', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.7e3a1qu4'
        });

        map.addSource('animatedLayer', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.97q6cepm'
        });

        map.addSource('concessionsLayer', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.br8ry584'
        });

        map.addSource('cameroonLayer', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.6w99lar1'
        });

        map.addSource('wijmaConcessionsLayer', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.5u5otsix'
        });
        
        map.addSource('contractorsLayer', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.4lv2fqr9'
        });
        
        map.addSource('newYorkLayer', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.bt1itowa'
        });
        
        map.addSource('newYorkLayer2', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.aun1z7h6'
        });
        
        map.addSource('newYorkLayer3', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.14gpph2b'
        });
        
        map.addSource('newYorkLayer4', {
            type: 'vector',
            url: 'mapbox://mcginnisannika.4z2r6269'
        });
        
        // Add animated outline layer for Guyana
        map.addLayer({
            id: 'guyana-outline',
            type: 'line',
            source: 'animatedLayer',
            'source-layer': 'guy_admbnd_adm0_2021-7r4vhz',
            paint: {
                'line-color': '#FFA500',
                'line-width': 3,
                'line-opacity': 0.8
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add Guyana fill layer
        map.addLayer({
            id: 'guyana-fill',
            type: 'fill',
            source: 'animatedLayer',
            'source-layer': 'guy_admbnd_adm0_2021-7r4vhz',
            paint: {
                'fill-color': '#FFA500',
                'fill-opacity': 0.2
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add static polygon layer 1
        map.addLayer({
            id: 'static-polygon-1',
            type: 'line',
            source: 'staticLayer1',
            'source-layer': 'amazonia_boundary_proposal_Ev-9gajom',
            paint: {
                'line-color': '#fff248',
                'line-width': 0.5,
                'line-opacity': 0.8
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add Amazon fill layer
        map.addLayer({
            id: 'amazon-fill',
            type: 'fill',
            source: 'staticLayer1',
            'source-layer': 'amazonia_boundary_proposal_Ev-9gajom',
            paint: {
                'fill-color': '#228B22',
                'fill-opacity': 0,
                'fill-outline-color': '#228B22'
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add static polygon layer 2
        map.addLayer({
            id: 'static-polygon-2',
            type: 'line',
            source: 'concessionsLayer',
            'source-layer': 'related_concessions-7n63rk',
            paint: {
                'line-color': '#fff248',
                'line-width': 1,
                'line-opacity': 0.8
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add Cameroon boundary layer
        map.addLayer({
            id: 'cameroon-boundary',
            type: 'line',
            source: 'cameroonLayer',
            'source-layer': 'cmr_admbnda_adm0_inc_20180104-1h1dam',
            paint: {
                'line-color': '#fff248',
                'line-width': 2,
                'line-opacity': 0.8
            },
            layout: {
                'visibility': 'none'
            }
        });
        
        // Add Wijma former concessions layer with drawing animation
        map.addLayer({
            id: 'wijma-concessions-fill',
            type: 'fill',
            source: 'wijmaConcessionsLayer',
            'source-layer': 'wijma_former_concessions-ct0suq',
            paint: {
                'fill-color': '#FFA500',
                'fill-opacity': 0
            },
            layout: {
                'visibility': 'none'
            }
        });

        map.addLayer({
            id: 'wijma-concessions-outline',
            type: 'line',
            source: 'wijmaConcessionsLayer',
            'source-layer': 'wijma_former_concessions-ct0suq',
            paint: {
                'line-color': '#FFA500',
                'line-width': 6,
                'line-opacity': 0.8,
                'line-dasharray': [0, 1000]
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add contractors layer
        map.addLayer({
            id: 'contractors-layer',
            type: 'circle',
            source: 'contractorsLayer',
            'source-layer': 'New_York_wood_importers_-_She-c9ypoo',
            paint: {
                'circle-radius': 8,
                'circle-color': '#FFA500',
                'circle-opacity': 0.8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FFFFFF'
            },
            layout: {
                'visibility': 'none'
            }
        });
        
        // Add contractors labels layer (hidden to remove company names)
        map.addLayer({
            id: 'contractors-labels',
            type: 'symbol',
            source: 'contractorsLayer',
            'source-layer': 'New_York_wood_importers_-_She-c9ypoo',
            layout: {
                'text-field': ['get', 'Vendor'],
                'text-font': ['DIN Offc Pro Medium'],
                'text-size': 12,
                'text-offset': [0, 1.5],
                'text-anchor': 'top',
                'text-allow-overlap': false,
                'text-ignore-placement': false,
                'visibility': 'none'
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-opacity': 1
            }
        });
        
        // Add New York layer
        map.addLayer({
            id: 'new-york-layer',
            type: 'line',
            source: 'newYorkLayer',
            'source-layer': 'brooklyn_bridge',
            paint: {
                'line-color': '#FFA500',
                'line-width': 3.5,
                'line-opacity': 1
            },
            layout: {
                'visibility': 'none'
            }
        });
        
        // Add Brooklyn Bridge label
        map.addLayer({
            id: 'brooklyn-bridge-label',
            type: 'symbol',
            source: 'newYorkLayer',
            'source-layer': 'brooklyn_bridge',
            layout: {
                'text-field': 'Brooklyn Bridge',
                'text-font': ['DIN Offc Pro Medium'],
                'text-size': 16,
                'text-offset': [4, -1.5],
                'text-anchor': 'top',
                'text-allow-overlap': true,
                'text-ignore-placement': false,
                'visibility': 'none'
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-opacity': 0
            }
        });
        
        // Add NYC Subway label
        map.addLayer({
            id: 'nyc-subway-label',
            type: 'symbol',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-73.9539, 40.8029]
                        },
                        properties: {
                            name: 'NYC Subway'
                        }
                    }]
                }
            },
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['DIN Offc Pro Medium'],
                'text-size': 16,
                'text-offset': [0, 1.5],
                'text-anchor': 'top',
                'text-allow-overlap': true,
                'text-ignore-placement': false,
                'visibility': 'none'
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-opacity': 0
            }
        });

        // Add second New York layer
        map.addLayer({
            id: 'new-york-layer2',
            type: 'line',
            source: 'newYorkLayer2',
            'source-layer': 'nyu-2451-34758-shapefile-20hzqv',
            paint: {
                'line-color': '#fff248',
                'line-width': 1.5,
                'line-opacity': 0.8
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add Staten Island Ferry labels layer
        map.addLayer({
            id: 'sif-terminals-labels',
            type: 'symbol',
            source: 'newYorkLayer4',
            'source-layer': 'Untitled_spreadsheet_-_Sheet1-ba8da1',
            layout: {
                'text-field': ['get', 'Infrastructure'],
                'text-font': ['DIN Offc Pro Medium'],
                'text-size': 16,
                'text-offset': [
                    'case',
                    ['==', ['get', 'Infrastructure'], 'Staten Island Ferry Whitehall Terminal'], [-2, 1.5],
                    [0, 1.5]
                ],
                'text-anchor': 'top',
                'text-allow-overlap': true,
                'text-ignore-placement': false,
                'visibility': 'none'
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-opacity': 0
            }
        });

        // Add fourth New York layer (Staten Island Ferry terminals)
        map.addLayer({
            id: 'new-york-layer4',
            type: 'circle',
            source: 'newYorkLayer4',
            'source-layer': 'Untitled_spreadsheet_-_Sheet1-ba8da1',
            paint: {
                'circle-radius': 8,
                'circle-color': '#FFA500',
                'circle-opacity': 1,
                'circle-stroke-width': 2.5,
                'circle-stroke-color': '#FFFFFF'
            },
            layout: {
                'visibility': 'none'
            }
        });

        // Add administrative boundaries layer
        map.addLayer({
            id: 'admin-boundaries',
            type: 'line',
            source: {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-streets-v8'
            },
            'source-layer': 'admin',
            paint: {
                'line-color': '#FFFFFF',
                'line-width': [
                    'case',
                    ['==', ['get', 'admin_level'], 1], 2,
                    ['==', ['get', 'admin_level'], 4], 2,
                    ['==', ['get', 'admin_level'], 6], 0.3,
                    0.3
                ],
                'line-opacity': [
                    'case',
                    ['==', ['get', 'admin_level'], 1], 0.5,
                    ['==', ['get', 'admin_level'], 4], 0.5,
                    ['==', ['get', 'admin_level'], 6], 0.15,
                    0.15
                ]
            },
            layout: {
                'visibility': 'none'
            }
        });

        console.log('All layers added successfully');
        
        // Set initial active chapter
        console.log('Setting initial active chapter to world');
        setActiveChapter('world');
    });
}

// Define chapters with their map positions
const chapters = {
    'world': {
        center: [-40, 15],
        zoom: 2.7,
        bearing: 0,
        pitch: 0
    },
    'world-prohibition': {
        center: [-40, 15],
        zoom: 2.7,
        bearing: 0,
        pitch: 0
    },
    'world-2': {
        center: [-70, 25],
        zoom: 2.7,
        bearing: 0,
        pitch: 0
    },
    'world-2-supply-chains': {
        center: [-25, 15],
        zoom: 2.7,
        bearing: 0,
        pitch: 0
    },
    'guyana-cameroon': {
        center: [-65, 10],
        zoom: 3.5,
        bearing: 0,
        pitch: 0
    },
    'guyana-cameroon-2': {
        center: [10, 7],
        zoom: 5.5,
        bearing: 0,
        pitch: 0
    },
    'guyana-2': {
        center: [10.15, 2.55],
        zoom: 12,
        bearing: 0,
        pitch: 0
    },
    'guyana-3': {
        center: [10.15, 2.55],
        zoom: 12,
        bearing: 0,
        pitch: 0
    },
    'intermediary-countries-cameroon': {
        center: [2, 30],
        zoom: 2.7,
        bearing: 0,
        pitch: 0
    },
    'intermediary-countries-guyana': {
        center: [-62, 2],
        zoom: 3.2,
        bearing: 0,
        pitch: 0
    },
    'contractors-locations': {
        center: [-73.5, 39.5],
        zoom: 6.5,
        bearing: 0,
        pitch: 0
    },
    'new-york-2': {
        center: [-74.00, 40.70],
        zoom: 10.5,
        bearing: 0,
        pitch: 0
    },
    'new-york-final': {
        center: [-74.00, 40.70],
        zoom: 10.5,
        bearing: 0,
        pitch: 0
    }
};

// Start world rotation
function startWorldRotation() {
    console.log('startWorldRotation called');
    let center = map.getCenter();
    console.log('Initial center:', center);
    
    function rotate() {
        if (activeChapterName !== 'world' && activeChapterName !== 'world-prohibition') {
            console.log('Stopping rotation - not on world chapter');
            worldRotationId = null;
            return;
        }
        center.lng = (center.lng + 0.01) % 360;
        console.log('Rotating to:', center.lng);
        map.setCenter([center.lng, center.lat]);
        worldRotationId = requestAnimationFrame(rotate);
    }
    if (!worldRotationId) {
        console.log('Starting rotation animation');
        rotate();
    }
}

// Stop world rotation
function stopWorldRotation() {
    if (worldRotationId) {
        cancelAnimationFrame(worldRotationId);
        worldRotationId = null;
    }
}

// Set active chapter and control map/layers
function setActiveChapter(chapterName) {
    console.log('setActiveChapter called with:', chapterName);
    if (chapterName === activeChapterName) return;
    
    if (!map) {
        console.error('Map object is null in setActiveChapter');
        return;
    }

    // Special handling for the Cameroon to Netherlands transition to prevent bouncing
    if (activeChapterName === 'guyana-3' && chapterName === 'intermediary-countries-cameroon') {
        map.flyTo({
            ...chapters[chapterName],
            duration: 6000, // Slower transition
            easing: (t) => t * (2 - t)
        });
    } else {
        map.flyTo({
            ...chapters[chapterName],
            duration: 1500,
            easing: (t) => t * (2 - t)
        });
    }

    // Clear SVG overlay at the beginning of each step
    if (chapterName !== 'guyana-3') {
        const svg = document.querySelector('#svg-overlay svg');
        if (svg) {
            svg.innerHTML = '';
        }
    }

    const newChapterEl = document.getElementById(chapterName);
    const oldChapterEl = document.getElementById(activeChapterName);
    if (newChapterEl) newChapterEl.classList.add('active');
    if (oldChapterEl) oldChapterEl.classList.remove('active');

    // Show/hide Guyana layers
    console.log('Checking if guyana-outline layer exists:', map.getLayer('guyana-outline'));
    if (map.getLayer('guyana-outline')) {
        const isGuyanaStep = chapterName === 'guyana-cameroon' || chapterName === 'world-2-supply-chains';
        
        map.setLayoutProperty(
            'guyana-outline',
            'visibility',
            isGuyanaStep ? 'visible' : 'none'
        );
        
        if (chapterName === 'world-2-supply-chains') {
            map.setPaintProperty('guyana-outline', 'line-color', '#fff248');
            map.setPaintProperty('guyana-outline', 'line-width', 2);
        } else {
            map.setPaintProperty('guyana-outline', 'line-color', '#FFA500');
            map.setPaintProperty('guyana-outline', 'line-width', 3);
        }
        
        map.setLayoutProperty(
            'guyana-fill',
            'visibility',
            chapterName === 'guyana-cameroon' ? 'visible' : 'none'
        );
        
        map.setLayoutProperty(
            'static-polygon-1',
            'visibility',
            chapterName === 'guyana-cameroon' ? 'visible' : 'none'
        );
        
        map.setLayoutProperty(
            'amazon-fill',
            'visibility',
            chapterName === 'guyana-cameroon' ? 'visible' : 'none'
        );
        
        map.setLayoutProperty(
            'static-polygon-2',
            'visibility',
            chapterName === 'guyana-cameroon' ? 'visible' : 'none'
        );
    }

    // Cameroon boundary layer
    const cameroonVisibility = chapterName === 'guyana-cameroon-2' || chapterName === 'world-2-supply-chains' ? 'visible' : 'none';
    
    if (map.getLayer('cameroon-boundary')) {
        map.setLayoutProperty(
            'cameroon-boundary',
            'visibility',
            cameroonVisibility
        );
        
        if (chapterName === 'world-2' || chapterName === 'world-2-supply-chains') {
            map.setPaintProperty('cameroon-boundary', 'line-width', 3);
        } else {
            map.setPaintProperty('cameroon-boundary', 'line-width', 2);
        }
    }

    // Wijma concessions layer
    if (chapterName === 'guyana-cameroon-2') {
        // Animation will handle visibility
    } else if (chapterName === 'guyana-2' || chapterName === 'guyana-3' || chapterName === 'guyana-cameroon') {
        if (map.getLayer('wijma-concessions-outline')) {
            map.setLayoutProperty('wijma-concessions-outline', 'visibility', 'visible');
            map.setPaintProperty('wijma-concessions-outline', 'line-opacity', 0.8);
        }
        
        if (map.getLayer('wijma-concessions-fill')) {
            map.setLayoutProperty('wijma-concessions-fill', 'visibility', 'visible');
            map.setPaintProperty('wijma-concessions-fill', 'fill-opacity', 0.2);
        }
    } else {
        if (map.getLayer('wijma-concessions-outline')) {
            map.setLayoutProperty('wijma-concessions-outline', 'visibility', 'none');
        }
        if (map.getLayer('wijma-concessions-fill')) {
            map.setLayoutProperty('wijma-concessions-fill', 'visibility', 'none');
        }
    }
    
    // Admin boundaries visibility
    const showAdminBoundaries = chapterName === 'contractors-locations' || chapterName === 'new-york-2';
    
    if (map.getLayer('admin-boundaries')) {
        map.setLayoutProperty('admin-boundaries', 'visibility', showAdminBoundaries ? 'visible' : 'none');
    }
    
    // Contractors layer visibility
    const contractorsVisibility = chapterName === 'contractors-locations' ? 'visible' : 'none';
    
    if (map.getLayer('contractors-layer')) {
        map.setLayoutProperty(
            'contractors-layer',
            'visibility',
            contractorsVisibility
        );
    }
    
    if (map.getLayer('contractors-labels')) {
        map.setLayoutProperty(
            'contractors-labels',
            'visibility',
            'none' // Always hidden to remove company names
        );
    }
    
    // New York layer visibility
    const newYorkVisibility = chapterName === 'new-york-2' || chapterName === 'new-york-final' || chapterName === 'world-2' || chapterName === 'world-2-supply-chains' ? 'visible' : 'none';
    
    if (map.getLayer('new-york-layer')) {
        map.setLayoutProperty(
            'new-york-layer',
            'visibility',
            newYorkVisibility
        );
    }
    
    if (map.getLayer('brooklyn-bridge-label')) {
        map.setLayoutProperty(
            'brooklyn-bridge-label',
            'visibility',
            chapterName === 'new-york-2' || chapterName === 'new-york-final' ? 'visible' : 'none'
        );
    }
    
    if (map.getLayer('nyc-subway-label')) {
        map.setLayoutProperty(
            'nyc-subway-label',
            'visibility',
            chapterName === 'new-york-2' || chapterName === 'new-york-final' ? 'visible' : 'none'
        );
    }

    if (map.getLayer('new-york-layer2')) {
        map.setLayoutProperty(
            'new-york-layer2',
            'visibility',
            newYorkVisibility
        );
        
        if (chapterName === 'world-2' || chapterName === 'world-2-supply-chains') {
            map.setPaintProperty('new-york-layer2', 'line-width', 3.5);
        } else {
            map.setPaintProperty('new-york-layer2', 'line-width', 2);
        }
    }
    
    if (map.getLayer('sif-terminals-labels')) {
        map.setLayoutProperty(
            'sif-terminals-labels',
            'visibility',
            chapterName === 'new-york-2' || chapterName === 'new-york-final' ? 'visible' : 'none'
        );
    }

    if (map.getLayer('new-york-layer4')) {
        map.setLayoutProperty(
            'new-york-layer4',
            'visibility',
            newYorkVisibility
        );
    }

    // Start/stop outline animation
    if (chapterName === 'guyana-cameroon') {
        if (currentOutlineAnimation) {
            clearTimeout(currentOutlineAnimation);
        }
        
        // Start with 0 opacity to prevent flashing, then animate to full opacity
        map.setPaintProperty('guyana-outline', 'line-opacity', 0);
        map.setPaintProperty('guyana-outline', 'line-dasharray', [0, 1000]);
        
        let dashLength = 0;
        let opacity = 0;
        const drawOutline = () => {
            if (activeChapterName !== 'guyana-cameroon') {
                return;
            }
            
            // Fade in opacity first
            if (opacity < 1) {
                opacity += 0.1;
                map.setPaintProperty('guyana-outline', 'line-opacity', opacity);
            }
            
            // Then animate the dash
            if (opacity >= 1) {
                dashLength += 2;
                map.setPaintProperty('guyana-outline', 'line-dasharray', [dashLength, 1000]);
            }
            
            if (dashLength < 100) {
                currentOutlineAnimation = setTimeout(drawOutline, 30);
            } else {
                currentOutlineAnimation = null;
            }
        };
        
        currentOutlineAnimation = setTimeout(drawOutline, 30);
    } else if (chapterName === 'world-2-supply-chains') {
        if (currentOutlineAnimation) {
            clearTimeout(currentOutlineAnimation);
            currentOutlineAnimation = null;
        }
        map.setPaintProperty('guyana-outline', 'line-opacity', 1);
        map.setPaintProperty('guyana-outline', 'line-dasharray', [1000, 0]);
    } else {
        if (currentOutlineAnimation) {
            clearTimeout(currentOutlineAnimation);
            currentOutlineAnimation = null;
        }
        map.setPaintProperty('guyana-outline', 'line-opacity', 0);
    }

    // Start/stop Wijma concessions drawing animation
    if (chapterName === 'guyana-cameroon-2') {
        if (currentWijmaAnimation) {
            clearTimeout(currentWijmaAnimation);
        }
        
        if (!map.getLayer('wijma-concessions-fill')) {
            return;
        }
        
        setTimeout(() => {
            // First make the layer visible but with 0 opacity to prevent flashing
            map.setLayoutProperty('wijma-concessions-fill', 'visibility', 'visible');
            map.setPaintProperty('wijma-concessions-fill', 'fill-opacity', 0);
            map.setPaintProperty('wijma-concessions-fill', 'fill-outline-color', 'transparent');
            
            let animationFillOpacity = 0;
            const drawWijmaOutline = () => {
                if (activeChapterName !== 'guyana-cameroon-2') {
                    return;
                }
                
                animationFillOpacity += 0.05;
                animationFillOpacity = Math.min(animationFillOpacity, 0.8);
                map.setPaintProperty('wijma-concessions-fill', 'fill-opacity', animationFillOpacity);
                
                if (animationFillOpacity < 0.8) {
                    currentWijmaAnimation = setTimeout(drawWijmaOutline, 50);
                } else {
                    currentWijmaAnimation = null;
                }
            };
            
            currentWijmaAnimation = setTimeout(drawWijmaOutline, 10);
        }, 1000);
        
    } else if (chapterName !== 'guyana-2' && chapterName !== 'guyana-3') {
        if (currentWijmaAnimation) {
            clearTimeout(currentWijmaAnimation);
            currentWijmaAnimation = null;
        }
        map.setPaintProperty('wijma-concessions-outline', 'line-opacity', 0);
        map.setPaintProperty('wijma-concessions-fill', 'fill-opacity', 0);
    }

    // Start/stop tree logo animation
    if (chapterName === 'guyana-2') {
        if (!map.hasImage('tree-icon')) {
            map.loadImage('tree_icon.png', (error, image) => {
                if (error) {
                    return;
                }
                map.addImage('tree-icon', image);
                createTreeLayers();
            });
        } else {
            createTreeLayers();
        }
        
        function createTreeLayers() {
            map.addLayer({
                id: 'surrounding-tree-0',
                type: 'symbol',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [10.13, 2.52]
                        },
                        properties: {
                            name: 'Central Tree'
                        }
                    }
                },
                layout: {
                    'icon-image': 'tree-icon',
                    'icon-size': 0.2
                },
                paint: {
                    'icon-opacity': 0,
                    'icon-color': '#FFFFFF'
                }
            });
            
            for (let i = 1; i < 11; i++) {
                const angle = ((i - 1) / 10) * 2 * Math.PI;
                const radius = 0.03;
                const x = 10.13 + radius * Math.cos(angle);
                const y = 2.52 + radius * Math.sin(angle);
                
                map.addLayer({
                    id: `surrounding-tree-${i}`,
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [x, y]
                            },
                            properties: {
                                name: `Tree ${i}`
                            }
                        }
                    },
                    layout: {
                        'icon-image': 'tree-icon',
                        'icon-size': 0.15
                    },
                    paint: {
                        'icon-opacity': 0,
                        'icon-color': '#FFFFFF'
                    }
                });
            }
            
            let centralTreeOpacity = 0;
            const animateCentralTree = () => {
                centralTreeOpacity += 0.1;
                centralTreeOpacity = Math.min(centralTreeOpacity, 1);
                map.setPaintProperty('surrounding-tree-0', 'icon-opacity', centralTreeOpacity);
                
                if (centralTreeOpacity < 1) {
                    setTimeout(animateCentralTree, 100);
                } else {
                    // Start animating all surrounding trees at once
                    animateSurroundingTrees();
                }
            };
            
            // Animate all surrounding trees at once with fade-in
            let surroundingTreesOpacity = 0;
            const animateSurroundingTrees = () => {
                surroundingTreesOpacity += 0.05;
                surroundingTreesOpacity = Math.min(surroundingTreesOpacity, 1);
                
                // Set opacity for all surrounding trees at once
                for (let i = 1; i < 11; i++) {
                    map.setPaintProperty(`surrounding-tree-${i}`, 'icon-opacity', surroundingTreesOpacity);
                }
                
                if (surroundingTreesOpacity < 1) {
                    setTimeout(animateSurroundingTrees, 50);
                }
            };
            
            setTimeout(animateCentralTree, 1000);
            
            if (map.getLayer('surrounding-tree-0')) {
                map.setLayoutProperty('surrounding-tree-0', 'visibility', 'visible');
            }
            for (let i = 0; i < 11; i++) {
                if (map.getLayer(`surrounding-tree-${i}`)) {
                    map.setLayoutProperty(`surrounding-tree-${i}`, 'visibility', 'visible');
                }
            }
        }
    }

    // Add animated lines for guyana-3
    if (chapterName === 'guyana-3') {
        for (let i = 0; i < 11; i++) {
            if (map.getLayer(`surrounding-tree-${i}`)) {
                map.setPaintProperty(`surrounding-tree-${i}`, 'icon-opacity', 0);
            }
        }
        
        const svg = document.querySelector('#svg-overlay svg');
        if (!svg) {
            return;
        }
        svg.innerHTML = '';
        
        const treeCoords = [10.13, 2.52];
        const treePoint = map.project(treeCoords);
        
        const lineX = treePoint.x - 5;
        const lineY = treePoint.y - 55;
        
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line1.setAttribute("d", `M 0 ${lineY - 20} Q ${lineX - 50} ${lineY - 110} 2000 ${lineY - 20}`);
        line1.setAttribute("stroke", "#3E2723");
        line1.setAttribute("stroke-width", "3");
        line1.setAttribute("fill", "none");
        line1.setAttribute("opacity", "0.9");
        line1.setAttribute("stroke-dasharray", "0 2000");
        svg.appendChild(line1);

        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line2.setAttribute("d", `M 0 ${lineY} Q ${lineX - 50} ${lineY - 90} 2000 ${lineY}`);
        line2.setAttribute("stroke", "#3E2723");
        line2.setAttribute("stroke-width", "3");
        line2.setAttribute("fill", "none");
        line2.setAttribute("opacity", "0.9");
        line2.setAttribute("stroke-dasharray", "0 2000");
        svg.appendChild(line2);

        const line3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line3.setAttribute("d", `M 0 ${lineY + 20} Q ${lineX - 50} ${lineY - 70} 2000 ${lineY + 20}`);
        line3.setAttribute("stroke", "#3E2723");
        line3.setAttribute("stroke-width", "3");
        line3.setAttribute("fill", "none");
        line3.setAttribute("opacity", "0.9");
        line3.setAttribute("stroke-dasharray", "0 2000");
        svg.appendChild(line3);
        
        const updateLinePositions = () => {
            const treeCoords = [10.13, 2.52];
            const treePoint = map.project(treeCoords);
            
            const lineX = treePoint.x - 5;
            const lineY = treePoint.y - 55;
            
            if (line1) {
                line1.setAttribute("d", `M 0 ${lineY - 20} Q ${lineX - 50} ${lineY - 110} 2000 ${lineY - 20}`);
            }
            if (line2) {
                line2.setAttribute("d", `M 0 ${lineY} Q ${lineX - 50} ${lineY - 90} 2000 ${lineY}`);
            }
            if (line3) {
                line3.setAttribute("d", `M 0 ${lineY + 20} Q ${lineX - 50} ${lineY - 70} 2000 ${lineY + 20}`);
            }
        };

        const moveListener = () => {
            if (activeChapterName === 'guyana-3') {
                updateLinePositions();
            }
        };
        map.on('move', moveListener);
        map.on('resize', moveListener);

        setTimeout(() => {
            line1.animate([
                { strokeDasharray: "0 2000" },
                { strokeDasharray: "2000 0" }
            ], {
                duration: 1500,
                fill: "forwards"
            });

            line2.animate([
                { strokeDasharray: "0 2000" },
                { strokeDasharray: "2000 0" }
            ], {
                duration: 1500,
                fill: "forwards"
            });

            line3.animate([
                { strokeDasharray: "0 2000" },
                { strokeDasharray: "2000 0" }
            ], {
                duration: 1500,
                fill: "forwards"
            });
        }, 100);
    }

    // Add animated curved line for intermediary-countries-cameroon
    if (chapterName === 'intermediary-countries-cameroon') {
        let curvedLine = null;
        let animationStarted = false;
        
        function drawCurvedLine() {
            const svg = document.querySelector('#svg-overlay svg');
            if (!svg) {
                return;
            }
            
            const doualaCoords = [9.7, 4.05];
            const rotterdamCoords = [4.5, 51.9];
            
            const doualaPoint = map.project(doualaCoords);
            const rotterdamPoint = map.project(rotterdamCoords);
            
            const midX = (doualaPoint.x + rotterdamPoint.x) / 2 + 150;
            const midY = (doualaPoint.y + rotterdamPoint.y) / 2 - 200;
            
            if (curvedLine) {
                svg.removeChild(curvedLine);
                curvedLine = null;
            }
            
            curvedLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
            curvedLine.setAttribute("d", `M ${doualaPoint.x} ${doualaPoint.y} Q ${midX} ${midY} ${rotterdamPoint.x} ${rotterdamPoint.y}`);
            curvedLine.setAttribute("stroke", "#FFA500");
            curvedLine.setAttribute("stroke-width", "2");
            curvedLine.setAttribute("fill", "none");
            curvedLine.setAttribute("opacity", "1");
            curvedLine.setAttribute("stroke-linecap", "round");
            curvedLine.setAttribute("stroke-dasharray", "0 1000");
            svg.appendChild(curvedLine);
            
            if (!animationStarted) {
                animationStarted = true;
                curvedLine.animate([
                    { strokeDasharray: "0 1000" },
                    { strokeDasharray: "1000 0" }
                ], {
                    duration: 1000,
                    fill: "forwards"
                });
            }
        }
        
        // Start line animation 2 seconds after map begins to move
        setTimeout(() => {
            if (activeChapterName === 'intermediary-countries-cameroon' && !animationStarted) {
                drawCurvedLine();
            }
        }, 2000);
        
        map.on('move', function() {
            if (curvedLine && activeChapterName === 'intermediary-countries-cameroon') {
                const doualaCoords = [9.7, 4.05];
                const rotterdamCoords = [4.5, 51.9];
                const doualaPoint = map.project(doualaCoords);
                const rotterdamPoint = map.project(rotterdamCoords);
                const midX = (doualaPoint.x + rotterdamPoint.x) / 2 + 150;
                const midY = (doualaPoint.y + rotterdamPoint.y) / 2 - 200;
                
                curvedLine.setAttribute("d", `M ${doualaPoint.x} ${doualaPoint.y} Q ${midX} ${midY} ${rotterdamPoint.x} ${rotterdamPoint.y}`);
            }
        });
    }

    // Add animated lines for intermediary-countries-guyana step
    if (chapterName === 'intermediary-countries-guyana') {
        let lines = [];
        let animationStarted = false;
        
        function drawContractorLines() {
            const svg = document.querySelector('#svg-overlay svg');
            if (!svg) {
                return;
            }
            
            const georgetownCoords = [-58.1553, 6.8013];
            const panamaCoords = [-80.0, 9.0];
            const jamaicaCoords = [-77.0, 17.9];
            const trinidadCoords = [-61.5, 10.4];
            
            const georgetownPoint = map.project(georgetownCoords);
            const panamaPoint = map.project(panamaCoords);
            const jamaicaPoint = map.project(jamaicaCoords);
            const trinidadPoint = map.project(trinidadCoords);
            
            lines.forEach(line => {
                if (line && svg.contains(line)) {
                    svg.removeChild(line);
                }
            });
            lines = [];
            
            const destinations = [
                { coords: panamaCoords, point: panamaPoint, color: '#FFA500' },
                { coords: jamaicaCoords, point: jamaicaPoint, color: '#FFA500' },
                { coords: trinidadCoords, point: trinidadPoint, color: '#FFA500' }
            ];
            
            destinations.forEach((dest, index) => {
                const midX = (georgetownPoint.x + dest.point.x) / 2;
                const midY = (georgetownPoint.y + dest.point.y) / 2 - 100;
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                line.setAttribute("d", `M ${georgetownPoint.x} ${georgetownPoint.y} Q ${midX} ${midY} ${dest.point.x} ${dest.point.y}`);
                line.setAttribute("stroke", dest.color);
                line.setAttribute("stroke-width", "2");
                line.setAttribute("fill", "none");
                line.setAttribute("opacity", "1");
                line.setAttribute("stroke-linecap", "round");
                line.setAttribute("stroke-dasharray", "0 1000");
                svg.appendChild(line);
                
                lines.push(line);
            });
            
            if (!animationStarted) {
                animationStarted = true;
                lines.forEach((line, index) => {
                    setTimeout(() => {
                        line.animate([
                            { strokeDasharray: "0 1000" },
                            { strokeDasharray: "1000 0" }
                        ], {
                            duration: 1000,
                            fill: "forwards"
                        });
                    }, index * 200);
                });
            }
        }
        
        map.once('moveend', () => {
            setTimeout(drawContractorLines, 50);
        });
        
        map.on('move', function() {
            if (lines.length > 0 && activeChapterName === 'intermediary-countries-guyana') {
                const georgetownCoords = [-58.1553, 6.8013];
                const panamaCoords = [-80.0, 9.0];
                const jamaicaCoords = [-77.0, 17.9];
                const trinidadCoords = [-61.5, 10.4];
                
                const georgetownPoint = map.project(georgetownCoords);
                const panamaPoint = map.project(panamaCoords);
                const jamaicaPoint = map.project(jamaicaCoords);
                const trinidadPoint = map.project(trinidadCoords);
                
                const destinations = [
                    { coords: panamaCoords, point: panamaPoint },
                    { coords: jamaicaCoords, point: jamaicaPoint },
                    { coords: trinidadCoords, point: trinidadPoint }
                ];
                
                destinations.forEach((dest, index) => {
                    if (lines[index]) {
                        const midX = (georgetownPoint.x + dest.point.x) / 2;
                        const midY = (georgetownPoint.y + dest.point.y) / 2 - 100;
                        
                        lines[index].setAttribute("d", `M ${georgetownPoint.x} ${georgetownPoint.y} Q ${midX} ${midY} ${dest.point.x} ${dest.point.y}`);
                    }
                });
            }
        });
    }

    // Clear SVG overlay when not on steps that need it
    if (chapterName !== 'guyana-3' && chapterName !== 'intermediary-countries-cameroon' && chapterName !== 'intermediary-countries-guyana' && chapterName !== 'new-york-2' && chapterName !== 'new-york-final') {
        const svg = document.querySelector('#svg-overlay svg');
        if (svg) {
            svg.innerHTML = '';
        }
    }

    // Show labels directly on new-york-2 and final step (no fade-in animation)
    if (chapterName === 'new-york-2' || chapterName === 'new-york-final') {
        if (map.getLayer('brooklyn-bridge-label')) {
            map.setPaintProperty('brooklyn-bridge-label', 'text-opacity', 1);
        }
        if (map.getLayer('nyc-subway-label')) {
            map.setPaintProperty('nyc-subway-label', 'text-opacity', 1);
        }
        if (map.getLayer('sif-terminals-labels')) {
            map.setPaintProperty('sif-terminals-labels', 'text-opacity', 1);
        }
    }

    // Start or stop rotation
    if (chapterName === 'world' || chapterName === 'world-prohibition') {
        console.log('Starting world rotation for chapter:', chapterName);
        activeChapterName = chapterName; // Set this before starting rotation
        startWorldRotation();
    } else {
        console.log('Stopping world rotation for chapter:', chapterName);
        stopWorldRotation();
    }

    activeChapterName = chapterName;

    // Additional tree opacity control for guyana-3
    if (chapterName === 'guyana-3') {
        if (map.getLayer('central-tree')) {
            map.setPaintProperty('central-tree', 'icon-opacity', 0);
        }
        for (let i = 0; i < 11; i++) {
            if (map.getLayer(`surrounding-tree-${i}`)) {
                map.setPaintProperty(`surrounding-tree-${i}`, 'icon-opacity', 0);
            }
        }
    } else if (chapterName !== 'guyana-2') {
        if (map.getLayer('central-tree')) {
            map.setLayoutProperty('central-tree', 'visibility', 'none');
        }
        for (let i = 0; i < 11; i++) {
            if (map.getLayer(`surrounding-tree-${i}`)) {
                map.setLayoutProperty(`surrounding-tree-${i}`, 'visibility', 'none');
            }
        }
    }
}

// Export functions for use in the main script
window.initializeMapFromJS = initializeMap;
window.setActiveChapter = setActiveChapter;