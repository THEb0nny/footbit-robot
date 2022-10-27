let x = 0, y = 0, yaw = 0; // Переменные для хранения значений

// Установить ирверсию моторов
const setInvertA = true, setInvertB = true, setInvertC = false;

function holonomicSpeedVectorMove(x: number, y: number, w: number, time?: number) { // x_pow, y_pow
    let F_A = y * -0.58 + x * -0.33 + w * 0.33;
    let F_B = y * 0.58 + x * -0.33 + w * 0.33;
    let F_C = x * 0.68 + w * 0.33;
    if (F_A != 0) servos.P0.run(F_A * (setInvertA ? -1 : 1));
    else servos.P0.stop();
    if (F_B != 0) servos.P1.run(F_B * (setInvertB ? -1 : 1));
    else servos.P1.stop();
    if (F_C != 0) servos.P2.run(F_C * (setInvertC ? -1 : 1));
    else servos.P2.stop();
    pause((time ? time : 1));
}

function holonomicAngleMove(angle: number, speed: number, time?: number) {
    speed = Math.abs(speed);
    angle *= -1; // Инвертируем
    angle += 90; // Смещаем 0 градусов на перед робота
    let angle_inRad = (angle * Math.PI) / 180;
    let x = speed * Math.cos(angle_inRad);
    let y = speed * Math.sin(angle_inRad);
    let x2 = Math.map(x, 0, x, 0, speed);
    let y2 = Math.map(y, 0, y, 0, speed);
    let w = 0;
    holonomicSpeedVectorMove(x, y, w, (time? time : 1));
}

// При получении числа по блютуз
radio.onReceivedValue(function (name, value) {
    if (name == "j1ValX") {
        if (Math.abs(value) > 10) x = value;
        else x = 0;
    } else if (name == "j1ValY") {
        if (Math.abs(value) > 10) y = value;
        else y = 0;
    } else if (name == "j2ValX") {
        if (Math.abs(value) > 10) yaw = value;
        else yaw = 0;
    }
});

function Main() {
    radio.setGroup(252); // Задать номер групового общения
    while (true) {
        holonomicSpeedVectorMove(x, y, yaw, 10);
    }
}

Main(); // Запуск при старте функции