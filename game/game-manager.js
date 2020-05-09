class GameManager {

    constructor() {
        this.initSoundManager();
        this.initWorld();
        this.initPlayer();
        this.initEnemies();
        this.initBullets();
        this.initParticleSystems();

        this.score = 0;
    }

    initWorld() {
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.world.gravity.y = 0;
        Matter.Engine.run(this.engine);
    }

    initPlayer() {
        const options = {
            life: 100,
            speed: 6,
            damage: 10,
            fireRate: 10

        }
        this.player = new Player(options);
        this.player.body = Matter.Bodies.rectangle(this.player.position.x, this.player.position.y, 36, 36);
        Matter.World.add(this.world, this.player.body);
    }

    initParticleSystems() {
        this.particleSystems = [];
    }

    renderParticleSystems() {
        this.particleSystems = this.particleSystems.filter(ps => {
            ps.render();

            return !ps.isDead();
        });
    }

    initEnemies() {
        this.maxEnemyInGame = 10;
        this.generateEnemyInterval = 80;

        this.enemies = [];

        for (let i = 0; i < 5; i++) {
            const enemy = new EnemyFollow({
                life: 50,
                damage: 10,
                speed: 2.5,
                position: createVector(random(100, innerWidth - 100), random(100, innerHeight - 100)),
                size: createVector(35, 35),
                player: this.player,
                attackRate: 60
            });

            enemy.body = Matter.Bodies.rectangle(enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);

            Matter.World.add(this.world, enemy.body);
            this.enemies.push(enemy);
        }
    }

    renderEnemies() {
        this.generateEnemies();

        this.enemies = this.enemies.filter(enemy => {
            enemy.update();
            enemy.display();

            if (enemy.attackCooldown <= 0 && enemy.collidesWith(this.player)) {
                enemy.attackCooldown = enemy.attackRate;

                this.player.takeDamage(enemy.damage);

                const lifePercentage = this.player.life / this.player.originalLife * 100;

                document.querySelector('#life').style.width = `${lifePercentage}%`;
            }

            if (enemy.isDead()) {
                this.soundManager.playSound('enemyExplode');
                this.score += 10;

                document.querySelector('#score').innerHTML = this.score;

                const particleSystems = new ParticleSystem({
                    count: 10,
                    cols: [color(230, 230, 230), color(236, 32, 40)],
                    shape: 'rect',
                    size: createVector(30, 30),
                    life: 70,
                    position: enemy.position.copy()
                });

                this.particleSystems.push(particleSystems);

                Matter.World.remove(this.world, enemy.body);
                return false;
            }

            return true;
        });
    }

    generateEnemies() {

        if (this.enemies.length < this.maxEnemyInGame && frameCount % this.generateEnemyInterval === 0) {
            const enemy = new EnemyFollow({
                life: 50,
                damage: 10,
                speed: 2.5,
                position: createVector(random(100, innerWidth - 100), random(100, innerHeight - 100)),
                size: createVector(35, 35),
                player: this.player,
                attackRate: 60
            });

            enemy.body = Matter.Bodies.rectangle(enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);

            Matter.World.add(this.world, enemy.body);
            this.enemies.push(enemy);
        }

    }

    initSoundManager() {
        this.soundManager = new SoundManager();
    }

    initBullets() {
        this.playerBullets = [];
    }

    renderBullets() {
        this.playerBullets = this.playerBullets.filter(bullet => {
            bullet.update();
            bullet.display();

            this.enemies.forEach(enemy => {
                if (!bullet.hasCollided) {
                    if (bullet.collidesWith(enemy)) {
                        bullet.hasCollided = true;
                        enemy.takeDamage(bullet.damage);

                        const particleSystems = new ParticleSystem({
                            count: 7,
                            cols: [color(35, 242, 200), color(35, 200, 242)],
                            shape: 'rect',
                            size: createVector(10, 10),
                            life: 50,
                            position: bullet.position.copy()
                        });

                        this.particleSystems.push(particleSystems);
                    }
                }
            });


            return !bullet.isOutBounds() && !bullet.hasCollided;
        })
    }

    restartGame() {
        this.enemies.forEach(enemy => {
            Matter.World.remove(this.world, enemy.body);
        });
        this.initPlayer();

        this.initParticleSystems();
        this.initEnemies();
        this.score = 0;

        document.querySelector('#score').innerHTML = this.score;
        document.querySelector('#life').style.width = '100%';
    }

    renderPlayer() {
        this.player.update();
        this.player.display();

        const bullet = this.player.fire();
        if (bullet) {
            this.soundManager.playSound('playerShoot');
            this.playerBullets.push(bullet);
        }

        if (this.player.life <= 0) {
            this.restartGame();
        }
    }

    render() {
        this.renderBullets();
        this.renderPlayer();
        this.renderEnemies();
        this.renderParticleSystems();
    }

}