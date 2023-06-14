document.querySelector('.container').addEventListener('mousemove', e => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    document.querySelector('.card').style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

document.querySelector('.container').addEventListener('mouseenter', e => {
    document.querySelector('.card').style.transition = "none";
});

document.querySelector('.container').addEventListener('mouseleave', e => {
    document.querySelector('.card').style.transition = "all 0.5s ease";
    document.querySelector('.card').style.transform = `rotateY(0deg) rotateX(0deg)`;
});
