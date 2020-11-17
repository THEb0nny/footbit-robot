let x = 0, y = 0;

function holonomicSpeedVectorMove(x: number, y: number, w: number, time?: number) { // x_pow, y_pow,
    let F_A = y * -0.58 + x * -0.33 + w * 0.33;
    let F_B = y * 0.58 + x * -0.33 + w * 0.33;
    let F_C = x * 0.68 + w * 0.33;
    //motors.mediumA.run(F_A); motors.mediumB.run(F_B); motors.mediumC.run(F_C);
    basic.pause(time);
}

function holonomicAngleMove(angle: number, speed: number, time?: number) {
    speed = Math.abs(speed);
    angle *= -1; // Инвертируем
    angle += 90; // Смещаем 0 градусов на перед робота
    let angle_inRad = (angle * Math.PI) / 180;
    let x = speed * Math.cos(angle_inRad);
    let y = speed * Math.sin(angle_inRad);
    x = Math.map(x, 0, x, 0, speed);
    y = Math.map(y, 0, y, 0, speed);
    let w = 0;
    holonomicSpeedVectorMove(x, y, w, time);
}

function Main() {
    radio.setGroup(252);
    while(true) {
        holonomicAngleMove(45, 50, 1);
        basic.pause(10); // Задержка цикла
    }
}

// Получаем данные с джойстика
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "val_X") x = value;
    else if (name == "val_Y") y = value;
});

Main(); // Запуск при старте функции