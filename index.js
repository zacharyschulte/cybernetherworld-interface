async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Authorization': 'Bearer 15d8e223-d76e-419d-8196-0e91fd48c3d6',
            'Content-Type': 'application/json',
            //'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

onload = function () {

    var output = document.querySelector('#output');

    var generate_text_button = document.querySelector("#generate_text");

    generate_text_button.onclick = function () {

        var text_to_process = "";
        var input = document.querySelector('#input').value;

        text_to_process += input;

        if (text_to_process.length > 2) {
            generate_text_button.disabled = true;

            postData('https://api.inferkit.com/v1/models/c4ec710e-134d-405a-9bea-85ebd50e0a84/generate', { "prompt": { "text": text_to_process }, "length": 300 })
                .then((data) => {
                    output.innerHTML = "<strong>" + text_to_process + "</strong>" + data['data']['text'];
                    generate_text_button.disabled = false;
                    $("#output-options").show();
                });


        }
    };

    var continue_generation_button = document.querySelector("#continue_generation");

    continue_generation_button.onclick = function () {
        continue_generation_button.disabled = true;
        var text_to_process = "";
        text_to_process += output.innerText;

        if (text_to_process.length > 2) {
            postData('https://api.inferkit.com/v1/models/c4ec710e-134d-405a-9bea-85ebd50e0a84/generate', { "prompt": { "text": text_to_process }, "length": 300 })
                .then((data) => {
                    $("#output").append(data['data']['text']);
                    continue_generation_button.disabled = false;
                });
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function rand(thing) {
        return thing[Math.floor(Math.random() * thing.length)];
    }

    $("#random").click(function () {
        $("#input").val(rand(phrases));
    });

    var phrases = ['Crowds of vile decapods butcher', 'A mile above the horizon of Chaos there resounds a mighty howl', 'The Great Pyramid overflowed with blood, imbuing all', 'In utter cruelty the Grand Daimon', 'The masses began chanting with riotous shouts', 'The murmuring chorus of disembodied voices', 'The planets we survey are mere outlines of an unreal plane beyond', 'An unnatural laughter echoes in the Garden of', 'A scarlet maelstrom buries', 'Unutterable filth floods the Necropolis', 'Phantom forms scurry to and fro below the horizon', 'Conflagrant fissures of jagged granite illumine the central pathway to the'];


    function saveOutput() {
        var node = document.getElementById('output');

        domtoimage.toBlob(node).then(function (blob) {
            window.saveAs(blob, 'cybernetherworld-output.png');
        });
    }

    var save_button = document.getElementById('save');
    save_button.addEventListener('click', saveOutput);

};