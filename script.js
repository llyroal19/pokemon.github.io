document.querySelector('.buscar button').addEventListener('click', async function() {
    const pokeapi_base = 'https://pokeapi.co/api/v2/pokemon/';
    const nombrepokemon = document.querySelector('.buscar input').value;
    const pokeapi = pokeapi_base + nombrepokemon;
    //alert("URL apli: " + pokeapi);
    try {
        const ack = await obtenerpromesa(pokeapi);
        procesar_respuestas(ack);
    } catch (error) {
        var errornombre = document.querySelector('.error');
        errornombre.style.display = 'block';

        var cajapokemon = document.querySelector('.contenido');
        cajapokemon.style.display = 'none';

        var evolucionboton = document.querySelector('.boton-evolucionar');
        evolucionboton.style.display = 'none';   
    
        //alert("Error: " + error.message);
    }
});

async function obtenerpromesa(url){
    try{
        const respuesta = await axios.get(url);
        //console.log("Estado de la respuesta: ", respuesta.status);
        return await respuesta.data;
    }catch(error){
        console.log("Error: ", error.message);
        throw error;
    }
}

function capitalizeFirstLetter(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

var pokemonnombreglobal;

async function procesar_respuestas(respuesta){
    var errornombre = document.querySelector('.error');
    errornombre.style.display = 'none';
    
    var cajapokemon = document.querySelector('.contenido');
    cajapokemon.style.display = 'flex';

    var nombre = respuesta.name
    pokemonnombreglobal = nombre;
    var nombremayuscula = capitalizeFirstLetter(nombre)
    nombrepokemon = document.querySelector('.nombre');
    nombrepokemon.textContent = nombremayuscula;

    var imagenpokemon = document.getElementById('imagenpokemon');
    imagenpokemon.src = respuesta.sprites.other['official-artwork'].front_default;

    var habilidadpokemon = document.querySelector('.habilidad');
    habilidadpokemon.textContent = 'Habilidades: ';
    
    respuesta.abilities.forEach(function(habilidad) {
        habilidadpokemon.textContent += habilidad.ability.name + ', ';
        }
    );

    var movimientopokemon = document.querySelector('.movimiento');
    movimientopokemon.textContent = 'Movimientos: ';
    
    for (var i = 0; i < respuesta.moves.length && i < 4; i++) {
        movimientopokemon.textContent += respuesta.moves[i].move.name;
        if (i < 3 && i < respuesta.moves.length - 1) {
            movimientopokemon.textContent += ', ';
        }
    }

    if (respuesta.moves.length > 4) {
        movimientopokemon.textContent += ', entre otros';
    }

    var idpokemon = respuesta.id;
    obtener_descripcion(idpokemon);
}

async function obtener_descripcion(pokemonid) {
    const pokeid_base = 'https://pokeapi.co/api/v2/pokemon-species/';
    const pokeid = pokeid_base + pokemonid;
    //alert("URL: " + pokeid);
    try {
        const ack = await obtenerpromesa(pokeid);
        procesar_respuestas_id(ack);
    } catch (error) {
        alert("Error: " + error.message);
    }
};

async function procesar_respuestas_id(respuesta){
    var descripcionpokemon = document.querySelector('.descripcion');
    descripcionpokemon.textContent = "Descripción: Sin descripción en español";

    respuesta.flavor_text_entries.forEach(function(descripcion) {
        var idioma = descripcion.language.name;
        if (idioma == 'es') {
            descripcionpokemon.textContent = "Descripción: ";
            descripcionpokemon.textContent += descripcion.flavor_text;
        }
    });

    const url_evolution_chain = respuesta.evolution_chain.url;
    //alert("URL: " + url_evolution_chain + " Nombre: " + respuesta.name)
    if (url_evolution_chain != null) {
        obtener_evolucion(url_evolution_chain);
    }
    else{
        var evoluciontexto = document.querySelector('.evolucion');
        evoluciontexto.style.display = 'none';   
        
        var evolucionboton = document.querySelector('.boton-evolucionar');
        evolucionboton.style.display = 'none';   
    }

}

async function obtener_evolucion(url_evolution_chain) {
    //alert("URL evolución: " + url_evolution_chain);
    try {
        const ack = await obtenerpromesa(url_evolution_chain);
        procesar_respuestas_evolucion(ack);
    } catch (error) {
        alert("Error: " + error.message);
    }
};

var evolucion_a;

async function procesar_respuestas_evolucion(respuesta){
    try{
        var specie1 = respuesta.chain.evolves_to[0].species.name;
    }
    catch (error) {
        alert("Error: " + error.message);
    }
    try{
        var specie2 = respuesta.chain.evolves_to[0].evolves_to[0].species.name;
    }
    catch (error) {
        var specie2 = respuesta.chain.evolves_to[1].species.name;
    }

    evolucion_a = specie1;

    if (specie1 == pokemonnombreglobal) {
        evolucion_a = specie2;
    }

    if (specie2 == pokemonnombreglobal) {
        var evoluciontexto = document.querySelector('.evolucion');
        evoluciontexto.style.display = 'none';   
        var evolucionboton = document.querySelector('.boton-evolucionar');
        evolucionboton.style.display = 'none';   
    }
    else{
        var evoluciontexto = document.querySelector('.evolucion');
        evoluciontexto.style.display = 'block';   
        
        var evolucionpokemon = document.querySelector('.evolucion');
        evolucionpokemon.textContent = 'Evolución a: ';
        evolucionpokemon.textContent += evolucion_a;

        var evolucionboton = document.querySelector('.boton-evolucionar');
        evolucionboton.style.display = 'block';   
    }
    //alert("Evolucion a - salida: " + evolucion_a);
}

document.querySelector('.boton-evolucionar button').addEventListener('click', async function() {
    //alert("Evolucion a - entrada: " + evolucion_a);
    const pokeapi_base = 'https://pokeapi.co/api/v2/pokemon/';
    const pokeapi = pokeapi_base + evolucion_a;
    document.querySelector('.buscar input').value = '';
    //alert("URL apli: " + pokeapi);
    try {
        const ack = await obtenerpromesa(pokeapi);
        procesar_respuestas(ack);
    } catch (error) {
        var errornombre = document.querySelector('.error');
        errornombre.style.display = 'block';

        var cajapokemon = document.querySelector('.contenido');
        cajapokemon.style.display = 'none';

        var evolucionboton = document.querySelector('.boton-evolucionar');
        evolucionboton.style.display = 'none';   
    
        //alert("Error: " + error.message);
    }
});

function reiniciar() {
    document.querySelector('.buscar input').value = '';
    location.reload();
}