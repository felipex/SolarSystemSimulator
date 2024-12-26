window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function() {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0, 0, 0);

        // Enhanced Camera with wider view
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            0,
            Math.PI / 3,
            250,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera.attachControl(canvas, true);
        camera.minZ = 0.1;
        camera.maxZ = 3000;
        camera.lowerRadiusLimit = 100;
        camera.upperRadiusLimit = 800;
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
        scene.createDefaultSkybox(envTexture, true, 1500);

        // Create Sun
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

        // Create orbit lines function - Moved before createPlanet
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

        // Planet creation function
        const createPlanet = (name, diameter, texturePath, orbitRadius, rotationSpeed, orbitSpeed) => {
            const material = new BABYLON.StandardMaterial(name + "Material", scene);
            material.diffuseTexture = new BABYLON.Texture(texturePath, scene);
            material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            material.specularPower = 16;

            const planet = BABYLON.MeshBuilder.CreateSphere(
                name,
                { diameter: diameter, segments: 32 },
                scene
            );
            planet.material = material;
            planet.position = new BABYLON.Vector3(orbitRadius, 0, 0);
            planet.rotationSpeed = rotationSpeed;
            planet.orbitSpeed = orbitSpeed;

            // Create orbit line
            const orbitLine = createOrbitLine(orbitRadius);
            orbitLine.color = new BABYLON.Color3(0.4, 0.4, 0.4);

            return planet;
        };

        // Create planets
        const mercury = createPlanet(
            "mercury",
            2.5,
            "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
            30,
            0.015,
            0.008
        );

        const venus = createPlanet(
            "venus",
            4,
            "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg",
            40,
            0.012,
            0.006
        );

        const earth = createPlanet(
            "earth",
            5,
            "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
            50,
            0.02,
            0.005
        );

        const mars = createPlanet(
            "mars",
            3.5,
            "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
            65,
            0.018,
            0.004
        );

        const jupiter = createPlanet(
            "jupiter",
            15,
            "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
            90,
            0.04,
            0.002
        );

        const saturn = createPlanet(
            "saturn",
            12,
            "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
            120,
            0.038,
            0.001
        );

        // Create Saturn's rings
        const ringMaterial = new BABYLON.StandardMaterial("saturnRingMaterial", scene);
        ringMaterial.diffuseTexture = new BABYLON.Texture(
            "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png",
            scene
        );
        ringMaterial.diffuseTexture.hasAlpha = true;

        const saturnRing = BABYLON.MeshBuilder.CreateDisc(
            "saturnRing",
            { radius: 20, tessellation: 64 },
            scene
        );
        saturnRing.material = ringMaterial;
        saturnRing.parent = saturn;
        saturnRing.rotation.x = Math.PI / 2;
        saturnRing.scaling.y = 0.1;

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

        const moonOrbitHolder = new BABYLON.TransformNode("moonOrbitHolder");
        moonOrbitHolder.position = earth.position;
        const moonOrbit = createOrbitLine(8);
        moonOrbit.parent = moonOrbitHolder;
        moonOrbit.color = new BABYLON.Color3(0.4, 0.4, 0.4);

        // Animation
        let angle = 0;
        scene.registerBeforeRender(function() {
            // Planet orbits and rotations
            [mercury, venus, earth, mars, jupiter, saturn].forEach(planet => {
                planet.position.x = Math.cos(angle * planet.orbitSpeed) * planet.position.length();
                planet.position.z = Math.sin(angle * planet.orbitSpeed) * planet.position.length();
                planet.rotation.y += planet.rotationSpeed;
            });

            // Moon orbit around Earth
            moonOrbitHolder.position = earth.position;
            moonOrbitHolder.rotation.y = angle;
            moon.position.x = earth.position.x + Math.cos(angle * 4) * 8;
            moon.position.z = earth.position.z + Math.sin(angle * 4) * 8;
            moon.rotation.y += 0.01;

            // Sun rotation
            sun.rotation.y += 0.005;

            angle += 0.005;
        });

        // Enhanced Glow effect for Sun
        const gl = new BABYLON.GlowLayer("glow", scene, {
            mainTextureFixedSize: 512,
            blurKernelSize: 64
        });
        gl.intensity = 0.7;

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