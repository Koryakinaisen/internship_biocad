const devicesWorks = require('./json/devices_works.json')
const users = require('./json/users.json')

function getDeviceHTML(device) {
    return `
    <div class="favorite-devices-block-element" data-device-id="${ device.id }">
      <div class="favorite-devices-block-element-image">
        <img src="${ (device.image)?device.image:"images/devices/unknown_device.png" }" alt="device">    
      </div>
      
      <div class="favorite-devices-block-element-name">
        ${ device.name }   
      </div>
      
      <select id="select-status" name="status" onchange="changeStatus(event)">
        <option value="free" ${ (device.status==='Cвободен')?'selected':'' }>Свободен</option>
        <option value="busy" ${ (device.status==='Занят')?'selected':'' }>Занят</option>
      </select>
        
      <div class="favorite-devices-block-element-notification">
        <img src="${ (device.notification)?'images/icons/notifications_active.svg':
            'images/icons/notifications_not_active.svg'}" alt="notifications"
            onclick="changeNotification(event)">
      </div>
    </div>         
    `
}

function getWorksHTML(works) {
    let html = ''
    works.forEach(function (work) {
        html += `
            <div class="work-container">
              <span  class="work-name">${ work.name }:</span>
              <span class="work-content">${ work.content }</span>
            </div>
        `
    })
    return html
}

function getDeviceWorkHTML(deviceWork) {
    const startDateJson = deviceWork.start_date
    const startDate = new Date(startDateJson.year, startDateJson.monthIndex,
        startDateJson.date, startDateJson.hours, startDateJson.minutes)
    let userNickname
    users.forEach(function (user) {
        if (user.id === deviceWork.user_id) {
            userNickname = user.nickname
        }
    })
    const worksHTML = getWorksHTML(deviceWork.works)
    return `
        <div class="device-work">
          <div class="device-analytics-works-start">
            ${ getDate(startDate) }
          </div>
          <div class="device-analytics-works-type">
            ${ deviceWork.work_type?'В работе':'Не в работе' }
            ${ deviceWork.work_type}
          </div>
          <div class="device-analytics-works-works">
            ${ worksHTML }
          </div>
          <div class="device-analytics-works-result">
            ${ deviceWork.result }
          </div>
          <div class="device-analytics-works-user">
            ${ userNickname }
          </div>
        </div>
    `
}

function getDeviceWorksHTML(device, daysInterval) {
    const currentDate = new Date()
    const pastDate = new Date()
    pastDate.setDate(currentDate.getDate() - daysInterval)
    const deviceWorks = []
    for(let i=0; i<devicesWorks.length; i++) {
        if (devicesWorks[i].device_id === device.id && cmpDates(pastDate, devicesWorks[i].start_date))
            deviceWorks.push(devicesWorks[i])
    }
    let html = ''
    deviceWorks.forEach(function (deviceWork) {
        html += getDeviceWorkHTML(deviceWork)
    })
    return html
}

function getDate(currentDate) {
    let date = ''
    date += currentDate.toISOString().slice(0,10).split('-').reverse().join('.') + ', '
    const hours = currentDate.getHours()
    const minutes = currentDate.getMinutes()
    if(hours < 10) date += '0'
    date += hours + ':'
    if(minutes < 10) date += '0'
    date += minutes
    return date
}

function cmpDates(pastDate, startDateJson) {
    const startDate = new Date(startDateJson.year, startDateJson.monthIndex,
        startDateJson.date, startDateJson.hours, startDateJson.minutes)
    return startDate.getTime() - pastDate.getTime() >= 0
}

function getDeviceAnalyticsHTML(device, daysInterval=0) {
    const currentDate = new Date()
    const currentDateStr = getDate(currentDate)
    const pastDate = new Date()
    pastDate.setDate(currentDate.getDate() - daysInterval)
    const pastDateStr = getDate(pastDate)
    console.log(pastDateStr)

    let html = ""
    html += `
        <div class="device-analytics-header">
          <img src="${ (device.image)?device.image:"images/devices/unknown_device.png" }"
               class="device-analytics-image" alt="device">
          <div class="device-analytics-data">
              <p class="device-analytics-name"> ${ device.name } </p>
              <span class="device-analytics-extra-data"> ${ device.number } &#8226 </span>
              <span class="device-analytics-extra-data"> ${ device.division } </span>
          </div>
          
          <div class="device-analytics-buttons">
              <select name="work">
                <option value="work">В работе</option>
              </select>
              <div class="device-analytics-buttons-img">
                <img src="images/icons/red_heart.svg" alt="heart">
              </div>
              <div class="device-analytics-buttons-img">
                <img src="images/icons/settings.svg" alt="settings">
              </div>
          </div>
        </div>
        
        <div class="device-analytics-panel">
          <div class="device-analytics-content-opener">
            <span>Работа прибора</span>
            <img src="images/icons/opener.svg" alt="opener" 
                 id="device-analytics-content-opener-button" onclick="openDeviceWorks()">
          </div>
          
          <div class="device-analytics-loader">
            <img src="images/icons/clock.svg" alt="clock">
            <a href="" class="device-analytics-pdf">СОХРАНИТЬ PDF | :</a>
          </div>
        </div>
        
        <div id="device-works" hidden>
          <div class="device-analytics-date">
            <div class="device-analytics-date-container" class="past-date-container">
              <span id="past-date-container-text">${ pastDateStr }</span>
              <img src="images/icons/calendar.svg" alt="calendar">
            </div>
            
            <div class="device-analytics-date-arrow">
              <img src="images/icons/arrow.svg" alt="arrow">
            </div>
            
            <div class="device-analytics-date-container">
              ${ currentDateStr }
              <img src="images/icons/calendar.svg" alt="calendar">
            </div>
          </div>
         
          <div class="device-analytics-time-interval">
            <form onchange="">
              <input type="radio" name="time-interval" id="day" value="day">
              <label for="day">День</label>
              <input type="radio" name="time-interval" id="week" value="week">
              <label for="week">Неделя</label>
              <input type="radio" name="time-interval" id="two-weeks" value="two-weeks">
              <label for="two-weeks">2 недели</label>
              <input type="radio" name="time-interval" id="month" value="month">
              <label for="month">Месяц</label>
              <input type="radio" name="time-interval" id="three-months" value="three-months">
              <label for="three-months">3 месяца</label>
              <input type="radio" name="time-interval" id="half-year" value="half-year">
              <label for="half-year">Полгода</label>
            </form>
          </div>
          
          <div class="device-analytics-works">
            <div class="device-analytics-works-header">
              <div class="device-analytics-works-start">
                Начало
              </div>
              <div class="device-analytics-works-type">
                Тип работы
              </div>
              <div class="device-analytics-works-works">
                Работы
              </div>
              <div class="device-analytics-works-result">
                Результат
              </div>
              <div class="device-analytics-works-user">
                Пользователь
              </div>
            </div>
            <div id="device-analytics-works-content">
            
            </div>
          </div>
        </div>
    `
    return html
}

module.exports = {getDeviceHTML, getDeviceAnalyticsHTML, getDeviceWorksHTML, getDate}