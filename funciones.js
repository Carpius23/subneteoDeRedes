var numeroDeRedes = 0
const dispositivosRedes = document.querySelector(".dispositivosRedes");
var datosDeRedes = []
var dispositivosConectados = []
var ordered = []
var potencias = []
const array255 = [1, 2, 4, 8, 16, 32, 64, 128]
const ipOriginal = [0, 0, 220, 148]
const array255SubRed = [255, 255, 255, 255]
var array0 = []
var resultados = []
var nuevasIP = []
var nuevasIpBase = []
var primeraUsable = []
var ultimaUsable = []

function refresh(){
    location.reload();
}

function guardarNumeroRedes() {
    numeroDeRedes = parseInt(document.getElementById("numeroRedes").value);
    mostrarRedes(numeroDeRedes);
    
    if(numeroDeRedes > 0){
        const reiniciarPagina = document.querySelector(".guardarNumeroRedes1");
        reiniciarPagina.addEventListener('click', refresh);
        numeroDeRedes = 0
    }
    else {
        const reiniciarPagina = document.querySelector(".guardarNumeroRedes1");
        reiniciarPagina.addEventListener('click', refresh);
        numeroDeRedes = 0
    }

}

function mostrarRedes(numeroDeRedes){
    for (let redes = 0; redes < numeroDeRedes; redes++){
        const div = document.createElement("div");
        div.classList.add("containerDispositivosRedes");
        div.innerHTML = `<h2 class="tittleDispositivos">Escribe el número de dispositivos a conectarse en esta red</h2>
        <h3 class="dispositivos">Red ${redes +1 }</h3>
        <input type="" class="dispositivosConectados${redes}" placeholder="Dispositivos">
        <img class="imagenComputadora" src="/recursos/pantalla-del-ordenador.png" alt="">
        <button class="buttonContainerGuardar "onclick="guardarDispositivosConectados(${redes})">Guardar</button>`;
        dispositivosRedes.append(div);
    }
    if(numeroDeRedes > 0){
        const button = document.createElement("button");
    button.id = "containerGuardar";
    button.textContent = "Guardar";
    button.addEventListener('click', guardarGuardarDispositivos); 
    dispositivosRedes.append(button);

}
}



function guardarDispositivosConectados(indiceRedes) {
    const inputs = document.getElementsByClassName(`dispositivosConectados${indiceRedes}`);
    if(inputs.length > 0) {
        const valorInput = parseInt(inputs[0].value) || 0;
        datosDeRedes[indiceRedes] = {
            red: indiceRedes + 1,
            dispositivos : valorInput
        };
        console.log(`Red ${indiceRedes + 1}: ${valorInput} dispositivos guardados.`);
    }
}

function guardarGuardarDispositivos(){
    const numeroDeRedes = document.querySelectorAll('[class^="dispositivosConectados"]').length;
    for (let indiceRedes = 0; indiceRedes < numeroDeRedes; indiceRedes++) {
        guardarDispositivosConectados(indiceRedes);
    }
}

document.getElementById('containerGuardar').addEventListener('click', function(){
    guardarGuardarDispositivos(numeroDeRedes);
});

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
    potencias = []
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
    resultados = []
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
    const nuevasIP = []; 
    for (let i = 0; i < resultados.length; i++) {
        let subArrayResultados = resultados[i];
        let resultadoSuma = new Array(4).fill(0);
        let carry = 0;

        for (let j = 0; j < ipBase.length; j++) {
            resultadoSuma[j] = ipBase[j] + subArrayResultados[j] + carry;
            carry = 0; 
            if (resultadoSuma[j] >= 256) {
                carry = 1; 
                resultadoSuma[j] -= 256; 
            } else if (resultadoSuma[j] === 255) {
                carry = (i === 0) ? 0 : 1;
            }
        }
        if (i !== 0) {
            resultadoSuma[0] += 1; 
        }

        if (resultadoSuma[0] >= 256) {
            resultadoSuma[0] = 0;
            resultadoSuma[1] += 1;
        }

        ipBase = resultadoSuma.slice();
        nuevasIP.push(resultadoSuma.slice().reverse()); 
    }
    return nuevasIP; 
}

function obtenerUltimaUsable(){
   let nuevasIP = obtenerIpNueva();
   let ultimaUsable = nuevasIP.map(subArray => {
    let copiaSubArray = subArray.slice();
    copiaSubArray[copiaSubArray.length - 1] -= 1;
    return copiaSubArray;
   });
   return ultimaUsable;
}

function obtenerPrimeraUsable(){
    let nuevasIP = obtenerIpNueva();
    let provisional = ipOriginal.slice();
    let carry = true
    let cascaron = nuevasIP.slice(0, nuevasIP.length - 1);
    for (let i = 0; i  < cascaron.length; i++){
        let subArray = cascaron[i]
        subArray = subArray.reverse();
        let carry2 = true 
        for (let j = 0; j < subArray.length; j++) {
            if (carry2 === true) {
                subArray[j] += 1;
                if (subArray[j] >= 256){
                    subArray[j] = 1;
                } else {
                    carry2 = false;
                }
            }
        }
        primeraUsable.push(subArray.slice().reverse());
    }
    for (let i = 0; i < provisional.length; i++){
        if (carry === true){
            provisional[i] += 1
        if (provisional[i] >= 256) {
            provisional [i] = 0;
        } else {
            carry = false;
            primeraUsable.unshift(provisional.slice().reverse());
        }
        }
    }
    return primeraUsable;
}
