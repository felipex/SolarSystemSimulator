window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const tooltip = document.getElementById('tooltip');
    const engine = new BABYLON.Engine(canvas, true);

    // Scientific facts for celestial bodies
    const celestialBodies = {
        sun: {
            name: "The Sun",
            facts: "Type: Yellow Dwarf Star\nDiameter: 1.39 million km\nSurface Temperature: 5,500°C\nAge: 4.6 billion years",
        },
        earth: {
            name: "Earth",
            facts: "Type: Terrestrial Planet\nDiameter: 12,742 km\nOrbital Period: 365.25 days\nMoons: 1\nAtmosphere: 78% Nitrogen, 21% Oxygen",
        },
        moon: {
            name: "The Moon",
            facts: "Type: Natural Satellite\nDiameter: 3,474 km\nOrbital Period: 27.3 days\nDistance from Earth: 384,400 km\nSurface Temperature: -233°C to 123°C",
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

        // Add pointer events for tooltips
        scene.onPointerMove = function(evt) {
            const pickResult = scene.pick(scene.pointerX, scene.pointerY);

            if (pickResult.hit && celestialBodies[pickResult.pickedMesh.name]) {
                const body = celestialBodies[pickResult.pickedMesh.name];
                tooltip.style.display = 'block';
                tooltip.style.left = evt.clientX + 10 + 'px';
                tooltip.style.top = evt.clientY + 10 + 'px';
                tooltip.innerHTML = `<strong>${body.name}</strong><br>${body.facts.replace(/\n/g, '<br>')}`;
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