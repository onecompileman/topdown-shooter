class EnemyFollow {

    constructor({
        life,
        damage,
        speed,
        position,
        size,
        player,
        attackRate
    }) {
        this.life = life;
        this.damage = damage;
        this.speed = speed;
        this.position = position;
        this.size = size;
        this.player = player;
        this.attackRate = attackRate;
        this.attackCooldown = 0;

        this.velocity = createVector(0, 0);
        this.rotation = 0;
        this.takeDamageEffect = 0;
    }


    update() {
        this.follow();
        Matter.Body.setVelocity(this.body, Matter.Vector.create(this.velocity.x, this.velocity.y));

        this.position = createVector(this.body.position.x, this.body.position.y);

        this.attackCooldown--;
        this.takeDamageEffect--;
        this.rotation += 0.2;
    }

    takeDamage(damage) {
        this.takeDamageEffect = 6;
        this.life -= damage;
    }

    isDead() {
        return this.life <= 0;
    }

    follow() {
        this.velocity = this.player.position.copy().sub(this.position);
        this.velocity.normalize().mult(this.speed);
    }

    display() {
        push();
        translate(this.position.x, this.position.y);
        ellipseMode(CENTER);
        rectMode(CENTER);
        rotate(this.rotation);
        fill(220);
        rect(0, 0, this.size.x, this.size.y);
        fill(this.takeDamageEffect > 0 ? color(220, 220, 220) : color(236, 32, 40));
        ellipse(0, 0, this.size.x * 0.8, this.size.y * 0.8);
        pop();
    }

    collidesWith(target) {
        return (this.position.x < target.position.x + target.size.x &&
            this.position.x + this.size.x > target.position.x &&
            this.position.y < target.position.y + target.size.y &&
            this.position.y + this.size.y > target.position.y);
    }


}