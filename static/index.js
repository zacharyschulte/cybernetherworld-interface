async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            //'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

onload = function () {
    var generate_text_button = document.querySelector("#generate_text");
    generate_text_button.onclick = function () {

        var text_to_process = "";
        var tab_id = '#inputtab1';

        text_to_process += document.querySelector(tab_id).querySelector("textarea").value;

        if (text_to_process.length > 2) {
            generate_text_button.disabled = true;

            postData('/neuralnet', { 'input': text_to_process })
                .then((data) => {
                    var active_output_parent_id = document.querySelector("#output_tab_list").querySelector("a.nav-link.active").getAttribute("href");
                    var active_output = document.querySelector(active_output_parent_id).querySelector("textarea");
                    active_output.value = text_to_process + data['data']['text'];
                    generate_text_button.disabled = false;
                    save_button.disabled = false;
                });
        }
    };
    var continue_generation_button = document.querySelector("#continue_generation");
    continue_generation_button.onclick = function () {

        var text_to_process = "";
        var tab_id = '#inputtab1';
        var active_output_parent_id = document.querySelector("#output_tab_list").querySelector("a.nav-link.active").getAttribute("href");
        var active_output = document.querySelector(active_output_parent_id).querySelector("textarea");

        text_to_process += active_output.value;

        if (text_to_process.length > 2) {
            continue_generation_button.disabled = true;

            postData('/neuralnet', { 'input': text_to_process })
                .then((data) => {
                    active_output.value = text_to_process + data['data']['text'];
                    continue_generation_button.disabled = false;
                    save_button.disabled = false;
                });
        }
    }




    function saveTextAsFile() {

        var active_output_parent_id = document.querySelector("#output_tab_list").querySelector("a.nav-link.active").getAttribute("href");
        var active_output = document.querySelector(active_output_parent_id).querySelector("textarea");
        var textToWrite = active_output.value;
        var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
        var fileNameToSaveAs = "output.txt";
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null) {
            // Chrome allows the link to be clicked without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        } else {
            // Firefox requires the link to be added to the DOM before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
    }

    var save_button = document.getElementById('save_button');
    save_button.addEventListener('click', saveTextAsFile);

    function destroyClickedElement(event) {
        // remove the link from the DOM
        document.body.removeChild(event.target);
    }

    // var sample_button = document.querySelector("#sample_button");
    // sample_button.onclick = function () {
    //     sample_button.disabled = true;
    //     var format = "";
    //     var sample_size;
    //     var url = false;
    //     if (document.querySelector("#url").checked) {
    //         url = document.querySelector("#sample_source_url").value;
    //     }

    //     if (document.querySelector("#document").checked) {
    //         format = "document";
    //     } else if (document.querySelector("#paragraph").checked) {
    //         format = "random_paragraphs";
    //         sample_size = document.querySelector("#sample_size_paragraph").value;
    //     } else if (document.querySelector("#sentence").checked) {
    //         format = "random_sentences";
    //         sample_size = document.querySelector("#sample_size_sentence").value;
    //     }

    //     if (document.querySelector("#random").checked || document.querySelector("#url").checked) {
    //         var url_route = "/sampledocument?" + "format=" + format;
    //         if (sample_size) {
    //             url_route += "&sample_size=" + sample_size;
    //         }
    //         if (url) {
    //             url_route += "&url=" + url;
    //         }
    //         fetch(url_route)
    //             .then((response) => {
    //                 return response.json();
    //             })
    //             .then((data) => {
    //                 var active_input_parent_id = document.querySelector("#input_tab_list").querySelector("a.nav-link.active").getAttribute("href");
    //                 var active_input = document.querySelector(active_input_parent_id).querySelector("textarea");
    //                 active_input.value = data['sample'];
    //                 sample_button.disabled = false;
    //             });

    //     } else if (document.querySelector("#upload").checked) {
    //         var url_route = "/uploaddocument?" + "format=" + format;
    //         if (sample_size) {
    //             url_route += "&sample_size=" + sample_size;
    //         }
    //         const fileInput = document.querySelector('input[type="file"]');
    //         const formData = new FormData();

    //         formData.append('file', fileInput.files[0]);

    //         const options = {
    //             method: 'POST',
    //             body: formData,
    //         };

    //         fetch(url_route, options)
    //             .then((response) => {
    //                 return response.json();
    //             })
    //             .then((data) => {
    //                 var active_input_parent_id = document.querySelector("#input_tab_list").querySelector("a.nav-link.active").getAttribute("href");
    //                 var active_input = document.querySelector(active_input_parent_id).querySelector("textarea");
    //                 active_input.value = data['sample'];
    //                 sample_button.disabled = false;
    //             });
    //     } else if (document.querySelector("#library").checked) {
    //         var url_route = "/sampledocument?" + "format=" + format;
    //         var library_url = $("#library_selection").val();
    //         url_route += "&url=" + library_url;
    //         if (sample_size) {
    //             url_route += "&sample_size=" + sample_size;
    //         }

    //         fetch(url_route)
    //             .then((response) => {
    //                 return response.json();
    //             })
    //             .then((data) => {
    //                 var active_input_parent_id = document.querySelector("#input_tab_list").querySelector("a.nav-link.active").getAttribute("href");
    //                 var active_input = document.querySelector(active_input_parent_id).querySelector("textarea");
    //                 active_input.value = data['sample'];
    //                 sample_button.disabled = false;
    //             });
    //     }

    // }


    // $('input[id=cutup_block_size]').on('change', function () {
    //     if ($(this).val() > 99) {
    //         $(this).val(99)
    //     } else if ($(this).val() < 1) {
    //         $(this).val(1)
    //     }
    // });
    // $('input[name=technique_selector]').on('change', function () {
    //     if ($(this).attr('id') == "cutup") {
    //         $("#cutup_block_size_container").removeClass("d-none")
    //         $("#markov_ngram_size_container").addClass("d-none")
    //     } else {
    //         $("#cutup_block_size_container").addClass("d-none")
    //         $("#markov_ngram_size_container").removeClass("d-none")
    //     }
    // });

    // $('input[name=sample_size_selector]').on('change', function () {
    //     if ($(this).attr('id') == "document") {
    //         $("#document-size").removeClass("d-none")
    //         $("#paragraph-size").addClass("d-none")
    //         $("#sentence-size").addClass("d-none")
    //     } else if ($(this).attr('id') == "sentence") {
    //         $("#document-size").addClass("d-none")
    //         $("#sentence-size").removeClass("d-none")
    //         $("#paragraph-size").addClass("d-none")
    //     } else {
    //         $("#document-size").addClass("d-none")
    //         $("#paragraph-size").removeClass("d-none")
    //         $("#sentence-size").addClass("d-none")
    //     }
    // });

    // $('input[name=sampler_selector]').on('change', function () {
    //     if ($(this).attr('id') == "library") {
    //         $("#fileSelect-container").addClass("d-none")
    //         $("#url-container").addClass("d-none")
    //         $("#random-container").addClass("d-none")
    //         $("#library_select_container").removeClass("d-none")
    //     } else if ($(this).attr('id') == "url") {
    //         $("#fileSelect-container").addClass("d-none")
    //         $("#url-container").removeClass("d-none")
    //         $("#random-container").addClass("d-none")
    //         $("#library_select_container").addClass("d-none")
    //     } else if ($(this).attr('id') == "upload") {
    //         $("#fileSelect-container").removeClass("d-none")
    //         $("#url-container").addClass("d-none")
    //         $("#random-container").addClass("d-none")
    //         $("#library_select_container").addClass("d-none")
    //     } else {
    //         $("#fileSelect-container").addClass("d-none")
    //         $("#url-container").addClass("d-none")
    //         $("#random-container").removeClass("d-none")
    //         $("#library_select_container").addClass("d-none")
    //     }
    // });

};