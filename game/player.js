class Player {

    constructor({
        life,
        speed,
        damage,
        fireRate
    }) {
        this.position = createVector(innerWidth / 2, innerHeight / 2);
        this.velocity = createVector(0, 0);
        this.lookAngle = 0;
        this.originalLife = this.life = life;
        this.speed = speed;
        this.damage = damage;
        this.fireRate = fireRate;
        this.fireCooldown = 0;
        this.size = createVector(36, 36);

        this.takeDamageEffect = 0;
    }


    display() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.lookAngle);
        fill(this.takeDamageEffect > 0 ? color(252, 120, 120) : 200);
        // strokeWeight(3);
        // stroke(0);
        triangle(0, -18, -18, 18, 18, 18);
        pop();
    }

    takeDamage(damage) {
        this.takeDamageEffect = 6;
        this.life -= damage;
    }

    update() {
        this.lookAtMouse();
        this.handleMovement();
        this.velocity.normalize().mult(this.speed);

        Matter.Body.setVelocity(this.body, Matter.Vector.create(this.velocity.x, this.velocity.y));

        this.position = createVector(this.body.position.x, this.body.position.y);

        this.fireCooldown--;
        this.takeDamageEffect--;
    }

    fire() {
        if (mouseIsPressed && this.fireCooldown <= 0) {
            this.fireCooldown = this.fireRate;
            const bulletSpeed = 14;
            const bulletVel = p5.Vector.fromAngle(this.lookAngle - (Math.PI / 2)).mult(bulletSpeed);
            const bullet = new Bullet({
                position: this.position.copy(),
                velocity: bulletVel,
                damage: this.damage,
                bulletType: BulletType.BULLET_1,
                size: createVector(12, 12)
            });

            return bullet;
        }

        return null;
    }

    handleMovement() {
        this.velocity = createVector(0, 0);

        // Left
        if (keyIsDown(65) || keyIsDown(97)) {
            this.velocity.x = -1;
        } else if (keyIsDown(68) || keyIsDown(100)) { // Right
            this.velocity.x = 1;
        }


        if (keyIsDown(87) || keyIsDown(119)) {
            this.velocity.y = -1;
        } else if (keyIsDown(83) || keyIsDown(115)) {
            this.velocity.y = 1;
        }
    }

    lookAtMouse() {
        const mousePos = createVector(mouseX, mouseY);
        const targetVelocity = mousePos.sub(this.position);
        this.lookAngle = Math.atan2(targetVelocity.y, targetVelocity.x) + (Math.PI / 2);
    }

}