/*******  upload script  *********/
const inputFile = document.getElementById('inputFile');
const container = document.getElementById('previewContainer');
const previewImage = container.querySelector('.previewImage');
const previewText = container.querySelector('.previewText');

// check for the input file(image)
inputFile.addEventListener('change',function() {
    const file = this.files[0];
    
    if(file) {
        const reader = new FileReader();

        previewText.style.display = "none";
        previewImage.style.display = "block";

        reader.addEventListener('load', function() {
            console.log(this);
            previewImage.setAttribute("src", this.result);
        });

        reader.readAsDataURL(file);
    }
    else {
        previewText.style.display = null;
        previewImage.style.display = null;
    }
});



/********** download script *************/

const downloadButton = document.getElementById('download');

downloadButton.addEventListener('click', function() {
  
    const canvas = document.createElement('canvas');
    const imageFormat = document.getElementById('formats');
    let format = imageFormat.options[imageFormat.selectedIndex].value;

    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;

    let context = canvas.getContext('2d');
    context.drawImage(previewImage, 0, 0);
    
    // convert canvas to a blob object
    canvas.toBlob(function(blob) {
    let link = document.createElement('a');
    link.download = 'example.' + format;

    link.href = URL.createObjectURL(blob);
    link.click();

    URL.revokeObjectURL(link.href);
    }, 'image/' + format);

});



