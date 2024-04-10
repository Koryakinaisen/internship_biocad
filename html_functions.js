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

function getDeviceWorkHTML(device_work) {
    return `
        <div class="device-work">
          ${ device_work.start_date }
        </div>
    `
}

function getDeviceAnalyticsHTML(device) {
    const deviceWorks = []
    for(let i=0; i<devicesWorks.length; i++) {
        if (devicesWorks[i].device_id === device.id) deviceWorks.push(devicesWorks[i])
    }
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
    `
    for(let i=0; i<deviceWorks.length; i++){
        html += getDeviceWorkHTML(deviceWorks[i])
    }
    html += '</div>'
    return html
}

module.exports = {getDeviceHTML, getDeviceAnalyticsHTML}