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

        // Create Sun with improved texture
        const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
        sunMaterial.emissiveTexture = new BABYLON.Texture(
            "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/sun.jpg",
            scene
        );
        sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        const sun = BABYLON.MeshBuilder.CreateSphere(
            "sun",
            { diameter: 20, segments: 32 },
            scene
        );
        sun.material = sunMaterial;

        // Create Earth with realistic texture
        const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
        earthMaterial.diffuseTexture = new BABYLON.Texture(
            "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/earth.jpg",
            scene
        );
        earthMaterial.bumpTexture = new BABYLON.Texture(
            "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/earthbump.jpg",
            scene
        );
        earthMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const earth = BABYLON.MeshBuilder.CreateSphere(
            "earth",
            { diameter: 5, segments: 32 },
            scene
        );
        earth.material = earthMaterial;
        earth.position = new BABYLON.Vector3(50, 0, 0);

        // Add Earth's atmosphere
        const atmosphereMaterial = new BABYLON.StandardMaterial("atmosphereMaterial", scene);
        atmosphereMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.7, 1.0);
        atmosphereMaterial.alpha = 0.1;

        const atmosphere = BABYLON.MeshBuilder.CreateSphere(
            "atmosphere",
            { diameter: 5.5, segments: 32 },
            scene
        );
        atmosphere.material = atmosphereMaterial;
        atmosphere.parent = earth;

        // Create Moon with realistic texture
        const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
        moonMaterial.diffuseTexture = new BABYLON.Texture(
            "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/moon.jpg",
            scene
        );
        moonMaterial.bumpTexture = new BABYLON.Texture(
            "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/moonbump.jpg",
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