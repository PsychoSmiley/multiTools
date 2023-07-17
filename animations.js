function createBubbles() {
    const container = document.querySelector('.bubbles-container');
    const screenSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    const bubbles = [];

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createBubble(x, y, directionX, directionY, size, speed) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        bubble.style.animationDuration = `${speed}s`;
        bubble.style.animationDirection = `${directionY === -1 ? 'reverse' : 'normal'} ${directionX === -1 ? 'reverse' : 'normal'}`;
        bubble.style.setProperty('--translate-x', `${getRandomNumber(5, 15)}px`);
        bubble.style.setProperty('--translate-y', `${getRandomNumber(5, 15)}px`);
        container.appendChild(bubble);

        const newBubble = {
            element: bubble,
            size,
            x,
            y,
            speed,
            directionX,
            directionY,
        };

        bubbles.push(newBubble);
    }

    function moveBubble(bubble) {
        const { size, x, y, speed, directionX, directionY } = bubble;
        let nextX = x + directionX * speed;
        let nextY = y + directionY * speed;

        if (nextX < 0) {
            nextX = 0;
            bubble.directionX = 1;
        } else if (nextX > screenSize.width - size) {
            nextX = screenSize.width - size;
            bubble.directionX = -1;
        }

        if (nextY < 0) {
            nextY = 0;
            bubble.directionY = 1;
        } else if (nextY > screenSize.height - size) {
            nextY = screenSize.height - size;
            bubble.directionY = -1;
        }

        bubble.x = nextX;
        bubble.y = nextY;

        bubble.element.style.left = `${bubble.x}px`;
        bubble.element.style.top = `${bubble.y}px`;

        checkCollision(bubble);
    }

    function checkCollision(bubble1) {
        for (const bubble2 of bubbles) {
            if (bubble1 !== bubble2 && !bubble1.isMerging && !bubble2.isMerging) {
                const distanceX = bubble1.x - bubble2.x;
                const distanceY = bubble1.y - bubble2.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (distance <= bubble1.size && distance <= bubble2.size) {
                    mergeBubbles(bubble1, bubble2);
                    break;
                }
            }
        }
    }

    function mergeBubbles(bubble1, bubble2) {
        bubble1.isMerging = true;
        bubble2.isMerging = true;

        const newSize = bubble1.size + bubble2.size;
        const newX = (bubble1.x + bubble2.x) / 2;
        const newY = (bubble1.y + bubble2.y) / 2;
        const newSpeed = Math.max(bubble1.speed, bubble2.speed);

        createBubble(newX, newY, bubble1.directionX, bubble1.directionY, newSize, newSpeed);

        container.removeChild(bubble1.element);
        container.removeChild(bubble2.element);

        bubbles.splice(bubbles.indexOf(bubble1), 1);
        bubbles.splice(bubbles.indexOf(bubble2), 1);
    }

    function updateBubbles() {
        bubbles.forEach((bubble) => {
            if (!bubble.isMerging) {
                moveBubble(bubble);

                if (bubble.size > 0) {
                    const sizeReductionRate = 0.1 * (1 + bubble.size / 100); // size reduction rate based on current size
                    bubble.size -= sizeReductionRate;
                    bubble.element.style.width = `${bubble.size}px`;
                    bubble.element.style.height = `${bubble.size}px`;
                } else {
                    container.removeChild(bubble.element);
                    bubbles.splice(bubbles.indexOf(bubble), 1);
                }
            }
        });

        requestAnimationFrame(updateBubbles);
    }

    function spawnNewBubble() {
        const side = getRandomNumber(1, 4);
        let x, y, directionX, directionY, size, speed, angle;

        switch (side) {
            case 1: // Top
                x = getRandomNumber(0, screenSize.width);
                y = -getRandomNumber(30, 60);
                directionX = 0;
                directionY = 1;
                break;
            case 2: // Right
                x = screenSize.width;
                y = getRandomNumber(0, screenSize.height);
                directionX = -1;
                directionY = 0;
                break;
            case 3: // Bottom
                x = getRandomNumber(0, screenSize.width);
                y = screenSize.height;
                directionX = 0;
                directionY = -1;
                break;
            case 4: // Left
                x = -getRandomNumber(30, 60);
                y = getRandomNumber(0, screenSize.height);
                directionX = 1;
                directionY = 0;
                break;
        }

        size = getRandomNumber(30, 100);
        speed = getRandomFloat(0.5, 4);
        angle = getRandomFloat(0, Math.PI * 2);
        const directionAngle = Math.atan2(directionY, directionX);
        const randomAngle = getRandomFloat(directionAngle - Math.PI / 4, directionAngle + Math.PI / 4);
        directionX = Math.cos(randomAngle);
        directionY = Math.sin(randomAngle);

        createBubble(x, y, directionX, directionY, size, speed);

        const nextSpawnTime = getRandomNumber(100, 1000);
        setTimeout(spawnNewBubble, nextSpawnTime);
    }

    spawnNewBubble();
    updateBubbles();
}

createBubbles();

document.querySelector('.container').addEventListener('mousemove', e => {
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const maxRotation = 10;
    const transitionDuration = 0.5;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const angleX = -(mouseY - cardCenterY) / (cardRect.height / 2) * maxRotation;
    const angleY = (mouseX - cardCenterX) / (cardRect.width / 2) * maxRotation;

    card.style.transition = 'transform 0.3s ease-out';
    card.style.transform = `rotateY(${angleY}deg) rotateX(${angleX}deg)`;
});

document.querySelector('.container').addEventListener('mouseenter', () => {
    const card = document.querySelector('.card');
    setTimeout(() => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 50);
});

document.querySelector('.container').addEventListener('mouseleave', () => {
    const card = document.querySelector('.card');
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
});
