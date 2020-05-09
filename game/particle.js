class Particle {

    constructor({
        col,
        shape,
        size,
        life,
        position
    }) {
        this.col = col;
        this.shape = shape;
        this.size = size;
        this.originalLife = this.life = life;
        this.position = position;
        this.velocity = createVector(random(-2, 2), random(-2, 2));
    }

    update() {
        this.life--;
        this.position.add(this.velocity);
    }

    display() {
        push();
        translate(this.position.x, this.position.y);
        ellipseMode(CENTER);
        rectMode(CENTER);
        fill(this.col);

        const lifePercentage = this.life / this.originalLife;

        switch (this.shape) {
            case 'rect':
                rect(0, 0, this.size.x * lifePercentage, this.size.y * lifePercentage);
                break;
            case 'circle':
                ellipse(0, 0, this.size.x * lifePercentage, this.size.y * lifePercentage);
                break;
        }
        pop();
    }

    isDead() {
        return this.life <= 0;
    }

}