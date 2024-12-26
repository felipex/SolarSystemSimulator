window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

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
            "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/frames/730x730_1x1_30p/sun/sun.jpg",
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
            "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/frames/730x730_1x1_30p/earth/earth.jpg",
            scene
        );
        earthMaterial.bumpTexture = new BABYLON.Texture(
            "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/frames/730x730_1x1_30p/earth/earthbump.jpg",
            scene
        );
        earthMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        earthMaterial.bumpTexture.level = 1.0;
        earthMaterial.specularPower = 16;

        const earth = BABYLON.MeshBuilder.CreateSphere(
            "earth",
            { diameter: 5, segments: 32 },
            scene
        );
        earth.material = earthMaterial;
        earth.position = new BABYLON.Vector3(50, 0, 0);

        // Add Earth's atmosphere with improved effect
        const atmosphereMaterial = new BABYLON.StandardMaterial("atmosphereMaterial", scene);
        atmosphereMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.5, 1.0);
        atmosphereMaterial.alpha = 0.2;

        const atmosphere = BABYLON.MeshBuilder.CreateSphere(
            "atmosphere",
            { diameter: 5.5, segments: 32 },
            scene
        );
        atmosphere.material = atmosphereMaterial;
        atmosphere.parent = earth;

        // Create Moon with enhanced material
        const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
        moonMaterial.diffuseTexture = new BABYLON.Texture(
            "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/frames/730x730_1x1_30p/moon/moon.jpg",
            scene
        );
        moonMaterial.bumpTexture = new BABYLON.Texture(
            "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/frames/730x730_1x1_30p/moon/moonbump.jpg",
            scene
        );
        moonMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        moonMaterial.bumpTexture.level = 0.8;

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
        earthOrbit.color = new BABYLON.Color3(0.5, 0.5, 0.5);

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

            moonOrbitHolder.position = earth.position;
            moonOrbitHolder.rotation.y = angle;

            // Moon orbit around Earth
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