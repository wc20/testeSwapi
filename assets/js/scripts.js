(function () {
    'use strict';

    $(document).ready(function () {
        var urlStarship = "";

        $(".enviar").click(function(){
            //Guarda o valor que o cliente digitou
            var valCliente = $('.valMglt').val();
            if( valCliente < 1) {
                $('.valMglt').addClass('alert-danger');
                return false;
            }else{
                $('.valMglt').removeClass('alert-danger');
            }

            //Insere o load
            loadIn();

            //Limpa o conteudo caso já tenha sido feita alguma busca
            $('#listaNaves').html('');

            
            
            //Salva o número de espaçonaves
            var num = 0;
            var getNumRows = $.get("https://swapi.co/api/starships", function(data, status){
                num = data.count;
            });
            
            
            $.when(getNumRows).then(function( x ) {

                //Defini o número de pages na paginação da api
                var loops = Math.round( num / 10);
                
                //loop que lista aeronaves por page na api
                for( var i = 1; i <= loops; i++ ){
                    $.get("https://swapi.co/api/starships/?page=" + i, function(data, status){

                        //loop que lista aeronaves de cada page
                        for( var c = 0; c < data.results.length; c++){

                            // função que faz o calculo do consumo
                            var consumo = getConsumo(data.results[c].consumables);

                            // função que faz o calculo de quantas paradas serão feitas
                            var mgltTotal = consumoTotal(data.results[c].MGLT, consumo , valCliente );

                            //Testa se tem algum valor dentro do campo de MGLT
                            if(isNaN(mgltTotal))
                                mgltTotal = "Valor MGLT não foi informado!";

                            //template
                            $('#listaNaves').append(
                                "<div class='col-md-6'>" +
									"<div class='card'>" +
										"<h4 class='card-header'> <strong> Espaçonave: </strong> " + data.results[c].name + "</h4>" +
										"<div class='card-body text-left'>" +
                                            "<p class='card-text'> <strong> Paradas: </strong> " + mgltTotal + " </p>" +
                                            "<a href='#' data-nave='"+ data.results[c].url +"' class='btn btn-info open-modal'> Saiba mais sobre a espaçonave </a>" +
										"</div>" +
									"</div>" +
								"</div>"
                            );
                        }
                    });
                }
            });

            //Retira o load
            loadOut();

            //Chamada Modal
            $('#listaNaves').on('click','.open-modal', function(event) {
                event.preventDefault();
                urlStarship = $(this).attr('data-nave');
                $("#modal").iziModal('open');
            });
        });

        //Criação do modal
        $("#modal").iziModal({

            onOpening: function(modal){
                modal.startLoading();

                //Faz a requisição na page da aeronave
                $.get( urlStarship , function(data) {

                    //Template do modal
                    $('#modal-html').html(
                        "<div class='card-header'>" +
				            "<h4> <strong> Nome: </strong> " + data.name + "</h4>" +
                        "</div>" +
                        "<div class='card-body'>"+
                            "<ul>" +
                            "<li class='list-group-item'> <strong> Modelo: </strong>" + data.model + "</li>"+
                            "<li class='list-group-item'> <strong> Frabricante: </strong>" + data.manufacturer + "</li>"+
                            "<li class='list-group-item'> <strong> Comprimento: </strong>" + data.length + "</li>"+
                            "<li class='list-group-item'> <strong> Tripulação : </strong>" + data.crew + "</li>"+
                            "<li class='list-group-item'> <strong> Passageiros : </strong>" + data.passengers + "</li>"+
                            "<li class='list-group-item'> <strong> Velocidade máxima na atmosfera: </strong>" +  data.max_atmosphering_speed + "</li>"+
                            "<li class='list-group-item'> <strong> Capacidade de carga: </strong>" + data.cargo_capacity + "</li>"+
                            "<li class='list-group-item'> <strong> Consumo: </strong>" + data.consumables + "</li>"+
                            "<li class='list-group-item'> <strong> MGLT: </strong>" + data.MGLT + "</li>"+
                        "</div>"
                    );
                    modal.stopLoading();
                });
            }
        });
    });
})();