window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const tooltip = document.getElementById('tooltip');
    const engine = new BABYLON.Engine(canvas, true);

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
        mercury: {
            name: "Mercury",
            facts: {
                type: "Terrestrial Planet",
                diameter: "4,879 kilometers",
                mass: "3.285 × 10^23 kg",
                distanceFromSun: "57.9 million kilometers",
                orbitalPeriod: "88 days",
                dayLength: "176 Earth days",
                atmosphere: "Extremely thin (exosphere)",
                temperature: "-180°C to 430°C",
                interesting: "Smallest planet in our solar system"
            }
        },
        venus: {
            name: "Venus",
            facts: {
                type: "Terrestrial Planet",
                diameter: "12,104 kilometers",
                mass: "4.867 × 10^24 kg",
                distanceFromSun: "108.2 million kilometers",
                orbitalPeriod: "225 days",
                dayLength: "243 Earth days",
                atmosphere: "96% Carbon Dioxide",
                temperature: "462°C (average)",
                interesting: "Hottest planet due to extreme greenhouse effect"
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
        mars: {
            name: "Mars",
            facts: {
                type: "Terrestrial Planet",
                diameter: "6,779 kilometers",
                mass: "6.39 × 10^23 kg",
                distanceFromSun: "227.9 million kilometers",
                orbitalPeriod: "687 days",
                dayLength: "24 hours, 37 minutes",
                atmosphere: "95% Carbon Dioxide",
                moons: "2 (Phobos and Deimos)",
                temperature: "-63°C (average)",
                interesting: "Has the largest volcano in the solar system"
            }
        },
        jupiter: {
            name: "Jupiter",
            facts: {
                type: "Gas Giant",
                diameter: "139,820 kilometers",
                mass: "1.898 × 10^27 kg",
                distanceFromSun: "778.5 million kilometers",
                orbitalPeriod: "11.9 years",
                dayLength: "9.9 hours",
                atmosphere: "90% Hydrogen, 10% Helium",
                moons: "79 known moons",
                temperature: "-110°C (cloud top)",
                interesting: "Great Red Spot is a storm lasting over 400 years"
            }
        },
        saturn: {
            name: "Saturn",
            facts: {
                type: "Gas Giant",
                diameter: "116,460 kilometers",
                mass: "5.683 × 10^26 kg",
                distanceFromSun: "1.434 billion kilometers",
                orbitalPeriod: "29.5 years",
                dayLength: "10.7 hours",
                atmosphere: "96% Hydrogen, 3% Helium",
                moons: "82 known moons",
                rings: "Main rings span 7,000 to 80,000 km above equator",
                interesting: "Only planet with prominent, visible rings"
            }
        },
        uranus: {
            name: "Uranus",
            facts: {
                type: "Ice Giant",
                diameter: "50,724 kilometers",
                mass: "8.681 × 10^25 kg",
                distanceFromSun: "2.871 billion kilometers",
                orbitalPeriod: "84 years",
                dayLength: "17.2 hours",
                atmosphere: "83% Hydrogen, 15% Helium, 2% Methane",
                moons: "27 known moons",
                temperature: "-224°C (average)",
                interesting: "Rotates on its side with an axial tilt of 98 degrees"
            }
        },
        neptune: {
            name: "Neptune",
            facts: {
                type: "Ice Giant",
                diameter: "49,244 kilometers",
                mass: "1.024 × 10^26 kg",
                distanceFromSun: "4.495 billion kilometers",
                orbitalPeriod: "165 years",
                dayLength: "16.1 hours",
                atmosphere: "80% Hydrogen, 19% Helium, 1% Methane",
                moons: "14 known moons",
                temperature: "-214°C (average)",
                interesting: "Has the strongest winds in the solar system"
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
        camera.lowerRadiusLimit = 10;
        camera.upperRadiusLimit = 400;
        camera.wheelPrecision = 50;
        camera.pinchPrecision = 50;
        camera.angularSensibilityX = 2000;
        camera.angularSensibilityY = 2000;

        const loadHighResTexture = (planetName) => {
            const highResTextures = {
                mercury: "https://www.solarsystemscope.com/textures/download/8k_mercury.jpg",
                venus: "https://www.solarsystemscope.com/textures/download/8k_venus_atmosphere.jpg",
                earth: "https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg",
                mars: "https://www.solarsystemscope.com/textures/download/8k_mars.jpg",
                jupiter: "https://www.solarsystemscope.com/textures/download/8k_jupiter.jpg",
                saturn: "https://www.solarsystemscope.com/textures/download/8k_saturn.jpg",
                uranus: "https://www.solarsystemscope.com/textures/download/8k_uranus.jpg",
                neptune: "https://www.solarsystemscope.com/textures/download/8k_neptune.jpg"
            };

            if (highResTextures[planetName]) {
                const texture = new BABYLON.Texture(highResTextures[planetName], scene);
                texture.onLoadObservable.add(() => {
                    const material = planets[planetName].material;
                    material.diffuseTexture.dispose();
                    material.diffuseTexture = texture;
                });
            }
        };

        const light = new BABYLON.PointLight(
            "sunLight",
            BABYLON.Vector3.Zero(),
            scene
        );
        light.intensity = 2;

        const envTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/space", scene);
        scene.environmentTexture = envTexture;
        scene.createDefaultSkybox(envTexture, true, 1000);

        const createOrbitLine = (radius, planetName) => {
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
            const orbit = BABYLON.MeshBuilder.CreateLines("orbit-" + planetName, { points: points }, scene);
            orbit.color = new BABYLON.Color3(0.4, 0.4, 0.4);
            orbit.alpha = 0.3;
            orbit.isPickable = true;

            // Create orbit visualization material
            const orbitMaterial = new BABYLON.StandardMaterial("orbitMaterial-" + planetName, scene);
            orbitMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.6, 1.0);
            orbitMaterial.alpha = 0.3;
            orbit.material = orbitMaterial;

            orbit.actionManager = new BABYLON.ActionManager(scene);
            orbit.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOverTrigger,
                    () => {
                        orbit.color = new BABYLON.Color3(0.6, 0.8, 1.0);
                        orbit.alpha = 0.8;

                        // Show orbital info in tooltip
                        const planetData = celestialBodies[planetName].facts;
                        const orbitInfo = `
                            <strong>${planetName.charAt(0).toUpperCase() + planetName.slice(1)}'s Orbit</strong>
                            <div><span class="fact-label">Distance from Sun:</span> ${planetData.distanceFromSun}</div>
                            <div><span class="fact-label">Orbital Period:</span> ${planetData.orbitalPeriod}</div>
                        `;
                        tooltip.style.display = 'block';
                        tooltip.innerHTML = orbitInfo;
                    }
                )
            );

            orbit.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOutTrigger,
                    () => {
                        orbit.color = new BABYLON.Color3(0.4, 0.4, 0.4);
                        orbit.alpha = 0.3;
                        tooltip.style.display = 'none';
                    }
                )
            );

            return orbit;
        };

        const zoomToPlanet = (targetMesh, distance) => {
            const targetPosition = targetMesh.getAbsolutePosition();
            BABYLON.Animation.CreateAndStartAnimation(
                "cameraZoom",
                camera,
                "target",
                30,
                60,
                camera.target,
                targetPosition,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            BABYLON.Animation.CreateAndStartAnimation(
                "cameraPosition",
                camera,
                "radius",
                30,
                60,
                camera.radius,
                distance,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        };

        const createPlanetMaterial = (name, textureUrl) => {
            const material = new BABYLON.StandardMaterial(name + "Material", scene);
            material.diffuseTexture = new BABYLON.Texture(textureUrl, scene);
            material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            material.specularPower = 16;
            return material;
        };

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

        const planetData = {
            mercury: { diameter: 3, distance: 30, speed: 0.08, texture: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg" },
            venus: { diameter: 4.5, distance: 40, speed: 0.07, texture: "https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg" },
            earth: { diameter: 5, distance: 50, speed: 0.06, texture: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg" },
            mars: { diameter: 4, distance: 60, speed: 0.05, texture: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg" },
            jupiter: { diameter: 15, distance: 80, speed: 0.04, texture: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg" },
            saturn: { diameter: 12, distance: 100, speed: 0.03, texture: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg" },
            uranus: { diameter: 8, distance: 120, speed: 0.02, texture: "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg" },
            neptune: { diameter: 7.5, distance: 140, speed: 0.01, texture: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg" }
        };

        const planets = {};
        const orbits = {};
        for (let planetName in planetData) {
            const data = planetData[planetName];
            const material = createPlanetMaterial(planetName, data.texture);

            const planet = BABYLON.MeshBuilder.CreateSphere(
                planetName,
                { diameter: data.diameter, segments: 32 },
                scene
            );
            planet.material = material;
            planet.position = new BABYLON.Vector3(data.distance, 0, 0);
            planets[planetName] = planet;

            planet.actionManager = new BABYLON.ActionManager(scene);
            planet.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    () => {
                        zoomToPlanet(planet, data.diameter * 3);
                        loadHighResTexture(planetName);
                    }
                )
            );


            // Create and store orbit
            const orbit = createOrbitLine(data.distance, planetName);
            orbits[planetName] = orbit;
        }

        const saturnRings = BABYLON.MeshBuilder.CreateTorus(
            "saturnRings",
            { diameter: 20, thickness: 0.3, tessellation: 64 },
            scene
        );
        const ringsTexture = new BABYLON.Texture(
            "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png",
            scene
        );
        const ringsMaterial = new BABYLON.StandardMaterial("saturnRingsMaterial", scene);
        ringsMaterial.diffuseTexture = ringsTexture;
        ringsMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        saturnRings.material = ringsMaterial;
        saturnRings.parent = planets.saturn;
        saturnRings.rotation.x = Math.PI / 3;

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

        const earthOrbit = createOrbitLine(50, "earth");
        earthOrbit.color = new BABYLON.Color3(0.4, 0.4, 0.4);

        const moonOrbitHolder = new BABYLON.TransformNode("moonOrbitHolder");
        moonOrbitHolder.position = planets.earth.position;
        const moonOrbit = createOrbitLine(8, "moon");
        moonOrbit.parent = moonOrbitHolder;
        moonOrbit.color = new BABYLON.Color3(0.4, 0.4, 0.4);

        let angle = 0;
        scene.registerBeforeRender(function() {
            for (let planetName in planets) {
                const planet = planets[planetName];
                const data = planetData[planetName];
                planet.position.x = Math.cos(angle * data.speed) * data.distance;
                planet.position.z = Math.sin(angle * data.speed) * data.distance;
                planet.rotation.y += 0.02;
            }

            saturnRings.position = planets.saturn.position;

            planets.earth.position.x = Math.cos(angle) * 50;
            planets.earth.position.z = Math.sin(angle) * 50;
            planets.earth.rotation.y += 0.02;

            moonOrbitHolder.position = planets.earth.position;
            moonOrbitHolder.rotation.y = angle;
            moon.position.x = planets.earth.position.x + Math.cos(angle * 4) * 8;
            moon.position.z = planets.earth.position.z + Math.sin(angle * 4) * 8;
            moon.rotation.y += 0.01;

            sun.rotation.y += 0.005;

            angle += 0.02;
        });

        const gl = new BABYLON.GlowLayer("glow", scene, {
            mainTextureFixedSize: 512,
            blurKernelSize: 64
        });
        gl.intensity = 0.7;

        const constellationMeshes = {};
        for (let id in constellations) {
            const constellation = constellations[id];
            const starMeshes = [];

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

                const glowLayer = new BABYLON.GlowLayer(`${id}-glow-${index}`, scene, {
                    mainTextureFixedSize: 256,
                    blurKernelSize: 64
                });
                glowLayer.intensity = 0.5;
                glowLayer.addIncludedOnlyMesh(star);

                starMeshes.push(star);
            });

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

        const numberOfStars = 2000;
        const backgroundStars = [];

        const starMaterial = new BABYLON.StandardMaterial("starMaterial", scene);
        starMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        starMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        starMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

        for (let i = 0; i < numberOfStars; i++) {
            const radius = 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            const star = BABYLON.MeshBuilder.CreateSphere("backgroundStar" + i, {
                diameter: 0.5 + Math.random() * 0.5,
                segments: 4
            }, scene);

            star.position.x = radius * Math.cos(theta) * Math.sin(phi);
            star.position.y = radius * Math.sin(theta) * Math.sin(phi);
            star.position.z = radius * Math.cos(phi);

            const starMaterialInstance = starMaterial.clone("starMaterial" + i);
            star.material = starMaterialInstance;

            const twinkleSpeed = 0.3 + Math.random() * 0.5;
            const initialIntensity = 0.5 + Math.random() * 0.5;

            backgroundStars.push({
                mesh: star,
                material: starMaterialInstance,
                twinkleSpeed: twinkleSpeed,
                timeOffset: Math.random() * Math.PI * 2,
                baseIntensity: initialIntensity
            });
        }

        let time = 0;
        scene.registerBeforeRender(() => {
            time += 0.016;
            backgroundStars.forEach(star => {
                const intensity = star.baseIntensity +
                    Math.sin(time * star.twinkleSpeed + star.timeOffset) * 0.3;
                star.material.emissiveColor = new BABYLON.Color3(
                    intensity,
                    intensity,
                    intensity * 0.9
                );
            });
        });


        const constellationList = document.getElementById('constellationList');
        const constellationPanel = document.getElementById('constellationPanel');
        const constellationTitle = document.getElementById('constellationTitle');
        const constellationStory = document.getElementById('constellationStory');

        let currentConstellation = null;

        constellationList.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const constellationId = event.target.dataset.constellation;

                if (currentConstellation) {
                    constellationMeshes[currentConstellation].stars.forEach(star => star.visibility = 0);
                    constellationMeshes[currentConstellation].lines.forEach(line => line.visibility = 0);
                }

                constellationMeshes[constellationId].stars.forEach(star => star.visibility = 1);
                constellationMeshes[constellationId].lines.forEach(line => line.visibility = 1);

                constellationTitle.textContent = constellations[constellationId].name;
                constellationStory.textContent = constellations[constellationId].story;
                constellationPanel.style.display = 'block';

                currentConstellation = constellationId;
            }
        });

        scene.onPointerMove = function(evt) {
            const pickResult = scene.pick(scene.pointerX, scene.pointerY);

            if (pickResult.hit && celestialBodies[pickResult.pickedMesh.name]) {
                const body = celestialBodies[pickResult.pickedMesh.name];
                const facts = body.facts;

                let tooltipContent = `<strong>${body.name}</strong>`;
                for (let key in facts) {
                    const label = key.charAt(0).toUpperCase() + key.slice(1)
                        .replace(/([A-Z])/g, ' $1`.trim();
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

        canvas.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset View';
        resetButton.className = 'reset-view-button';
        document.body.appendChild(resetButton);

        resetButton.addEventListener('click', () => {
            camera.setPosition(new BABYLON.Vector3(0, 100, 150));
            camera.setTarget(BABYLON.Vector3.Zero());
        });

        // Add orbit toggle button
        const orbitToggleButton = document.createElement('button');
        orbitToggleButton.textContent = 'Toggle Orbits';
        orbitToggleButton.className = 'orbit-toggle-button';
        document.body.appendChild(orbitToggleButton);

        let orbitsVisible = true;
        orbitToggleButton.addEventListener('click', () => {
            orbitsVisible = !orbitsVisible;
            for (let planetName in orbits) {
                orbits[planetName].visibility = orbitsVisible ? 1 : 0;
            }
            orbitToggleButton.textContent = orbitsVisible ? 'Hide Orbits' : 'Show Orbits';
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