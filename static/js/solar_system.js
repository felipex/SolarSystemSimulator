window.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    // Create the scene
    const createScene = function() {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0, 0, 0);

        // Camera
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            0,
            Math.PI / 3,
            100,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera.attachControl(canvas, true);
        camera.minZ = 0.1;
        camera.maxZ = 1000;
        camera.lowerRadiusLimit = 50;
        camera.upperRadiusLimit = 300;

        // Lighting
        const light = new BABYLON.PointLight(
            "sunLight",
            BABYLON.Vector3.Zero(),
            scene
        );
        light.intensity = 2;

        // Create Sun
        const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
        sunMaterial.emissiveColor = new BABYLON.Color3(1, 0.7, 0);
        sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        const sun = BABYLON.MeshBuilder.CreateSphere(
            "sun",
            { diameter: 20 },
            scene
        );
        sun.material = sunMaterial;

        // Create Earth
        const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
        earthMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.5, 1);
        earthMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        const earth = BABYLON.MeshBuilder.CreateSphere(
            "earth",
            { diameter: 5 },
            scene
        );
        earth.material = earthMaterial;
        earth.position = new BABYLON.Vector3(50, 0, 0);

        // Create Moon
        const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
        moonMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        moonMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const moon = BABYLON.MeshBuilder.CreateSphere(
            "moon",
            { diameter: 1.5 },
            scene
        );
        moon.material = moonMaterial;
        moon.position = new BABYLON.Vector3(55, 0, 0);

        // Create starfield background
        const starCount = 2000;
        const starsystem = new BABYLON.ParticleSystem("stars", starCount, scene);
        starsystem.particleTexture = new BABYLON.Texture(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oFFAABEbrjeo4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAFklEQVQY02NgYGD4z4AG/jMwMDAzwAQAQ88BHf8P+nAAAAAASUVORK5CYII="
        );
        starsystem.emitter = new BABYLON.SphereParticleEmitter(500);
        starsystem.minEmitPower = 0;
        starsystem.maxEmitPower = 0;
        starsystem.minSize = 0.1;
        starsystem.maxSize = 0.5;
        starsystem.start();

        // Animation
        let angle = 0;
        scene.registerBeforeRender(function() {
            // Earth orbit around Sun
            earth.position.x = Math.cos(angle) * 50;
            earth.position.z = Math.sin(angle) * 50;
            earth.rotation.y += 0.02;

            // Moon orbit around Earth
            moon.position.x = earth.position.x + Math.cos(angle * 4) * 8;
            moon.position.z = earth.position.z + Math.sin(angle * 4) * 8;
            moon.rotation.y += 0.01;

            // Sun rotation
            sun.rotation.y += 0.005;

            angle += 0.005;
        });

        // Glow effect for Sun
        const gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 0.5;

        return scene;
    };

    // Create and run the scene
    const scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
