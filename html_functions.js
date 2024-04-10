function getDeviceHTML(device) {
    return `
    <div class="favorite-devices-block-element" data-device-id="${ device.id }">
      <div class="favorite-devices-block-element-image">
        <img src="${ device.image }" alt="device">    
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

module.exports = {getDeviceHTML}