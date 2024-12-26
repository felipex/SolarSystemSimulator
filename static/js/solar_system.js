window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const tooltip = document.getElementById('tooltip');
    const engine = new BABYLON.Engine(canvas, true);

    // Scientific facts for celestial bodies
    const celestialBodies = {
        sun: {
            name: "The Sun",
            facts: {
                type: "Yellow Dwarf Star (G2V)",
                diameter: "1.39 million kilometers (109× Earth)",
                mass: "1.989 × 10^30 kg (333,000× Earth)",
                surfaceTemp: "5,500°C (photosphere)",
                coreTemp: "15 million°C",
                age: "4.6 billion years",
                composition: "73% Hydrogen, 25% Helium, 2% other elements",
                rotation: "27 days at equator",
                interesting: "Produces energy through nuclear fusion of hydrogen into helium"
            }
        },
        earth: {
            name: "Earth",
            facts: {
                type: "Terrestrial Planet",
                diameter: "12,742 kilometers",
                mass: "5.97 × 10^24 kg",
                distanceFromSun: "149.6 million kilometers (1 AU)",
                orbitalPeriod: "365.25 days",
                dayLength: "23 hours, 56 minutes",
                atmosphere: "78% Nitrogen, 21% Oxygen, 1% other gases",
                moons: "1 (The Moon)",
                avgTemp: "15°C (global average)",
                interesting: "Only known planet with confirmed life"
            }
        },
        moon: {
            name: "The Moon",
            facts: {
                type: "Natural Satellite",
                diameter: "3,474 kilometers",
                mass: "7.34 × 10^22 kg",
                distanceFromEarth: "384,400 kilometers (average)",
                orbitalPeriod: "27.3 days",
                surfaceTemp: "-233°C to 123°C",
                atmosphere: "Extremely thin (exosphere)",
                composition: "Rock and iron-rich core",
                gravity: "1/6 of Earth's gravity",
                interesting: "Same face always points toward Earth (tidally locked)"
            }
        }
    };

    const constellations = {
        'ursa-major': {
            name: 'Ursa Major (Great Bear)',
            story: `The Great Bear constellation tells the story of Callisto, a beautiful nymph who caught the eye of Zeus. 
                   Hera, Zeus's wife, discovered this and in her jealousy transformed Callisto into a bear. 
                   Zeus later placed Callisto in the stars as Ursa Major to honor her. 
                   The constellation's distinctive 'Big Dipper' pattern has been used for navigation throughout history.`,
            stars: [
                [100, 30, 80],   // Dubhe
                [95, 32, 85],    // Merak
                [90, 33, 90],    // Phecda
                [85, 31, 95],    // Megrez
                [80, 35, 100],   // Alioth
                [75, 34, 105],   // Mizar
                [70, 33, 110]    // Alkaid
            ]
        },
        'orion': {
            name: 'Orion (The Hunter)',
            story: `Orion was a giant hunter in Greek mythology, known for his skill and beauty. 
                   According to legend, he was killed by a scorpion sent by Gaia (or in some versions, by Artemis). 
                   Zeus placed him among the stars where he eternally hunts across the night sky. 
                   The distinctive three stars of Orion's Belt make this one of the most recognizable constellations.`,
            stars: [
                [120, 20, -30],  // Betelgeuse
                [125, 15, -25],  // Bellatrix
                [123, 10, -20],  // Alnitak
                [123, 10, -15],  // Alnilam
                [123, 10, -10],  // Mintaka
                [125, 5, -5],    // Saiph
                [120, 5, -35]    // Rigel
            ]
        },
        'cassiopeia': {
            name: 'Cassiopeia (The Queen)',
            story: `Cassiopeia was a vain queen in Greek mythology who boasted that she and her daughter Andromeda were more beautiful than the Nereids. 
                   This angered Poseidon, who sent a sea monster to ravage the coast of her kingdom. 
                   As punishment for her pride, she was placed in the stars on a throne, forced to circle the celestial pole forever. 
                   The constellation forms a distinctive 'W' or 'M' shape in the night sky.`,
            stars: [
                [-90, 40, 70],   // Shedar
                [-85, 45, 65],   // Caph
                [-80, 35, 60],   // Gamma Cas
                [-75, 30, 55],   // Ruchbah
                [-70, 25, 50]    // Segin
            ]
        }
    };

    const createScene = function() {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0, 0, 0);

        // Enhanced Camera
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            0,
            Math.PI / 3,
            150,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera.attachControl(canvas, true);
        camera.minZ = 0.1;
        camera.maxZ = 2000;
        camera.lowerRadiusLimit = 80;
        camera.upperRadiusLimit = 400;
        camera.wheelPrecision = 50;

        // Enhanced Lighting
        const light = new BABYLON.PointLight(
            "sunLight",
            BABYLON.Vector3.Zero(),
            scene
        );
        light.intensity = 2;

        // Environment
        const envTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/space", scene);
        scene.environmentTexture = envTexture;
        scene.createDefaultSkybox(envTexture, true, 1000);

        // Create Sun with enhanced material
        const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
        sunMaterial.emissiveTexture = new BABYLON.Texture(
            "https://www.solarsystemscope.com/textures/download/2k_sun.jpg",
            scene
        );
        sunMaterial.emissiveColor = new BABYLON.Color3(1, 0.8, 0.3);
        sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        const sun = BABYLON.MeshBuilder.CreateSphere(
            "sun",
            { diameter: 20, segments: 32 },
            scene
        );
        sun.material = sunMaterial;

        // Create Earth with enhanced material
        const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
        earthMaterial.diffuseTexture = new BABYLON.Texture(
            "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
            scene
        );
        earthMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        earthMaterial.specularPower = 16;

        const earth = BABYLON.MeshBuilder.CreateSphere(
            "earth",
            { diameter: 5, segments: 32 },
            scene
        );
        earth.material = earthMaterial;
        earth.position = new BABYLON.Vector3(50, 0, 0);

        // Create Moon
        const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
        moonMaterial.diffuseTexture = new BABYLON.Texture(
            "https://www.solarsystemscope.com/textures/download/2k_moon.jpg",
            scene
        );

        const moon = BABYLON.MeshBuilder.CreateSphere(
            "moon",
            { diameter: 1.5, segments: 32 },
            scene
        );
        moon.material = moonMaterial;
        moon.position = new BABYLON.Vector3(55, 0, 0);

        // Create orbit lines
        const createOrbitLine = (radius) => {
            const points = [];
            const segments = 128;
            for (let i = 0; i <= segments; i++) {
                const angle = (i * Math.PI * 2) / segments;
                points.push(new BABYLON.Vector3(
                    radius * Math.cos(angle),
                    0,
                    radius * Math.sin(angle)
                ));
            }
            return BABYLON.MeshBuilder.CreateLines("orbit", { points: points }, scene);
        };

        const earthOrbit = createOrbitLine(50);
        earthOrbit.color = new BABYLON.Color3(0.4, 0.4, 0.4);

        const moonOrbitHolder = new BABYLON.TransformNode("moonOrbitHolder");
        moonOrbitHolder.position = earth.position;
        const moonOrbit = createOrbitLine(8);
        moonOrbit.parent = moonOrbitHolder;
        moonOrbit.color = new BABYLON.Color3(0.4, 0.4, 0.4);

        // Animation
        let angle = 0;
        scene.registerBeforeRender(function() {
            // Earth orbit around Sun
            earth.position.x = Math.cos(angle) * 50;
            earth.position.z = Math.sin(angle) * 50;
            earth.rotation.y += 0.02;

            // Moon orbit around Earth
            moonOrbitHolder.position = earth.position;
            moonOrbitHolder.rotation.y = angle;
            moon.position.x = earth.position.x + Math.cos(angle * 4) * 8;
            moon.position.z = earth.position.z + Math.sin(angle * 4) * 8;
            moon.rotation.y += 0.01;

            // Sun rotation
            sun.rotation.y += 0.005;

            angle += 0.02;
        });

        // Enhanced Glow effect for Sun
        const gl = new BABYLON.GlowLayer("glow", scene, {
            mainTextureFixedSize: 512,
            blurKernelSize: 64
        });
        gl.intensity = 0.7;

        // Create constellation meshes with enhanced visuals
        const constellationMeshes = {};
        for (let id in constellations) {
            const constellation = constellations[id];
            const starMeshes = [];

            // Create stars with enhanced appearance
            constellation.stars.forEach((position, index) => {
                const star = BABYLON.MeshBuilder.CreateSphere(
                    `${id}-star-${index}`,
                    { diameter: 1.2, segments: 16 },
                    scene
                );
                const starMaterial = new BABYLON.StandardMaterial(`${id}-star-material-${index}`, scene);
                starMaterial.emissiveColor = new BABYLON.Color3(0.98, 0.98, 1);
                starMaterial.specularColor = new BABYLON.Color3(0.98, 0.98, 1);
                starMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                star.material = starMaterial;
                star.position = new BABYLON.Vector3(...position);
                star.visibility = 0;

                // Add glow effect to stars
                const glowLayer = new BABYLON.GlowLayer(`${id}-glow-${index}`, scene, {
                    mainTextureFixedSize: 256,
                    blurKernelSize: 64
                });
                glowLayer.intensity = 0.5;
                glowLayer.addIncludedOnlyMesh(star);

                starMeshes.push(star);
            });

            // Create lines with enhanced appearance
            const lines = [];
            for (let i = 0; i < constellation.stars.length - 1; i++) {
                const points = [
                    new BABYLON.Vector3(...constellation.stars[i]),
                    new BABYLON.Vector3(...constellation.stars[i + 1])
                ];
                const line = BABYLON.MeshBuilder.CreateLines(`${id}-line-${i}`, {
                    points: points,
                    updatable: true
                }, scene);
                line.color = new BABYLON.Color3(0.5, 0.7, 1);
                line.alpha = 0.6;
                line.visibility = 0;
                lines.push(line);
            }

            constellationMeshes[id] = { stars: starMeshes, lines: lines };
        }

        // Add constellation interaction
        const constellationList = document.getElementById('constellationList');
        const constellationPanel = document.getElementById('constellationPanel');
        const constellationTitle = document.getElementById('constellationTitle');
        const constellationStory = document.getElementById('constellationStory');

        let currentConstellation = null;

        constellationList.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const constellationId = event.target.dataset.constellation;

                // Hide previously shown constellation
                if (currentConstellation) {
                    constellationMeshes[currentConstellation].stars.forEach(star => star.visibility = 0);
                    constellationMeshes[currentConstellation].lines.forEach(line => line.visibility = 0);
                }

                // Show selected constellation
                constellationMeshes[constellationId].stars.forEach(star => star.visibility = 1);
                constellationMeshes[constellationId].lines.forEach(line => line.visibility = 1);

                // Update panel content
                constellationTitle.textContent = constellations[constellationId].name;
                constellationStory.textContent = constellations[constellationId].story;
                constellationPanel.style.display = 'block';

                currentConstellation = constellationId;
            }
        });

        // Add pointer events for tooltips
        scene.onPointerMove = function(evt) {
            const pickResult = scene.pick(scene.pointerX, scene.pointerY);

            if (pickResult.hit && celestialBodies[pickResult.pickedMesh.name]) {
                const body = celestialBodies[pickResult.pickedMesh.name];
                const facts = body.facts;

                let tooltipContent = `<strong>${body.name}</strong>`;
                for (let key in facts) {
                    const label = key.charAt(0).toUpperCase() + key.slice(1)
                        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                        .trim();
                    tooltipContent += `<div><span class="fact-label">${label}:</span> ${facts[key]}</div>`;
                }

                tooltip.style.display = 'block';
                tooltip.style.left = evt.clientX + 10 + 'px';
                tooltip.style.top = evt.clientY + 10 + 'px';
                tooltip.innerHTML = tooltipContent;
            } else {
                tooltip.style.display = 'none';
            }
        };

        // Hide tooltip when pointer leaves canvas
        canvas.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });


        return scene;
    };

    const scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
});