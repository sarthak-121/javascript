let heading = document.getElementById("word");
let meaning = document.getElementById("para");
let bgpage = chrome.extension.getBackgroundPage();
// diplay the selected word
heading.innerHTML = bgpage.word;

// makes request to urban dictionary for meaning of the word
async function getMeaning() {
    let response = await fetch("https://mashape-community-urban-dictionary.p.rapidapi.com/define?term="+bgpage.word, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
            "x-rapidapi-key": "5dc74e7f93msh38342ef123ac142p1138dbjsn66f6f701f22a"
        }
    });
    let data = await response.json();
    return data;
}

// display the meaning in the popup
getMeaning().then(data => {
    meaning.innerHTML = data.list[0].definition;

    let toggleButton = document.getElementsByClassName("toggle_btn");
    let counter = 0;

    toggleButton[0].addEventListener("click",() => {
        if(counter === 0) {
            counter = 9;
        }
        else {
            counter--;
        }
        meaning.innerHTML = data.list[counter].definition;
    });

    toggleButton[1].addEventListener("click",() => {
        if(counter === 9) {
            counter = 0;
        }
        else {
            counter++;
        }
        meaning.innerHTML = data.list[counter].definition;
    });

    // addButton adds the word and its meaning to local storage
    let addButton = document.getElementById("add_btn");
    let viewButton = document.getElementById("view_btn");
    let dictionaryData = [];

    addButton.addEventListener('click', () => {

        // retrives data from local storage if there is any previous data
        if(localStorage.getItem("dictionaryData")) {
            dictionaryData = JSON.parse(localStorage.getItem("dictionaryData"));
        }

        let date = new Date();
        let dateString = date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
        console.log(dateString);

        let info = {
            word: bgpage.word,
            meaning: data.list[counter].definition,
            date: dateString
        }

        dictionaryData.push(info);
        localStorage.setItem("dictionaryData", JSON.stringify(dictionaryData));       
    });

    viewButton.addEventListener('click', () =>{
        // opens saved wordsin a new tab
        window.open('./dictionaryData/index.html', '_blank');
        //win.focus();
    });

});

