import * as THREE from 'three';

// Warm "Andean sunset" grade applied to every baked model. (1, 1, 1) = original.
export const WARM_TINT = { r: 1.12, g: 0.93, b: 0.7 };

export default class BakedModel {
    model: LoadedModel;
    texture: LoadedTexture;
    material: THREE.MeshBasicMaterial;

    constructor(model: LoadedModel, texture: LoadedTexture, scale?: number) {
        this.model = model;
        this.texture = texture;

        this.texture.flipY = false;
        this.texture.encoding = THREE.sRGBEncoding;

        // Baked light lives in the texture, so warmth is a colour multiplier.
        // Channels may exceed 1 to compensate for the darkening of G/B.
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            color: new THREE.Color(WARM_TINT.r, WARM_TINT.g, WARM_TINT.b),
        });

        this.model.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (scale) child.scale.set(scale, scale, scale);
                child.material.map = this.texture;
                child.material = this.material;
            }
        });

        return this;
    }

    getModel(): THREE.Group {
        return this.model.scene;
    }
}
