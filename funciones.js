let numeroDeRedes = 0
const dispositivosRedes = document.querySelector(".dispositivosRedes");
let datosDeRedes = []
let dispositivosConectados = []
let ordered = []
let potencias = []
let array255 = [1, 2, 4, 8, 16, 32, 64, 128]
let ipOriginal = [0, 0, 220, 148]
let array255SubRed = [255, 255, 255, 255]
let array0 = []
let resultados = []
let nuevasIP = []

function guardarNumeroRedes() {
    numeroDeRedes = parseInt(document.getElementById("numeroRedes").value);
    mostrarRedes(numeroDeRedes);
}

function mostrarRedes(numeroDeRedes){
    for (let redes = 0; redes < numeroDeRedes; redes++){
        const div = document.createElement("div");
        div.classList.add("containerDispositivosRedes");
        div.innerHTML = `<h2 class="tittleDispositivos">Escribe el número de dispositivos a conectarse en esta red</h2>
        <h3 class="dipositivos">Red ${redes +1 }</h3>
        <input type="number" id="dispositivosConectados${redes}" placeholder="Dispositivos">
        <button onclick="guardarDispositivosConectados(${redes})">Guardar</button>`;
        dispositivosRedes.append(div);

    }
}

function guardarDispositivosConectados(indiceRedes) {
    const valorInput = parseInt(document.getElementById(`dispositivosConectados${indiceRedes}`).value) || 0;
    datosDeRedes[indiceRedes] = {
        red: indiceRedes + 1,
        dispositivos : valorInput
    };
    console.log(`Red ${indiceRedes + 1}: ${valorInput} dispositivos guardados.`);
}


function obtenerDispositivosConectados(){
    dispositivosConectados = datosDeRedes.map(red => red.dispositivos);
    console.log(dispositivosConectados);
    return dispositivosConectados;
}

function ordenamiento(){
    obtenerDispositivosConectados()
    dispositivosConectados.sort((a,b)=> a-b);
    ordered = dispositivosConectados.reverse();
    console.log(ordered);
    
}

function potenciar() {
    ordenamiento()
    for (let i = 0; i < ordered.length; i++) {
        let numero = ordered[i];
        let potencia = 0; 
        while (2 ** potencia < numero) {
            potencia++;
        }
        datosDeRedes[i].potencia=potencia;
        potencias.push(potencia);
    }
    return potencias;
}

function sumarSegunPotencias() {
    potenciar()
    for (let i = 0; i < potencias.length; i++) {
        let array0 = new Array(4).fill(0);
        let sumaAcumulada = 0;
        let contadorSumas = 0;
        let indiceArray0 = 0;
        let sumasNecesarias = potencias[i];
        for (let j = 0; contadorSumas < sumasNecesarias; j++) {
            sumaAcumulada += array255[j % array255.length];
            contadorSumas++;
            if (sumaAcumulada >= 255) {
                sumaAcumulada = 0;
                if (indiceArray0 < array0.length) {
                    array0[indiceArray0] = 255;
                    indiceArray0++;
                }
            }
        }
        if (indiceArray0 < array0.length) {
            array0[indiceArray0] = sumaAcumulada;
            indiceArray0++;
        }
        sumaAcumulada = 0;
        contadorSumas = 0;
        while (indiceArray0 < array0.length) {
            array0[indiceArray0] = 0;
            indiceArray0++;
        }

        resultados.push(array0);
    }
    return resultados;
}

function obtenerIpNueva() {
    let ipBase = ipOriginal.slice(); 
    sumarSegunPotencias(); 
    let nuevasIP = []; 

    for (let i = 0; i < resultados.length; i++) {
        let subArrayResultados = resultados[i];
        let resultadoSuma = new Array(4).fill(0);
        let carry = 0;

        // Sumar ipBase con subArrayResultados
        for (let j = 0; j < ipBase.length; j++) {
            resultadoSuma[j] = ipBase[j] + subArrayResultados[j] + carry;
            carry = 0; // Resetea el carry para el siguiente octeto

            // Manejar el desbordamiento
            if (resultadoSuma[j] >= 256) {
                carry = 1; // Lleva el 'carry' al siguiente octeto
                resultadoSuma[j] -= 256; // Resta 256 al octeto actual
            } else if (resultadoSuma[j] === 255) {
                // Especialmente en la primera iteración, si el resultado es 255, no debería haber desbordamiento
                carry = (i === 0) ? 0 : 1;
            }
        }

        // En la primera iteración, no incrementar el primer octeto
        if (i !== 0) {
            resultadoSuma[0] += 1; // Incrementa el primer octeto en las iteraciones subsiguientes
        }

        // Realizar el desbordamiento final si es necesario
        if (resultadoSuma[0] >= 256) {
            resultadoSuma[0] = 0;
            resultadoSuma[1] += 1;
        }

        // Actualizar ipBase para la siguiente iteración
        ipBase = resultadoSuma.slice();
        // Agregar la dirección IP generada a la lista
        nuevasIP.push(resultadoSuma.slice().reverse()); 
    }

    return nuevasIP; 
}