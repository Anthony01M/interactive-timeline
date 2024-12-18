document.addEventListener('DOMContentLoaded', function () {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);

    const timelineForm = document.getElementById('timelineForm');
    const timeline = document.getElementById('timeline');

    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.forEach(event => addTimelineEvent(event.description, event.date, event.time));

    timelineForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const eventDescription = document.getElementById('eventInput').value;
        const eventDate = document.getElementById('dateInput').value;
        const eventTime = document.getElementById('timeInput').value;

        addTimelineEvent(eventDescription, eventDate, eventTime);
        saveEvent(eventDescription, eventDate, eventTime);
        timelineForm.reset();
    });

    function addTimelineEvent(description, date, time) {
        const eventElement = document.createElement('div');
        eventElement.className = 'timeline-event';
        eventElement.innerHTML = `
            <div class="timeline-date">${date} ${time}</div>
            <div class="timeline-description">${description}</div>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;
        timeline.appendChild(eventElement);
        animateEvent(eventElement);
        updateEventColor(eventElement, date, time);

        eventElement.querySelector('.edit-button').addEventListener('click', () => editEvent(eventElement, description, date, time));
        eventElement.querySelector('.delete-button').addEventListener('click', () => deleteEvent(eventElement, description, date, time));
    }

    function animateEvent(eventElement) {
        eventElement.style.opacity = 0;
        setTimeout(() => {
            eventElement.style.opacity = 1;
            eventElement.style.transform = 'translateY(0)';
        }, 100);
    }

    function updateEventColor(eventElement, date, time) {
        const currentDateTime = new Date();
        const eventDateTime = new Date(`${date}T${time}`);
        if (eventDateTime < currentDateTime) {
            eventElement.style.backgroundColor = '#ff4d4d';
        } else {
            eventElement.style.backgroundColor = '#007bff';
        }
    }

    function editEvent(eventElement, description, date, time) {
        const newDescription = prompt('Edit event description:', description);
        const newDate = prompt('Edit event date:', date);
        const newTime = prompt('Edit event time:', time);
        if (newDescription && newDate && newTime) {
            eventElement.querySelector('.timeline-description').textContent = newDescription;
            eventElement.querySelector('.timeline-date').textContent = `${newDate} ${newTime}`;
            updateEventColor(eventElement, newDate, newTime);
            updateLocalStorage(description, date, time, newDescription, newDate, newTime);
        }
    }

    function deleteEvent(eventElement, description, date, time) {
        timeline.removeChild(eventElement);
        removeFromLocalStorage(description, date, time);
    }

    function saveEvent(description, date, time) {
        events.push({ description, date, time });
        localStorage.setItem('events', JSON.stringify(events));
    }

    function updateLocalStorage(oldDescription, oldDate, oldTime, newDescription, newDate, newTime) {
        const index = events.findIndex(event => event.description === oldDescription && event.date === oldDate && event.time === oldTime);
        if (index !== -1) {
            events[index] = { description: newDescription, date: newDate, time: newTime };
            localStorage.setItem('events', JSON.stringify(events));
        }
    }

    function removeFromLocalStorage(description, date, time) {
        const index = events.findIndex(event => event.description === description && event.date === date && event.time === time);
        if (index !== -1) {
            events.splice(index, 1);
            localStorage.setItem('events', JSON.stringify(events));
        }
    }

    setInterval(() => {
        const eventElements = document.querySelectorAll('.timeline-event');
        eventElements.forEach(eventElement => {
            const date = eventElement.querySelector('.timeline-date').textContent.split(' ')[0];
            const time = eventElement.querySelector('.timeline-date').textContent.split(' ')[1];
            updateEventColor(eventElement, date, time);
        });
    }, 60000);
});