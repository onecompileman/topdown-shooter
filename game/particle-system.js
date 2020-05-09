class ParticleSystem {
    constructor({
        count,
        cols,
        shape,
        size,
        life,
        position
    }) {
        this.particles = Array(count).fill(1).map(p => {
            return new Particle({
                col: random(cols),
                shape,
                size,
                life,
                position: position.copy()
            });
        });
    }

    render() {
        this.particles = this.particles.filter(particle => {
            particle.update();
            particle.display();

            return !particle.isDead();
        })
        this.life--;
    }

    isDead() {
        return this.life <= 0;
    }
}