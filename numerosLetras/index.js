'use strict';

function numberToWord(numero) {
  var unidad = ['UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  var dv = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE', 'VEINTIÚN', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE'];
  var	decena = ['DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  var	centena = ['CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
  // var	auxiliar = ['UN0', 'VEINTIUNO', 'CIENTO','MIL', 'MILES', 'MILLON', 'MILLONES', 'BILLON', 'BILLONES'];
  var	posicion = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // decena, centena, millar
  var	posicionDv = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
  // var	segmento = 0;

  // el primer segmento si no es igual a tres, lo completo con ceros a la izquierda
  function convierteNumeroLetra(numero) {
    var l = numero.toString().length; // longitud del numero, cantidad de digitos
    var	residuo = l % 3;
    var	primerSegmento = parseFloat(l / 3);
    var	result = '';

    if(residuo === 0) {
      result = procesaNumero(numero);
    } else {
      // calcula la primera posición, si tiene longitud 1 ó 2
      primerSegmento = primerSegmento.toString().split('.');
      primerSegmento = primerSegmento[1].substr(0,2); // consigo únicamente los primeros dos decimales para determinar que segmento es
      primerSegmento = parseInt(primerSegmento);

      if(primerSegmento === 66) { // primer segmento, tiene un conjunto de dos números
        numero = '0' + numero.toString();
        result = procesaNumero(numero);
      } else if (primerSegmento === 33) { // primer segmento, tiene sólo un número
        numero = '00' + numero.toString();
        result = procesaNumero(numero);
      }
    }
    return result;
  }
  // saber a que segmento pertenece: unidad de millar, decena de millar, centena de millar
  function defineSegmento(numero) {
    var flag = 1;
    var	l = numero.toString().length;
    var	arregloNum = [];
    var	escalaNumerica = ['MIL', 'TRILLONES', 'MIL', 'BILLONES', 'MIL', 'MILLONES', 'MIL', 'UNIDAD'];
    var	esNumResultante = [];
    var	validaEscalaNumerica = [];
    var	subnumero = null;
    var	num = '';
    var	result = { arregloNum: null, escalaNumerica: null, validaEscalaNumerica: null };

    for (var i = 0; i < l; i++) {
      subnumero = (numero.toString())[i];
      num = num + subnumero;
      if(flag === 3) { // define el conjunto de 3 números
        // console.log(num);
        (num === '000') ? validaEscalaNumerica.push(true) : validaEscalaNumerica.push(false);
        arregloNum.push(num);
        flag = 1;
        num = '';
      } else {
        flag++;
      }
    }
    // define la escala numérica, dependiendo de la longitud del arreglo de números
    escalaNumerica.reverse();
    for (var i = 0; i < arregloNum.length; i++) {
      esNumResultante.push(escalaNumerica[i]);
    }
    esNumResultante.reverse();
    result = { arregloNum: arregloNum, escalaNumerica: esNumResultante, validaEscalaNumerica: validaEscalaNumerica};
    return result;
  }
  // saber a que unidad pertenece: unidad, decena o centena. Recibirá digitos de 3
  function defineUnidad(numero) {
    var numeroString = numero;
    numero = parseInt(numero);

    var p = '';
    var l  = numero.toString().length;
    var sbnInteger = '';
    var result = '';
    // los digitos son leidos de izquierda a derecha según el conjunto de número
    var primerDigito = parseInt(numero.toString()[0]);
    var segundoDigito = parseInt(numero.toString()[1]);
    var tercerDigito = parseInt(numero.toString()[2]);

    switch(l) {
      case 1: // unidad
        p = posicion.indexOf(numero);
        result = unidad[p];
        break;
      case 2: // decena
        if (numero >= 11 && numero <= 29) {
          p = posicionDv.indexOf(numero);
          result = dv[p];
        } else if(segundoDigito === 0) {
          p = posicion.indexOf(primerDigito);
          result = decena[p];
        } else {
          p = posicion.indexOf(primerDigito);
          result = decena[p];
          p = posicion.indexOf(segundoDigito);
          result = result + ' Y '  + unidad[p];
        }
        break;
      case 3: // centena
        sbnInteger = numero.toString()[1] + numero.toString()[2];
        sbnInteger = parseInt(sbnInteger);
        if(sbnInteger >= '01' && sbnInteger <= '09') {
          result = identificaCientos(primerDigito);
          p = posicion.indexOf(tercerDigito);
          result = result + ' ' + unidad[p];
        } else if(sbnInteger >= 11 && sbnInteger <= 29) { // valido dv
          result = identificaCientos(primerDigito);
          p = posicionDv.indexOf(sbnInteger);
          result = result + ' ' + dv[p];
        } else if(parseInt(sbnInteger.toString()[1]) === 0) { // valido las decenas enteras: 20, 30 ...
          result = identificaCientos(primerDigito);
          p = posicion.indexOf(segundoDigito);
          result = result + ' ' + decena[p];
        } else if(sbnInteger == '00') { // valido las centenas enteras: 100, 200 ...
          p = posicion.indexOf(primerDigito);
          result = centena[p];
        } else {
          result = identificaCientos(primerDigito);
          p = posicion.indexOf(segundoDigito);
          result = result + ' ' + decena[p];
          p = posicion.indexOf(tercerDigito);
          result = result + ' Y '  + unidad[p];
        }
        break;
    }
    return result;
  }
  function identificaCientos(primerDigito) {
    var p = '';
    var result = '';

    if(primerDigito === 1) {
      p = posicion.indexOf(primerDigito);
      // result = auxiliar[2]; // Ciento
      result = 'CIENTO';
    } else {
      p = posicion.indexOf(primerDigito);
      result = centena[p];
    }
    return result;
  }
  // identifica la escala numérica, si la descripcion en letra(numeroEnLetra) es UN; crear subcadena(segmentoEscalaNumerica) y quitar (plural)ES
  function identificaEscalaNumerica(numeroEnLetra, segmentoEscalaNumerica) {
    if(segmentoEscalaNumerica != 'UNIDAD') {
      if(numeroEnLetra === 'UN' && segmentoEscalaNumerica != 'MIL') {
        segmentoEscalaNumerica = numeroEnLetra + ' ' + segmentoEscalaNumerica.substr(0, ((segmentoEscalaNumerica.toString().length) - 2)); // recorto la terminacion ES: MILLONES = MILLON, etc
      } else if(numeroEnLetra === 'UN'  && segmentoEscalaNumerica === 'MIL') {
        segmentoEscalaNumerica = segmentoEscalaNumerica;
      } else {
        segmentoEscalaNumerica = numeroEnLetra + ' ' + segmentoEscalaNumerica;
      }
    } else {
      segmentoEscalaNumerica = numeroEnLetra + ' ' + segmentoEscalaNumerica;
    }
    return segmentoEscalaNumerica;
  }
  function procesaNumero(numero) {
    var objeto = { du: null, en: null };
    var contador = 0;
    var letra = '';
    var subLetra = '';
    var ds = null;

    ds = defineSegmento(numero); // contiene arreglos: arregloNum, escalaNumerica y validaEscalaNumerica
    // console.log('ds: ' + JSON.stringify(ds));

    // implementar si el numero es si el primer segmento es diferente de cero  y los demas igual a cero
    // implementar si el primer segmento igual a 100 o diferente 123 y el ultimo segmento es 001

    (ds.arregloNum).forEach(function(elemento) {
      objeto.du = defineUnidad(elemento); // procesa el número a letra
      objeto.en = ds.escalaNumerica[contador]; // BILLONES, MILLLONES, MIL. Cada segmento de numeros (3)
      // si la descripcion en letra es UN; crear subcadena y quitar (plural)ES
      subLetra = identificaEscalaNumerica(objeto.du, objeto.en);

      // console.log(objeto.du + objeto.en);

      if (contador === 0) { // identifica el primer segmento de 3 digitos
        letra = subLetra;
        // letra = objeto.du + ' ' + objeto.en;
      } else {
        if(typeof objeto.du != 'undefined') {
          letra = letra + ' ' + subLetra;
          // letra = letra + ' ' + objeto.du + ' ' + objeto.en;
        } else {
          if(ds.escalaNumerica[contador-1] === 'MIL' && ds.validaEscalaNumerica[contador-1] === false) {
            letra = letra + ' '  + objeto.en;
          }
        }
      }
      contador++;

    });
    
    var unidad = letra.slice(-6);
    if(unidad === 'UNIDAD') {
      letra = letra.substr(0, ((letra.toString().length) - 7)); // quita la última escala numérica que es UNIDAD
    }
    return letra;
  }

  var resultado = convierteNumeroLetra(numero);
  return resultado;


}


var numero = 300000010001;
console.log(numberToWord(numero));