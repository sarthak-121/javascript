let data = JSON.parse(localStorage.getItem("dictionaryData")); 
console.log(data);

let htmlString = "";

// diplay the content
data.forEach(element => {
    htmlString += `<div class="row">
    <div class="col-sm-2"></div>
    <div class="col-sm-8">
        <div class="cards">
            <h3>${element.word}</h3>
            <h6>${element.date}</h6>
            <br>
            <p>${element.meaning}</p>
           
        </div>
    </div>
    <div class="col-sm-2"></div>
</div>`
});

let container = document.getElementsByClassName("container");
container[0].innerHTML = htmlString;