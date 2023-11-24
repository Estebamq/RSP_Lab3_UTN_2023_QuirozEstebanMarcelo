const apiUrl = "http://localhost/2parcial/vehiculoAereoTerrestre.php";

function GetVehiculos() {
    fetch(apiUrl, {method: 'GET'})
        .then(function(response) {
            if (response.ok) {
                return response.json(); 
            } else {
                throw new Error('Error en la respuesta de la API');
            }
        })
        .then(function(jsonData) {
            document.getElementById('spinner').style.display = 'none';
            showAbmForm("form-data-container", "form-amb-container");
            const data = jsonData;
            people = data.map((item) => {
                return "cantPue" in item && "cantRue" in item
                ? new Terrestre(
                    item.id,
                    item.modelo,
                    item.anoFab,
                    item.velMax,
                    item.cantPue,
                    item.cantRue
                    )
                : new Aereo(
                    item.id,
                    item.modelo,
                    item.anoFab,
                    item.velMax,
                    item.altMax,
                    item.autonomia
                    );
            });
            init(people);
            
        })
        .catch(error => {
            alert(error);
        });
};

const post = async (data) => {
    document.getElementById('spinner').style.display = 'flex';
    const dataToSend = data;
    try{
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
        })
        if(response.ok){
            document.getElementById('spinner').style.display = 'none';
            showAbmForm("form-data-container", "form-amb-container");

        }else {
            throw new Error(`Error de red: ${response.status}`);
        }
        editPerson(dataToSend);
        
    }catch(error){
        alert(error);
        document.getElementById('spinner').style.display = 'none';
        showAbmForm("form-data-container", "form-amb-container");
    }
}

const put = (person) => {
            document.getElementById('spinner').style.display = 'flex';
            var objetoJson = person;
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', apiUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {

                    document.getElementById('spinner').style.display = 'none';

                    if (xhr.status === 200) {
                        // En caso de recibir un código 200
                        var respuestaJson = JSON.parse(xhr.responseText);

                        // Actualizar el ID con el provisto en la respuesta
                        person.id  = respuestaJson.id;

                        addPerson(person);
                        showAbmForm("form-data-container", "form-amb-container");
                    } else {

                        showAbmForm("form-data-container", "form-amb-container");
                        alert(`Error durante la actualización: ${response.status}`);
                    }
                }
            };

            // Enviar la solicitud con el objeto JSON como cuerpo
            xhr.send(JSON.stringify(objetoJson));

};

function deleteData(id){
    document.getElementById('spinner').style.display = 'flex';
    toggleButtonsDisabled(true);
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if (xml.readyState==4){
            if (xml.status==200){
                document.getElementById('spinner').style.display = 'none';
                toggleButtonsDisabled(false);
                deletePerson(id);
            }else{
                alert(`Error de red: ${xml.status}`);
                document.getElementById('spinner').style.display = 'none';
                toggleButtonsDisabled(false);
            }
        }
    };

    xml.open("DELETE",apiUrl);
    xml.setRequestHeader("Content-Type", "application/json");
    let o = {id: id};
    xml.send(JSON.stringify(o));
    
}

