class Bullet {

    constructor({
        position,
        velocity,
        damage,
        bulletType,
        size
    }) {
        this.position = position;
        this.velocity = velocity;
        this.damage = damage;
        this.bulletType = bulletType;
        this.size = size;

        this.hasCollided = false;
    }

    update() {
        this.position.add(this.velocity);
    }

    isOutBounds() {
        return this.position.x < -100 || this.position.x > innerWidth + 100 ||
            this.position.y < -100 || this.position.y > innerHeight + 100;
    }

    collidesWith(target) {
        return (this.position.x < target.position.x + target.size.x &&
            this.position.x + this.size.x > target.position.x &&
            this.position.y < target.position.y + target.size.y &&
            this.position.y + this.size.y > target.position.y);
    }

    display() {
        switch (this.bulletType) {
            case BulletType.BULLET_1:
                push();
                translate(this.position.x, this.position.y);
                rotate(this.velocity.heading());
                strokeWeight(2);
                stroke(color(35, 242, 200));
                line(0, 0, -20, 0);
                noStroke();
                fill(color(35, 200, 242));
                ellipseMode(CENTER);
                ellipse(0, 0, this.size.x, this.size.y);
                pop();
                break;
        }
    }

}