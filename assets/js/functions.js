function getConsumo( arg ){
    var consumo = arg.split(" ");
    var num = parseInt( consumo[0] );
    var days = "";
    var totalDays = 0;
    if( consumo[1] == "days" || consumo[1] == "day" ){
        totalDays = num;
    }else if( consumo[1] == "week" || consumo[1] == "weeks" ){
        totalDays = num * 7;
    }else if( consumo[1] == "month" || consumo[1] == "months" ){
        totalDays = num * 30;
    }else{
        totalDays = num * 365;
    }

    return totalDays;
}

function consumoTotal( mglt, consumo, mgltTotal ){
    var mgltPorDia = mglt * 24;
    var totalConsumido = mgltPorDia * consumo;
    var result = mgltTotal / totalConsumido;

    return  Math.trunc(result);
}

function loadIn(){
    $('.loading').fadeIn();
}

function loadOut(){
    $('.loading').fadeOut();
}