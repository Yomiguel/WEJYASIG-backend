const aqi = (concentration) => {

    const aqiRange = [
        0,
        50,
        100,
        150,
        200,
        300,
        400,
        500
    ]
    
    const concentrationRange = [
        0,
        15.4,
        40.4,
        65.4,
        150.4,
        250.4,
        350.4,
        500.4
    ]

    for(let element in concentrationRange) {
        if(concentrationRange[element] < concentration && concentration <= concentrationRange[element + 1]) {
            return ((aqiRange[element + 1] - aqiRange[element]) / ((concentrationRange[element + 1]) - (concentrationRange[element]))) * (concentration - concentrationRange[element]) + aqiRange[element];
        }
    }
}