const socket = io();

//Elements 
const $messageForm = document.querySelector('form');
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormInput = $messageForm.querySelector('input');
const $LocationButton = document.querySelector('#share-location');
const $messages = document.querySelector('#messages')


//Templates 
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationURLTemplate = document.querySelector('#locationURL-template').innerHTML;


//Options
const {username, room} = Qs.parse(location.search, {igonreQueryPrefix: true})

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})


socket.on('locationURL', (URLmessage)=>{
    console.log(URLmessage);
    const html = Mustache.render(locationURLTemplate,{
        URL: URLmessage.URL,
        createdAt: moment(URLmessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
})

document.querySelector('form').addEventListener('submit',(e) =>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', e.target.elements.message.value, (error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error){
            return console.log(error)
        }
        console.log('message was delivered!')
    });
})

$LocationButton.addEventListener('click', () =>{
    if(!navigator.geolocation){
        alert('Geolocation is not supported by your browser!');
    }

    $LocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(position =>{
        

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            console.log('location is sent!')
            $LocationButton.removeAttribute('disabled');
        });
    })
})

socket.emit('join', {username, room});