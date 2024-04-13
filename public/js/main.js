function AJAXGet(url, callBack) {
    const xhttp = new XMLHttpRequest()  //асинхронный запрос
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && this.status === 200) {    //4 - обработка запроса завершена, 200 - успешная обработка запроса
            callBack(this.responseText)     //responseText - ответ от сервера
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
    const favoriteDevices = document.getElementById('favorite-devices-block')
    const firstChild = favoriteDevices.firstElementChild.outerHTML
    while (favoriteDevices.firstChild) {
        favoriteDevices.removeChild(favoriteDevices.firstChild)
    }
    favoriteDevices.innerHTML = firstChild
    favoriteDevices.innerHTML += responceText
}

function updateDeviceAnalytics(responceText) {
    const deviceAnalytics = document.getElementById('device-analytics-container')
    while (deviceAnalytics.firstChild) {
        deviceAnalytics.removeChild(deviceAnalytics.firstChild)
    }
    deviceAnalytics.innerHTML = responceText
    addEventListenersForRadioInputs()
}

function onLoadMainPage() {
    AJAXGet('/favorite-devices', updateFavoriteDevices)
}

function onLoadAnalyticsPage() {
    AJAXGet('/device-analytics', updateDeviceAnalytics)
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
    AJAXPost('/change-status', params)
}

function closeDeviceWorks() {
    const deviceWorks = document.getElementById('device-works')
    const openerButton = document.getElementById('device-analytics-content-opener-button')
    if (deviceWorks.hasAttribute('hidden')) {
        deviceWorks.removeAttribute('hidden')
        openerButton.style.rotate = '360deg'
    } else {
        deviceWorks.setAttribute('hidden', 'hidden')
        openerButton.style.rotate = '-90deg'
    }
}

function addEventListenersForRadioInputs() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (this.checked) {
                const selectedValue = this.value;
                let timeInterval
                switch (selectedValue) {
                    case 'day':
                        timeInterval = 1
                        break
                    case 'week':
                        timeInterval = 7
                        break
                    case 'two-weeks':
                        timeInterval = 14
                        break
                    case 'month':
                        timeInterval = 31
                        break
                    case 'three-months':
                        timeInterval = 93
                        break
                    case 'half-year':
                        timeInterval = 186
                        break
                    default:
                        timeInterval = 14
                }
                AJAXGet(`/get-works?time-interval=${timeInterval}`, function (responseText) {
                    const deviceWorks = document.getElementById('device-analytics-works-content')
                    console.log(responseText)
                    const res = JSON.parse(responseText)
                    deviceWorks.innerHTML = res.html
                    const pastDateContainer = document.getElementById('past-date-container-text')
                    pastDateContainer.innerHTML = res.date_text
                })
            }
        });
    });
}