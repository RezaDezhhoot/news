document.getElementById("imageUpload").onclick = function () {
    let xhttp = new XMLHttpRequest();
    const selectedImage = document.getElementById('selectedImage');
    const imageStatus = document.getElementById('imageStatus');
    const progressDiv = document.getElementById('progressDiv');
    const progressBar = document.getElementById('progress-bar');

    xhttp.onreadystatechange = function () {
        imageStatus.innerHTML = this.responseText;
        selectedImage.value = '';
    }
    xhttp.open("POST","/admin/posts/image-upload");
    xhttp.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            let result = Math.round((e.loaded/e.total)*100);
            if (result !== 100) {
                progressBar.innerHTML = result + '%';
                progressBar.style.width = result + "%";
            } else  {
                progressDiv.style.display = "none";
            }

        }
    }
    let formData = new FormData();

    if (selectedImage.files.length > 0) {
        progressDiv.style.display = "block";
        formData.append("image",selectedImage.files[0]);
        xhttp.send(formData);
    } else {
        imageStatus.innerHTML = 'not selected';
    }
};
