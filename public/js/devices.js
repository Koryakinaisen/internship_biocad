function AJAXGet(url) {
    const xhttp = new XMLHttpRequest()  //асинхронный запрос
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && this.status === 200) {    //4 - обработка запроса завершена, 200 - успешная обработка запроса
            updateFavoriteDevices(this.responseText)     //responseText - ответ от сервера
        }
    }
    xhttp.open('GET', url, true)
    xhttp.send()    //отправка настроенного запроса
}

function AJAXPost(url, params) {
    const xhttp = new XMLHttpRequest()  //асинхронный запрос
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && this.status === 200) {    //4 - обработка запроса завершена, 200 - успешная обработка запроса
            console.log(this.responseText)     //responseText - ответ от сервера
            location.reload()
        }
    }
    xhttp.open('POST', url, true)
    xhttp.send(params)    //отправка настроенного запроса
}

function updateFavoriteDevices(responceText) {
    const favoriteDevices = document.getElementById("favorite-devices-block")
    const firstChild = favoriteDevices.firstElementChild.outerHTML
    while (favoriteDevices.firstChild) {
        favoriteDevices.removeChild(favoriteDevices.firstChild)
    }
    favoriteDevices.innerHTML = firstChild
    favoriteDevices.innerHTML += responceText
}

function onLoad() {
    AJAXGet('/favorite-devices')
}

function changeNotification(event) {
    const deviceId = event.target.parentElement.parentElement.dataset.deviceId
    const params = `{ "device_id": ${ deviceId }}`
    AJAXPost('/change-notification', params)
}

function changeStatus(event) {
    const selectStatus = event.target
    const selectedIndex = selectStatus.selectedIndex
    const selectedText = selectStatus.options[selectedIndex].text
    const deviceId = selectStatus.parentElement.dataset.deviceId
    const params = `{ "device_id": ${ deviceId }, "status": "${ selectedText }"}`
    console.log(params)
    AJAXPost('/change-status', params)
}